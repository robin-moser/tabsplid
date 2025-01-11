from sqlmodel import SQLModel, create_engine, Session

# Define the database URL
sqlite_file_name = "database.db"
DATABASE_URL = f"sqlite:///{sqlite_file_name}"

# Create the database engine
engine = create_engine(DATABASE_URL, echo=True)

def init_db():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

def get_metadata():
    return SQLModel.metadata
