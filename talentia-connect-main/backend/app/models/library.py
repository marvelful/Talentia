from sqlalchemy import Column, String, DateTime, func, Text, Boolean

from ..db.session import Base


class LibraryCategory(Base):
    __tablename__ = "library_categories"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())


class LibraryResource(Base):
    __tablename__ = "library_resources"

    id = Column(String, primary_key=True, index=True)
    category_id = Column(String, nullable=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    type = Column(String, nullable=False)  # PDF, ZIP, VIDEO, XLSX, etc.
    file_url = Column(String, nullable=False)
    size_label = Column(String, nullable=True)
    is_premium = Column(Boolean, default=False, nullable=False)
    allowed_roles = Column(Text, nullable=True)  # comma-separated roles

    created_at = Column(DateTime(timezone=True), server_default=func.now())
