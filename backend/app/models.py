from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime, timezone
import uuid, uuid6

### Links

class ExpenseMemberLink(SQLModel, table=True):
    expense_id: uuid.UUID | None = Field(default=None, foreign_key="expense.id", primary_key=True)
    member_id: uuid.UUID | None = Field(default=None, foreign_key="member.id", primary_key=True)


###

class ProjectBase(SQLModel):
    name: str | None = None

class Project(ProjectBase, table=True):
    id: uuid.UUID = Field(primary_key=True, default_factory=uuid6.uuid7)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc),
        sa_column_kwargs={"onupdate": lambda: datetime.now(timezone.utc)})
    members: list["Member"] = Relationship(back_populates="project", cascade_delete=True)
    expenses: list["Expense"] = Relationship(back_populates="project", cascade_delete=True)

class ProjectPublicAll(ProjectBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

class ProjectPublic(ProjectBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    members: list["MemberPublicWithExpenses"] = []
    payments: list["Payment"] = []

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(ProjectBase):
    pass


###

class MemberBase(SQLModel):
    name: str | None = None

class Member(MemberBase, table=True):
    id: uuid.UUID = Field(primary_key=True, default_factory=uuid6.uuid7)
    project_id: uuid.UUID | None = Field(primary_key=True, default=None, foreign_key="project.id")
    balance: float = Field(default=0)
    project: "Project" = Relationship(back_populates="members")
    expenses: list["Expense"] = Relationship(back_populates="member", cascade_delete=True)
    involved_expenses: list["Expense"] = Relationship(
            back_populates="involved_members", link_model=ExpenseMemberLink)

class MemberPublic(MemberBase):
    id: uuid.UUID

class MemberPublicWithExpenses(MemberBase):
    id: uuid.UUID
    expenses: list["ExpensePublic"] = []

class MemberCreate(MemberBase):
    pass

class MemberUpdate(MemberBase):
    pass



###

class ExpenseBase(SQLModel):
    amount: float = 0
    name: str | None = None

class Expense(ExpenseBase, table=True):
    id: uuid.UUID = Field(primary_key=True, default_factory=uuid6.uuid7)
    project_id: uuid.UUID = Field(primary_key=True, foreign_key="project.id")
    member_id: uuid.UUID = Field(primary_key=True, foreign_key="member.id")
    project: "Project" = Relationship(back_populates="expenses")
    member: "Member" = Relationship(back_populates="expenses")
    involved_members: list["Member"] = Relationship(
            back_populates="involved_expenses", link_model=ExpenseMemberLink)

class ExpensePublic(ExpenseBase):
    id: uuid.UUID
    involved_members: list["MemberPublic"] = []

class ExpenseCreate(ExpenseBase):
    involved_members: list[uuid.UUID] = []

class ExpenseUpdate(ExpenseBase):
    involved_members: list[uuid.UUID] | None = None

###

class Payment(SQLModel):
    from_member: "Member"
    to_member: "Member"
    amount: float

class PaymentPublic(SQLModel):
    from_member: "MemberPublic"
    to_member: "MemberPublic"
    amount: float
