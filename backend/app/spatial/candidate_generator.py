import math
from typing import List, Dict, Any, Optional

def haversine_distance_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Computes accurate great-circle distance between two geographic coordinates in meters.
    Replicates PostGIS ST_Distance(geography) in pure Python.
    """
    R = 6371000.0  # Earth radius in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2.0) ** 2 + \
        math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c

# Seed ATM Terminals (Delhi-NCR, Lucknow, Mumbai, Bengaluru)
ATM_CATALOG = [
    {
        "atm_id": "ATM-UP-NOI-042",
        "name": "HDFC Sector 62 E-Lobby",
        "bank": "HDFC Bank",
        "district": "Gautam Buddha Nagar (Noida)",
        "state": "Uttar Pradesh",
        "lat": 28.6280,
        "lng": 77.3649,
        "cctv_active": True,
        "historical_mule_hits": 14,
        "daily_volume_inr": 3500000.0,
        "risk_level": "CRITICAL"
    },
    {
        "atm_id": "ATM-UP-NOI-019",
        "name": "SBI Sector 63 Industrial Cross",
        "bank": "State Bank of India",
        "district": "Gautam Buddha Nagar (Noida)",
        "state": "Uttar Pradesh",
        "lat": 28.6315,
        "lng": 77.3712,
        "cctv_active": True,
        "historical_mule_hits": 9,
        "daily_volume_inr": 2800000.0,
        "risk_level": "HIGH"
    },
    {
        "atm_id": "ATM-UP-GZB-088",
        "name": "Axis Bank Mohan Nagar Metro Terminal",
        "bank": "Axis Bank",
        "district": "Ghaziabad",
        "state": "Uttar Pradesh",
        "lat": 28.6811,
        "lng": 77.3872,
        "cctv_active": False,
        "historical_mule_hits": 18,
        "daily_volume_inr": 4200000.0,
        "risk_level": "CRITICAL"
    },
    {
        "atm_id": "ATM-UP-LKO-014",
        "name": "ICICI Bank Hazratganj Square",
        "bank": "ICICI Bank",
        "district": "Lucknow",
        "state": "Uttar Pradesh",
        "lat": 26.8467,
        "lng": 80.9462,
        "cctv_active": True,
        "historical_mule_hits": 7,
        "daily_volume_inr": 2100000.0,
        "risk_level": "MEDIUM"
    },
    {
        "atm_id": "ATM-KA-BLR-045",
        "name": "SBI Koramangala 80ft Road",
        "bank": "State Bank of India",
        "district": "Bengaluru Urban",
        "state": "Karnataka",
        "lat": 12.9352,
        "lng": 77.6245,
        "cctv_active": True,
        "historical_mule_hits": 11,
        "daily_volume_inr": 3100000.0,
        "risk_level": "HIGH"
    }
]

# Seed Police Beat Units
POLICE_BEAT_UNITS = [
    {
        "unit_id": "BEAT-NOI-CH-04",
        "callsign": "Cheetah 4 (Noida Sec 62 Patrol)",
        "station": "PS Sector 58 Noida",
        "vehicle": "Motorcycle Patrol",
        "lat": 28.6250,
        "lng": 77.3620,
        "is_available": True
    },
    {
        "unit_id": "BEAT-NOI-PCR-12",
        "callsign": "PCR Van 12 (Model Town Cross)",
        "station": "PS Sector 63 Noida",
        "vehicle": "Mahindra Scorpio PCR",
        "lat": 28.6350,
        "lng": 77.3780,
        "is_available": True
    }
]

class SpatialCandidateGenerator:
    """
    Layer 6: PostGIS Spatial Query Candidate Generator.
    Performs ST_DWithin spatial queries to shortlist all ATMs within
    geographic radius (e.g. 2.5 km) of the suspect's cell tower location.
    """

    @classmethod
    def shortlist_atm_candidates(
        cls,
        cell_lat: float,
        cell_lng: float,
        radius_meters: float = 3000.0,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        candidates = []
        for atm in ATM_CATALOG:
            dist = haversine_distance_meters(cell_lat, cell_lng, atm["lat"], atm["lng"])
            if dist <= radius_meters:
                # Find nearest police beat unit
                nearest_unit, eta_min = cls.calculate_nearest_patrol(atm["lat"], atm["lng"])
                
                # Spatial heuristic score
                spatial_score = round(max(10.0, 100.0 - (dist / radius_meters) * 40.0 + (atm["historical_mule_hits"] * 2.0)), 1)
                
                candidates.append({
                    **atm,
                    "distance_meters": round(dist, 1),
                    "distance_km": round(dist / 1000.0, 2),
                    "spatial_heuristic_score": min(99.0, spatial_score),
                    "nearest_police_unit": nearest_unit,
                    "patrol_eta_minutes": eta_min
                })

        # Sort by shortest distance
        candidates.sort(key=lambda x: x["distance_meters"])
        return candidates[:limit]

    @classmethod
    def calculate_nearest_patrol(cls, target_lat: float, target_lng: float):
        """Calculates nearest police beat unit and intercept ETA in minutes."""
        best_unit = None
        min_dist = float("inf")
        for unit in POLICE_BEAT_UNITS:
            d = haversine_distance_meters(target_lat, target_lng, unit["lat"], unit["lng"])
            if d < min_dist:
                min_dist = d
                best_unit = unit

        if not best_unit:
            return None, 15.0

        # Urban speed ~ 30 km/h + 1.5 min dispatch latency
        eta = (min_dist / 1000.0) / 30.0 * 60.0 + 1.5
        return best_unit, round(eta, 1)
