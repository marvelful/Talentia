from sqlalchemy import Column, String, DateTime, func, ForeignKey, Text, Boolean, Float
from sqlalchemy.orm import relationship

from ..db.session import Base


class Portfolio(Base):
    __tablename__ = "portfolios"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    headline = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    public_slug = Column(String, unique=True, index=True, nullable=True)
    is_public = Column(Boolean, default=True, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User")
    projects = relationship("PortfolioProject", back_populates="portfolio")
    certifications = relationship("Certification", back_populates="portfolio")
    testimonials = relationship("Testimonial", back_populates="portfolio")


class PortfolioProject(Base):
    __tablename__ = "portfolio_projects"

    id = Column(String, primary_key=True, index=True)
    portfolio_id = Column(String, ForeignKey("portfolios.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    media_urls = Column(Text, nullable=True)  # could be JSON stringified
    tags = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    portfolio = relationship("Portfolio", back_populates="projects")


class Certification(Base):
    __tablename__ = "certifications"

    id = Column(String, primary_key=True, index=True)
    portfolio_id = Column(String, ForeignKey("portfolios.id"), nullable=False)
    name = Column(String, nullable=False)
    issuer = Column(String, nullable=True)
    issue_date = Column(DateTime(timezone=True), nullable=True)
    file_url = Column(String, nullable=True)

    portfolio = relationship("Portfolio", back_populates="certifications")


class Testimonial(Base):
    __tablename__ = "testimonials"

    id = Column(String, primary_key=True, index=True)
    portfolio_id = Column(String, ForeignKey("portfolios.id"), nullable=False)
    author_name = Column(String, nullable=False)
    relation = Column(String, nullable=True)
    text = Column(Text, nullable=False)

    portfolio = relationship("Portfolio", back_populates="testimonials")


class RatingReview(Base):
    __tablename__ = "rating_reviews"

    id = Column(String, primary_key=True, index=True)
    from_user_id = Column(String, ForeignKey("users.id"), nullable=True)
    to_user_id = Column(String, ForeignKey("users.id"), nullable=False)
    rating = Column(Float, nullable=False)
    comment = Column(Text, nullable=True)
    context = Column(String, nullable=True)  # e.g. GIG, MENTORSHIP

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    from_user = relationship("User", foreign_keys=[from_user_id])
    to_user = relationship("User", foreign_keys=[to_user_id])
