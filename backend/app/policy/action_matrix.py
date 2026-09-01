from typing import Dict, Any
from app.core.config import settings

class ActionPolicyEngine:
    """
    Layer 8: Config-driven deterministic policy (No blackbox ML here).
    Decides whether an intelligence finding triggers an immediate automatic dispatch,
    a human-in-the-loop signoff, or background watchlist logging.
    """

    @classmethod
    def determine_tier(cls, confidence_score: float, amount_inr: float, flags: list) -> Dict[str, Any]:
        if confidence_score >= settings.TIER_1_AUTO_DISPATCH_CONFIDENCE and amount_inr >= 200000.0:
            return {
                "tier": "TIER_1_AUTO_DISPATCH",
                "label": "Instant Statutory Intercept",
                "requires_human_approval": False,
                "auto_actions": [
                    "NOTIFY_BEAT_PATROL_RADIO",
                    "TRIGGER_CFCFRMS_BANK_HOLD",
                    "NOTIFY_INVESTIGATING_OFFICER_SMS"
                ]
            }
        elif confidence_score >= settings.TIER_2_HUMAN_REVIEW_CONFIDENCE:
            return {
                "tier": "TIER_2_HUMAN_REVIEW",
                "label": "Superintendent Sign-off Required",
                "requires_human_approval": True,
                "target_queue": "/actions",
                "auto_actions": [
                    "ENQUEUE_OFFICER_TASK",
                    "PREPARE_SECTION_91_CRPC_NOTICE"
                ]
            }
        else:
            return {
                "tier": "TIER_3_MONITORING",
                "label": "Passive Syndicate Watchlist",
                "requires_human_approval": False,
                "auto_actions": [
                    "LOG_IN_ANOMALY_WATCHLIST"
                ]
            }
