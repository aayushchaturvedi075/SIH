from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.alert import AlertEvent, DispatchRequest

router = APIRouter(prefix="/alerts", tags=["Alerts & Dispatch"])

ALERTS_DB = [
    {
        "alert_id": "ALT-2026-09-8471",
        "case_ref": "NCRP-DEMO-894321",
        "alert_type": "CASH_OUT_IMMINENT",
        "severity": "CRITICAL",
        "title": "ATM Cash-Out Imminent: Sector 62 E-Lobby",
        "description": "Layer-3 mule account 918230918234 (SBI) balance ₹18.5L transferred via IMPS. High likelihood of ATM withdrawal within 18 minutes.",
        "amount_inr": 1850000.0,
        "target_location": "Noida Sector 62, UP",
        "target_atm_id": "ATM-UP-NOI-042",
        "target_atm_name": "HDFC Sector 62 E-Lobby",
        "time_window_remaining_min": 18,
        "confidence_score": 94.2,
        "action_tier": "TIER_1_AUTO_DISPATCH",
        "status": "NEW",
    },
    {
        "alert_id": "ALT-2026-09-8470",
        "case_ref": "NCRP-DEMO-894323",
        "alert_type": "RAPID_LAYERING",
        "severity": "CRITICAL",
        "title": "Rapid Multi-Hop Splitting (5 Accounts)",
        "description": "Victim deposit of ₹95,00,000 split into 5 parallel mule streams across ICICI, Axis, Canara within 180 seconds.",
        "amount_inr": 9500000.0,
        "target_location": "Mumbai / Surat Corridor",
        "time_window_remaining_min": 25,
        "confidence_score": 97.8,
        "action_tier": "TIER_1_AUTO_DISPATCH",
        "status": "ACKNOWLEDGED",
    }
]

@router.get("", response_model=List[dict])
def list_alerts():
    return ALERTS_DB

@router.post("/dispatch")
def trigger_dispatch(dispatch: DispatchRequest):
    for a in ALERTS_DB:
        if a["alert_id"] == dispatch.alert_id:
            a["status"] = "DISPATCHED"
            return {
                "status": "DISPATCH_TRANSMITTED",
                "alert_id": dispatch.alert_id,
                "case_ref": dispatch.case_ref,
                "broadcast_channels": {
                    "police_radio": dispatch.police_radio_broadcast,
                    "bank_cfcfrms": dispatch.bank_cfcfrms_hold,
                    "telecom_dot": dispatch.telecom_dot_imei_lock,
                    "sms_officer": dispatch.sms_investigating_officer
                },
                "statutory_authority": "Section 91 CrPC / Section 94 BNSS"
            }
    raise HTTPException(status_code=404, detail="Alert not found")
