from fastapi import HTTPException
from sqlmodel import Session, select
import uuid


from app import models

def get_project_or_404(project_id: uuid.UUID, session: Session):
    project = session.exec(select(models.Project).where(models.Project.id == project_id)).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

def get_member_or_404(member_id: uuid.UUID, project_id: uuid.UUID, session: Session):
    member = session.exec(
        select(models.Member).where(models.Member.id == member_id, models.Member.project_id == project_id)
    ).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    return member

def get_expense_or_404(expense_id: uuid.UUID, session: Session):
    expense = session.exec(select(models.Expense).where(models.Expense.id == expense_id)).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    return expense
