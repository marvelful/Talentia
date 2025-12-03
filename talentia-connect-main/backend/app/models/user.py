from sqlalchemy import Boolean, Column, DateTime, Enum, String, func, ForeignKey
from sqlalchemy.orm import relationship
import enum

from ..db.session import Base


class UserRole(str, enum.Enum):
    STUDENT = "STUDENT"
    COMPANY = "COMPANY"
    MENTOR = "MENTOR"
    UNIVERSITY_ADMIN = "UNIVERSITY_ADMIN"
    SUPER_ADMIN = "SUPER_ADMIN"


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    avatar_url = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    role = Column(Enum(UserRole), default=UserRole.STUDENT, nullable=False)

    university_id = Column(String, ForeignKey("universities.id"), nullable=True)
    department = Column(String, nullable=True)
    matric_number = Column(String, nullable=True)
    is_verified = Column(Boolean, default=False, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships (optional; mainly for ORM convenience)
    university = relationship("University", back_populates="users", lazy="joined", uselist=False)
