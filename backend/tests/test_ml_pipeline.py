import pytest
from app.ml.embeddings import GraphSAGEEmbeddingExtractor
from app.ml.feature_assembler import MLFeatureAssembler
from app.ml.ranker import ProbabilisticATMClassifierAndRanker
from app.ml.timeline_model import CashOutTimelineModel
from app.ml.evaluation import feedback_engine

def test_graphsage_embedding_generation():
    embed = GraphSAGEEmbeddingExtractor.extract_node_embedding("MULE_L1_01", dim=32)
    assert len(embed) == 32
    # Verify values are bounded and non-zero
    assert any(x != 0.0 for x in embed)

def test_feature_assembler():
    sample_atm = {
        "atm_id": "ATM-TEST-01",
        "distance_km": 1.4,
        "historical_mule_hits": 8,
        "daily_volume_inr": 3000000.0,
        "cctv_active": True,
        "patrol_eta_minutes": 7.5
    }
    features = MLFeatureAssembler.assemble_candidate_features(
        mule_account_token="MULE_L1_01",
        atm_candidate=sample_atm,
        transaction_amount=1850000.0,
        layer_hop=2
    )
    assert len(features) == 40

def test_probabilistic_ranking_and_calibration():
    sample_candidates = [
        {
            "atm_id": "ATM-UP-NOI-042",
            "name": "HDFC Sector 62 E-Lobby",
            "distance_km": 0.8,
            "historical_mule_hits": 14,
            "daily_volume_inr": 3500000.0,
            "cctv_active": True
        },
        {
            "atm_id": "ATM-FAR-099",
            "name": "SBI Outer Ring Road",
            "distance_km": 4.5,
            "historical_mule_hits": 1,
            "daily_volume_inr": 1000000.0,
            "cctv_active": True
        }
    ]
    ranked = ProbabilisticATMClassifierAndRanker.rank_candidates(
        mule_account_token="MULE_L1_01",
        candidates=sample_candidates,
        transaction_amount=1850000.0
    )
    assert len(ranked) == 2
    # Rank 1 must be the closer / higher-risk ATM
    assert ranked[0]["atm_id"] == "ATM-UP-NOI-042"
    assert ranked[0]["confidence_score"] > ranked[1]["confidence_score"]
    # Probabilities must be bounded in [0, 100%]
    assert 0.0 <= ranked[0]["confidence_score"] <= 100.0

def test_timeline_probability_curve():
    curve = CashOutTimelineModel.generate_probability_curve(peak_time_minutes=18.0)
    assert "timeline_samples" in curve
    assert len(curve["timeline_samples"]) > 20
    assert curve["optimal_intercept_peak_min"] == 18
    # Find sample at T+18
    sample_18 = next(s for s in curve["timeline_samples"] if s["minute"] == 18)
    assert sample_18["instantaneous_probability_pct"] >= 90.0

def test_feedback_and_drift():
    record = feedback_engine.log_outcome(
        case_id="NCRP-DEMO-894321",
        predicted_atm="ATM-UP-NOI-042",
        actual_outcome="INTERCEPTED_AT_ATM",
        is_success=True,
        loss_recovered_inr=1850000.0
    )
    assert record["is_success"] is True
    
    metrics = feedback_engine.compute_evaluation_metrics()
    assert metrics["roc_auc_score"] > 0.90
    assert metrics["drift_status"] == "NO_DRIFT_HEALTHY"
