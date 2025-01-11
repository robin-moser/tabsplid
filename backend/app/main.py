from fastapi import FastAPI
from app.database import init_db
from app.routes import router

app = FastAPI()

# Initialize the database
@app.on_event("startup")
def on_startup():
    init_db()

# Include the projects router
app.include_router(router)
