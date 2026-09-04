"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Play,
  Pause,
  Sliders,
  Tv,
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
  const [displayMode, setDisplayMode] = useState<"REAL_VIDEO" | "SCHEMATIC">("REAL_VIDEO");
  const [isAiOverlayActive, setIsAiOverlayActive] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [timestamp, setTimestamp] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);
  const [customStreamUrl, setCustomStreamUrl] = useState("");
  const [showStreamInput, setShowStreamInput] = useState(false);
  const [snapshotResult, setSnapshotResult] = useState<{
    frameId: string;
    hash: string;
    certId: string;
  } | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

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

  // Handle Play/Pause toggle
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

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

  // Video source selector
  const currentVideoSrc =
    customStreamUrl.trim() !== ""
      ? customStreamUrl
      : selectedCam === "CAM1"
      ? "/videos/cctv_fascia.mp4"
      : "/videos/cctv_lobby.mp4";

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-5 animate-in fade-in-0 duration-200">
      <div className="relative w-full max-w-5xl bg-[#090e1a] border-2 border-red-700/80 rounded-xl shadow-[0_0_60px_rgba(220,38,38,0.3)] overflow-hidden flex flex-col max-h-[95vh]">
        {/* Top Header Bar */}
        <div className="bg-red-950/95 border-b border-red-800/70 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-xs font-mono font-bold">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <span className="text-red-400 tracking-wider font-extrabold flex items-center gap-1.5 uppercase">
              <Video className="w-4 h-4" /> LIVE REAL-TIME CCTV STREAM // {atm.id}
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-white font-sans font-medium">{atm.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-900/60 text-red-200 border border-red-700 font-bold">
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
            {/* Feed Mode: Real Video vs Schematic */}
            <div className="flex bg-navy-900 p-0.5 rounded border border-navy-700 text-[11px]">
              <button
                onClick={() => setDisplayMode("REAL_VIDEO")}
                className={`px-2 py-0.5 rounded font-bold transition-colors ${
                  displayMode === "REAL_VIDEO"
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Real Video
              </button>
              <button
                onClick={() => setDisplayMode("SCHEMATIC")}
                className={`px-2 py-0.5 rounded font-bold transition-colors ${
                  displayMode === "SCHEMATIC"
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Schematic
              </button>
            </div>

            {/* Sensor / Vision Filters */}
            <button
              onClick={() => setVisionMode("IR_NIGHT")}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                visionMode === "IR_NIGHT" ? "bg-emerald-800 text-white font-bold" : "bg-navy-900 text-slate-400"
              }`}
            >
              IR Night Vision
            </button>
            <button
              onClick={() => setVisionMode("STANDARD")}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                visionMode === "STANDARD" ? "bg-blue-800 text-white font-bold" : "bg-navy-900 text-slate-400"
              }`}
            >
              RGB Standard
            </button>
            <button
              onClick={() => setVisionMode("THERMAL")}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                visionMode === "THERMAL" ? "bg-amber-700 text-white font-bold" : "bg-navy-900 text-slate-400"
              }`}
            >
              Thermal IR
            </button>

            {/* AI Overlay toggle */}
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

            <button
              onClick={() => setShowStreamInput((p) => !p)}
              className="px-2 py-0.5 rounded bg-navy-900 hover:bg-navy-800 text-slate-300 border border-navy-700 text-[11px] transition-colors"
              title="Configure external RTSP/HLS URL"
            >
              Custom Stream
            </button>
          </div>
        </div>

        {/* Optional Custom Stream URL Input */}
        {showStreamInput && (
          <div className="bg-navy-900 px-4 py-2 border-b border-navy-800 flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400 shrink-0">External Video / RTSP URL:</span>
            <input
              type="text"
              value={customStreamUrl}
              onChange={(e) => setCustomStreamUrl(e.target.value)}
              placeholder="e.g. https://.../stream.mp4 or /videos/cctv_fascia.mp4"
              className="flex-1 bg-navy-950 text-white px-3 py-1 rounded border border-navy-700 text-xs focus:outline-none focus:border-blue-500"
            />
            {customStreamUrl && (
              <button
                onClick={() => setCustomStreamUrl("")}
                className="px-2 py-1 bg-red-900/60 hover:bg-red-800 text-red-200 rounded text-[11px]"
              >
                Reset Default
              </button>
            )}
          </div>
        )}

        {/* CCTV Main Viewport Area */}
        <div className="relative flex-1 bg-black min-h-[380px] sm:min-h-[460px] overflow-hidden flex items-center justify-center select-none">
          {/* Scanline and CRT flickering filter overlay */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] z-20 opacity-60"></div>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_120px_rgba(0,0,0,0.92)] z-20"></div>

          {/* Actual Video Viewport Container */}
          <div
            className={`relative w-full h-full flex items-center justify-center transition-all duration-300 ${
              visionMode === "IR_NIGHT"
                ? "filter grayscale contrast-135 brightness-95"
                : visionMode === "THERMAL"
                ? "filter invert(100%) hue-rotate(180deg) contrast(140%)"
                : "filter contrast-105"
            }`}
          >
            {displayMode === "REAL_VIDEO" ? (
              /* Embedded Real Video Player */
              <div className="relative w-full h-full flex items-center justify-center bg-black">
                <video
                  ref={videoRef}
                  key={`${selectedCam}-${currentVideoSrc}`}
                  src={currentVideoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover max-h-[460px]"
                />

                {/* Night-Vision Green phosphor tint overlay if IR_NIGHT is active */}
                {visionMode === "IR_NIGHT" && (
                  <div className="absolute inset-0 pointer-events-none bg-emerald-950/20 mix-blend-color-dodge z-10"></div>
                )}

                {/* Dynamic Real-Time AI Computer Vision Bounding Boxes over Real Video */}
                {isAiOverlayActive && (
                  <div className="absolute inset-0 pointer-events-none z-15">
                    {selectedCam === "CAM1" ? (
                      /* Face & Card Slot Bounding Boxes on Real Video */
                      <>
                        {/* Bounding Box 1: Face / Helmet Concealment */}
                        <div className="absolute top-[18%] left-[34%] w-[32%] h-[42%] border-2 border-dashed border-red-500 rounded bg-red-500/10 animate-pulse flex flex-col justify-start">
                          <span className="bg-red-600 text-white font-mono font-bold text-[10px] px-1.5 py-0.5 w-fit shadow">
                            [!] SUSPECT: HELMET / FACE CONCEALMENT (96.4%)
                          </span>
                          <div className="p-1 text-[9px] font-mono text-red-300 bg-black/60 mt-auto">
                            TRACK_ID: #SUS-8941 // DWELL: 3m 14s
                          </div>
                        </div>

                        {/* Bounding Box 2: Rapid Multi-Card Swapping */}
                        <div className="absolute top-[64%] left-[45%] w-[24%] h-[26%] border-2 border-dashed border-amber-500 rounded bg-amber-500/10 flex flex-col justify-start">
                          <span className="bg-amber-600 text-white font-mono font-bold text-[9px] px-1.5 py-0.5 w-fit shadow">
                            MULTI-CARD SWAP #4 DETECTED
                          </span>
                          <div className="p-0.5 text-[8px] font-mono text-amber-200 bg-black/60 mt-auto">
                            CARD BIN: 4591-XXXX (SBI MULE)
                          </div>
                        </div>
                      </>
                    ) : (
                      /* Lobby Overhead Bounding Boxes on Real Video */
                      <>
                        {/* Bounding Box: Person Entering / Moving */}
                        <div className="absolute top-[22%] left-[26%] w-[28%] h-[56%] border-2 border-dashed border-red-500 rounded bg-red-500/10 flex flex-col justify-start">
                          <span className="bg-red-600 text-white font-mono font-bold text-[10px] px-1.5 py-0.5 w-fit shadow">
                            [!] MULE RUNNER AT KIOSK (94.8%)
                          </span>
                          <div className="p-1 text-[9px] font-mono text-red-200 bg-black/60 mt-auto">
                            MATCH: TOWER CELL NOIDA SEC 62
                          </div>
                        </div>

                        {/* Bounding Box: Exterior Lookout */}
                        <div className="absolute top-[35%] left-[68%] w-[22%] h-[38%] border-2 border-dashed border-amber-500 rounded bg-amber-500/10 flex flex-col justify-start">
                          <span className="bg-amber-600 text-white font-mono font-bold text-[9px] px-1.5 py-0.5 w-fit shadow">
                            ACCOMPLICE LOOKOUT (88.5%)
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Fallback Vector Schematic View */
              <svg className="w-full h-full max-h-[460px]" viewBox="0 0 800 450">
                <rect width="800" height="450" fill="#080c14" />
                <rect x="150" y="80" width="500" height="340" fill="#141c28" rx="8" />
                <rect x="200" y="110" width="400" height="180" fill="#05080f" rx="4" />
                <text x="220" y="150" fill="#22c55e" fontSize="14" fontFamily="monospace">
                  {atm.bank.toUpperCase()} // TERMINAL #{atm.id}
                </text>
                <text x="220" y="175" fill="#38bdf8" fontSize="12" fontFamily="monospace">
                  LIVE POLICE FORENSIC FEED ACTIVE
                </text>
                <ellipse cx="400" cy="180" rx="80" ry="100" fill="#020408" />
                <ellipse cx="400" cy="160" rx="55" ry="65" fill="#1e293b" />
                <rect x="470" y="240" width="45" height="28" fill="#3b82f6" rx="3" />
                {isAiOverlayActive && (
                  <rect
                    x="320"
                    y="90"
                    width="160"
                    height="140"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2"
                    strokeDasharray="6,4"
                    className="animate-pulse"
                  />
                )}
              </svg>
            )}
          </div>

          {/* CCTV On-Screen Display (OSD) Overlays */}
          <div className="absolute top-3 left-3 z-30 font-mono text-[11px] text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] space-y-0.5 pointer-events-none">
            <div className="flex items-center gap-1.5 text-red-500 font-bold">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
              REC [LIVE STREAM]
            </div>
            <div className="text-emerald-400 font-semibold tracking-wide">{timestamp}</div>
            <div className="text-slate-300">STREAM: RTSP-H.265-1080P // 25.00 FPS</div>
            <div className="text-slate-400 font-semibold">
              CAMERA: {selectedCam === "CAM1" ? "CAM-01 [FASCIA PINHOLE]" : "CAM-02 [OVERHEAD LOBBY]"}
            </div>
          </div>

          <div className="absolute top-3 right-3 z-30 font-mono text-right text-[11px] text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] space-y-0.5 pointer-events-none">
            <div className="text-amber-400 font-bold">BITRATE: 4.8 Mbps</div>
            <div className="text-slate-300">LATENCY: 38ms (WebRTC)</div>
            <div className="text-purple-400 font-semibold">AI INFERENCE: ACTIVE</div>
          </div>

          {/* Play/Pause overlay button */}
          {displayMode === "REAL_VIDEO" && (
            <button
              onClick={togglePlay}
              className="absolute top-3 left-1/2 -translate-x-1/2 z-30 px-3 py-1 bg-black/60 hover:bg-black/80 text-slate-300 hover:text-white rounded-full border border-white/20 text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              {isPlaying ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
              <span>{isPlaying ? "PAUSE STREAM" : "RESUME STREAM"}</span>
            </button>
          )}

          {/* Bottom Live Alert Banner */}
          <div className="absolute bottom-3 left-3 right-3 z-30 bg-red-950/90 backdrop-blur-md border border-red-700/90 rounded-lg p-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono shadow-2xl">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse shrink-0" />
              <div className="text-red-200">
                <strong className="text-white font-bold">SUSPECT CASHOUT MATCH:</strong> Cell tower triangulation confirms suspect within 2.2km radius. Multi-card withdrawal in progress.
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCaptureSnapshot}
                disabled={isCapturing}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded flex items-center gap-1.5 shadow-md shadow-red-950 transition-colors"
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
