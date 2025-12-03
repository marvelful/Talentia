from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ....db.session import SessionLocal
from ....models.course import Course, CourseModule, Lesson
from ....schemas.course import CourseSummaryOut, CourseDetailOut, CourseModuleOut, LessonOut


router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=List[CourseSummaryOut])
def list_courses(db: Session = Depends(get_db)):
    return db.query(Course).order_by(Course.created_at.desc()).all()


@router.get("/{course_id}", response_model=CourseDetailOut)
def get_course(course_id: str, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")

    # Eagerly load modules and lessons for the response
    modules = (
        db.query(CourseModule)
        .filter(CourseModule.course_id == course.id)
        .order_by(CourseModule.order)
        .all()
    )

    module_outputs: list[CourseModuleOut] = []
    for module in modules:
        lessons = (
            db.query(Lesson)
            .filter(Lesson.module_id == module.id)
            .order_by(Lesson.id)
            .all()
        )
        module_outputs.append(
            CourseModuleOut(
                id=module.id,
                title=module.title,
                order=module.order,
                lessons=[LessonOut.model_validate(lesson) for lesson in lessons],
            )
        )

    detail = CourseDetailOut.model_validate(course)
    detail.modules = module_outputs
    return detail
