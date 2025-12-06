from typing import List, Optional

from pydantic import BaseModel


class TalentOut(BaseModel):
    id: str
    name: str
    skill: Optional[str] = None
    university: Optional[str] = None
    rating: float
    reviews: int
    gigs: int
    hourlyRate: Optional[str] = None
    avatarUrl: Optional[str] = None
    skills: List[str] = []
