from sqlmodel import SQLModel, create_engine, Session
import os

# Define the database URL
sqlite_path = f"sqlite:///database.db"

# Define the database url from environment variable
DATABASE_URL = os.getenv("DATABASE_URL") or sqlite_path

# Create the database engine
engine = create_engine(DATABASE_URL, echo=False)

def init_db():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

def get_metadata():
    return SQLModel.metadata
