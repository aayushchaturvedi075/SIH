"use client";

import React, { useState, useEffect } from "react";
import {
  Video,
  Radio,
  Eye,
  Camera,
  ShieldAlert,
  Clock,
  Download,
  CheckCircle2,
  AlertTriangle,
  X,
  Maximize2,
  RefreshCw,
  Sparkles,
  Layers,
  FileCheck,
} from "lucide-react";
import { formatCurrencyINR } from "@/lib/utils";

interface LiveCCTVModalProps {
  isOpen: boolean;
  onClose: () => void;
  atm: {
    id: string;
    name: string;
    bank: string;
    risk: "CRITICAL" | "HIGH" | "MEDIUM";
    confidence: number;
    distance?: string;
    eta?: string;
  };
}

export function LiveCCTVModal({ isOpen, onClose, atm }: LiveCCTVModalProps) {
  const [selectedCam, setSelectedCam] = useState<"CAM1" | "CAM2">("CAM1");
  const [visionMode, setVisionMode] = useState<"IR_NIGHT" | "STANDARD" | "THERMAL">("IR_NIGHT");
  const [isAiOverlayActive, setIsAiOverlayActive] = useState(true);
  const [timestamp, setTimestamp] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);
  const [snapshotResult, setSnapshotResult] = useState<{
    frameId: string;
    hash: string;
    certId: string;
  } | null>(null);

  // Live surveillance timestamp clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, "0");
      const str = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(
        now.getHours()
      )}:${pad(now.getMinutes())}:${pad(now.getSeconds())}.${pad(
        Math.floor(now.getMilliseconds() / 10)
      )} IST`;
      setTimestamp(str);
    };
    updateTime();
    const interval = setInterval(updateTime, 100);
    return () => clearInterval(interval);
  }, []);

  if (!isOpen) return null;

  const handleCaptureSnapshot = () => {
    setIsCapturing(true);
    setTimeout(() => {
      const randomHex = Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("");
      setSnapshotResult({
        frameId: `FRM-${atm.id.slice(-6)}-${Date.now().toString().slice(-6)}`,
        hash: randomHex,
        certId: `BSA-CERT-CCTV-${randomHex.slice(0, 12).toUpperCase()}`,
      });
      setIsCapturing(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 animate-in fade-in-0 duration-200">
      <div className="relative w-full max-w-5xl bg-[#0a0f1d] border-2 border-red-800/80 rounded-xl shadow-[0_0_50px_rgba(220,38,38,0.25)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header Bar */}
        <div className="bg-red-950/90 border-b border-red-800/60 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-xs font-mono font-bold">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <span className="text-red-400 tracking-wider font-extrabold flex items-center gap-1.5 uppercase">
              <Video className="w-4 h-4" /> LIVE POLICE E-SURVEILLANCE FEED // {atm.id}
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-white font-sans font-medium">{atm.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-900/60 text-red-200 border border-red-700/60 font-bold">
              {atm.confidence}% CASHOUT RISK
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Camera Selector & HUD Toolbar */}
        <div className="bg-navy-950 px-4 py-2 border-b border-navy-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px] font-sans">Camera Angle:</span>
            <button
              onClick={() => setSelectedCam("CAM1")}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                selectedCam === "CAM1"
                  ? "bg-red-600 text-white shadow-md shadow-red-950 border border-red-400"
                  : "bg-navy-900 text-slate-300 hover:bg-navy-800 border border-navy-700"
              }`}
            >
              CAM 01: Fascia Pinhole (Face)
            </button>
            <button
              onClick={() => setSelectedCam("CAM2")}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                selectedCam === "CAM2"
                  ? "bg-red-600 text-white shadow-md shadow-red-950 border border-red-400"
                  : "bg-navy-900 text-slate-300 hover:bg-navy-800 border border-navy-700"
              }`}
            >
              CAM 02: Lobby Overhead (Wide)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px] font-sans">Sensors:</span>
            <button
              onClick={() => setVisionMode("IR_NIGHT")}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                visionMode === "IR_NIGHT" ? "bg-emerald-800 text-white" : "bg-navy-900 text-slate-400"
              }`}
            >
              IR Night Vision
            </button>
            <button
              onClick={() => setVisionMode("STANDARD")}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                visionMode === "STANDARD" ? "bg-blue-800 text-white" : "bg-navy-900 text-slate-400"
              }`}
            >
              RGB Standard
            </button>
            <button
              onClick={() => setVisionMode("THERMAL")}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                visionMode === "THERMAL" ? "bg-amber-700 text-white" : "bg-navy-900 text-slate-400"
              }`}
            >
              Thermal IR
            </button>
            <button
              onClick={() => setIsAiOverlayActive((p) => !p)}
              className={`px-2.5 py-0.5 rounded text-[11px] font-bold border transition-colors flex items-center gap-1 ${
                isAiOverlayActive
                  ? "bg-purple-950 text-purple-300 border-purple-700"
                  : "bg-navy-900 text-slate-500 border-navy-800"
              }`}
            >
              <Sparkles className="w-3 h-3" /> AI Vision HUD
            </button>
          </div>
        </div>

        {/* CCTV Main Viewport Area */}
        <div className="relative flex-1 bg-black min-h-[360px] sm:min-h-[420px] overflow-hidden flex items-center justify-center select-none">
          {/* Scanline and CRT flickering filter overlay */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] z-10 opacity-60"></div>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.9)] z-10"></div>

          {/* Simulated Live Camera Graphics (SVG based on Camera angle & Vision Mode) */}
          <div
            className={`w-full h-full flex items-center justify-center transition-all duration-300 ${
              visionMode === "IR_NIGHT"
                ? "filter grayscale contrast-125 brightness-90 bg-[#0d1410]"
                : visionMode === "THERMAL"
                ? "filter hue-rotate-180 invert brightness-110 bg-[#1e0a24]"
                : "bg-[#0f172a]"
            }`}
          >
            {selectedCam === "CAM1" ? (
              /* CAM 01: Fascia Close-Up: Suspect inserting cards with helmet/mask */
              <svg className="w-full h-full max-h-[440px]" viewBox="0 0 800 450">
                <rect width="800" height="450" fill="#0c1015" />
                {/* ATM Kiosk Wall & Frame */}
                <path d="M 0 0 L 800 0 L 800 450 L 0 450 Z" fill="#141a24" opacity="0.4" />
                <rect x="150" y="80" width="500" height="340" fill="#1a2230" rx="10" />
                <rect x="200" y="110" width="400" height="180" fill="#080c14" rx="4" />
                {/* Screen text simulation */}
                <text x="220" y="150" fill="#22c55e" fontSize="14" fontFamily="monospace" opacity="0.8">
                  {atm.bank.toUpperCase()} CASH TERMINAL // INSERT CARD...
                </text>
                <text x="220" y="175" fill="#38bdf8" fontSize="12" fontFamily="monospace" opacity="0.6">
                  PLEASE ENTER 4-DIGIT PIN OR SELECT SERVICE
                </text>
                <text x="220" y="240" fill="#f59e0b" fontSize="11" fontFamily="monospace" opacity="0.7">
                  TXN #8491 - WITHDRAWAL IN PROGRESS (INR 20,000)
                </text>

                {/* Card slot glowing */}
                <rect x="520" y="220" width="60" height="12" fill="#22c55e" opacity="0.8" rx="2" />
                <line x1="520" y1="226" x2="580" y2="226" stroke="#000" strokeWidth="2" />

                {/* Suspect Figure (Hooded/Helmet Silhouette) */}
                <ellipse cx="400" cy="180" rx="90" ry="110" fill="#06090e" opacity="0.95" />
                <ellipse cx="400" cy="160" rx="65" ry="75" fill="#18202d" />
                {/* Helmet visor reflection */}
                <path d="M 360 145 Q 400 135 440 145 Q 430 180 370 180 Z" fill="#0a0e17" stroke="#38bdf8" strokeWidth="1" opacity="0.8" />
                {/* Hands inserting card into reader */}
                <ellipse cx="500" cy="270" rx="45" ry="30" fill="#1e293b" />
                <rect x="480" y="235" width="45" height="28" fill="#3b82f6" rx="3" transform="rotate(-15 480 235)" />

                {/* AI Detection Bounding Boxes (if enabled) */}
                {isAiOverlayActive && (
                  <>
                    {/* Bounding Box 1: Face Concealment */}
                    <rect
                      x="320"
                      y="85"
                      width="160"
                      height="150"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2"
                      strokeDasharray="6,4"
                      className="animate-pulse"
                    />
                    <rect x="320" y="60" width="220" height="24" fill="#ef4444" rx="2" />
                    <text x="325" y="76" fill="#ffffff" fontSize="11" fontFamily="monospace" fontWeight="bold">
                      [!] FACE CONCEALED (96.4%)
                    </text>

                    {/* Bounding Box 2: Multi-card swapping */}
                    <rect
                      x="450"
                      y="210"
                      width="150"
                      height="90"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      strokeDasharray="4,4"
                    />
                    <rect x="450" y="188" width="180" height="22" fill="#d97706" rx="2" />
                    <text x="455" y="203" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      MULTI-CARD SWAP: #4 INSERTED
                    </text>
                  </>
                )}
              </svg>
            ) : (
              /* CAM 02: Lobby Overhead Fisheye Angle: Shows kiosk entrance & glass door */
              <svg className="w-full h-full max-h-[440px]" viewBox="0 0 800 450">
                <rect width="800" height="450" fill="#070a0f" />
                {/* Fisheye curved lines */}
                <ellipse cx="400" cy="225" rx="390" ry="220" fill="none" stroke="#1e293b" strokeWidth="1" opacity="0.3" />
                <rect x="80" y="40" width="640" height="370" fill="#0d141f" rx="12" />

                {/* ATM Kiosk glass door */}
                <rect x="140" y="60" width="240" height="330" fill="#141f30" opacity="0.7" />
                <line x1="260" y1="60" x2="260" y2="390" stroke="#334155" strokeWidth="4" />

                {/* ATM Machine in corner */}
                <rect x="520" y="100" width="160" height="280" fill="#1e293b" rx="6" />
                <rect x="540" y="130" width="120" height="80" fill="#22c55e" opacity="0.4" />

                {/* Suspect standing at ATM */}
                <ellipse cx="500" cy="240" rx="35" ry="70" fill="#0f172a" />
                <circle cx="500" cy="170" r="22" fill="#1e293b" />

                {/* Accomplice waiting on motorcycle outside glass door */}
                <rect x="180" y="240" width="70" height="40" fill="#334155" rx="4" />
                <circle cx="190" cy="285" r="16" fill="#0f172a" stroke="#475569" strokeWidth="3" />
                <circle cx="240" cy="285" r="16" fill="#0f172a" stroke="#475569" strokeWidth="3" />
                <circle cx="215" cy="210" r="14" fill="#1e293b" />

                {/* AI Overlays for Overhead Camera */}
                {isAiOverlayActive && (
                  <>
                    <rect
                      x="160"
                      y="180"
                      width="110"
                      height="130"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      strokeDasharray="4,4"
                    />
                    <rect x="160" y="158" width="150" height="20" fill="#b45309" rx="2" />
                    <text x="165" y="172" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      LOOKOUT SUSPECT (88.5%)
                    </text>
                  </>
                )}
              </svg>
            )}
          </div>

          {/* CCTV On-Screen Display (OSD) Overlays */}
          <div className="absolute top-3 left-3 z-20 font-mono text-[11px] text-white/90 drop-shadow space-y-0.5">
            <div className="flex items-center gap-1.5 text-red-500 font-bold">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
              REC [LIVE]
            </div>
            <div className="text-emerald-400 font-semibold">{timestamp}</div>
            <div className="text-slate-300">STREAM: RTSP-H.265-1080P // 25.00 FPS</div>
            <div className="text-slate-400">NODE: {selectedCam === "CAM1" ? "CAM-PINHOLE-FASCIA" : "CAM-OVERHEAD-WIDE"}</div>
          </div>

          <div className="absolute top-3 right-3 z-20 font-mono text-right text-[11px] text-white/90 drop-shadow space-y-0.5">
            <div className="text-amber-400 font-bold">BITRATE: 4.8 Mbps</div>
            <div className="text-slate-300">LATENCY: 42ms</div>
            <div className="text-purple-400 font-semibold">AI VISION ENGINE: ACTIVE</div>
          </div>

          {/* Bottom Live Alert Banner */}
          <div className="absolute bottom-3 left-3 right-3 z-20 bg-red-950/85 backdrop-blur-sm border border-red-700/80 rounded-lg p-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse shrink-0" />
              <div className="text-red-200">
                <strong className="text-white font-bold">SUSPICIOUS CASHOUT PATTERN IN PROGRESS:</strong> Suspect matching tower cell dwell time (2.2km radius) withdrawing funds sequentially.
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCaptureSnapshot}
                disabled={isCapturing}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded flex items-center gap-1.5 shadow-md shadow-red-950 transition-colors"
              >
                <Camera className="w-3.5 h-3.5" />
                {isCapturing ? "Anchoring..." : "Capture Evidentiary Frame"}
              </button>
            </div>
          </div>
        </div>

        {/* Section 65B Cryptographic Proof Modal Result */}
        {snapshotResult && (
          <div className="bg-[#050914] border-t border-emerald-800/60 p-4 animate-in slide-in-from-bottom-2 duration-150">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs font-mono">
                <FileCheck className="w-4 h-4" />
                <span>SECTION 65B / 63 BSA CRYPTOGRAPHIC EVIDENCE CERTIFICATE ANCHORED</span>
              </div>
              <button
                onClick={() => setSnapshotResult(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Dismiss
              </button>
            </div>

            <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs font-mono bg-navy-950/80 p-2.5 rounded border border-navy-800">
              <div>
                <span className="text-slate-400 text-[10px]">FRAME ID:</span>
                <p className="text-white font-bold">{snapshotResult.frameId}</p>
              </div>
              <div className="md:col-span-2 truncate">
                <span className="text-slate-400 text-[10px]">SHA-256 EVIDENCE HASH:</span>
                <p className="text-saffron font-bold truncate">{snapshotResult.hash}</p>
              </div>
              <div className="md:col-span-3 pt-1 border-t border-navy-800 flex items-center justify-between text-[11px] text-slate-300">
                <span>Algorand Testnet Merkle Anchor: <strong className="text-emerald-400">{snapshotResult.certId}</strong></span>
                <span className="text-emerald-400 font-bold">✓ Ready for Court Admissibility</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
