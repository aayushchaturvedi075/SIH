from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any, Optional
from app.ml.evaluation import feedback_engine

router = APIRouter(prefix="/feedback", tags=["Evaluation & Drift (Layer 10)"])

class OutcomeLogRequest(BaseModel):
    case_id: str
    predicted_atm: str
    actual_outcome: str  # INTERCEPTED_AT_ATM, ACCOUNT_FROZEN_BEFORE_CASHOUT, MULE_DIVERTED_TO_OTHER_ATM
    is_success: bool
    loss_recovered_inr: float = 0.0
    officer_notes: Optional[str] = None

@router.post("/outcome")
def log_operational_outcome(req: OutcomeLogRequest):
    """Logs ground-truth feedback from law enforcement field officers after dispatch."""
    record = feedback_engine.log_outcome(
        case_id=req.case_id,
        predicted_atm=req.predicted_atm,
        actual_outcome=req.actual_outcome,
        is_success=req.is_success,
        loss_recovered_inr=req.loss_recovered_inr,
        officer_notes=req.officer_notes or ""
    )
    return {
        "status": "FEEDBACK_LOGGED_SUCCESSFULLY",
        "record": record
    }

@router.get("/drift-metrics")
def get_model_drift_metrics():
    """Returns real-time precision rate, ROC-AUC score, and Population Stability Index (PSI) drift."""
    return feedback_engine.compute_evaluation_metrics()
