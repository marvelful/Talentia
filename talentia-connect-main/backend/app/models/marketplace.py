from sqlalchemy import (
    Column,
    String,
    DateTime,
    func,
    ForeignKey,
    Text,
    Float,
)
from sqlalchemy.orm import relationship

from ..db.session import Base


class Gig(Base):
    __tablename__ = "gigs"

    id = Column(String, primary_key=True, index=True)
    company_id = Column(String, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    role = Column(String, nullable=True)
    budget_min = Column(Float, nullable=True)
    budget_max = Column(Float, nullable=True)
    location = Column(String, nullable=True)
    type = Column(String, nullable=True)  # CONTRACT, GIG, PROJECT, ONGOING
    category = Column(String, nullable=True)
    deadline = Column(DateTime(timezone=True), nullable=True)
    status = Column(String, nullable=False, default="OPEN")

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    company = relationship("User")
    applications = relationship("GigApplication", back_populates="gig")


class GigApplication(Base):
    __tablename__ = "gig_applications"

    id = Column(String, primary_key=True, index=True)
    gig_id = Column(String, ForeignKey("gigs.id"), nullable=False)
    student_id = Column(String, ForeignKey("users.id"), nullable=False)
    proposal = Column(Text, nullable=True)
    status = Column(String, nullable=False, default="APPLIED")

    applied_at = Column(DateTime(timezone=True), server_default=func.now())

    gig = relationship("Gig", back_populates="applications")
    student = relationship("User")


class Contract(Base):
    __tablename__ = "contracts"

    id = Column(String, primary_key=True, index=True)
    gig_id = Column(String, ForeignKey("gigs.id"), nullable=False)
    application_id = Column(String, ForeignKey("gig_applications.id"), nullable=False)
    agreed_amount = Column(Float, nullable=True)
    status = Column(String, nullable=False, default="PENDING_PAYMENT")

    created_at = Column(DateTime(timezone=True), server_default=func.now())


class WorkSubmission(Base):
    __tablename__ = "work_submissions"

    id = Column(String, primary_key=True, index=True)
    contract_id = Column(String, ForeignKey("contracts.id"), nullable=False)
    notes = Column(Text, nullable=True)
    files = Column(Text, nullable=True)  # could hold URLs
    status = Column(String, nullable=False, default="SUBMITTED")

    submitted_at = Column(DateTime(timezone=True), server_default=func.now())


class Payment(Base):
    __tablename__ = "payments"

    id = Column(String, primary_key=True, index=True)
    contract_id = Column(String, ForeignKey("contracts.id"), nullable=False)
    provider = Column(String, nullable=True)
    reference = Column(String, nullable=True)
    amount = Column(Float, nullable=False)
    status = Column(String, nullable=False, default="PENDING")

    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Payout(Base):
    __tablename__ = "payouts"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(String, nullable=False, default="PENDING")

    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(String, primary_key=True, index=True)
    gig_id = Column(String, ForeignKey("gigs.id"), nullable=False)
    application_id = Column(String, ForeignKey("gig_applications.id"), nullable=False)
    company_id = Column(String, ForeignKey("users.id"), nullable=False)
    student_id = Column(String, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    messages = relationship("Message", back_populates="conversation")


class Message(Base):
    __tablename__ = "messages"

    id = Column(String, primary_key=True, index=True)
    conversation_id = Column(String, ForeignKey("conversations.id"), nullable=False)
    sender_id = Column(String, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    conversation = relationship("Conversation", back_populates="messages")
