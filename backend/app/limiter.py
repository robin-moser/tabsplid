from fastapi import Request
from fastapi.responses import JSONResponse

from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

# custom_error_handler
def custom_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"message": "You have exceeded your rate limit"},
    )

# Initialize the limiter
limiter = Limiter(
    key_func=get_remote_address,
    enabled=True,
)
