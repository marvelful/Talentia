from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class LessonOut(BaseModel):
    id: str
    title: str
    type: str
    content_url: Optional[str] = None
    duration_minutes: Optional[int] = None

    class Config:
        from_attributes = True


class CourseModuleOut(BaseModel):
    id: str
    title: str
    order: int
    lessons: List[LessonOut] = []

    class Config:
        from_attributes = True


class CourseSummaryOut(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    level: Optional[str] = None
    cover_image: Optional[str] = None
    is_premium: bool

    class Config:
        from_attributes = True


class CourseDetailOut(CourseSummaryOut):
    created_at: datetime
    modules: List[CourseModuleOut] = []

    class Config:
        from_attributes = True
