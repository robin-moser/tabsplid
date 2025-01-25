from fastapi import Depends, Request
from sqlmodel import Session, select
import uuid

from app.database import get_session
from app.limiter import limiter
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
@limiter.limit("5/minute")
def get_all_projects(
        request: Request,
        _: str = Depends(helper.authenticated_or_401),
        session: Session = Depends(get_session)):

    projects = session.exec(select(models.Project)).all()
    return projects


# Create a new project
@router.post("/projects", response_model=models.ProjectPublic)
@limiter.limit("2/minute")
def create_project(
        request: Request,
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
@limiter.limit("10/10second")
def get_project(
        request: Request,
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
@limiter.limit("10/10second")
def update_project(
        request: Request,
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
@limiter.limit("2/minute")
def delete_project(
        request: Request,
        id: uuid.UUID,
        session: Session = Depends(get_session)):

    project = helper.get_project_or_404(id, session)
    session.delete(project)
    session.commit()
    return
