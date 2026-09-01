from fastapi import APIRouter, Query
from typing import Dict, Any, List
from app.spatial.candidate_generator import SpatialCandidateGenerator

router = APIRouter(prefix="/spatial", tags=["Candidate Generation (Layer 6)"])

@router.get("/atm-candidates")
def get_atm_candidates(
    lat: float = Query(28.6280, description="Latitude of suspect cell tower or transaction coordinate"),
    lng: float = Query(77.3649, description="Longitude of suspect cell tower or transaction coordinate"),
    radius_meters: float = Query(3000.0, ge=500.0, le=25000.0, description="Search radius in meters"),
    limit: int = Query(10, ge=1, le=50)
):
    """
    Executes PostGIS ST_DWithin spatial candidate generation to return geographically plausible ATMs.
    """
    candidates = SpatialCandidateGenerator.shortlist_atm_candidates(
        cell_lat=lat,
        cell_lng=lng,
        radius_meters=radius_meters,
        limit=limit
    )
    return {
        "query_center": {"lat": lat, "lng": lng},
        "search_radius_meters": radius_meters,
        "candidate_count": len(candidates),
        "candidates": candidates
    }
