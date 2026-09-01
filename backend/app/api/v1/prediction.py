from fastapi import APIRouter, Query, Body
from typing import Dict, Any, List, Optional
from pydantic import BaseModel
from app.spatial.candidate_generator import SpatialCandidateGenerator
from app.ml.ranker import ProbabilisticATMClassifierAndRanker
from app.ml.timeline_model import CashOutTimelineModel

router = APIRouter(prefix="/predict", tags=["Probabilistic AI Prediction (Layer 7)"])

class PredictionRequest(BaseModel):
    mule_account_token: str = "MULE_L2_01"
    cell_lat: float = 28.6280
    cell_lng: float = 77.3649
    search_radius_meters: float = 3000.0
    transaction_amount_inr: float = 1850000.0
    layer_hop: int = 2

@router.post("/rank-atms")
def rank_candidate_atms(req: PredictionRequest):
    """
    Combines PostGIS spatial shortlisting + GraphSAGE embeddings + LightGBM LambdaRank + Isotonic Calibration
    to rank candidate ATMs with exact calibrated probabilities and expected cash-out time.
    """
    # 1. Layer 6 PostGIS Candidate Shortlist
    spatial_candidates = SpatialCandidateGenerator.shortlist_atm_candidates(
        cell_lat=req.cell_lat,
        cell_lng=req.cell_lng,
        radius_meters=req.search_radius_meters,
        limit=10
    )

    # 2. Layer 7 Machine Learning Ranker & Calibrator
    ranked_atms = ProbabilisticATMClassifierAndRanker.rank_candidates(
        mule_account_token=req.mule_account_token,
        candidates=spatial_candidates,
        transaction_amount=req.transaction_amount_inr,
        layer_hop=req.layer_hop
    )

    return {
        "mule_account_token": req.mule_account_token,
        "transaction_amount_inr": req.transaction_amount_inr,
        "total_shortlisted_atms": len(ranked_atms),
        "top_prediction": ranked_atms[0] if ranked_atms else None,
        "ranked_candidates": ranked_atms
    }

@router.get("/timeline-curve/{case_id}")
def get_timeline_curve(
    case_id: str,
    peak_min: float = Query(18.0, ge=5.0, le=45.0),
    confidence_pct: float = Query(94.2, ge=50.0, le=99.0)
):
    """
    Generates time-dependent cash-out probability density curve across the 60-minute golden hour window.
    """
    curve = CashOutTimelineModel.generate_probability_curve(
        peak_time_minutes=peak_min,
        max_probability_pct=confidence_pct
    )
    return {
        "case_id": case_id,
        **curve
    }
