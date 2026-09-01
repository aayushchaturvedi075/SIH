"use client";

import React, { useState } from "react";
import { MOCK_MULE_NODES, MOCK_NETWORK_EDGES, MuleNode } from "@/lib/mock-data";
import { formatCurrencyINR } from "@/lib/utils";
import { SensitiveData } from "@/components/common/SensitiveData";
import { Shield, AlertTriangle, Landmark, DollarSign, Smartphone, ArrowRight } from "lucide-react";

export function NetworkGraph() {
  const [selectedNode, setSelectedNode] = useState<MuleNode | null>(MOCK_MULE_NODES[0]);

  // Coordinate mapping for SVG nodes
  const nodeCoords: Record<string, { x: number; y: number }> = {
    "NODE-01": { x: 100, y: 180 },
    "NODE-02": { x: 300, y: 90 },
    "NODE-03": { x: 300, y: 190 },
    "NODE-04": { x: 300, y: 290 },
    "NODE-05": { x: 500, y: 90 },
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case "PRIMARY_ACCUSED":
        return "#ba1a1a";
      case "LAYER_1_MULE":
        return "#002147";
      case "ATM_POINT":
        return "#cd7200";
      case "CRYPTO_OFFRAMP":
        return "#7e22ce";
      default:
        return "#3a5f94";
    }
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-sm overflow-hidden flex flex-col lg:flex-row h-full">
      {/* SVG Canvas */}
      <div className="flex-1 p-4 bg-[#f4f6f8] relative min-h-[380px] flex flex-col justify-center items-center select-none">
        <div className="absolute top-3 left-3 flex items-center gap-2 bg-white/90 backdrop-blur px-2.5 py-1 rounded border border-outline-variant text-[11px] font-mono z-10">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
          <span>LIVE SYNDICATE TOPOLOGY — CLUSTER #NCR-9812</span>
        </div>

        <svg className="w-full h-full max-w-[620px] max-h-[360px]" viewBox="0 0 600 360">
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="20"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#74777f" />
            </marker>
          </defs>

          {/* Edges */}
          {MOCK_NETWORK_EDGES.map((edge, i) => {
            const start = nodeCoords[edge.from];
            const end = nodeCoords[edge.to];
            if (!start || !end) return null;
            return (
              <g key={i}>
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke={edge.status === "FROZEN" ? "#15803d" : "#74777f"}
                  strokeWidth="2"
                  strokeDasharray={edge.status === "FROZEN" ? "4" : undefined}
                  markerEnd="url(#arrow)"
                />
                <text
                  x={(start.x + end.x) / 2}
                  y={(start.y + end.y) / 2 - 6}
                  fill="#1a1c1c"
                  fontSize="9"
                  fontFamily="JetBrains Mono"
                  textAnchor="middle"
                  className="bg-white"
                >
                  ₹{(edge.amount / 100000).toFixed(1)}L ({edge.method})
                </text>
              </g>
            );
          })}

          {/* Nodes */}
          {MOCK_MULE_NODES.map((node) => {
            const pos = nodeCoords[node.id];
            if (!pos) return null;
            const isSelected = selectedNode?.id === node.id;
            const color = getNodeColor(node.type);

            return (
              <g
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className="cursor-pointer transition-transform hover:scale-105"
              >
                {/* Glow ring if selected */}
                {isSelected && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="24"
                    fill="none"
                    stroke="#ff9933"
                    strokeWidth="3"
                    strokeDasharray="3"
                  />
                )}
                {/* Main node circle */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="18"
                  fill={color}
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="drop-shadow"
                />
                {/* Label text */}
                <text
                  x={pos.x}
                  y={pos.y + 32}
                  fill="#1a1c1c"
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="Noto Sans"
                  textAnchor="middle"
                >
                  {node.label}
                </text>
                <text
                  x={pos.x}
                  y={pos.y + 44}
                  fill="#44474e"
                  fontSize="9"
                  fontFamily="JetBrains Mono"
                  textAnchor="middle"
                >
                  {node.bank}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-2 left-3 right-3 flex flex-wrap items-center justify-between gap-2 text-[10px] text-on-surface-variant font-mono bg-white/80 p-1.5 rounded border border-outline-variant">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]"></span> Primary Entry
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#002147]"></span> Layer-1 Mule
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#cd7200]"></span> ATM Point
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7e22ce]"></span> Crypto P2P
          </div>
          <div className="flex items-center gap-1.5 text-emerald-700">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-emerald-600"></span> Frozen Trail
          </div>
        </div>
      </div>

      {/* Node Inspector Panel */}
      {selectedNode && (
        <div className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-outline-variant p-4 bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant mb-3">
              <span className="font-label-caps text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
                NODE FORENSICS
              </span>
              <span className="font-mono text-[11px] px-1.5 py-0.5 bg-primary-container text-white rounded">
                HOP {selectedNode.hops}
              </span>
            </div>

            <h4 className="font-bold text-sm text-primary">{selectedNode.holderName}</h4>
            <p className="text-xs text-on-surface-variant mt-0.5 font-medium">{selectedNode.bank}</p>

            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-surface-container">
                <span className="text-on-surface-variant">Account:</span>
                <SensitiveData value={selectedNode.accountNo} type="account" />
              </div>

              <div className="flex justify-between py-1 border-b border-surface-container">
                <span className="text-on-surface-variant">Phone:</span>
                <SensitiveData value={selectedNode.phone} type="phone" />
              </div>

              <div className="flex justify-between py-1 border-b border-surface-container">
                <span className="text-on-surface-variant">IMEI:</span>
                <span className="font-mono text-[11px]">{selectedNode.imei}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-surface-container">
                <span className="text-on-surface-variant">Location:</span>
                <span className="font-medium">{selectedNode.geoDistrict}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-surface-container">
                <span className="text-on-surface-variant">Current Balance:</span>
                <span className="font-mono font-bold text-primary">
                  {formatCurrencyINR(selectedNode.balance)}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-surface-container">
                <span className="text-on-surface-variant">Linked NCRP Cases:</span>
                <span className="font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                  {selectedNode.linkedComplaints} complaints
                </span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-on-surface-variant">Status:</span>
                {selectedNode.frozen ? (
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    FROZEN (1930)
                  </span>
                ) : (
                  <span className="text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200 animate-pulse">
                    ACTIVE (RISK)
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-outline-variant flex flex-col gap-2">
            <button
              onClick={() => alert(`Freeze mandate dispatched to ${selectedNode.bank} for A/C ${selectedNode.accountNo}`)}
              className="w-full bg-error hover:bg-red-800 text-white font-label-caps text-xs py-2 rounded uppercase font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <AlertTriangle className="w-4 h-4" /> Trigger Urgent Freeze
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
