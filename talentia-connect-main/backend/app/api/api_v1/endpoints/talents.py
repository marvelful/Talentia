from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from ....db.session import SessionLocal
from ....models.assessment import SkillTag, UserSkill
from ....models.marketplace import Contract, GigApplication
from ....models.portfolio import RatingReview
from ....models.university import University
from ....models.user import User, UserRole
from ....schemas.talent import TalentOut


router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=List[TalentOut])
def list_talents(db: Session = Depends(get_db)):
    """Return student talents with aggregated ratings and completed gigs.

    This powers the "View talents" marketplace so companies see live ratings
    based on RatingReview entries created when contracts are completed.
    """

    # Aggregate reviews per student
    review_stats = (
        db.query(
            RatingReview.to_user_id.label("user_id"),
            func.avg(RatingReview.rating).label("avg_rating"),
            func.count(RatingReview.id).label("reviews_count"),
        )
        .group_by(RatingReview.to_user_id)
        .subquery()
    )

    # Count completed gigs per student via contracts
    gig_stats = (
        db.query(
            GigApplication.student_id.label("user_id"),
            func.count(Contract.id).label("completed_gigs"),
        )
        .join(Contract, Contract.application_id == GigApplication.id)
        .filter(Contract.status == "COMPLETED")
        .group_by(GigApplication.student_id)
        .subquery()
    )

    # Base student query joined with stats
    rows = (
        db.query(
            User.id,
            User.first_name,
            User.last_name,
            User.avatar_url,
            University.name.label("university_name"),
            review_stats.c.avg_rating,
            review_stats.c.reviews_count,
            gig_stats.c.completed_gigs,
        )
        .join(review_stats, review_stats.c.user_id == User.id)
        .outerjoin(gig_stats, gig_stats.c.user_id == User.id)
        .outerjoin(University, University.id == User.university_id)
        .filter(User.role == UserRole.STUDENT)
        .order_by(review_stats.c.avg_rating.desc())
        .all()
    )

    talents: List[TalentOut] = []

    for row in rows:
        # Fetch up to 5 strongest skills for each student (by level)
        skill_rows = (
            db.query(SkillTag.name)
            .join(UserSkill, UserSkill.skill_id == SkillTag.id)
            .filter(UserSkill.user_id == row.id)
            .order_by(UserSkill.level.desc())
            .limit(5)
            .all()
        )
        skills = [s.name for s in skill_rows]
        primary_skill = skills[0] if skills else None

        display_name = f"{row.first_name} {row.last_name}".strip() or "Student"
        rating_value = float(row.avg_rating or 0.0)

        talents.append(
            TalentOut(
                id=row.id,
                name=display_name,
                skill=primary_skill,
                university=row.university_name,
                rating=round(rating_value, 1),
                reviews=int(row.reviews_count or 0),
                gigs=int(row.completed_gigs or 0),
                # Hourly rate is not modelled yet; leave as None so the UI can show "Rate TBD".
                hourlyRate=None,
                avatarUrl=row.avatar_url
                or "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=300&fit=crop&crop=face",
                skills=skills,
            )
        )

    return talents