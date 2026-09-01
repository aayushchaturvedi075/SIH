from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.schemas.ncrp import NCRPComplaintCreate, NCRPComplaintResponse
from app.rules.pre_filter import RuleEnginePreFilter
from app.policy.action_matrix import ActionPolicyEngine
from app.core.security import mask_display

router = APIRouter(prefix="/cases", tags=["Cases"])

# In-memory case repository
CASES_DB = [
    {
        "id": "CASE-2026-9812",
        "ncrp_id": "NCRP-DEMO-894321",
        "acknowledgement_no": "202609019842100",
        "category": "Financial Fraud",
        "sub_category": "Digital Arrest / Sextortion / CBI Impersonation",
        "reported_timestamp": "2026-09-01T19:42:15Z",
        "total_loss_inr": 4250000.0,
        "blocked_amount_inr": 3100000.0,
        "recovery_rate": 72.9,
        "status": "CRITICAL_TRIAGE",
        "risk_score": 94.0,
        "cash_out_likelihood": 89.0,
        "time_to_withdraw_min": 18,
        "victim": {
            "name": "Dr. Arvind Rameshwar",
            "phone": "9871234567",
            "phone_token": "TOK_9871234567_HASH",
            "state": "Uttar Pradesh",
            "district": "Gautam Buddha Nagar (Noida)",
        },
        "suspect": {
            "account_number": "918230918234",
            "bank_name": "State Bank of India",
            "ifsc": "SBIN0001423",
            "upi_vpa": "paytmqr.283910@paytm",
            "phone": "919876543210",
            "imei": "867543029182736",
            "ip_address": "103.212.45.89",
        }
    }
]

@router.get("", response_model=List[dict])
def list_cases(limit: int = Query(20, ge=1, le=100)):
    """Retrieve active cases under investigation with pre-filtered risk telemetry."""
    return CASES_DB[:limit]

@router.get("/{ncrp_id}")
def get_case_by_id(ncrp_id: str):
    """Retrieve full case dossier, suspect footprints, and rule evaluation."""
    for c in CASES_DB:
        if c["ncrp_id"] == ncrp_id:
            return c
    raise HTTPException(status_code=404, detail="Case not found in NCRP registry")

@router.post("/ingest", response_model=dict)
def ingest_new_complaint(complaint: NCRPComplaintCreate):
    """
    Ingests a complaint through Layer 1 (Tokenization) and Layer 4 (Deterministic Rule Pre-filter).
    """
    evaluation = RuleEnginePreFilter.evaluate_complaint(complaint)
    action = ActionPolicyEngine.determine_tier(
        confidence_score=evaluation["prefilter_score"],
        amount_inr=complaint.total_loss_inr,
        flags=evaluation["flags"]
    )
    
    new_record = complaint.dict()
    new_record["id"] = f"CASE-{len(CASES_DB) + 1}"
    new_record["risk_score"] = evaluation["prefilter_score"]
    new_record["status"] = "CRITICAL_TRIAGE" if evaluation["requires_immediate_graph_expansion"] else "UNDER_INVESTIGATION"
    new_record["action_policy"] = action
    
    CASES_DB.insert(0, new_record)
    return {
        "status": "INGESTED_SUCCESSFULLY",
        "case_id": new_record["id"],
        "prefilter_evaluation": evaluation,
        "action_policy": action
    }
