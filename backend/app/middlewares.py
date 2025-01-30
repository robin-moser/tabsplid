from fastapi import Request, Response
import os

demo_project_id = os.getenv("DEMO_PROJECT_ID")

# Middleware to reject requests to the demo endpoint
async def reject_demo_requests(request: Request, call_next):
    # UUIDs can be with or without dashes, so we first normalize the URL
    normalized = request.url.path.replace("-", "")
    if demo_project_id and demo_project_id in normalized:
        if request.method not in ["GET", "OPTIONS"]:
            return Response(status_code=403)
    return await call_next(request)
