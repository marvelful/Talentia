from typing import Optional

from pydantic import BaseModel


class MentorOut(BaseModel):
    id: str
    user_id: str
    full_name: str
    headline: Optional[str] = None
    company: Optional[str] = None
    hourly_rate: Optional[float] = None
    expertise_tags: Optional[str] = None
    rating: Optional[float] = None
    reviews: Optional[int] = None

    class Config:
        from_attributes = True
