import asyncio
import json
import logging
from typing import Dict, Any, List, Optional
from app.core.config import settings

logger = logging.getLogger("ingestion_stream")

class StreamManager:
    """
    Layer 2: Redis Streams Ingestion Manager with High-Throughput In-Memory Fallback.
    Handles streaming of NCRP complaints, NPCI transactions, and CDR logs.
    """
    _instance = None
    _in_memory_streams: Dict[str, List[Dict[str, Any]]] = {}
    _subscribers: List[asyncio.Queue] = []

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(StreamManager, cls).__new__(cls)
            cls._instance._in_memory_streams = {
                settings.STREAM_NCRP_COMPLAINTS: [],
                settings.STREAM_NPCI_TRANSACTIONS: [],
                settings.STREAM_CDR_EVENTS: [],
                settings.STREAM_ALERTS_DISPATCH: [],
            }
        return cls._instance

    async def publish_event(self, stream_name: str, event_data: Dict[str, Any]) -> str:
        """Publishes an event to the Redis Stream (or in-memory buffer) and notifies SSE subscribers."""
        event_id = f"EVT_{len(self._in_memory_streams.get(stream_name, [])) + 1}"
        wrapped = {
            "event_id": event_id,
            "stream": stream_name,
            "payload": event_data
        }
        if stream_name not in self._in_memory_streams:
            self._in_memory_streams[stream_name] = []
        self._in_memory_streams[stream_name].append(wrapped)

        # Notify active SSE subscribers
        for queue in self._subscribers:
            await queue.put(wrapped)

        logger.info(f"Published event {event_id} to stream {stream_name}")
        return event_id

    def subscribe(self) -> asyncio.Queue:
        q = asyncio.Queue()
        self._subscribers.append(q)
        return q

    def unsubscribe(self, queue: asyncio.Queue):
        if queue in self._subscribers:
            self._subscribers.remove(queue)

    def get_stream_records(self, stream_name: str, limit: int = 50) -> List[Dict[str, Any]]:
        return self._in_memory_streams.get(stream_name, [])[-limit:]

stream_manager = StreamManager()
