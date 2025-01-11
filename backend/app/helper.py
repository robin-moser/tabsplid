from fastapi import HTTPException
from sqlmodel import Session, select
import uuid


from app import models

def get_project_or_404(project_id: uuid.UUID, session: Session):
    project = session.exec(select(models.Project).where(models.Project.id == project_id)).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

def get_person_or_404(person_id: uuid.UUID, project_id: uuid.UUID, session: Session):
    person = session.exec(
        select(models.Person).where(models.Person.id == person_id, models.Person.project_id == project_id)
    ).first()
    if not person:
        raise HTTPException(status_code=404, detail="Person not found")
    return person

def get_expense_or_404(expense_id: uuid.UUID, session: Session):
    expense = session.exec(select(models.Expense).where(models.Expense.id == expense_id)).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    return expense
