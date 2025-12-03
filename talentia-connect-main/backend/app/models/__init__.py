# Import all models so that Base.metadata.create_all() can see them
from .user import User, UserRole
from .university import University, UniversityStudent
from .assessment import (
    AssessmentCategory,
    AssessmentQuestion,
    AssessmentAttempt,
    AssessmentAnswer,
    AssessmentResult,
    SkillTag,
    UserSkill,
)
from .portfolio import Portfolio, PortfolioProject, Certification, Testimonial, RatingReview
from .course import (
    CourseCategory,
    Course,
    CourseModule,
    Lesson,
    QuizQuestion,
    QuizAnswerOption,
    QuizSubmission,
    QuizSubmissionAnswer,
    CourseEnrollment,
    CourseCertificate,
)
from .marketplace import Gig, GigApplication, Contract, WorkSubmission, Payment, Payout
from .mentorship import MentorProfile, MentorAvailability, MentorshipSession, MentorshipFeedback
from .library import LibraryCategory, LibraryResource
from .analytics import ActivityLog