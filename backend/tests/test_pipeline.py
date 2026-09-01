import pytest
from app.core.security import tokenize_pii, mask_display
from app.schemas.ncrp import NCRPComplaintCreate, VictimProfile, SuspectEntity
from app.rules.pre_filter import RuleEnginePreFilter
from app.policy.action_matrix import ActionPolicyEngine

def test_deterministic_tokenization():
    """Verify identical phone / account numbers always produce identical token hashes."""
    phone_a = "9876543210"
    phone_b = "98765-43210"
    token_a = tokenize_pii(phone_a)
    token_b = tokenize_pii(phone_b)
    
    assert token_a == token_b
    assert token_a.startswith("TOK_")
    assert len(token_a) > 20

def test_masking_utility():
    assert mask_display("918230918234", "account") == "XXXX-XXXX-8234"
    assert mask_display("103.212.45.89", "ip") == "103.212.*.*"
    assert mask_display("9876543210", "phone") == "+91 XXXXX 43210"

def test_rule_engine_high_value_flag():
    complaint = NCRPComplaintCreate(
        ncrp_id="NCRP-TEST-101",
        acknowledgement_no="202609019999",
        category="Financial Fraud",
        sub_category="Digital Arrest / CBI Impersonation",
        total_loss_inr=4250000.0,
        victim=VictimProfile(
            name="Citizen One",
            phone="9871234567",
            state="Uttar Pradesh",
            district="Noida"
        ),
        suspect=SuspectEntity(
            account_number="918230918234",
            bank_name="SBI",
            ifsc="SBIN0001423"
        )
    )
    
    evaluation = RuleEnginePreFilter.evaluate_complaint(complaint)
    assert evaluation["passed_prefilter"] is True
    assert "HIGH_VALUE_FRAUD_CRITICAL" in evaluation["flags"]
    assert "HIGH_RISK_MODUS_OPERANDI" in evaluation["flags"]
    assert evaluation["prefilter_score"] > 80.0

def test_action_policy_tier_1():
    action = ActionPolicyEngine.determine_tier(
        confidence_score=94.2,
        amount_inr=1850000.0,
        flags=["HIGH_VALUE_FRAUD_CRITICAL"]
    )
    assert action["tier"] == "TIER_1_AUTO_DISPATCH"
    assert action["requires_human_approval"] is False
    assert "TRIGGER_CFCFRMS_BANK_HOLD" in action["auto_actions"]

def test_action_policy_tier_2():
    action = ActionPolicyEngine.determine_tier(
        confidence_score=72.0,
        amount_inr=150000.0,
        flags=[]
    )
    assert action["tier"] == "TIER_2_HUMAN_REVIEW"
    assert action["requires_human_approval"] is True
