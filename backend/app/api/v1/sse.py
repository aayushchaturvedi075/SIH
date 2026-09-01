import asyncio
import json
from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
from app.ingestion.stream_manager import stream_manager

router = APIRouter(prefix="/stream", tags=["Real-time Stream"])

@router.get("/alerts")
async def stream_live_alerts(request: Request):
    """
    Server-Sent Events (SSE) streaming real-time cyber intelligence alerts to the Next.js frontend.
    """
    queue = stream_manager.subscribe()

    async def event_generator():
        try:
            # Emit initial handshake
            yield f"data: {json.dumps({'type': 'CONNECTED', 'message': 'IntelliTrace Live SSE Gateway Active'})}\n\n"
            while True:
                if await request.is_disconnected():
                    break
                try:
                    event = await asyncio.wait_for(queue.get(), timeout=15.0)
                    yield f"data: {json.dumps(event)}\n\n"
                except asyncio.TimeoutError:
                    # Keep-alive heartbeat ping
                    yield f": heartbeat\n\n"
        finally:
            stream_manager.unsubscribe(queue)

    return StreamingResponse(event_generator(), media_type="text/event-stream")
