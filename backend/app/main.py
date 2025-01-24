from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db
from app.routers import projects, members, expenses
from app import middlewares


app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the database
@app.on_event("startup")
def on_startup():
    init_db()

# Include the routers
app.include_router(projects.router)
app.include_router(members.router)
app.include_router(expenses.router)

# Include the middlewares
app.middleware("http")(middlewares.reject_demo_requests)
