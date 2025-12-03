from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ....db.session import SessionLocal
from ....models.library import LibraryCategory, LibraryResource
from ....schemas.library import LibraryCategoryOut, LibraryResourceOut


router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/categories", response_model=List[LibraryCategoryOut])
def list_categories(db: Session = Depends(get_db)):
    return db.query(LibraryCategory).order_by(LibraryCategory.name).all()


@router.get("/resources", response_model=List[LibraryResourceOut])
def list_resources(db: Session = Depends(get_db)):
    return db.query(LibraryResource).order_by(LibraryResource.created_at.desc()).all()
