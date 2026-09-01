from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.router import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="IntelliTrace Cybercrime Forensics & Predictive ATM Cash-Out Interception Microservice",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for Next.js frontend (http://localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "service": "IntelliTrace Intelligence Core",
        "status": "OPERATIONAL",
        "version": settings.VERSION,
        "docs": "/docs",
        "jurisdiction": "Ministry of Home Affairs & I4C"
    }
