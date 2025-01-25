from fastapi import Depends, Request
from sqlmodel import Session
import uuid

from app.database import get_session
from app.limiter import limiter
from app import models, helper

router = helper.get_router()

# GET    /projects/{id}/members (get all members of a project)
# POST   /projects/{id}/members (create a new member for a project)

# GET    /projects/{id}/members/{member_id} (get a member by id)
# PUT    /projects/{id}/members/{member_id} (update a member by id)
# DELETE /projects/{id}/members/{member_id} (delete a member by id)

# Get all members of a project
@router.get("/projects/{id}/members", response_model=list[models.MemberPublic])
@limiter.limit("10/10second")
def get_all_members(
        request: Request,
        id: uuid.UUID,
        session: Session = Depends(get_session)):

    project = helper.get_project_or_404(id, session)
    return project.members


# Create a new member for a project
@router.post("/projects/{id}/members", response_model=models.MemberPublicWithExpenses)
@limiter.limit("30/5minute")
def create_member(
        request: Request,
        id: uuid.UUID,
        data: models.MemberCreate,
        session: Session = Depends(get_session)):

    member = models.Member(**data.model_dump())
    member.project_id = id

    session.add(member)
    session.commit()
    session.refresh(member)
    return member


# Get a member by id
@router.get("/projects/{id}/members/{member_id}", response_model=models.MemberPublic)
@limiter.limit("10/10second")
def get_member(
        request: Request,
        id: uuid.UUID,
        member_id: uuid.UUID,
        session: Session = Depends(get_session)):

    return helper.get_member_or_404(member_id, id, session)


# Update a member by id
@router.put("/projects/{id}/members/{member_id}", response_model=models.MemberPublic)
@limiter.limit("30/minute")
def update_member(
        request: Request,
        id: uuid.UUID,
        member_id: uuid.UUID,
        data: models.MemberUpdate,
        session: Session = Depends(get_session)):

    member = helper.get_member_or_404(member_id, id, session)
    update = data.model_dump(exclude_unset=True)
    for key, value in update.items():
        setattr(member, key, value)

    session.add(member)
    session.commit()
    session.refresh(member)
    return member


# Delete a member by id
@router.delete("/projects/{id}/members/{member_id}", response_model=None, status_code=204)
@limiter.limit("30/minute")
def delete_member(
        request: Request,
        id: uuid.UUID,
        member_id: uuid.UUID,
        session: Session = Depends(get_session)):

    member = helper.get_member_or_404(member_id, id, session)
    session.delete(member)
    session.commit()
    return
