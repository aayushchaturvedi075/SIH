from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class AlertEvent(BaseModel):
    alert_id: str
    case_ref: str
    alert_type: str  # CASH_OUT_IMMINENT, RAPID_LAYERING, MULE_CLUSTER_ACTIVE, CROSS_STATE_HOP
    severity: str    # CRITICAL, HIGH, MEDIUM, LOW
    title: str
    description: str
    amount_inr: float
    target_location: str
    target_atm_id: Optional[str] = None
    target_atm_name: Optional[str] = None
    time_window_remaining_min: int = 20
    confidence_score: float = 90.0
    action_tier: str = "TIER_1_AUTO_DISPATCH"  # TIER_1_AUTO_DISPATCH, TIER_2_HUMAN_REVIEW, TIER_3_MONITORING
    status: str = "NEW"
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class DispatchRequest(BaseModel):
    alert_id: str
    case_ref: str
    police_radio_broadcast: bool = True
    bank_cfcfrms_hold: bool = True
    telecom_dot_imei_lock: bool = True
    sms_investigating_officer: bool = True
    notes: Optional[str] = None
