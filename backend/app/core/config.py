import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "IntelliTrace Cybercrime Intelligence API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Layer 1: Governance & Legal Secret Salt Key for SHA-256 PII Tokenization
    PII_HASH_SALT: str = os.getenv("PII_HASH_SALT", "MHA_I4C_INTELLITRACE_SALT_SECURE_2026")
    
    # Layer 2: Redis Stream Broker
    REDIS_HOST: str = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT: int = int(os.getenv("REDIS_PORT", "6379"))
    REDIS_DB: int = int(os.getenv("REDIS_DB", "0"))
    
    STREAM_NCRP_COMPLAINTS: str = "stream:ncrp_complaints"
    STREAM_NPCI_TRANSACTIONS: str = "stream:npci_transactions"
    STREAM_CDR_EVENTS: str = "stream:cdr_events"
    STREAM_ALERTS_DISPATCH: str = "stream:alerts_dispatch"
    
    # Layer 4: Rule Engine Thresholds
    MIN_LOSS_INVESTIGATION_THRESHOLD: float = 50000.0  # ₹50,000 INR
    VELOCITY_HOP_SECONDS: int = 600  # 10 minutes
    HIGH_VALUE_LAYERING_THRESHOLD: float = 500000.0  # ₹5 Lakhs
    
    # Layer 8: Action Policy Thresholds
    TIER_1_AUTO_DISPATCH_CONFIDENCE: float = 85.0
    TIER_2_HUMAN_REVIEW_CONFIDENCE: float = 60.0

    class Config:
        env_file = ".env"

settings = Settings()
