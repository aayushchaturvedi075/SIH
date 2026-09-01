"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PredictionCurve } from "@/components/visualizations/PredictionCurve";
import { StatCard } from "@/components/common/StatCard";
import { Badge } from "@/components/common/Badge";
import { Sliders, Clock, Activity, Cpu, RotateCcw, Save, Zap, AlertCircle } from "lucide-react";

export default function UnifiedAIWorkbenchPage() {
  const [activeTab, setActiveTab] = useState<"TIMELINE" | "TUNING" | "PERFORMANCE">("TIMELINE");

  // Feature weights state
  const [weights, setWeights] = useState({
    spatialProximity: 35,
    historicalDensity: 25,
    graphCentrality: 20,
    cashVelocity: 10,
    cctvFactor: 5,
    nightBias: 5,
  });

  const [simulatedScore, setSimulatedScore] = useState(94.2);

  const handleSliderChange = (key: keyof typeof weights, value: number) => {
    const updated = { ...weights, [key]: value };
    setWeights(updated);
    // Dynamic simulated confidence calculation
    const score = Math.min(
      99.2,
      Math.max(
        50.0,
        updated.spatialProximity * 0.9 +
          updated.historicalDensity * 0.8 +
          updated.graphCentrality * 0.7 +
          updated.cashVelocity * 0.5 +
          updated.cctvFactor * 0.4
      )
    );
    setSimulatedScore(Number(score.toFixed(1)));
  };

  const handleReset = () => {
    setWeights({
      spatialProximity: 35,
      historicalDensity: 25,
      graphCentrality: 20,
      cashVelocity: 10,
      cctvFactor: 5,
      nightBias: 5,
    });
    setSimulatedScore(94.2);
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-[1600px] mx-auto w-full pb-16">
        {/* Header & Sub-Tab Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant pb-4">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold text-lg">
              <Cpu className="w-5 h-5 text-amber-500" />
              <span>AI Predictive Intelligence &amp; Model Workbench</span>
            </div>
            <p className="text-xs text-on-surface-variant font-medium">
              Real-time cash-out timeline curves, GraphSAGE feature sensitivity tuning, and model telemetry
            </p>
          </div>

          <div className="flex bg-surface-container-high p-1 rounded border border-outline-variant text-xs font-mono">
            <button
              onClick={() => setActiveTab("TIMELINE")}
              className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors ${
                activeTab === "TIMELINE"
                  ? "bg-primary-container text-white font-bold shadow"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-red-400" /> Cash-Out Timeline Curve
            </button>
            <button
              onClick={() => setActiveTab("TUNING")}
              className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors ${
                activeTab === "TUNING"
                  ? "bg-primary-container text-white font-bold shadow"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" /> Feature Weight Sliders
            </button>
            <button
              onClick={() => setActiveTab("PERFORMANCE")}
              className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors ${
                activeTab === "PERFORMANCE"
                  ? "bg-primary-container text-white font-bold shadow"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" /> Performance &amp; PSI Drift
            </button>
          </div>
        </div>

        {/* Tab 1: Cash-Out Prediction Timeline */}
        {activeTab === "TIMELINE" && (
          <div className="space-y-6">
            <div className="p-3 bg-surface border border-outline-variant rounded flex items-center justify-between text-xs font-mono">
              <span>TARGET INVESTIGATION: <strong className="text-primary">NCRP-DEMO-894321</strong></span>
              <span className="text-red-700 font-bold">OPTIMAL INTERCEPT WINDOW: T+12m to T+26m (Peak at T+18m)</span>
            </div>
            <PredictionCurve />
          </div>
        )}

        {/* Tab 2: Feature Sensitivity Sliders */}
        {activeTab === "TUNING" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-surface border border-outline-variant rounded p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-outline-variant pb-3">
                <span className="font-label-caps text-xs text-primary font-bold">
                  ENSEMBLE FEATURE COEFFICIENTS (LIGHTGBM + GRAPHSAGE)
                </span>
                <button
                  onClick={handleReset}
                  className="px-2 py-1 bg-surface-container hover:bg-surface-container-high text-on-surface-variant text-[11px] font-mono rounded flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset Defaults
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="font-bold text-primary">Geospatial Proximity Weight (ST_Distance):</span>
                    <span className="text-amber-500 font-bold">{weights.spatialProximity}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    value={weights.spatialProximity}
                    onChange={(e) => handleSliderChange("spatialProximity", Number(e.target.value))}
                    className="w-full accent-primary-container cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="font-bold text-primary">Historical ATM Syndicate Density:</span>
                    <span className="text-amber-500 font-bold">{weights.historicalDensity}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={weights.historicalDensity}
                    onChange={(e) => handleSliderChange("historicalDensity", Number(e.target.value))}
                    className="w-full accent-primary-container cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="font-bold text-primary">GraphSAGE Node Centrality Affinity:</span>
                    <span className="text-amber-500 font-bold">{weights.graphCentrality}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    value={weights.graphCentrality}
                    onChange={(e) => handleSliderChange("graphCentrality", Number(e.target.value))}
                    className="w-full accent-primary-container cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="font-bold text-primary">Multi-Hop Layering Transfer Velocity:</span>
                    <span className="text-amber-500 font-bold">{weights.cashVelocity}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    value={weights.cashVelocity}
                    onChange={(e) => handleSliderChange("cashVelocity", Number(e.target.value))}
                    className="w-full accent-primary-container cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Simulation Preview Card */}
            <div className="bg-surface border border-outline-variant rounded p-6 space-y-4 shadow-sm h-fit">
              <span className="font-label-caps text-xs text-primary font-bold">LIVE PREDICTION SIMULATOR</span>
              <div className="p-4 bg-surface-container-low border border-outline-variant rounded text-center space-y-1">
                <span className="text-[10px] text-on-surface-variant font-mono uppercase">Calibrated Confidence</span>
                <div className="text-3xl font-mono font-black text-amber-400">{simulatedScore}%</div>
                <span className="text-[10px] text-emerald-600 font-bold">TIER-1 AUTO DISPATCH ACTIVE</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Adjusting coefficients recalculates the Isotonic probability mapping in real-time without retraining base weights.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Model Performance & Drift Telemetry */}
        {activeTab === "PERFORMANCE" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="ROC-AUC Score" value="0.942" accentColor="emerald" subtitle="50k Holdout Cases" />
              <StatCard title="Inference Latency" value="14.2 ms" accentColor="blue" subtitle="End-to-End Pipeline" />
              <StatCard title="Population Stability (PSI)" value="0.038" accentColor="emerald" subtitle="Healthy (No Drift)" />
              <StatCard title="Precision @ Top-1 ATM" value="91.4%" accentColor="saffron" subtitle="Field Validated" />
            </div>

            <div className="bg-surface border border-outline-variant rounded p-6 space-y-3">
              <h4 className="font-bold text-sm text-primary">Model Version &amp; Telemetry Matrix</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono pt-2">
                <div className="p-3 bg-surface-container-low border border-outline-variant rounded">
                  <span className="text-on-surface-variant text-[10px]">CURRENT MODEL VERSION</span>
                  <p className="text-primary font-bold text-sm">v2.4.1-lightgbm-calibrated</p>
                </div>
                <div className="p-3 bg-surface-container-low border border-outline-variant rounded">
                  <span className="text-on-surface-variant text-[10px]">ACTIVE DRIFT STATUS</span>
                  <p className="text-emerald-700 font-bold text-sm">NO_DRIFT_HEALTHY (PSI &lt; 0.1)</p>
                </div>
                <div className="p-3 bg-surface-container-low border border-outline-variant rounded">
                  <span className="text-on-surface-variant text-[10px]">NEXT RETRAINING SCHEDULE</span>
                  <p className="text-primary font-bold text-sm">03-SEP-2026 04:00 IST</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
