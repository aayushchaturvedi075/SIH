"use client";

import React, { useState } from "react";
import { formatTimeRemaining } from "@/lib/utils";
import { Clock, TrendingUp, AlertTriangle, ShieldCheck } from "lucide-react";

interface PredictionCurveProps {
  currentMinute?: number;
  totalWindowMin?: number;
  predictedAtm?: string;
  confidenceScore?: number;
}

export function PredictionCurve({
  currentMinute = 18,
  totalWindowMin = 45,
  predictedAtm = "HDFC Sector 62 E-Lobby (Noida)",
  confidenceScore = 91.4,
}: PredictionCurveProps) {
  const [sliderMin, setSliderMin] = useState(currentMinute);

  // Calculate curve height dynamically based on Gaussian-like curve peaked around minute 15-20
  const getProbability = (min: number) => {
    const mean = 18;
    const std = 8;
    const exponent = -Math.pow(min - mean, 2) / (2 * Math.pow(std, 2));
    const factor = Math.exp(exponent);
    return Math.round(factor * confidenceScore);
  };

  const points = [
    { min: 0, prob: getProbability(0) },
    { min: 5, prob: getProbability(5) },
    { min: 10, prob: getProbability(10) },
    { min: 15, prob: getProbability(15) },
    { min: 18, prob: getProbability(18) },
    { min: 25, prob: getProbability(25) },
    { min: 30, prob: getProbability(30) },
    { min: 40, prob: getProbability(40) },
    { min: 45, prob: getProbability(45) },
  ];

  const currentProb = getProbability(sliderMin);

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-sm p-4 shadow-sm">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-outline-variant mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-label-caps text-xs uppercase font-bold text-primary">
              AI CASH-OUT PROBABILITY CURVE &amp; INTERCEPT WINDOW
            </span>
            <span className="bg-error-container text-on-error-container text-[10px] font-mono font-bold px-1.5 py-0.5 rounded animate-pulse">
              ACTIVE WINDOW
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Predictive Model: <span className="font-mono font-semibold">XGBoost-CrimeFlow-v4.2</span> • Target ATM:{" "}
            <span className="font-semibold text-primary">{predictedAtm}</span>
          </p>
        </div>
        <div className="text-right">
          <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">Confidence</span>
          <div className="text-lg font-mono font-bold text-red-700">{confidenceScore}%</div>
        </div>
      </div>

      {/* SVG Probability Curve */}
      <div className="relative bg-[#f8fafc] border border-outline-variant rounded-sm p-4 select-none">
        <svg className="w-full h-44" viewBox="0 0 500 160">
          <defs>
            <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ba1a1a" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ba1a1a" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="40" y1="20" x2="480" y2="20" stroke="#e2e8f0" strokeDasharray="3" />
          <line x1="40" y1="60" x2="480" y2="60" stroke="#e2e8f0" strokeDasharray="3" />
          <line x1="40" y1="100" x2="480" y2="100" stroke="#e2e8f0" strokeDasharray="3" />
          <line x1="40" y1="140" x2="480" y2="140" stroke="#cbd5e1" />

          {/* Axis Labels */}
          <text x="25" y="24" fontSize="9" fill="#64748b" fontFamily="JetBrains Mono">90%</text>
          <text x="25" y="64" fontSize="9" fill="#64748b" fontFamily="JetBrains Mono">60%</text>
          <text x="25" y="104" fontSize="9" fill="#64748b" fontFamily="JetBrains Mono">30%</text>
          <text x="25" y="144" fontSize="9" fill="#64748b" fontFamily="JetBrains Mono">0%</text>

          {/* Critical Intercept Window Shading (min 10 to 25) */}
          <rect x="140" y="20" width="150" height="120" fill="#fee2e2" opacity="0.45" />
          <text x="215" y="32" fontSize="9" fill="#991b1b" fontWeight="bold" fontFamily="Noto Sans" textAnchor="middle">
            OPTIMAL LEA INTERCEPT ZONE
          </text>

          {/* Probability Path */}
          <path
            d="M 40,135 Q 120,130 180,30 T 320,120 T 480,138"
            fill="none"
            stroke="#ba1a1a"
            strokeWidth="3"
          />
          <path
            d="M 40,135 Q 120,130 180,30 T 320,120 T 480,138 L 480,140 L 40,140 Z"
            fill="url(#curveGrad)"
          />

          {/* Current minute vertical marker */}
          {(() => {
            const markerX = 40 + (sliderMin / 45) * 440;
            return (
              <g>
                <line x1={markerX} y1="20" x2={markerX} y2="140" stroke="#002147" strokeWidth="2" strokeDasharray="3" />
                <circle cx={markerX} cy={140 - (currentProb / 100) * 120} r="5" fill="#002147" stroke="#ffffff" strokeWidth="2" />
                <text x={markerX} y="15" fontSize="10" fill="#002147" fontWeight="bold" fontFamily="JetBrains Mono" textAnchor="middle">
                  T+{sliderMin}m ({currentProb}%)
                </text>
              </g>
            );
          })()}
        </svg>

        {/* Time Scrubber Slider */}
        <div className="mt-3 flex items-center gap-3">
          <span className="text-xs font-mono text-on-surface-variant font-semibold">T+0m (Incident)</span>
          <input
            type="range"
            min="0"
            max="45"
            value={sliderMin}
            onChange={(e) => setSliderMin(Number(e.target.value))}
            className="flex-1 accent-primary-container h-1.5 bg-outline-variant rounded-lg cursor-pointer"
          />
          <span className="text-xs font-mono text-on-surface-variant font-semibold">T+45m (Expiry)</span>
        </div>
      </div>

      {/* Recommended Action Box */}
      <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-sm flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-800" />
          <span className="text-amber-900 font-medium">
            Projected Intercept Time Window: <strong>14 to 22 mins from now</strong>. Sector 58 Beat PCR Unit ETA: <strong>4.2 mins</strong>.
          </span>
        </div>
        <button
          onClick={() => alert(`Direct Beat Dispatch Signal Broadcasted to Noida PCR Unit 09 for ATM: ${predictedAtm}`)}
          className="px-3 py-1 bg-[#ba1a1a] hover:bg-red-800 text-white font-label-caps text-xs font-bold rounded uppercase transition-colors shrink-0"
        >
          Dispatch Beat Unit
        </button>
      </div>
    </div>
  );
}
