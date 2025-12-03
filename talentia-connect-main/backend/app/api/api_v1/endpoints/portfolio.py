from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ....db.session import SessionLocal
from ....models.portfolio import Portfolio, PortfolioProject, Certification, Testimonial
from ....schemas.portfolio import PortfolioOverviewOut
from .auth import get_current_user


router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/me", response_model=PortfolioOverviewOut)
def get_my_portfolio(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    portfolio = db.query(Portfolio).filter(Portfolio.user_id == current_user.id).first()
    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found for current user",
        )

    projects_count = db.query(PortfolioProject).filter(PortfolioProject.portfolio_id == portfolio.id).count()
    certifications_count = (
        db.query(Certification).filter(Certification.portfolio_id == portfolio.id).count()
    )
    testimonials_count = db.query(Testimonial).filter(Testimonial.portfolio_id == portfolio.id).count()

    return PortfolioOverviewOut(
        id=portfolio.id,
        headline=portfolio.headline,
        bio=portfolio.bio,
        projects_count=projects_count,
        certifications_count=certifications_count,
        testimonials_count=testimonials_count,
    )
