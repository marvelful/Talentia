from typing import List
import uuid

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


def _ensure_seed_data(db: Session) -> None:
    """Seed a small curated e-library the first time the API is called.

    This keeps things simple for now (no separate migration/seed script) and
    only runs when the tables are still empty.
    """

    has_categories = db.query(LibraryCategory).first()
    has_resources = db.query(LibraryResource).first()
    if has_categories or has_resources:
        return

    # Categories
    cameroon_culture = LibraryCategory(
        id=str(uuid.uuid4()),
        name="Cameroon Culture & Arts",
    )
    cameroon_history = LibraryCategory(
        id=str(uuid.uuid4()),
        name="Cameroon History",
    )
    professionalism = LibraryCategory(
        id=str(uuid.uuid4()),
        name="Professionalism & Career",
    )
    course_books = LibraryCategory(
        id=str(uuid.uuid4()),
        name="Course Books",
    )

    db.add_all([cameroon_culture, cameroon_history, professionalism, course_books])

    # Resources – thumbnails use open images so that the current UI "just works".
    resources = [
        # Cameroon culture
        LibraryResource(
            id=str(uuid.uuid4()),
            category_id=cameroon_culture.id,
            title="Cameroon Cultural Heritage: Traditions & Festivals",
            description="Overview of major Cameroonian cultural festivals, traditional dances and attire.",
            type="PDF",
            file_url="https://images.unsplash.com/photo-1545424273-61199678b3e1?w=600&h=400&fit=crop",
            size_label="4.2 MB",
            is_premium=False,
            allowed_roles="STUDENT,COMPANY,MENTOR",
        ),
        LibraryResource(
            id=str(uuid.uuid4()),
            category_id=cameroon_culture.id,
            title="Languages of Cameroon: A Practical Guide",
            description="Short guide to the main national languages and how they shape everyday life.",
            type="PDF",
            file_url="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=400&fit=crop",
            size_label="3.1 MB",
            is_premium=False,
            allowed_roles="STUDENT,COMPANY,MENTOR",
        ),
        # Cameroon history
        LibraryResource(
            id=str(uuid.uuid4()),
            category_id=cameroon_history.id,
            title="A Short History of Cameroon (Colonial to Modern State)",
            description="Timeline of key historical events from the colonial period to present-day Cameroon.",
            type="PDF",
            file_url="https://images.unsplash.com/photo-1509099863731-ef4bff19e808?w=600&h=400&fit=crop",
            size_label="5.6 MB",
            is_premium=False,
            allowed_roles="STUDENT,COMPANY,MENTOR",
        ),
        LibraryResource(
            id=str(uuid.uuid4()),
            category_id=cameroon_history.id,
            title="Cameroon in Central African Politics",
            description="Introductory reading on Cameroon's role in the CEMAC and African Union.",
            type="PDF",
            file_url="https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=600&h=400&fit=crop",
            size_label="2.9 MB",
            is_premium=False,
            allowed_roles="STUDENT,COMPANY,MENTOR",
        ),
        # Professionalism
        LibraryResource(
            id=str(uuid.uuid4()),
            category_id=professionalism.id,
            title="Professionalism for Young Graduates in Cameroon",
            description="Practical guide to workplace ethics, communication and dress code in the Cameroonian context.",
            type="PDF",
            file_url="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=400&fit=crop",
            size_label="3.8 MB",
            is_premium=False,
            allowed_roles="STUDENT",
        ),
        LibraryResource(
            id=str(uuid.uuid4()),
            category_id=professionalism.id,
            title="CV & Cover Letter Templates for Cameroon Job Market",
            description="Templates and examples adapted for local employers and international organizations.",
            type="ZIP",
            file_url="https://images.unsplash.com/photo-1512427691650-1e0c2f9a81b3?w=600&h=400&fit=crop",
            size_label="1.4 MB",
            is_premium=False,
            allowed_roles="STUDENT",
        ),
        # Course books
        LibraryResource(
            id=str(uuid.uuid4()),
            category_id=course_books.id,
            title="Introductory Microeconomics (Level 200)",
            description="Core notes and example questions for first courses in microeconomics.",
            type="PDF",
            file_url="https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=600&h=400&fit=crop",
            size_label="6.3 MB",
            is_premium=False,
            allowed_roles="STUDENT",
        ),
        LibraryResource(
            id=str(uuid.uuid4()),
            category_id=course_books.id,
            title="Fundamentals of Programming with Python",
            description="Beginner-friendly programming text used in many CS departments across Cameroon.",
            type="PDF",
            file_url="https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=600&h=400&fit=crop",
            size_label="7.8 MB",
            is_premium=False,
            allowed_roles="STUDENT",
        ),
    ]

    db.add_all(resources)
    db.commit()


@router.get("/categories", response_model=List[LibraryCategoryOut])
def list_categories(db: Session = Depends(get_db)):
    _ensure_seed_data(db)
    return db.query(LibraryCategory).order_by(LibraryCategory.name).all()


@router.get("/resources", response_model=List[LibraryResourceOut])
def list_resources(db: Session = Depends(get_db)):
    _ensure_seed_data(db)
    return db.query(LibraryResource).order_by(LibraryResource.created_at.desc()).all()
