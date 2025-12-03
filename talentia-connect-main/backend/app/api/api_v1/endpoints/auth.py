from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import uuid

from ....db.session import SessionLocal
from ....models.user import User, UserRole
from ....schemas.user import UserCreate, UserLogin, UserOut, TokenResponse
from ....core.security import get_password_hash, verify_password, create_access_token, decode_token

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def get_db():
  db = SessionLocal()
  try:
      yield db
  finally:
      db.close()


@router.post("/register", response_model=TokenResponse)
def register_user(payload: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    user = User(
        id=str(uuid.uuid4()),
        email=payload.email,
        password_hash=get_password_hash(payload.password),
        first_name=payload.firstName,
        last_name=payload.lastName,
        role=UserRole[payload.role],
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    access_token = create_access_token(subject=user.id, role=user.role.value)

    return TokenResponse(
        accessToken=access_token,
        user=UserOut(
            id=user.id,
            email=user.email,
            firstName=user.first_name,
            lastName=user.last_name,
            role=user.role.value,
        ),
    )


@router.post("/login", response_model=TokenResponse)
def login_user(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    access_token = create_access_token(subject=user.id, role=user.role.value)

    return TokenResponse(
        accessToken=access_token,
        user=UserOut(
            id=user.id,
            email=user.email,
            firstName=user.first_name,
            lastName=user.last_name,
            role=user.role.value,
        ),
    )


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    try:
        payload = decode_token(token)
        user_id: str = payload.get("sub")
    except Exception:  # noqa: BLE001
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


@router.get("/me", response_model=UserOut)
def read_me(current_user: User = Depends(get_current_user)):
    return UserOut(
        id=current_user.id,
        email=current_user.email,
        firstName=current_user.first_name,
        lastName=current_user.last_name,
        role=current_user.role.value,
    )
