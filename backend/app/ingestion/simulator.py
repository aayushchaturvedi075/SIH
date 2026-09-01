import asyncio
import random
from datetime import datetime
from app.ingestion.stream_manager import stream_manager
from app.core.config import settings
from app.core.security import tokenize_pii

SAMPLE_MODUS = [
    ("Financial Fraud", "Digital Arrest / CBI Impersonation", 4250000.0, "Gautam Buddha Nagar (Noida)", "Uttar Pradesh"),
    ("Financial Fraud", "Telegram Part-Time Review Scam", 1850000.0, "Bengaluru Urban", "Karnataka"),
    ("Investment Fraud", "Fake Institutional Trading App (FII Quota)", 9500000.0, "Mumbai Suburban", "Maharashtra"),
    ("Loan Fraud", "Chinese Instant APK Lending Extortion", 620000.0, "Patna", "Bihar"),
]

SAMPLE_ATMS = [
    ("ATM-UP-NOI-042", "HDFC Sector 62 E-Lobby", "Noida", 28.628, 77.3649),
    ("ATM-UP-GZB-019", "SBI Mohan Nagar Cross", "Ghaziabad", 28.6811, 77.3872),
    ("ATM-KA-BLR-109", "SBI Koramangala 5th Block", "Bengaluru", 12.9352, 77.6245),
    ("ATM-MH-MUM-018", "Axis Bank Andheri East", "Mumbai", 19.1136, 72.8697),
]

async def simulate_incoming_ncrp_event() -> dict:
    modus = random.choice(SAMPLE_MODUS)
    atm = random.choice(SAMPLE_ATMS)
    random_id = random.randint(894320, 894999)
    phone = f"98{random.randint(10000000, 99999999)}"
    acc = f"91{random.randint(1000000000, 9999999999)}"

    complaint = {
        "ncrp_id": f"NCRP-DEMO-{random_id}",
        "acknowledgement_no": f"20260901{random_id}",
        "category": modus[0],
        "sub_category": modus[1],
        "total_loss_inr": modus[2],
        "reported_timestamp": datetime.utcnow().isoformat(),
        "victim": {
            "name": f"Citizen Case #{random_id}",
            "phone_token": tokenize_pii(phone),
            "state": modus[4],
            "district": modus[3],
        },
        "suspect": {
            "account_number": acc,
            "account_token": tokenize_pii(acc),
            "bank_name": "State Bank of India",
            "ifsc": "SBIN0001423",
            "upi_vpa": f"mule.{random_id}@sbi",
            "imei": f"8675430{random.randint(10000000, 99999999)}",
        },
        "predicted_atm": {
            "id": atm[0],
            "name": atm[1],
            "district": atm[2],
            "lat": atm[3],
            "lng": atm[4],
        },
        "confidence_score": round(random.uniform(82.0, 96.5), 1),
        "time_to_withdraw_min": random.randint(12, 35),
    }

    await stream_manager.publish_event(settings.STREAM_NCRP_COMPLAINTS, complaint)
    return complaint
