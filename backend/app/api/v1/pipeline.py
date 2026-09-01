from fastapi import APIRouter
from app.ingestion.simulator import simulate_incoming_ncrp_event
from app.ingestion.stream_manager import stream_manager
from app.core.config import settings

router = APIRouter(prefix="/pipeline", tags=["Pipeline Telemetry"])

@router.get("/status")
def get_pipeline_telemetry():
    return {
        "pipeline_health": "OPERATIONAL",
        "active_stream_connectors": [
            {
                "name": "NCRP Complaints Gateway",
                "status": "LIVE",
                "stream_key": settings.STREAM_NCRP_COMPLAINTS,
                "buffered_events": len(stream_manager.get_stream_records(settings.STREAM_NCRP_COMPLAINTS)),
                "latency_ms": 18
            },
            {
                "name": "NPCI UPI / IMPS Switch",
                "status": "LIVE",
                "stream_key": settings.STREAM_NPCI_TRANSACTIONS,
                "buffered_events": len(stream_manager.get_stream_records(settings.STREAM_NPCI_TRANSACTIONS)),
                "latency_ms": 12
            },
            {
                "name": "DoT Telecom TAFCOP Gateway",
                "status": "LIVE",
                "stream_key": settings.STREAM_CDR_EVENTS,
                "buffered_events": len(stream_manager.get_stream_records(settings.STREAM_CDR_EVENTS)),
                "latency_ms": 28
            }
        ]
    }

@router.post("/simulate-event")
async def trigger_simulation():
    """Triggers an instantaneous synthetic NCRP cybercrime event on the live stream."""
    event = await simulate_incoming_ncrp_event()
    return {
        "status": "STREAM_EVENT_EMITTED",
        "event": event
    }
