import math
from typing import Dict, Any, List

class CashOutTimelineModel:
    """
    Layer 7: Dynamic Cash-Out Prediction Timeline Model.
    Generates time-dependent probability density P(t) over a 60-minute golden hour window.
    Identifies the peak cash-out window and the optimal law enforcement intercept window.
    """

    @classmethod
    def generate_probability_curve(
        cls,
        peak_time_minutes: float = 18.0,
        bandwidth_sigma: float = 6.5,
        max_probability_pct: float = 94.2
    ) -> Dict[str, Any]:
        time_points = []
        
        # Sample every 2 minutes from T+0 to T+60 minutes
        for minute in range(0, 62, 2):
            # Asymmetric skewed Gaussian distribution (faster rise, gradual decay)
            t = float(minute)
            diff = (t - peak_time_minutes)
            if diff < 0:
                exponent = -0.5 * (diff / bandwidth_sigma) ** 2
            else:
                exponent = -0.5 * (diff / (bandwidth_sigma * 1.4)) ** 2
                
            density = math.exp(exponent) * (max_probability_pct / 100.0)
            prob_pct = round(density * 100.0, 1)
            
            # Cumulative risk probability
            cumulative_risk = round(min(99.0, (1.0 - math.exp(-t / (peak_time_minutes * 0.9))) * 100.0), 1)
            
            time_points.append({
                "minute": minute,
                "label": f"T+{minute}m",
                "instantaneous_probability_pct": prob_pct,
                "cumulative_risk_pct": cumulative_risk,
                "is_golden_hour_window": 12 <= minute <= 26
            })

        return {
            "optimal_intercept_start_min": max(0, int(peak_time_minutes - 6)),
            "optimal_intercept_peak_min": int(peak_time_minutes),
            "optimal_intercept_end_min": int(peak_time_minutes + 8),
            "peak_probability_pct": max_probability_pct,
            "timeline_samples": time_points
        }
