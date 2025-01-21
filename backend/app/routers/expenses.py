from fastapi import Depends
from sqlmodel import Session, select
import uuid

from app.database import get_session
from app import models, helper

router = helper.get_router()

# GET    /projects/{id}/members/{member_id}/expenses (get all expenses for a member)
# POST   /projects/{id}/members/{member_id}/expenses (create a new expense for a member)

# GET    /projects/{id}/members/{member_id}/expenses/{expense_id} (get an expense by id)
# PUT    /projects/{id}/members/{member_id}/expenses/{expense_id} (update an expense by id)
# DELETE /projects/{id}/members/{member_id}/expenses/{expense_id} (delete an expense by id)

# Get all expenses for a member
@router.get("/projects/{id}/members/{member_id}/expenses", response_model=list[models.ExpensePublic])
def get_all_expenses(
        id: uuid.UUID,
        member_id: uuid.UUID,
        session: Session = Depends(get_session)):

    expenses = session.exec(
        select(models.Expense).where(
            models.Expense.project_id == id,
            models.Expense.member_id == member_id
        )
    ).all()
    return expenses


# Create a new expense for a member
@router.post("/projects/{id}/members/{member_id}/expenses", response_model=models.ExpensePublic)
def create_expense(
        id: uuid.UUID,
        member_id: uuid.UUID,
        data: models.ExpenseCreate,
        session: Session = Depends(get_session)):

    create = data.model_dump(exclude_unset=True)
    create = helper.remodel_involved_members(create, session)
    expense = models.Expense(**create, project_id=id, member_id=member_id)

    session.add(expense)
    session.commit()
    session.refresh(expense)
    return expense


# Get an expense by id
@router.get("/projects/{id}/members/{member_id}/expenses/{expense_id}", response_model=models.ExpensePublic)
def get_expense(
        member_id: uuid.UUID,
        expense_id: uuid.UUID,
        session: Session = Depends(get_session)):

    expense = helper.get_expense_or_404(expense_id, member_id, session)
    return expense


# Update an expense by id
@router.put("/projects/{id}/members/{member_id}/expenses/{expense_id}", response_model=models.ExpensePublic)
def update_expense(
        member_id: uuid.UUID,
        expense_id: uuid.UUID,
        data: models.ExpenseUpdate,
        session: Session = Depends(get_session)):

    expense = helper.get_expense_or_404(expense_id, member_id, session)
    update = data.model_dump(exclude_unset=True)
    update = helper.remodel_involved_members(update, session)

    for key, value in update.items():
        setattr(expense, key, value)

    session.add(expense)
    session.commit()
    session.refresh(expense)
    return expense


# Delete an expense by id
@router.delete("/projects/{id}/members/{member_id}/expenses/{expense_id}", response_model=None, status_code=204)
def delete_expense(
        member_id: uuid.UUID,
        expense_id: uuid.UUID,
        session: Session = Depends(get_session)):

    expense = helper.get_expense_or_404(expense_id, member_id, session)
    session.delete(expense)
    session.commit()
    return
