from typing import Dict, Any, Tuple, List
from app.schemas.ncrp import NCRPComplaintCreate
from app.schemas.transaction import BankTransactionEvent
from app.core.config import settings

class RuleEnginePreFilter:
    """
    Layer 4: High-speed deterministic pre-filtering executed before graph and ML ranking.
    Quickly flags or prunes events in microseconds without expensive database queries.
    """
    
    HIGH_RISK_KEYWORDS = [
        "DIGITAL ARREST", "CBI", "ED", "POLICE IMPERSONATION",
        "TRADING APP", "FII QUOTA", "TELEGRAM TASK", "PART TIME JOB",
        "INSTANT LOAN", "CHINESE APP", "EXTORTION", "SEXTORTION"
    ]
    
    KNOWN_MULE_BLACKLIST_TOKENS = {
        "TOK_918230918234",
        "TOK_867543029182736",
        "TOK_PAYTMQR283910"
    }

    @classmethod
    def evaluate_complaint(cls, complaint: NCRPComplaintCreate) -> Dict[str, Any]:
        flags: List[str] = []
        score: float = 50.0

        # 1. Loss threshold rule
        if complaint.total_loss_inr >= settings.HIGH_VALUE_LAYERING_THRESHOLD:
            flags.append("HIGH_VALUE_FRAUD_CRITICAL")
            score += 25.0
        elif complaint.total_loss_inr >= settings.MIN_LOSS_INVESTIGATION_THRESHOLD:
            flags.append("ELEVATED_LOSS_GATE_PASSED")
            score += 10.0

        # 2. Modus Operandi check
        sub_cat_upper = complaint.sub_category.upper()
        if any(kw in sub_cat_upper for kw in cls.HIGH_RISK_KEYWORDS):
            flags.append("HIGH_RISK_MODUS_OPERANDI")
            score += 15.0

        # 3. Suspect token checks
        if complaint.suspect.phone_token in cls.KNOWN_MULE_BLACKLIST_TOKENS:
            flags.append("KNOWN_MULE_PHONE_MATCH")
            score += 20.0

        # Bound score between 0 and 99
        final_score = min(98.5, max(10.0, score))
        return {
            "passed_prefilter": True,
            "prefilter_score": final_score,
            "flags": flags,
            "requires_immediate_graph_expansion": "HIGH_VALUE_FRAUD_CRITICAL" in flags or "HIGH_RISK_MODUS_OPERANDI" in flags
        }

    @classmethod
    def evaluate_transaction(cls, txn: BankTransactionEvent, recent_txns_count: int = 1) -> Dict[str, Any]:
        flags: List[str] = []
        
        # Velocity check: > 3 transfers in window
        if recent_txns_count >= 3:
            flags.append("HIGH_FREQUENCY_LAYERING_VELOCITY")
            
        if txn.amount_inr >= 200000.0:
            flags.append("HIGH_VALUE_TRANSFER")
            
        return {
            "passed": len(flags) > 0,
            "flags": flags,
            "is_layer_2_or_above": txn.layer_hop >= 2
        }
