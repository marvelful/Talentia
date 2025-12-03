from sqlalchemy import Column, String, DateTime, func, ForeignKey, Text, JSON

from ..db.session import Base


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    type = Column(String, nullable=False)  # e.g. ASSESSMENT_TAKEN, GIG_APPLIED
    # Use 'meta' as attribute name; underlying column name will still be 'metadata'
    meta = Column("metadata", JSON, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
