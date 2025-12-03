from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ....db.session import SessionLocal
from ....models.mentorship import MentorProfile
from ....models.user import User
from ....schemas.mentorship import MentorOut


router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/mentors", response_model=List[MentorOut])
def list_mentors(db: Session = Depends(get_db)):
    profiles = db.query(MentorProfile, User).join(User, MentorProfile.user_id == User.id).all()

    results: list[MentorOut] = []
    for profile, user in profiles:
        full_name = f"{user.first_name} {user.last_name}".strip()
        results.append(
            MentorOut(
                id=profile.id,
                user_id=user.id,
                full_name=full_name,
                headline=profile.headline,
                company=None,
                hourly_rate=profile.hourly_rate,
                expertise_tags=profile.expertise_tags,
                rating=None,
                reviews=None,
            )
        )

    return results
