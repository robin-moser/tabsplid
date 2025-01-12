from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from typing import List
import uuid

from app.database import get_session
from app import models, helper

router = APIRouter(prefix="/api")

### PROJECTS ###

# Create a new project
@router.post("/projects", response_model=models.ProjectPublic)
def create_project(project_create: models.ProjectCreate, session: Session = Depends(get_session)):
    project = models.Project(**project_create.model_dump())
    session.add(project)
    session.commit()
    session.refresh(project)
    return project

# Get a project by id
@router.get("/projects/{id}", response_model=models.ProjectPublic)
def get_project(id: uuid.UUID, session: Session = Depends(get_session)):
    return helper.get_project_or_404(id, session)

# Update a project by id
@router.put("/projects/{id}", response_model=models.ProjectPublic)
def update_project(id: uuid.UUID, project_update: models.ProjectUpdate, session: Session = Depends(get_session)):
    project = helper.get_project_or_404(id, session)

    update_data = project_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(project, key, value)

    session.add(project)
    session.commit()
    session.refresh(project)
    return project

# Delete a project
@router.delete("/projects/{id}", response_model=dict)
def delete_project(id: uuid.UUID, session: Session = Depends(get_session)):
    project = helper.get_project_or_404(id, session)
    session.delete(project)
    session.commit()
    return {"message": f"Project with id {id} has been deleted."}

# Get all projects
@router.get("/projects", response_model=List[models.ProjectPublicAll])
def get_all_projects(session: Session = Depends(get_session)):
    projects = session.exec(select(models.Project)).all()
    print(projects)
    return projects

# Delete all projects
@router.delete("/projects", response_model=dict)
def delete_all_projects(session: Session = Depends(get_session)):
    projects = session.exec(select(models.Project)).all()
    for project in projects:
        session.delete(project)
    session.commit()
    return {"message": "All projects have been deleted."}

### PERSONS ###

# Create a new member for a project
@router.post("/projects/{id}/members", response_model=models.MemberPublic)
def create_member(id: uuid.UUID, member_create: models.MemberCreate, session: Session = Depends(get_session)):
    member = models.Member(**member_create.model_dump())
    member.project_id = id
    session.add(member)
    session.commit()
    session.refresh(member)
    return member

# Get all members for a project
@router.get("/projects/{id}/members", response_model=List[models.MemberPublic])
def get_all_members(id: uuid.UUID, session: Session = Depends(get_session)):
    project = helper.get_project_or_404(id, session)
    return project.members

# Update a member for a project
@router.put("/projects/{id}/members/{member_id}", response_model=models.Member)
def update_member(id: uuid.UUID, member_id: uuid.UUID, member_update: models.MemberUpdate, session: Session = Depends(get_session)):
    member = helper.get_member_or_404(member_id, id, session)

    update_data = member_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(member, key, value)

    session.add(member)
    session.commit()
    session.refresh(member)
    return member

# Delete a member for a project
@router.delete("/projects/{id}/members/{member_id}", response_model=dict)
def delete_member(id: uuid.UUID, member_id: uuid.UUID, session: Session = Depends(get_session)):
    member = helper.get_member_or_404(member_id, id, session)
    session.delete(member)
    session.commit()
    return {"message": f"Member with id {member_id} has been deleted."}

### EXPENSES ###

# Create a new expense for a member
@router.post("/projects/{id}/members/{member_id}/expenses", response_model=models.ExpensePublic)
def create_expense(id: uuid.UUID, member_id: uuid.UUID, expense_create: models.ExpenseCreate, session: Session = Depends(get_session)):
    data = expense_create.model_dump(exclude_unset=True)

    # involved_members is a list of dics with the id of the members,
    # so we need to get the member object for each id
    involved_members = []
    involved_member_ids = data.get("involved_members", [])
    if involved_member_ids:
        involved_members = session.exec(
            select(models.Member).where(models.Member.id.in_(involved_member_ids))
        ).all()
        if len(involved_members) != len(involved_member_ids):
            raise HTTPException(status_code=404, detail="One or more involved members not found")
    data["involved_members"] = involved_members

    expense = models.Expense(**data, project_id=id, member_id=member_id)
    session.add(expense)
    session.commit()
    session.refresh(expense)
    return expense

# Update an expense for a member
@router.put("/projects/{id}/members/{member_id}/expenses/{expense_id}", response_model=models.ExpensePublic)
def update_expense(id: uuid.UUID, member_id: uuid.UUID, expense_id: uuid.UUID, expense_update: models.ExpenseUpdate, session: Session = Depends(get_session)):
    expense = helper.get_expense_or_404(expense_id, session)
    data = expense_update.model_dump(exclude_unset=True)

    # involved_members is a list of dics with the id of the members,
    # so we need to get the member object for each id
    involved_members = []
    involved_member_ids = data.get("involved_members", [])
    if involved_member_ids:
        involved_members = session.exec(
            select(models.Member).where(models.Member.id.in_(involved_member_ids))
        ).all()
        if len(involved_members) != len(involved_member_ids):
            raise HTTPException(status_code=404, detail="One or more involved members not found")
    data["involved_members"] = involved_members

    for key, value in data.items():
        setattr(expense, key, value)

    session.add(expense)
    session.commit()
    session.refresh(expense)
    return expense

# Get the calculatet depts and credits for a a complete project
@router.get("/projects/{id}/calculate", response_model=models.Calculate)
def calculate(id: uuid.UUID, session: Session = Depends(get_session)):
    project = helper.get_project_or_404(id, session)
    members = list(session.exec(select(models.Member).where(models.Member.project_id == project.id)).all())
    if not members:
        raise HTTPException(status_code=404, detail="No members found in this project")

    expense_query = session.exec(
        select(models.Expense).where(models.Expense.project_id == project.id)
    )
    for expense in expense_query:
        involved_members = expense.involved_members or members  # Assume all members if empty
        part_amount = expense.amount / len(involved_members)

        for involved_member in involved_members:
            involved_member.balance -= part_amount
        expense.member.balance += expense.amount

    payments = []

    for member in members:
        if member.balance < 0:
            for other_member in members:
                if other_member.balance > 0:
                    payment = models.Payment(
                        from_member=member,
                        to_member=other_member,
                        amount=min(abs(member.balance), other_member.balance)
                    )
                    payments.append(payment)
                    member.balance += payment.amount
                    other_member.balance -= payment.amount


    calculate = models.Calculate(
        payments=payments,
        project=project

    )

    return calculate
