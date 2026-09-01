from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.core.security import tokenize_pii

class BankTransactionEvent(BaseModel):
    transaction_ref: str = Field(..., example="TXN-NPCI-2026-9812401")
    sender_account: str
    sender_bank: str
    sender_ifsc: str
    receiver_account: str
    receiver_bank: str
    receiver_ifsc: str
    amount_inr: float = Field(..., gt=0)
    method: str = Field(..., example="IMPS")  # IMPS, RTGS, NEFT, UPI
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    layer_hop: int = 1
    source_complaint_id: Optional[str] = None
    
    # Auto-computed token properties
    @property
    def sender_token(self) -> str:
        return tokenize_pii(self.sender_account)

    @property
    def receiver_token(self) -> str:
        return tokenize_pii(self.receiver_account)
