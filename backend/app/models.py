from sqlmodel import SQLModel, Field, Relationship
import uuid, uuid6

### Links

class ExpensePersonLink(SQLModel, table=True):
    expense_id: uuid.UUID | None = Field(default=None, foreign_key="expense.id", primary_key=True)
    person_id: uuid.UUID | None = Field(default=None, foreign_key="person.id", primary_key=True)


###

class ProjectBase(SQLModel):
    name: str | None = None

class Project(ProjectBase, table=True):
    id: uuid.UUID = Field(primary_key=True, default_factory=uuid6.uuid7)
    persons: list["Person"] = Relationship(back_populates="project", cascade_delete=True)
    expenses: list["Expense"] = Relationship(back_populates="project", cascade_delete=True)

class ProjectPublicAll(ProjectBase):
    id: uuid.UUID

class ProjectPublic(ProjectBase):
    id: uuid.UUID
    persons: list["PersonPublic"] = []

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(ProjectBase):
    pass


###

class PersonBase(SQLModel):
    name: str | None = None

class Person(PersonBase, table=True):
    id: uuid.UUID = Field(primary_key=True, default_factory=uuid6.uuid7)
    project_id: uuid.UUID | None = Field(primary_key=True, default=None, foreign_key="project.id")
    balance: float = Field(default=0)
    project: "Project" = Relationship(back_populates="persons")
    expenses: list["Expense"] = Relationship(back_populates="person", cascade_delete=True)
    involved_expenses: list["Expense"] = Relationship(
            back_populates="involved_persons", link_model=ExpensePersonLink)

class PersonPublic(PersonBase):
    id: uuid.UUID
    expenses: list["ExpensePublicAll"] = []

class PersonCreate(PersonBase):
    pass

class PersonUpdate(PersonBase):
    pass


###

class ExpenseBase(SQLModel):
    amount: float = 0
    name: str | None = None

class Expense(ExpenseBase, table=True):
    id: uuid.UUID = Field(primary_key=True, default_factory=uuid6.uuid7)
    project_id: uuid.UUID = Field(primary_key=True, foreign_key="project.id")
    person_id: uuid.UUID = Field(primary_key=True, foreign_key="person.id")
    project: "Project" = Relationship(back_populates="expenses")
    person: "Person" = Relationship(back_populates="expenses")
    involved_persons: list["Person"] = Relationship(
            back_populates="involved_expenses", link_model=ExpensePersonLink)

class ExpensePublic(ExpenseBase):
    id: uuid.UUID
    involved_persons: list["PersonBase"] = []

class ExpensePublicAll(ExpenseBase):
    id: uuid.UUID
    involved_persons: list["PersonBase"] = []

class ExpenseCreate(ExpenseBase):
    involved_persons: list[uuid.UUID] = []

class ExpenseUpdate(ExpenseBase):
    involved_persons: list[uuid.UUID] = []

###

class Payment(SQLModel):
    from_person: "Person"
    to_person: "Person"
    amount: float

class Calculate(SQLModel):
    project: "Project"
    payments: list["Payment"]
    # persons: list["PersonPublicWithExpenses"]
