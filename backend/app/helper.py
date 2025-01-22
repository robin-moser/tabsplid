from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from sqlmodel import Session, col, select
import bcrypt
import uuid
import os

from app import models

# Configure Basic Auth
security = HTTPBasic()

# Fetch the bcrypt hashed credentials from environment variable
hashed_credentials = os.getenv("BASIC_AUTH")
try:
    auth_user, auth_hash = hashed_credentials.split(":") if hashed_credentials else (None, None)
except ValueError:
    raise RuntimeError("BASIC_AUTH environment variable must be in the format 'username:hashed_password'.")

def get_router():
    return APIRouter(prefix="/api")

def authenticated_or_401(credentials: HTTPBasicCredentials = Depends(security)):
    # if auth_user or auth_hash are not defined, raise an exception
    if not (auth_user and auth_hash):
        raise HTTPException(
            status_code=500,
            detail="Basic auth credentials not set",
        )

    # Check if the provided credentials are correct
    if not (credentials.username == auth_user and bcrypt.checkpw(
        credentials.password.encode('UTF-8'), auth_hash.encode('UTF-8'))):
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Basic"},
        )

    return credentials.username

def get_project_or_404(project_id: uuid.UUID, session: Session):
    project = session.exec(
            select(models.Project).where(
                models.Project.id == project_id,
                )
            ).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

def get_member_or_404(member_id: uuid.UUID, project_id: uuid.UUID, session: Session):
    member = session.exec(
            select(models.Member).where(
                models.Member.id == member_id,
                models.Member.project_id == project_id,
                )
            ).first()

    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    return member

def get_expense_or_404(expense_id: uuid.UUID, member_id: uuid.UUID, session: Session):
    expense = session.exec(
            select(models.Expense).where(
                models.Expense.id == expense_id,
                models.Expense.member_id == member_id,
                )
            ).first()

    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    return expense

def remodel_involved_members(data, session):
    involved_members = []
    involved_member_ids = data.get("involved_members", [])

    if involved_member_ids:
        involved_members = session.exec(
            select(models.Member).where(
                col(models.Member.id).in_(involved_member_ids)
            )
        ).all()

        if len(involved_members) != len(involved_member_ids):
            raise HTTPException(
                status_code=404,
                detail="One or more involved members not found"
            )

    data["involved_members"] = involved_members
    return data

def calculate_project_payments(project: models.Project) -> list[models.PaymentPublic]:
    # Reset all member balances
    for member in project.members:
        member.balance = 0

    # Distribute expense amounts to members
    for expense in project.expenses:
        involved_members = expense.involved_members or project.members
        part_amount = (expense.amount or 0) / len(involved_members)

        for member in involved_members:
            member.balance -= part_amount
        expense.member.balance += (expense.amount or 0)

    # Calculate payments to settle balances
    payments = []
    for member in project.members:
        if member.balance < 0:
            for other_member in project.members:
                if other_member.balance > 0:
                    amount = min(abs(member.balance), other_member.balance)
                    payments.append(models.Payment(
                        from_member=member,
                        to_member=other_member,
                        amount=amount
                    ))

                    # Update balances after payment
                    member.balance += amount
                    other_member.balance -= amount

    # Convert payments to public format
    payments_public = [
        models.PaymentPublic(
            from_member=models.MemberPublic.model_validate(payment.from_member),
            to_member=models.MemberPublic.model_validate(payment.to_member),
            amount=payment.amount
        )
        for payment in payments
    ]

    return payments_public
