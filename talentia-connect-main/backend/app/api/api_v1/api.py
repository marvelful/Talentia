from fastapi import APIRouter

from .endpoints import auth, gigs, library, courses, mentorship, portfolio


api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(gigs.router, prefix="/gigs", tags=["gigs"])
api_router.include_router(library.router, prefix="/library", tags=["library"])
api_router.include_router(courses.router, prefix="/courses", tags=["courses"])
api_router.include_router(mentorship.router, tags=["mentorship"])  # exposes /mentors
api_router.include_router(portfolio.router, prefix="/portfolio", tags=["portfolio"])
