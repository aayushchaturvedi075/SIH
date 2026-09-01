from fastapi import APIRouter
from app.api.v1.cases import router as cases_router
from app.api.v1.alerts import router as alerts_router
from app.api.v1.pipeline import router as pipeline_router
from app.api.v1.sse import router as sse_router
from app.api.v1.graph import router as graph_router
from app.api.v1.spatial import router as spatial_router
from app.api.v1.prediction import router as prediction_router
from app.api.v1.feedback import router as feedback_router
from app.api.v1.settlement import router as settlement_router

api_router = APIRouter()
api_router.include_router(cases_router)
api_router.include_router(alerts_router)
api_router.include_router(pipeline_router)
api_router.include_router(sse_router)
api_router.include_router(graph_router)
api_router.include_router(spatial_router)
api_router.include_router(prediction_router)
api_router.include_router(feedback_router)
api_router.include_router(settlement_router)
