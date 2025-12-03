from pydantic import BaseModel


class PortfolioOverviewOut(BaseModel):
    id: str
    headline: str | None = None
    bio: str | None = None
    projects_count: int
    certifications_count: int
    testimonials_count: int

    class Config:
        from_attributes = True
