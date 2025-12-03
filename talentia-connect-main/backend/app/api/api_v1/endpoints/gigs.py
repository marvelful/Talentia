from typing import List
import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ....db.session import SessionLocal
from ....models.marketplace import Gig, GigApplication
from ....models.user import User, UserRole
from ....schemas.gig import GigOut, GigCreate, GigApplicationCreate, GigApplicationOut
from .auth import get_current_user

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=GigOut, status_code=status.HTTP_201_CREATED)
def create_gig(
    payload: GigCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Only company users can create gigs
    if current_user.role != UserRole.COMPANY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only company users can post opportunities",
        )

    gig = Gig(
        id=str(uuid.uuid4()),
        company_id=current_user.id,
        title=payload.title,
        description=payload.description,
        role=payload.role,
        budget_min=payload.budgetMin,
        budget_max=payload.budgetMax,
        location=payload.location,
        type=payload.type,
        category=payload.category,
        deadline=payload.deadline,
    )
    db.add(gig)
    db.commit()
    db.refresh(gig)

    # Derive budget label in the same way as list_gigs
    if gig.budget_min is not None and gig.budget_max is not None:
        budget = f"XAF {gig.budget_min:,.0f} - XAF {gig.budget_max:,.0f}"
    elif gig.budget_min is not None:
        budget = f"From XAF {gig.budget_min:,.0f}"
    elif gig.budget_max is not None:
        budget = f"Up to XAF {gig.budget_max:,.0f}"
    else:
        budget = None

    company_name = f"{current_user.first_name} {current_user.last_name}".strip() or "Company"
    company_logo = "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop"

    return GigOut(
        id=gig.id,
        title=gig.title,
        company=company_name,
        companyLogo=company_logo,
        location=gig.location,
        type=gig.type,
        budget=budget,
        deadline=gig.deadline,
        posted=gig.created_at.isoformat() if gig.created_at else "",
        description=gig.description,
        skills=[],
        applicants=0,
        category=gig.category,
    )


@router.get("/", response_model=List[GigOut])
def list_gigs(db: Session = Depends(get_db)):
    gigs = db.query(Gig).order_by(Gig.created_at.desc()).all()

    results: List[GigOut] = []
    for gig in gigs:
        # Derive a budget label from min/max (XAF currency)
        if gig.budget_min is not None and gig.budget_max is not None:
            budget = f"XAF {gig.budget_min:,.0f} - XAF {gig.budget_max:,.0f}"
        elif gig.budget_min is not None:
            budget = f"From XAF {gig.budget_min:,.0f}"
        elif gig.budget_max is not None:
            budget = f"Up to XAF {gig.budget_max:,.0f}"
        else:
            budget = None

        # Placeholder company & logo for now (until we add richer company profiles)
        company_name = "Company"
        company_logo = "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop"

        results.append(
            GigOut(
                id=gig.id,
                title=gig.title,
                company=company_name,
                companyLogo=company_logo,
                location=gig.location,
                type=gig.type,
                budget=budget,
                deadline=gig.deadline,
                posted=gig.created_at.isoformat() if gig.created_at else "",
                description=gig.description,
                skills=[],
                applicants=len(gig.applications) if hasattr(gig, "applications") and gig.applications else 0,
                category=gig.category,
            )
        )

    return results


@router.get("/my", response_model=List[GigOut])
def list_my_gigs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != UserRole.COMPANY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only company users can view their own opportunities",
        )

    gigs = (
        db.query(Gig)
        .filter(Gig.company_id == current_user.id)
        .order_by(Gig.created_at.desc())
        .all()
    )

    results: List[GigOut] = []
    for gig in gigs:
        if gig.budget_min is not None and gig.budget_max is not None:
            budget = f"XAF {gig.budget_min:,.0f} - XAF {gig.budget_max:,.0f}"
        elif gig.budget_min is not None:
            budget = f"From XAF {gig.budget_min:,.0f}"
        elif gig.budget_max is not None:
            budget = f"Up to XAF {gig.budget_max:,.0f}"
        else:
            budget = None

        company_name = f"{current_user.first_name} {current_user.last_name}".strip() or "Company"
        company_logo = "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop"

        results.append(
            GigOut(
                id=gig.id,
                title=gig.title,
                company=company_name,
                companyLogo=company_logo,
                location=gig.location,
                type=gig.type,
                budget=budget,
                deadline=gig.deadline,
                posted=gig.created_at.isoformat() if gig.created_at else "",
                description=gig.description,
                skills=[],
                applicants=len(gig.applications) if hasattr(gig, "applications") and gig.applications else 0,
                category=gig.category,
            )
        )

    return results


@router.post("/{gig_id}/apply", response_model=GigApplicationOut, status_code=status.HTTP_201_CREATED)
def apply_to_gig(
    gig_id: str,
    payload: GigApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can apply to opportunities",
        )

    gig = db.query(Gig).filter(Gig.id == gig_id).first()
    if not gig:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Gig not found")

    # Optional: prevent duplicate applications
    existing = (
        db.query(GigApplication)
        .filter(
            GigApplication.gig_id == gig_id,
            GigApplication.student_id == current_user.id,
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already applied to this opportunity",
        )

    application = GigApplication(
        id=str(uuid.uuid4()),
        gig_id=gig_id,
        student_id=current_user.id,
        proposal=payload.proposal,
        status="APPLIED",
    )
    db.add(application)
    db.commit()
    db.refresh(application)

    student_name = f"{current_user.first_name} {current_user.last_name}".strip() or current_user.email

    return GigApplicationOut(
        id=application.id,
        gigId=application.gig_id,
        studentId=application.student_id,
        studentName=student_name,
        proposal=application.proposal,
        status=application.status,
        appliedAt=application.applied_at,
    )


@router.get("/{gig_id}/applications", response_model=List[GigApplicationOut])
def list_applications_for_gig(
    gig_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    gig = db.query(Gig).filter(Gig.id == gig_id).first()
    if not gig:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Gig not found")

    # Only the company that owns the gig (or a super admin) can view applications
    if gig.company_id != current_user.id and current_user.role != UserRole.SUPER_ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to view applications for this opportunity",
        )

    applications = (
        db.query(GigApplication)
        .filter(GigApplication.gig_id == gig_id)
        .order_by(GigApplication.applied_at.desc())
        .all()
    )

    results: List[GigApplicationOut] = []
    for app in applications:
        student = app.student  # relationship to User
        student_name = (
            f"{student.first_name} {student.last_name}".strip()
            if student is not None
            else app.student_id
        )
        results.append(
            GigApplicationOut(
                id=app.id,
                gigId=app.gig_id,
                studentId=app.student_id,
                studentName=student_name,
                proposal=app.proposal,
                status=app.status,
                appliedAt=app.applied_at,
            )
        )

    return results
