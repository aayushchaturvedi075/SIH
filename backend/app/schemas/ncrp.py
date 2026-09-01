from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import datetime
import re
from app.core.security import tokenize_pii

class VictimProfile(BaseModel):
    name: str
    phone: str
    phone_token: Optional[str] = None
    state: str
    district: str
    aadhaar_masked: Optional[str] = None

    @field_validator("phone_token", mode="before")
    @classmethod
    def compute_phone_token(cls, v, values):
        if not v and "phone" in values.data:
            return tokenize_pii(values.data["phone"])
        return v

class SuspectEntity(BaseModel):
    account_number: Optional[str] = None
    account_token: Optional[str] = None
    bank_name: Optional[str] = None
    ifsc: Optional[str] = None
    upi_vpa: Optional[str] = None
    upi_token: Optional[str] = None
    phone: Optional[str] = None
    phone_token: Optional[str] = None
    imei: Optional[str] = None
    imei_token: Optional[str] = None
    ip_address: Optional[str] = None

    @field_validator("ifsc")
    @classmethod
    def validate_ifsc(cls, v):
        if v and not re.match(r"^[A-Z]{4}0[A-Z0-9]{6}$", v.upper()):
            raise ValueError(f"Invalid Indian IFSC Code format: {v}")
        return v.upper() if v else v

class NCRPComplaintCreate(BaseModel):
    ncrp_id: str = Field(..., example="NCRP-2026-984321")
    acknowledgement_no: str = Field(..., example="202609019842100")
    category: str = Field(..., example="Financial Fraud")
    sub_category: str = Field(..., example="Digital Arrest / Sextortion / CBI Impersonation")
    reported_timestamp: datetime = Field(default_factory=datetime.utcnow)
    total_loss_inr: float = Field(..., gt=0, example=4250000.0)
    victim: VictimProfile
    suspect: SuspectEntity
    initial_deposit_account: Optional[str] = None
    initial_deposit_bank: Optional[str] = None
    tags: List[str] = Field(default_factory=list)

class NCRPComplaintResponse(NCRPComplaintCreate):
    id: str
    risk_score: float = 0.0
    cash_out_likelihood: float = 0.0
    time_to_withdraw_min: int = 45
    status: str = "CRITICAL_TRIAGE"
    blocked_amount_inr: float = 0.0
    recovery_rate: float = 0.0
