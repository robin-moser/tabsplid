from fastapi import Depends
from sqlmodel import Session, select
import uuid

from app.database import get_session
from app import models, helper

router = helper.get_router()

# GET    /projects (get all projects)
# POST   /projects (create a new project)
# DELETE /projects (delete all projects)

# GET    /projects/{id} (get a project by id)
# PUT    /projects/{id} (update a project by id)
# DELETE /projects/{id} (delete a project by id)

# Get all projects and optionally calculate payments
@router.get("/projects", response_model=list[models.ProjectPublicAll])
def get_all_projects(
        session: Session = Depends(get_session)):

    projects = session.exec(select(models.Project)).all()
    return projects


# Delete all projects
@router.delete("/projects", response_model=dict)
def delete_all_projects(
        session: Session = Depends(get_session)):

    projects = session.exec(select(models.Project)).all()
    for project in projects:
        session.delete(project)
    session.commit()
    return {"message": "All projects have been deleted."}


# Create a new project
@router.post("/projects", response_model=models.ProjectPublic)
def create_project(
        data: models.ProjectCreate,
        member_count: int = 0,
        session: Session = Depends(get_session)):

    project = models.Project(**data.model_dump())
    # Quickly add new members to the project
    for _ in range(member_count):
        member = models.Member(project_id=project.id)
        project.members.append(member)

    session.add(project)
    session.commit()
    session.refresh(project)
    return project


# Get a project by id
@router.get("/projects/{id}", response_model=models.ProjectPublic)
def get_project(
        id: uuid.UUID,
        calculate: bool = False,
        session: Session = Depends(get_session)):

    project = helper.get_project_or_404(id, session)
    project_public = models.ProjectPublic.model_validate(project)

    if calculate:
        project_public.payments = helper.calculate_project_payments(project)

    return project_public


# Update a project by id
@router.put("/projects/{id}", response_model=models.ProjectPublic)
def update_project(
        id: uuid.UUID,
        data: models.ProjectUpdate,
        session: Session = Depends(get_session)):

    project = helper.get_project_or_404(id, session)
    update = data.model_dump(exclude_unset=True)
    for key, value in update.items():
        setattr(project, key, value)

    session.add(project)
    session.commit()
    session.refresh(project)
    return project


# Delete a project
@router.delete("/projects/{id}", response_model=None, status_code=204)
def delete_project(
        id: uuid.UUID,
        session: Session = Depends(get_session)):

    project = helper.get_project_or_404(id, session)
    session.delete(project)
    session.commit()
    return
