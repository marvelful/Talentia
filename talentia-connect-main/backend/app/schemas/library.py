from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class LibraryCategoryOut(BaseModel):
    id: str
    name: str

    class Config:
        from_attributes = True


class LibraryResourceOut(BaseModel):
    id: str
    category_id: Optional[str] = None
    title: str
    description: Optional[str] = None
    type: str
    file_url: str
    size_label: Optional[str] = None
    is_premium: bool
    allowed_roles: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
