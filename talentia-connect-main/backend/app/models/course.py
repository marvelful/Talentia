from sqlalchemy import (
    Column,
    String,
    DateTime,
    func,
    ForeignKey,
    Text,
    Boolean,
    Integer,
    Float,
)
from sqlalchemy.orm import relationship

from ..db.session import Base


class CourseCategory(Base):
    __tablename__ = "course_categories"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Course(Base):
    __tablename__ = "courses"

    id = Column(String, primary_key=True, index=True)
    category_id = Column(String, ForeignKey("course_categories.id"), nullable=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    level = Column(String, nullable=True)  # BEGINNER, INTERMEDIATE, ADVANCED
    cover_image = Column(String, nullable=True)
    is_premium = Column(Boolean, default=False, nullable=False)
    created_by_id = Column(String, ForeignKey("users.id"), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    category = relationship("CourseCategory")
    modules = relationship("CourseModule", back_populates="course")


class CourseModule(Base):
    __tablename__ = "course_modules"

    id = Column(String, primary_key=True, index=True)
    course_id = Column(String, ForeignKey("courses.id"), nullable=False)
    title = Column(String, nullable=False)
    order = Column(Integer, nullable=False, default=0)

    course = relationship("Course", back_populates="modules")
    lessons = relationship("Lesson", back_populates="module")


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(String, primary_key=True, index=True)
    module_id = Column(String, ForeignKey("course_modules.id"), nullable=False)
    title = Column(String, nullable=False)
    type = Column(String, nullable=False)  # VIDEO, PDF, QUIZ
    content_url = Column(String, nullable=True)
    duration_minutes = Column(Integer, nullable=True)

    module = relationship("CourseModule", back_populates="lessons")


class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

    id = Column(String, primary_key=True, index=True)
    lesson_id = Column(String, ForeignKey("lessons.id"), nullable=False)
    text = Column(Text, nullable=False)

    lesson = relationship("Lesson")
    options = relationship("QuizAnswerOption", back_populates="question")


class QuizAnswerOption(Base):
    __tablename__ = "quiz_answer_options"

    id = Column(String, primary_key=True, index=True)
    question_id = Column(String, ForeignKey("quiz_questions.id"), nullable=False)
    text = Column(Text, nullable=False)
    is_correct = Column(Boolean, default=False, nullable=False)

    question = relationship("QuizQuestion", back_populates="options")


class QuizSubmission(Base):
    __tablename__ = "quiz_submissions"

    id = Column(String, primary_key=True, index=True)
    lesson_id = Column(String, ForeignKey("lessons.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    score = Column(Float, nullable=True)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())

    answers = relationship("QuizSubmissionAnswer", back_populates="submission")


class QuizSubmissionAnswer(Base):
    __tablename__ = "quiz_submission_answers"

    id = Column(String, primary_key=True, index=True)
    submission_id = Column(String, ForeignKey("quiz_submissions.id"), nullable=False)
    question_id = Column(String, ForeignKey("quiz_questions.id"), nullable=False)
    selected_option_id = Column(String, ForeignKey("quiz_answer_options.id"), nullable=True)

    submission = relationship("QuizSubmission", back_populates="answers")


class CourseEnrollment(Base):
    __tablename__ = "course_enrollments"

    id = Column(String, primary_key=True, index=True)
    course_id = Column(String, ForeignKey("courses.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    progress = Column(Float, nullable=False, default=0.0)
    status = Column(String, nullable=False, default="IN_PROGRESS")

    enrolled_at = Column(DateTime(timezone=True), server_default=func.now())


class CourseCertificate(Base):
    __tablename__ = "course_certificates"

    id = Column(String, primary_key=True, index=True)
    enrollment_id = Column(String, ForeignKey("course_enrollments.id"), nullable=False)
    certificate_url = Column(String, nullable=False)
    issued_at = Column(DateTime(timezone=True), server_default=func.now())
