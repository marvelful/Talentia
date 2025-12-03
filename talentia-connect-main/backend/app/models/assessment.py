from sqlalchemy import Column, String, DateTime, func, ForeignKey, Integer, Float, Text, JSON
from sqlalchemy.orm import relationship

from ..db.session import Base


class AssessmentCategory(Base):
    __tablename__ = "assessment_categories"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    questions = relationship("AssessmentQuestion", back_populates="category")


class AssessmentQuestion(Base):
    __tablename__ = "assessment_questions"

    id = Column(String, primary_key=True, index=True)
    category_id = Column(String, ForeignKey("assessment_categories.id"), nullable=False)
    text = Column(Text, nullable=False)
    type = Column(String, nullable=False)  # e.g. MULTIPLE_CHOICE, SCALE
    options = Column(JSON, nullable=True)  # for multiple choice
    weight = Column(Float, nullable=False, default=1.0)

    category = relationship("AssessmentCategory", back_populates="questions")


class AssessmentAttempt(Base):
    __tablename__ = "assessment_attempts"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User")
    answers = relationship("AssessmentAnswer", back_populates="attempt")
    result = relationship("AssessmentResult", back_populates="attempt", uselist=False)


class AssessmentAnswer(Base):
    __tablename__ = "assessment_answers"

    id = Column(String, primary_key=True, index=True)
    attempt_id = Column(String, ForeignKey("assessment_attempts.id"), nullable=False)
    question_id = Column(String, ForeignKey("assessment_questions.id"), nullable=False)
    selected_option = Column(String, nullable=True)
    score = Column(Float, nullable=True)

    attempt = relationship("AssessmentAttempt", back_populates="answers")
    question = relationship("AssessmentQuestion")


class AssessmentResult(Base):
    __tablename__ = "assessment_results"

    id = Column(String, primary_key=True, index=True)
    attempt_id = Column(String, ForeignKey("assessment_attempts.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    overall_score = Column(Float, nullable=False)
    category_scores = Column(JSON, nullable=True)  # {categoryId: score}

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    attempt = relationship("AssessmentAttempt", back_populates="result")
    user = relationship("User")


class SkillTag(Base):
    __tablename__ = "skill_tags"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    category = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())


class UserSkill(Base):
    __tablename__ = "user_skills"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    skill_id = Column(String, ForeignKey("skill_tags.id"), nullable=False)
    level = Column(Integer, nullable=False)  # e.g. 1-100 or 1-5
    source = Column(String, nullable=True)  # e.g. ASSESSMENT, MANUAL

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")
    skill = relationship("SkillTag")
