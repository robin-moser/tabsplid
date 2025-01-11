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

# Create a new person for a project
@router.post("/projects/{id}/persons", response_model=models.PersonPublic)
def create_person(id: uuid.UUID, person_create: models.PersonCreate, session: Session = Depends(get_session)):
    person = models.Person(**person_create.model_dump())
    person.project_id = id
    session.add(person)
    session.commit()
    session.refresh(person)
    return person

# Get all persons for a project
@router.get("/projects/{id}/persons", response_model=List[models.PersonPublic])
def get_all_persons(id: uuid.UUID, session: Session = Depends(get_session)):
    project = helper.get_project_or_404(id, session)
    return project.persons

# Update a person for a project
@router.put("/projects/{id}/persons/{person_id}", response_model=models.Person)
def update_person(id: uuid.UUID, person_id: uuid.UUID, person_update: models.PersonUpdate, session: Session = Depends(get_session)):
    person = helper.get_person_or_404(person_id, id, session)

    update_data = person_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(person, key, value)

    session.add(person)
    session.commit()
    session.refresh(person)
    return person

# Delete a person for a project
@router.delete("/projects/{id}/persons/{person_id}", response_model=dict)
def delete_person(id: uuid.UUID, person_id: uuid.UUID, session: Session = Depends(get_session)):
    person = helper.get_person_or_404(person_id, id, session)
    session.delete(person)
    session.commit()
    return {"message": f"Person with id {person_id} has been deleted."}

### EXPENSES ###

# Create a new expense for a person
@router.post("/projects/{id}/persons/{person_id}/expenses", response_model=models.ExpensePublic)
def create_expense(id: uuid.UUID, person_id: uuid.UUID, expense_create: models.ExpenseCreate, session: Session = Depends(get_session)):
    data = expense_create.model_dump(exclude_unset=True)

    # involved_persons is a list of dics with the id of the persons,
    # so we need to get the person object for each id
    involved_persons = []
    involved_person_ids = data.get("involved_persons", [])
    if involved_person_ids:
        involved_persons = session.exec(
            select(models.Person).where(models.Person.id.in_(involved_person_ids))
        ).all()
        if len(involved_persons) != len(involved_person_ids):
            raise HTTPException(status_code=404, detail="One or more involved persons not found")
    data["involved_persons"] = involved_persons

    expense = models.Expense(**data, project_id=id, person_id=person_id)
    session.add(expense)
    session.commit()
    session.refresh(expense)
    return expense

# Update an expense for a person
@router.put("/projects/{id}/persons/{person_id}/expenses/{expense_id}", response_model=models.ExpensePublic)
def update_expense(id: uuid.UUID, person_id: uuid.UUID, expense_id: uuid.UUID, expense_update: models.ExpenseUpdate, session: Session = Depends(get_session)):
    expense = helper.get_expense_or_404(expense_id, session)
    data = expense_update.model_dump(exclude_unset=True)

    # involved_persons is a list of dics with the id of the persons,
    # so we need to get the person object for each id
    involved_persons = []
    involved_person_ids = data.get("involved_persons", [])
    if involved_person_ids:
        involved_persons = session.exec(
            select(models.Person).where(models.Person.id.in_(involved_person_ids))
        ).all()
        if len(involved_persons) != len(involved_person_ids):
            raise HTTPException(status_code=404, detail="One or more involved persons not found")
    data["involved_persons"] = involved_persons

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
    persons = list(session.exec(select(models.Person).where(models.Person.project_id == project.id)).all())
    if not persons:
        raise HTTPException(status_code=404, detail="No persons found in this project")

    expense_query = session.exec(
        select(models.Expense).where(models.Expense.project_id == project.id)
    )
    for expense in expense_query:
        involved_persons = expense.involved_persons or persons  # Assume all persons if empty
        part_amount = expense.amount / len(involved_persons)

        for involved_person in involved_persons:
            involved_person.balance -= part_amount
        expense.person.balance += expense.amount

    payments = []

    for person in persons:
        if person.balance < 0:
            for other_person in persons:
                if other_person.balance > 0:
                    payment = models.Payment(
                        from_person=person,
                        to_person=other_person,
                        amount=min(abs(person.balance), other_person.balance)
                    )
                    payments.append(payment)
                    person.balance += payment.amount
                    other_person.balance -= payment.amount


    calculate = models.Calculate(
        payments=payments,
        project=project

    )

    return calculate
