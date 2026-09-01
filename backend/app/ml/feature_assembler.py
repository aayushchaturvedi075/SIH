from typing import Dict, Any, List
from datetime import datetime
from app.ml.embeddings import GraphSAGEEmbeddingExtractor

class MLFeatureAssembler:
    """
    Layer 7: Combines GraphSAGE embeddings, PostGIS spatial distance,
    financial layering velocity, ATM attributes, and police proximity into
    a unified numerical feature vector for LightGBM LambdaRank.
    """

    @classmethod
    def assemble_candidate_features(
        cls,
        mule_account_token: str,
        atm_candidate: Dict[str, Any],
        transaction_amount: float = 1850000.0,
        layer_hop: int = 2
    ) -> List[float]:
        # 1. GraphSAGE Structural Embeddings (32 dimensions)
        graph_embed = GraphSAGEEmbeddingExtractor.extract_node_embedding(mule_account_token, dim=32)
        
        # 2. Spatial Attributes
        dist_km = atm_candidate.get("distance_km", 2.0)
        
        # 3. ATM Historical Attributes
        mule_hits = float(atm_candidate.get("historical_mule_hits", 5))
        daily_vol_millions = atm_candidate.get("daily_volume_inr", 2500000.0) / 1000000.0
        cctv_flag = 1.0 if atm_candidate.get("cctv_active", True) else 0.0
        
        # 4. Operational & Velocity Attributes
        patrol_eta = float(atm_candidate.get("patrol_eta_minutes", 12.0))
        amt_millions = transaction_amount / 1000000.0
        current_hour = float(datetime.utcnow().hour)
        is_night_cashout = 1.0 if (current_hour >= 20 or current_hour <= 5) else 0.0
        
        # Combine all features into dense vector (32 + 8 = 40 dimensions)
        features = graph_embed + [
            dist_km,
            mule_hits,
            daily_vol_millions,
            cctv_flag,
            patrol_eta,
            amt_millions,
            float(layer_hop),
            is_night_cashout
        ]
        return features
