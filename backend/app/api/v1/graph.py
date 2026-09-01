from fastapi import APIRouter, Query
from typing import Dict, Any, List
from app.graph.neo4j_client import graph_engine

router = APIRouter(prefix="/graph", tags=["Fund-Flow Graph (Layer 5)"])

@router.get("/fund-trace/{case_id}")
def get_case_fund_trace(case_id: str):
    """Traces multi-hop fund flow from victim through mule layers to cash terminals."""
    return graph_engine.get_fund_flow_trace(start_node="VIC_ARVIND")

@router.get("/mule-clusters")
def get_mule_clusters():
    """Returns detected syndicate clusters using Louvain Community Detection."""
    clusters = graph_engine.detect_louvain_syndicates()
    return {
        "algorithm": "Louvain Community Detection",
        "total_clusters": len(clusters),
        "clusters": clusters
    }

@router.get("/pagerank")
def get_pagerank_centrality(limit: int = Query(10, ge=1, le=50)):
    """Returns PageRank Hub Centrality identifying primary money consolidating accounts."""
    ranks = graph_engine.compute_pagerank()
    return {
        "algorithm": "PageRank Centrality",
        "damping_factor": 0.85,
        "results": ranks[:limit]
    }
