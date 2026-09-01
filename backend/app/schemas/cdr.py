from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class CDREvent(BaseModel):
    phone_number: str
    imei: str
    imsi: Optional[str] = None
    cell_tower_id: str
    cell_tower_lat: float
    cell_tower_lng: float
    cell_tower_district: str
    state: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    call_duration_sec: int = 0
    event_type: str = "DATA_SESSION"  # VOICE_CALL, SMS, DATA_SESSION
