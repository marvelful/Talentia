from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class GigCreate(BaseModel):
    title: str
    description: Optional[str] = None
    role: Optional[str] = None
    budgetMin: Optional[float] = None
    budgetMax: Optional[float] = None
    location: Optional[str] = None
    type: Optional[str] = None  # CONTRACT, GIG, PROJECT, ONGOING
    category: Optional[str] = None
    deadline: Optional[datetime] = None


class GigApplicationCreate(BaseModel):
    proposal: Optional[str] = None


class GigApplicationOut(BaseModel):
    id: str
    gigId: str
    studentId: str
    studentName: str
    proposal: Optional[str] = None
    status: str
    appliedAt: datetime


class GigOut(BaseModel):
    id: str
    title: str
    company: Optional[str] = None
    companyLogo: Optional[str] = None
    location: Optional[str] = None
    type: Optional[str] = None
    budget: Optional[str] = None
    deadline: Optional[datetime] = None
    posted: str
    description: Optional[str] = None
    skills: List[str] = []
    applicants: int = 0
    category: Optional[str] = None

    class Config:
        from_attributes = True
