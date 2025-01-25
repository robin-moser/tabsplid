from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from slowapi.errors import RateLimitExceeded

from app.database import init_db
from app.routers import projects, members, expenses
from app import middlewares
from app.limiter import limiter, custom_handler


# Initialize the database
@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    yield


app = FastAPI(lifespan=lifespan)
app.state.limiter = limiter

# pyright: reportArgumentType=false
app.add_exception_handler(RateLimitExceeded, custom_handler)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the routers
app.include_router(projects.router)
app.include_router(members.router)
app.include_router(expenses.router)

# Include the middlewares
app.middleware("http")(middlewares.reject_demo_requests)
