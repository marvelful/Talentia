from sqlalchemy import Column, String, DateTime, func, Enum, Boolean, ForeignKey
from sqlalchemy.orm import relationship
import enum

from ..db.session import Base


class SubscriptionStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    TRIALING = "TRIALING"
    CANCELED = "CANCELED"


class University(Base):
    __tablename__ = "universities"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    logo_url = Column(String, nullable=True)
    country = Column(String, nullable=True)
    city = Column(String, nullable=True)
    subscription_plan = Column(String, nullable=True)
    subscription_status = Column(Enum(SubscriptionStatus), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    users = relationship("User", back_populates="university")
    students = relationship("UniversityStudent", back_populates="university")


class UniversityStudent(Base):
    __tablename__ = "university_students"

    id = Column(String, primary_key=True, index=True)
    university_id = Column(String, ForeignKey("universities.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    faculty = Column(String, nullable=True)
    department = Column(String, nullable=True)
    cohort_year = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    university = relationship("University", back_populates="students")
    user = relationship("User")
