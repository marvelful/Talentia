from typing import List
import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ....db.session import SessionLocal
from ....models.marketplace import Gig, GigApplication, Conversation, Message, Contract, Payment, Payout
from ....models.portfolio import RatingReview
from ....models.user import User, UserRole
from ....schemas.gig import (
    GigOut,
    GigCreate,
    GigApplicationCreate,
    GigApplicationOut,
    ConversationOut,
    MessageCreate,
    MessageOut,
    ContractCreate,
    ContractOut,
    ReleaseContractRequest,
)
from .auth import get_current_user

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _ensure_seed_company_and_gigs(db: Session) -> None:
    """Seed a demo company and a set of creative gigs (singing, dancing, painting...).

    This only runs when there are no gigs yet, so it is safe to call from the
    listing endpoint without duplicating data.
    """

    has_gigs = db.query(Gig).first()
    if has_gigs:
        return

    # Create a lightweight demo company account to own the seeded gigs.
    seed_email = "creative-hub@talentia.local"
    company = db.query(User).filter(User.email == seed_email).first()
    if not company:
        company = User(
            id=str(uuid.uuid4()),
            email=seed_email,
            password_hash="SEED_USER_NO_LOGIN",
            first_name="Creative",
            last_name="Hub",
            role=UserRole.COMPANY,
        )
        db.add(company)
        db.flush()  # ensure company.id is available

    gigs = [
        Gig(
            id=str(uuid.uuid4()),
            company_id=company.id,
            title="Afrobeats Singer for Campus Concert",
            description="Faith-based youth concert needs a powerful lead singer to perform 3–4 Afrobeats worship songs.",
            role="Lead Singer",
            budget_min=50000,
            budget_max=80000,
            location="Douala, Cameroon (on-site)",
            type="Gig",
            category="Singing",
        ),
        Gig(
            id=str(uuid.uuid4()),
            company_id=company.id,
            title="Gospel Choir for Youth Convention",
            description="University gospel convention looking for a student choir to lead praise & worship sessions.",
            role="Choir",
            budget_min=80000,
            budget_max=120000,
            location="Yaounde, Cameroon (on-site)",
            type="Contract",
            category="Singing",
        ),
        Gig(
            id=str(uuid.uuid4()),
            company_id=company.id,
            title="Afro Dance Crew for Cultural Night",
            description="University cultural night needs an energetic Afro dance crew for a 20–30 minute performance.",
            role="Dance Crew",
            budget_min=60000,
            budget_max=90000,
            location="Buea, Cameroon (on-site)",
            type="Gig",
            category="Dance",
        ),
        Gig(
            id=str(uuid.uuid4()),
            company_id=company.id,
            title="Contemporary Dance Performance for Conference Opening",
            description="Faith and creativity conference opening act – looking for a contemporary dance duo.",
            role="Dancer",
            budget_min=70000,
            budget_max=110000,
            location="Online rehearsal + Yaounde performance",
            type="Project",
            category="Dance",
        ),
        Gig(
            id=str(uuid.uuid4()),
            company_id=company.id,
            title="Live Painter for Youth Conference Stage",
            description="Create a prophetic art piece live on stage during worship sessions.",
            role="Painter",
            budget_min=40000,
            budget_max=70000,
            location="Douala, Cameroon (on-site)",
            type="Gig",
            category="Painting",
        ),
        Gig(
            id=str(uuid.uuid4()),
            company_id=company.id,
            title="Mural Artist for Campus Prayer Room",
            description="Design and paint a mural that reflects hope, unity and excellence in the campus prayer room.",
            role="Visual Artist",
            budget_min=90000,
            budget_max=150000,
            location="Bamenda, Cameroon (on-site)",
            type="Project",
            category="Painting",
        ),
        Gig(
            id=str(uuid.uuid4()),
            company_id=company.id,
            title="Spoken Word & Music Set for Youth Sunday",
            description="Blend spoken word and soft acoustic music for a 10–15 minute youth service piece.",
            role="Spoken Word Artist",
            budget_min=30000,
            budget_max=60000,
            location="Hybrid (online prep, on-site performance)",
            type="Gig",
            category="Music",
        ),
        Gig(
            id=str(uuid.uuid4()),
            company_id=company.id,
            title="Cultural Troupe for Inter-university Festival",
            description="Showcase traditional Cameroonian dance and drumming at an inter-university cultural festival.",
            role="Cultural Performer",
            budget_min=100000,
            budget_max=180000,
            location="Limbe, Cameroon (on-site)",
            type="Gig",
            category="Cultural Performance",
        ),
    ]

    db.add_all(gigs)
    db.commit()


@router.post("/", response_model=GigOut, status_code=status.HTTP_201_CREATED)
def create_gig(
    payload: GigCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Only company users can create gigs
    if current_user.role != UserRole.COMPANY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only company users can post opportunities",
        )

    gig = Gig(
        id=str(uuid.uuid4()),
        company_id=current_user.id,
        title=payload.title,
        description=payload.description,
        role=payload.role,
        budget_min=payload.budgetMin,
        budget_max=payload.budgetMax,
        location=payload.location,
        type=payload.type,
        category=payload.category,
        deadline=payload.deadline,
    )
    db.add(gig)
    db.commit()
    db.refresh(gig)

    # Derive budget label in the same way as list_gigs
    if gig.budget_min is not None and gig.budget_max is not None:
        budget = f"XAF {gig.budget_min:,.0f} - XAF {gig.budget_max:,.0f}"
    elif gig.budget_min is not None:
        budget = f"From XAF {gig.budget_min:,.0f}"
    elif gig.budget_max is not None:
        budget = f"Up to XAF {gig.budget_max:,.0f}"
    else:
        budget = None

    company_name = f"{current_user.first_name} {current_user.last_name}".strip() or "Company"
    company_logo = "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop"

    return GigOut(
        id=gig.id,
        title=gig.title,
        company=company_name,
        companyLogo=company_logo,
        location=gig.location,
        type=gig.type,
        budget=budget,
        deadline=gig.deadline,
        posted=gig.created_at.isoformat() if gig.created_at else "",
        description=gig.description,
        skills=[],
        applicants=0,
        category=gig.category,
    )


@router.get("/", response_model=List[GigOut])
def list_gigs(db: Session = Depends(get_db)):
    # Seed some creative demo gigs (singing, dancing, painting, etc.) the first
    # time this endpoint is called so the Opportunities page is not empty in a
    # fresh environment.
    _ensure_seed_company_and_gigs(db)

    # Only show gigs that are still open (or with no explicit status yet)
    gigs = (
        db.query(Gig)
        .filter((Gig.status == "OPEN") | (Gig.status.is_(None)))
        .order_by(Gig.created_at.desc())
        .all()
    )

    results: List[GigOut] = []
    for gig in gigs:
        # Derive a budget label from min/max (XAF currency)
        if gig.budget_min is not None and gig.budget_max is not None:
            budget = f"XAF {gig.budget_min:,.0f} - XAF {gig.budget_max:,.0f}"
        elif gig.budget_min is not None:
            budget = f"From XAF {gig.budget_min:,.0f}"
        elif gig.budget_max is not None:
            budget = f"Up to XAF {gig.budget_max:,.0f}"
        else:
            budget = None

        # Placeholder company & logo for now (until we add richer company profiles)
        company_name = "Company"
        company_logo = "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop"

        results.append(
            GigOut(
                id=gig.id,
                title=gig.title,
                company=company_name,
                companyLogo=company_logo,
                location=gig.location,
                type=gig.type,
                budget=budget,
                deadline=gig.deadline,
                posted=gig.created_at.isoformat() if gig.created_at else "",
                description=gig.description,
                skills=[],
                applicants=len(gig.applications) if hasattr(gig, "applications") and gig.applications else 0,
                category=gig.category,
            )
        )

    return results


@router.get("/conversations/me", response_model=List[ConversationOut])
def list_my_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    conversations = (
        db.query(Conversation)
        .filter(
            (Conversation.company_id == current_user.id)
            | (Conversation.student_id == current_user.id)
        )
        .order_by(Conversation.created_at.desc())
        .all()
    )

    results: List[ConversationOut] = []
    for conv in conversations:
        messages_out: List[MessageOut] = []
        if conv.messages:
            for m in sorted(conv.messages, key=lambda x: x.created_at):
                messages_out.append(
                    MessageOut(
                        id=m.id,
                        senderId=m.sender_id,
                        content=m.content,
                        createdAt=m.created_at,
                    )
                )

        results.append(
            ConversationOut(
                id=conv.id,
                gigId=conv.gig_id,
                applicationId=conv.application_id,
                companyId=conv.company_id,
                studentId=conv.student_id,
                messages=messages_out,
            )
        )

    return results


@router.post("/applications/{application_id}/approve", response_model=ConversationOut)
def approve_application(
    application_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    application = db.query(GigApplication).filter(GigApplication.id == application_id).first()
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    gig = db.query(Gig).filter(Gig.id == application.gig_id).first()
    if not gig:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Gig not found")

    # Only the owning company (or super admin) can approve applications
    if gig.company_id != current_user.id and current_user.role != UserRole.SUPER_ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to approve applications for this opportunity",
        )

    application.status = "APPROVED"

    conversation = (
        db.query(Conversation)
        .filter(Conversation.application_id == application.id)
        .first()
    )
    if not conversation:
        conversation = Conversation(
            id=str(uuid.uuid4()),
            gig_id=gig.id,
            application_id=application.id,
            company_id=gig.company_id,
            student_id=application.student_id,
        )
        db.add(conversation)

    db.commit()
    db.refresh(conversation)

    messages_out: List[MessageOut] = []
    if conversation.messages:
        for m in sorted(conversation.messages, key=lambda x: x.created_at):
            messages_out.append(
                MessageOut(
                    id=m.id,
                    senderId=m.sender_id,
                    content=m.content,
                    createdAt=m.created_at,
                )
            )

    return ConversationOut(
        id=conversation.id,
        gigId=conversation.gig_id,
        applicationId=conversation.application_id,
        companyId=conversation.company_id,
        studentId=conversation.student_id,
        messages=messages_out,
    )


@router.get("/applications/{application_id}/conversation", response_model=ConversationOut)
def get_conversation_for_application(
    application_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    application = db.query(GigApplication).filter(GigApplication.id == application_id).first()
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    gig = db.query(Gig).filter(Gig.id == application.gig_id).first()
    if not gig:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Gig not found")

    # Only company, student or super admin can see the conversation
    if (
        gig.company_id != current_user.id
        and application.student_id != current_user.id
        and current_user.role != UserRole.SUPER_ADMIN
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to view this conversation",
        )

    conversation = (
        db.query(Conversation)
        .filter(Conversation.application_id == application_id)
        .first()
    )
    if not conversation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")

    messages_out: List[MessageOut] = []
    if conversation.messages:
        for m in sorted(conversation.messages, key=lambda x: x.created_at):
            messages_out.append(
                MessageOut(
                    id=m.id,
                    senderId=m.sender_id,
                    content=m.content,
                    createdAt=m.created_at,
                )
            )

    return ConversationOut(
        id=conversation.id,
        gigId=conversation.gig_id,
        applicationId=conversation.application_id,
        companyId=conversation.company_id,
        studentId=conversation.student_id,
        messages=messages_out,
    )


@router.post("/applications/{application_id}/messages", response_model=MessageOut)
def send_message_for_application(
    application_id: str,
    payload: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    application = db.query(GigApplication).filter(GigApplication.id == application_id).first()
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    gig = db.query(Gig).filter(Gig.id == application.gig_id).first()
    if not gig:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Gig not found")

    # Only company, student or super admin can send messages
    if (
        gig.company_id != current_user.id
        and application.student_id != current_user.id
        and current_user.role != UserRole.SUPER_ADMIN
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to send messages in this conversation",
        )

    conversation = (
        db.query(Conversation)
        .filter(Conversation.application_id == application_id)
        .first()
    )
    if not conversation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")

    message = Message(
        id=str(uuid.uuid4()),
        conversation_id=conversation.id,
        sender_id=current_user.id,
        content=payload.content,
    )
    db.add(message)
    db.commit()
    db.refresh(message)

    return MessageOut(
        id=message.id,
        senderId=message.sender_id,
        content=message.content,
        createdAt=message.created_at,
    )


@router.get("/my", response_model=List[GigOut])
def list_my_gigs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != UserRole.COMPANY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only company users can view their own opportunities",
        )

    gigs = (
        db.query(Gig)
        .filter(Gig.company_id == current_user.id)
        .order_by(Gig.created_at.desc())
        .all()
    )

    results: List[GigOut] = []
    for gig in gigs:
        if gig.budget_min is not None and gig.budget_max is not None:
            budget = f"XAF {gig.budget_min:,.0f} - XAF {gig.budget_max:,.0f}"
        elif gig.budget_min is not None:
            budget = f"From XAF {gig.budget_min:,.0f}"
        elif gig.budget_max is not None:
            budget = f"Up to XAF {gig.budget_max:,.0f}"
        else:
            budget = None

        company_name = f"{current_user.first_name} {current_user.last_name}".strip() or "Company"
        company_logo = "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop"

        results.append(
            GigOut(
                id=gig.id,
                title=gig.title,
                company=company_name,
                companyLogo=company_logo,
                location=gig.location,
                type=gig.type,
                budget=budget,
                deadline=gig.deadline,
                posted=gig.created_at.isoformat() if gig.created_at else "",
                description=gig.description,
                skills=[],
                applicants=len(gig.applications) if hasattr(gig, "applications") and gig.applications else 0,
                category=gig.category,
            )
        )

    return results


@router.post("/{gig_id}/apply", response_model=GigApplicationOut, status_code=status.HTTP_201_CREATED)
def apply_to_gig(
    gig_id: str,
    payload: GigApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can apply to opportunities",
        )

    gig = db.query(Gig).filter(Gig.id == gig_id).first()
    if not gig:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Gig not found")

    # Optional: prevent duplicate applications
    existing = (
        db.query(GigApplication)
        .filter(
            GigApplication.gig_id == gig_id,
            GigApplication.student_id == current_user.id,
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already applied to this opportunity",
        )

    application = GigApplication(
        id=str(uuid.uuid4()),
        gig_id=gig_id,
        student_id=current_user.id,
        proposal=payload.proposal,
        status="APPLIED",
    )
    db.add(application)
    db.commit()
    db.refresh(application)

    student_name = f"{current_user.first_name} {current_user.last_name}".strip() or current_user.email

    return GigApplicationOut(
        id=application.id,
        gigId=application.gig_id,
        studentId=application.student_id,
        studentName=student_name,
        proposal=application.proposal,
        status=application.status,
        appliedAt=application.applied_at,
    )


@router.post("/applications/{application_id}/contracts", response_model=ContractOut)
def create_contract_for_application(
    application_id: str,
    payload: ContractCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    application = db.query(GigApplication).filter(GigApplication.id == application_id).first()
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    gig = db.query(Gig).filter(Gig.id == application.gig_id).first()
    if not gig:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Gig not found")

    if gig.company_id != current_user.id and current_user.role != UserRole.SUPER_ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to create a contract for this opportunity",
        )

    # One contract per application
    existing = (
        db.query(Contract)
        .filter(Contract.application_id == application.id)
        .first()
    )
    if existing:
        contract = existing
    else:
        contract = Contract(
            id=str(uuid.uuid4()),
            gig_id=gig.id,
            application_id=application.id,
            agreed_amount=payload.agreedAmount,
            status="ACTIVE",
        )
        db.add(contract)

        # Create a held payment record (simulated escrow)
        payment = Payment(
            id=str(uuid.uuid4()),
            contract_id=contract.id,
            provider="TALENTIA_ESCROW",
            reference=f"ESCROW-{contract.id}",
            amount=payload.agreedAmount,
            status="HELD",
        )
        db.add(payment)

    db.commit()
    db.refresh(contract)

    return ContractOut(
        id=contract.id,
        gigId=contract.gig_id,
        applicationId=contract.application_id,
        companyId=gig.company_id,
        studentId=application.student_id,
        agreedAmount=contract.agreed_amount,
        status=contract.status,
        createdAt=contract.created_at,
    )


@router.get("/applications/{application_id}/contract", response_model=ContractOut | None)
def get_contract_for_application(
    application_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    application = db.query(GigApplication).filter(GigApplication.id == application_id).first()
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    gig = db.query(Gig).filter(Gig.id == application.gig_id).first()
    if not gig:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Gig not found")

    if (
        gig.company_id != current_user.id
        and application.student_id != current_user.id
        and current_user.role != UserRole.SUPER_ADMIN
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to view this contract",
        )

    contract = (
        db.query(Contract)
        .filter(Contract.application_id == application_id)
        .first()
    )
    if not contract:
        return None

    return ContractOut(
        id=contract.id,
        gigId=contract.gig_id,
        applicationId=contract.application_id,
        companyId=gig.company_id,
        studentId=application.student_id,
        agreedAmount=contract.agreed_amount,
        status=contract.status,
        createdAt=contract.created_at,
    )


@router.post("/contracts/{contract_id}/release", response_model=ContractOut)
def release_contract_payment(
    contract_id: str,
    payload: ReleaseContractRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not contract:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contract not found")

    gig = db.query(Gig).filter(Gig.id == contract.gig_id).first()
    if not gig:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Gig not found")

    application = db.query(GigApplication).filter(GigApplication.id == contract.application_id).first()
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    if gig.company_id != current_user.id and current_user.role != UserRole.SUPER_ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to release this payment",
        )

    # Mark payment as paid and create payout (simulated transfer)
    payment = (
        db.query(Payment)
        .filter(Payment.contract_id == contract.id)
        .first()
    )
    if payment:
        payment.status = "PAID"

    payout = Payout(
        id=str(uuid.uuid4()),
        user_id=application.student_id,
        amount=contract.agreed_amount,
        status="PENDING",
    )
    db.add(payout)

    contract.status = "COMPLETED"

    # Mark gig as filled so it no longer appears as an open opportunity
    if gig.status != "FILLED":
        gig.status = "FILLED"

    # Optional rating / review
    if payload.rating is not None:
        review = RatingReview(
            id=str(uuid.uuid4()),
            from_user_id=current_user.id,
            to_user_id=application.student_id,
            rating=payload.rating,
            comment=payload.comment,
            context="GIG",
        )
        db.add(review)

    db.commit()
    db.refresh(contract)

    return ContractOut(
        id=contract.id,
        gigId=contract.gig_id,
        applicationId=contract.application_id,
        companyId=gig.company_id,
        studentId=application.student_id,
        agreedAmount=contract.agreed_amount,
        status=contract.status,
        createdAt=contract.created_at,
    )


@router.get("/{gig_id}/applications", response_model=List[GigApplicationOut])
def list_applications_for_gig(
    gig_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    gig = db.query(Gig).filter(Gig.id == gig_id).first()
    if not gig:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Gig not found")

    # Only the company that owns the gig (or a super admin) can view applications
    if gig.company_id != current_user.id and current_user.role != UserRole.SUPER_ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to view applications for this opportunity",
        )

    applications = (
        db.query(GigApplication)
        .filter(GigApplication.gig_id == gig_id)
        .order_by(GigApplication.applied_at.desc())
        .all()
    )

    results: List[GigApplicationOut] = []
    for app in applications:
        student = app.student  # relationship to User
        student_name = (
            f"{student.first_name} {student.last_name}".strip()
            if student is not None
            else app.student_id
        )
        results.append(
            GigApplicationOut(
                id=app.id,
                gigId=app.gig_id,
                studentId=app.student_id,
                studentName=student_name,
                proposal=app.proposal,
                status=app.status,
                appliedAt=app.applied_at,
            )
        )

    return results
