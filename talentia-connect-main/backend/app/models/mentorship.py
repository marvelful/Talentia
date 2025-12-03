from sqlalchemy import Column, String, DateTime, func, ForeignKey, Text, Float, Boolean
from sqlalchemy.orm import relationship

from ..db.session import Base


class MentorProfile(Base):
    __tablename__ = "mentor_profiles"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    headline = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    hourly_rate = Column(Float, nullable=True)
    expertise_tags = Column(Text, nullable=True)  # comma-separated
    approval_status = Column(String, nullable=False, default="PENDING")

    user = relationship("User")
    availabilities = relationship("MentorAvailability", back_populates="mentor")


class MentorAvailability(Base):
    __tablename__ = "mentor_availabilities"

    id = Column(String, primary_key=True, index=True)
    mentor_id = Column(String, ForeignKey("mentor_profiles.id"), nullable=False)
    weekday = Column(String, nullable=True)  # e.g. MONDAY, TUESDAY
    date = Column(DateTime(timezone=True), nullable=True)
    start_time = Column(String, nullable=True)  # HH:MM
    end_time = Column(String, nullable=True)

    mentor = relationship("MentorProfile", back_populates="availabilities")


class MentorshipSession(Base):
    __tablename__ = "mentorship_sessions"

    id = Column(String, primary_key=True, index=True)
    mentor_id = Column(String, ForeignKey("users.id"), nullable=False)
    student_id = Column(String, ForeignKey("users.id"), nullable=False)
    scheduled_at = Column(DateTime(timezone=True), nullable=False)
    duration_minutes = Column(Float, nullable=True)
    meeting_link = Column(String, nullable=True)
    status = Column(String, nullable=False, default="SCHEDULED")

    created_at = Column(DateTime(timezone=True), server_default=func.now())


class MentorshipFeedback(Base):
    __tablename__ = "mentorship_feedback"

    id = Column(String, primary_key=True, index=True)
    session_id = Column(String, ForeignKey("mentorship_sessions.id"), nullable=False)
    rating = Column(Float, nullable=False)
    comments = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
