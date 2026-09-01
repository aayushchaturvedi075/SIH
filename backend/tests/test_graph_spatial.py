import pytest
from app.graph.neo4j_client import graph_engine
from app.spatial.candidate_generator import SpatialCandidateGenerator, haversine_distance_meters

def test_graph_fund_flow_trace():
    trace = graph_engine.get_fund_flow_trace("VIC_ARVIND")
    assert trace["total_nodes"] >= 4
    assert trace["total_edges"] >= 3
    
    # Check victim exists
    victim_nodes = [n for n in trace["nodes"] if n["type"] == "Victim"]
    assert len(victim_nodes) >= 1
    assert "Dr. Arvind" in victim_nodes[0]["label"]

def test_pagerank_centrality():
    ranks = graph_engine.compute_pagerank()
    assert len(ranks) > 0
    # Top ranked node must have valid hub score
    assert ranks[0]["hub_centrality_score"] > 0
    assert "account_token" in ranks[0]

def test_louvain_syndicates():
    clusters = graph_engine.detect_louvain_syndicates()
    assert len(clusters) >= 1
    assert clusters[0]["node_count"] >= 2
    assert clusters[0]["total_volume_inr"] > 0

def test_spatial_haversine_accuracy():
    # Distance between Noida Sec 62 and Sector 63 ~ 700m
    d = haversine_distance_meters(28.6280, 77.3649, 28.6315, 77.3712)
    assert 600.0 <= d <= 900.0

def test_spatial_candidate_generation():
    # Query within 3000m radius of Noida Sector 62
    candidates = SpatialCandidateGenerator.shortlist_atm_candidates(
        cell_lat=28.6280,
        cell_lng=77.3649,
        radius_meters=3000.0
    )
    assert len(candidates) >= 2
    # Verify distance ordering (closest first)
    assert candidates[0]["distance_meters"] <= candidates[1]["distance_meters"]
    assert candidates[0]["patrol_eta_minutes"] > 0
