"use client";

import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import {
  Shield,
  AlertTriangle,
  Radio,
  Navigation,
  Clock,
  CheckCircle2,
  Layers,
  ChevronDown,
  Building2,
  Landmark,
  MapPin,
  Flame,
} from "lucide-react";

// Fix Leaflet Default Icon path issues in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom Tactical DivIcons using Tailwind HTML
const createRadarIcon = (risk: "CRITICAL" | "HIGH" | "MEDIUM", name: string) => {
  const color =
    risk === "CRITICAL"
      ? "bg-red-600 border-red-300 ring-red-500 text-white"
      : risk === "HIGH"
      ? "bg-amber-500 border-amber-300 ring-amber-500 text-white"
      : "bg-emerald-600 border-emerald-300 ring-emerald-500 text-white";

  return L.divIcon({
    className: "custom-radar-icon",
    html: `
      <div class="relative flex flex-col items-center group cursor-pointer">
        <div class="relative flex items-center justify-center w-8 h-8">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full ${
            risk === "CRITICAL" ? "bg-red-400 opacity-75" : "bg-amber-400 opacity-50"
          }"></span>
          <span class="relative inline-flex items-center justify-center rounded-full h-7 w-7 ${color} border-2 shadow-2xl font-bold text-[10px]">
            ATM
          </span>
        </div>
        <div class="mt-0.5 px-2 py-0.5 bg-navy-950/95 border border-navy-700 text-white rounded text-[10px] font-mono font-bold whitespace-nowrap shadow-xl">
          ${name}
        </div>
      </div>
    `,
    iconSize: [130, 50],
    iconAnchor: [65, 16],
    popupAnchor: [0, -20],
  });
};

const createPoliceIcon = (name: string) => {
  return L.divIcon({
    className: "custom-police-icon",
    html: `
      <div class="relative flex flex-col items-center group cursor-pointer">
        <div class="relative flex items-center justify-center w-8 h-8">
          <span class="animate-pulse absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-40"></span>
          <span class="relative inline-flex items-center justify-center rounded-full h-7 w-7 bg-blue-600 border-2 border-blue-200 text-white shadow-xl text-xs">
            🚔
          </span>
        </div>
        <div class="mt-0.5 px-1.5 py-0.5 bg-blue-950/95 border border-blue-800 text-blue-200 rounded text-[9px] font-mono font-bold whitespace-nowrap shadow-xl">
          ${name}
        </div>
      </div>
    `,
    iconSize: [120, 50],
    iconAnchor: [60, 16],
    popupAnchor: [0, -20],
  });
};

const createTowerIcon = (label: string) => {
  return L.divIcon({
    className: "custom-tower-icon",
    html: `
      <div class="relative flex flex-col items-center group cursor-pointer">
        <div class="relative flex items-center justify-center w-10 h-10">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-saffron opacity-60"></span>
          <span class="relative inline-flex items-center justify-center rounded-full h-8 w-8 bg-[#ff9933] border-2 border-white text-navy-950 font-bold shadow-2xl text-xs">
            📡
          </span>
        </div>
        <div class="mt-0.5 px-2 py-0.5 bg-saffron text-navy-950 rounded text-[10px] font-mono font-black whitespace-nowrap shadow-2xl">
          ${label}
        </div>
      </div>
    `,
    iconSize: [180, 60],
    iconAnchor: [90, 20],
    popupAnchor: [0, -24],
  });
};

interface ATMItem {
  id: string;
  name: string;
  bank: string;
  lat: number;
  lng: number;
  risk: "CRITICAL" | "HIGH" | "MEDIUM";
  distance: string;
  historicalHits: number;
  confidence: number;
  eta: string;
}

interface PoliceUnit {
  id: string;
  name: string;
  fullName: string;
  station: string;
  lat: number;
  lng: number;
  status: string;
}

interface HotspotZone {
  key: string;
  name: string;
  state: string;
  badge: string;
  description: string;
  center: [number, number];
  zoom: number;
  tower: {
    id: string;
    label: string;
    lat: number;
    lng: number;
    carrier: string;
    imei: string;
    radius: number;
  };
  atms: ATMItem[];
  policeUnits: PoliceUnit[];
}

// 5-6 High-Risk ATM Zones per Metropolitan Cyber Hub
const HOTSPOT_ZONES: Record<string, HotspotZone> = {
  NOIDA: {
    key: "NOIDA",
    name: "Noida / Delhi-NCR",
    state: "Uttar Pradesh",
    badge: "6 ATMs • Active Intercept",
    description: "Sector 62 Institutional & Cyber Corridor",
    center: [28.6280, 77.3649],
    zoom: 14,
    tower: {
      id: "UP-NOI-CELL-901",
      label: "Suspect Cell: Noida Sec 62",
      lat: 28.6280,
      lng: 77.3649,
      carrier: "Airtel 5G NSA (DoT TAFCOP)",
      imei: "867543029182736",
      radius: 2200,
    },
    atms: [
      {
        id: "ATM-UP-NOI-042",
        name: "HDFC Sector 62 E-Lobby",
        bank: "HDFC Bank",
        lat: 28.6280,
        lng: 77.3649,
        risk: "CRITICAL",
        distance: "750 m",
        historicalHits: 14,
        confidence: 94.2,
        eta: "2.4 mins (Cheetah 4)",
      },
      {
        id: "ATM-UP-NOI-019",
        name: "SBI Sector 63 Cross",
        bank: "State Bank of India",
        lat: 28.6315,
        lng: 77.3712,
        risk: "HIGH",
        distance: "1.2 km",
        historicalHits: 9,
        confidence: 81.5,
        eta: "3.8 mins (PCR 12)",
      },
      {
        id: "ATM-UP-GZB-088",
        name: "Axis Mohan Nagar Metro",
        bank: "Axis Bank",
        lat: 28.6411,
        lng: 77.3872,
        risk: "CRITICAL",
        distance: "2.1 km",
        historicalHits: 18,
        confidence: 88.7,
        eta: "5.1 mins (PCR 08)",
      },
      {
        id: "ATM-UP-NOI-005",
        name: "ICICI Sector 58 Commercial",
        bank: "ICICI Bank",
        lat: 28.6180,
        lng: 77.3590,
        risk: "MEDIUM",
        distance: "1.8 km",
        historicalHits: 4,
        confidence: 62.0,
        eta: "4.5 mins (Cheetah 4)",
      },
      {
        id: "ATM-UP-NOI-018",
        name: "PNB Atta Market Sector 18",
        bank: "Punjab National Bank",
        lat: 28.5700,
        lng: 77.3220,
        risk: "HIGH",
        distance: "3.2 km",
        historicalHits: 11,
        confidence: 84.0,
        eta: "6.2 mins (PCR 12)",
      },
      {
        id: "ATM-UP-GZB-034",
        name: "Kotak Indirapuram Habitech",
        bank: "Kotak Mahindra Bank",
        lat: 28.6430,
        lng: 77.3700,
        risk: "CRITICAL",
        distance: "1.9 km",
        historicalHits: 15,
        confidence: 89.1,
        eta: "4.1 mins (Cheetah 4)",
      },
    ],
    policeUnits: [
      {
        id: "BEAT-NOI-CH-04",
        name: "Cheetah 4",
        fullName: "Cheetah 4 (Noida Sec 62 Patrol)",
        station: "PS Sector 58 Noida",
        lat: 28.6250,
        lng: 77.3620,
        status: "ON_PATROL",
      },
      {
        id: "BEAT-NOI-PCR-12",
        name: "PCR 12",
        fullName: "PCR Van 12 (Model Town Cross)",
        station: "PS Sector 63 Noida",
        lat: 28.6350,
        lng: 77.3780,
        status: "STANDBY",
      },
    ],
  },
  MUMBAI: {
    key: "MUMBAI",
    name: "Mumbai (Maharashtra)",
    state: "Maharashtra",
    badge: "6 ATMs • High Volume",
    description: "BKC Financial District & Andheri MIDC",
    center: [19.0657, 72.8680],
    zoom: 14,
    tower: {
      id: "MH-MUM-CELL-402",
      label: "Suspect Cell: BKC G-Block",
      lat: 19.0657,
      lng: 72.8680,
      carrier: "Jio 5G SA (TAFCOP Core)",
      imei: "869104038192834",
      radius: 2000,
    },
    atms: [
      {
        id: "ATM-MH-MUM-101",
        name: "ICICI BKC G-Block E-Lobby",
        bank: "ICICI Bank",
        lat: 19.0657,
        lng: 72.8680,
        risk: "CRITICAL",
        distance: "400 m",
        historicalHits: 22,
        confidence: 95.8,
        eta: "1.8 mins (BKC Cheetah 9)",
      },
      {
        id: "ATM-MH-MUM-102",
        name: "HDFC Andheri East MIDC",
        bank: "HDFC Bank",
        lat: 19.1136,
        lng: 72.8697,
        risk: "CRITICAL",
        distance: "1.8 km",
        historicalHits: 17,
        confidence: 91.2,
        eta: "3.5 mins (Andheri Mobile 3)",
      },
      {
        id: "ATM-MH-MUM-103",
        name: "Axis Lower Parel High Street",
        bank: "Axis Bank",
        lat: 18.9950,
        lng: 72.8250,
        risk: "HIGH",
        distance: "2.4 km",
        historicalHits: 12,
        confidence: 83.4,
        eta: "4.8 mins (BKC Cheetah 9)",
      },
      {
        id: "ATM-MH-MUM-104",
        name: "SBI Dadar TT Circle Hub",
        bank: "State Bank of India",
        lat: 19.0178,
        lng: 72.8478,
        risk: "CRITICAL",
        distance: "2.9 km",
        historicalHits: 19,
        confidence: 89.0,
        eta: "5.2 mins (Andheri Mobile 3)",
      },
      {
        id: "ATM-MH-MUM-105",
        name: "Kotak Borivali West Link Road",
        bank: "Kotak Mahindra Bank",
        lat: 19.2300,
        lng: 72.8550,
        risk: "HIGH",
        distance: "3.5 km",
        historicalHits: 8,
        confidence: 79.5,
        eta: "6.0 mins (BKC Cheetah 9)",
      },
      {
        id: "ATM-MH-MUM-106",
        name: "Bank of Baroda Vashi Sector 17",
        bank: "Bank of Baroda",
        lat: 19.0770,
        lng: 72.9980,
        risk: "MEDIUM",
        distance: "4.1 km",
        historicalHits: 6,
        confidence: 68.0,
        eta: "7.1 mins (Andheri Mobile 3)",
      },
    ],
    policeUnits: [
      {
        id: "BEAT-MUM-CH-09",
        name: "BKC Cheetah 9",
        fullName: "PCR Cheetah 9 (BKC Cyber PS)",
        station: "Bandra Kurla Cyber Thana",
        lat: 19.0680,
        lng: 72.8650,
        status: "ON_PATROL",
      },
      {
        id: "BEAT-MUM-MOB-03",
        name: "Andheri Mob 3",
        fullName: "Andheri Mobile Van 03",
        station: "MIDC Police Station",
        lat: 19.1100,
        lng: 72.8640,
        status: "STANDBY",
      },
    ],
  },
  LUCKNOW: {
    key: "LUCKNOW",
    name: "Lucknow (Uttar Pradesh)",
    state: "Uttar Pradesh",
    badge: "6 ATMs • State Cyber HQ",
    description: "Hazratganj Metro & Gomti Nagar Thana",
    center: [26.8467, 80.9462],
    zoom: 14,
    tower: {
      id: "UP-LKO-CELL-108",
      label: "Suspect Cell: Hazratganj Square",
      lat: 26.8467,
      lng: 80.9462,
      carrier: "Airtel 4G+ Central UP",
      imei: "864192039182745",
      radius: 2500,
    },
    atms: [
      {
        id: "ATM-UP-LKO-201",
        name: "SBI Hazratganj Main Branch",
        bank: "State Bank of India",
        lat: 26.8467,
        lng: 80.9462,
        risk: "CRITICAL",
        distance: "350 m",
        historicalHits: 16,
        confidence: 93.6,
        eta: "1.9 mins (PCR Van 03)",
      },
      {
        id: "ATM-UP-LKO-202",
        name: "HDFC Gomti Nagar Cyber Thana",
        bank: "HDFC Bank",
        lat: 26.8520,
        lng: 80.9920,
        risk: "CRITICAL",
        distance: "1.9 km",
        historicalHits: 13,
        confidence: 90.4,
        eta: "3.2 mins (Gomti Cheetah 01)",
      },
      {
        id: "ATM-UP-LKO-203",
        name: "ICICI Alambagh Commercial",
        bank: "ICICI Bank",
        lat: 26.8180,
        lng: 80.9020,
        risk: "HIGH",
        distance: "2.3 km",
        historicalHits: 10,
        confidence: 82.1,
        eta: "4.5 mins (PCR Van 03)",
      },
      {
        id: "ATM-UP-LKO-204",
        name: "PNB Charbagh Station E-Lobby",
        bank: "Punjab National Bank",
        lat: 26.8320,
        lng: 80.9200,
        risk: "CRITICAL",
        distance: "1.7 km",
        historicalHits: 15,
        confidence: 88.5,
        eta: "3.6 mins (PCR Van 03)",
      },
      {
        id: "ATM-UP-LKO-205",
        name: "Bank of India Chowk Heritage",
        bank: "Bank of India",
        lat: 26.8680,
        lng: 80.9040,
        risk: "HIGH",
        distance: "2.8 km",
        historicalHits: 7,
        confidence: 76.8,
        eta: "5.1 mins (Gomti Cheetah 01)",
      },
      {
        id: "ATM-UP-LKO-206",
        name: "Axis Indira Nagar Sector 14",
        bank: "Axis Bank",
        lat: 26.8850,
        lng: 80.9850,
        risk: "MEDIUM",
        distance: "3.4 km",
        historicalHits: 5,
        confidence: 65.2,
        eta: "6.0 mins (Gomti Cheetah 01)",
      },
    ],
    policeUnits: [
      {
        id: "BEAT-LKO-PCR-03",
        name: "PCR Van 03",
        fullName: "PCR Van 03 (Hazratganj Thana)",
        station: "PS Hazratganj Lucknow",
        lat: 26.8490,
        lng: 80.9420,
        status: "ON_PATROL",
      },
      {
        id: "BEAT-LKO-CH-01",
        name: "Gomti Cheetah 01",
        fullName: "Gomti Nagar Cheetah Patrol 01",
        station: "UP Cyber Crime Thana Gomti Nagar",
        lat: 26.8550,
        lng: 80.9880,
        status: "STANDBY",
      },
    ],
  },
  KOLKATA: {
    key: "KOLKATA",
    name: "Kolkata (West Bengal)",
    state: "West Bengal",
    badge: "6 ATMs • East Zone",
    description: "Salt Lake Sector V & Park Street Corridor",
    center: [22.5726, 88.4312],
    zoom: 14,
    tower: {
      id: "WB-KOL-CELL-509",
      label: "Suspect Cell: Salt Lake Sector V",
      lat: 22.5726,
      lng: 88.4312,
      carrier: "Jio 5G Eastern Grid",
      imei: "861940291823901",
      radius: 2400,
    },
    atms: [
      {
        id: "ATM-WB-KOL-301",
        name: "HDFC Salt Lake Sector V Ring",
        bank: "HDFC Bank",
        lat: 22.5726,
        lng: 88.4312,
        risk: "CRITICAL",
        distance: "500 m",
        historicalHits: 20,
        confidence: 94.7,
        eta: "2.1 mins (Bidhannagar Cheetah)",
      },
      {
        id: "ATM-WB-KOL-302",
        name: "SBI Park Street Camac Corner",
        bank: "State Bank of India",
        lat: 22.5530,
        lng: 88.3520,
        risk: "CRITICAL",
        distance: "2.2 km",
        historicalHits: 16,
        confidence: 92.0,
        eta: "3.8 mins (Lalbazar PCR 14)",
      },
      {
        id: "ATM-WB-KOL-303",
        name: "Axis New Town Action Area 1",
        bank: "Axis Bank",
        lat: 22.5850,
        lng: 88.4720,
        risk: "HIGH",
        distance: "1.9 km",
        historicalHits: 11,
        confidence: 84.3,
        eta: "4.2 mins (Bidhannagar Cheetah)",
      },
      {
        id: "ATM-WB-KOL-304",
        name: "ICICI Howrah Station Outer",
        bank: "ICICI Bank",
        lat: 22.5830,
        lng: 88.3420,
        risk: "CRITICAL",
        distance: "2.6 km",
        historicalHits: 18,
        confidence: 89.2,
        eta: "4.9 mins (Lalbazar PCR 14)",
      },
      {
        id: "ATM-WB-KOL-305",
        name: "PNB Gariahat Market Hub",
        bank: "Punjab National Bank",
        lat: 22.5180,
        lng: 88.3680,
        risk: "HIGH",
        distance: "3.1 km",
        historicalHits: 9,
        confidence: 78.4,
        eta: "5.5 mins (Lalbazar PCR 14)",
      },
      {
        id: "ATM-WB-KOL-306",
        name: "Bank of Baroda Esplanade Metro",
        bank: "Bank of Baroda",
        lat: 22.5640,
        lng: 88.3510,
        risk: "MEDIUM",
        distance: "2.9 km",
        historicalHits: 6,
        confidence: 67.5,
        eta: "5.8 mins (Lalbazar PCR 14)",
      },
    ],
    policeUnits: [
      {
        id: "BEAT-KOL-CH-02",
        name: "Bidhannagar Cheetah",
        fullName: "Bidhannagar Cyber Cheetah 2",
        station: "PS Electronics Complex Salt Lake",
        lat: 22.5750,
        lng: 88.4280,
        status: "ON_PATROL",
      },
      {
        id: "BEAT-KOL-PCR-14",
        name: "Lalbazar PCR 14",
        fullName: "Lalbazar Central Control PCR 14",
        station: "Lalbazar Police HQ",
        lat: 22.5700,
        lng: 88.3550,
        status: "STANDBY",
      },
    ],
  },
  BANGALORE: {
    key: "BANGALORE",
    name: "Bangalore (Karnataka)",
    state: "Karnataka",
    badge: "6 ATMs • Silicon Corridor",
    description: "Koramangala 80ft Rd & Whitefield ITPL",
    center: [12.9352, 77.6245],
    zoom: 14,
    tower: {
      id: "KA-BLR-CELL-701",
      label: "Suspect Cell: Koramangala 80ft Rd",
      lat: 12.9352,
      lng: 77.6245,
      carrier: "Airtel 5G Tech Park Grid",
      imei: "867543029199201",
      radius: 2300,
    },
    atms: [
      {
        id: "ATM-KA-BLR-401",
        name: "SBI Koramangala 80ft Road",
        bank: "State Bank of India",
        lat: 12.9352,
        lng: 77.6245,
        risk: "CRITICAL",
        distance: "450 m",
        historicalHits: 25,
        confidence: 96.1,
        eta: "1.7 mins (Hoysala 18)",
      },
      {
        id: "ATM-KA-BLR-402",
        name: "HDFC Whitefield ITPL Hub",
        bank: "HDFC Bank",
        lat: 12.9860,
        lng: 77.7380,
        risk: "CRITICAL",
        distance: "2.5 km",
        historicalHits: 19,
        confidence: 92.8,
        eta: "3.9 mins (Cyber Hoysala 04)",
      },
      {
        id: "ATM-KA-BLR-403",
        name: "ICICI HSR Layout Sector 1",
        bank: "ICICI Bank",
        lat: 12.9120,
        lng: 77.6440,
        risk: "HIGH",
        distance: "1.8 km",
        historicalHits: 14,
        confidence: 85.2,
        eta: "3.5 mins (Hoysala 18)",
      },
      {
        id: "ATM-KA-BLR-404",
        name: "Axis Indiranagar 100ft Road",
        bank: "Axis Bank",
        lat: 12.9720,
        lng: 77.6410,
        risk: "CRITICAL",
        distance: "2.1 km",
        historicalHits: 17,
        confidence: 90.0,
        eta: "4.1 mins (Cyber Hoysala 04)",
      },
      {
        id: "ATM-KA-BLR-405",
        name: "Kotak Electronic City Phase 1",
        bank: "Kotak Mahindra Bank",
        lat: 12.8450,
        lng: 77.6600,
        risk: "HIGH",
        distance: "3.6 km",
        historicalHits: 10,
        confidence: 81.6,
        eta: "5.4 mins (Hoysala 18)",
      },
      {
        id: "ATM-KA-BLR-406",
        name: "Canara Bank MG Road Metro",
        bank: "Canara Bank",
        lat: 12.9750,
        lng: 77.6090,
        risk: "MEDIUM",
        distance: "2.8 km",
        historicalHits: 7,
        confidence: 69.4,
        eta: "5.0 mins (Cyber Hoysala 04)",
      },
    ],
    policeUnits: [
      {
        id: "BEAT-BLR-HOY-18",
        name: "Hoysala 18",
        fullName: "Hoysala 18 (Koramangala Patrol)",
        station: "PS Koramangala Bengaluru",
        lat: 12.9370,
        lng: 77.6210,
        status: "ON_PATROL",
      },
      {
        id: "BEAT-BLR-HOY-04",
        name: "Cyber Hoysala 04",
        fullName: "Cyber Crime PS Hoysala 04",
        station: "CID Cyber Crime Police Station Bangalore",
        lat: 12.9700,
        lng: 77.6380,
        status: "STANDBY",
      },
    ],
  },
};

// Helper to pan map smoothly on hotspot select
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { animate: true, duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

export default function LeafletMap({
  height = "550px",
  onSelectATM,
}: {
  height?: string;
  onSelectATM?: (atm: ATMItem) => void;
}) {
  const [selectedZoneKey, setSelectedZoneKey] = useState<string>("NOIDA");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [tileTheme, setTileTheme] = useState<"OSM_STANDARD" | "DARK_CANVAS" | "OSM_HOT">("OSM_STANDARD");
  const [dispatchedUnits, setDispatchedUnits] = useState<Record<string, boolean>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeZone = HOTSPOT_ZONES[selectedZoneKey] || HOTSPOT_ZONES.NOIDA;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDispatch = (atmId: string) => {
    setDispatchedUnits((prev) => ({ ...prev, [atmId]: true }));
  };

  return (
    <div className="relative w-full rounded-lg overflow-hidden border border-navy-700 shadow-2xl bg-navy-950">
      {/* Top Left Controls: Tile Selector */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-wrap items-center gap-1.5 bg-navy-900/95 backdrop-blur border border-navy-700 rounded-lg p-1.5 shadow-xl">
        <span className="text-[11px] font-semibold text-slate-300 px-1.5 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-saffron" /> Style:
        </span>
        <button
          onClick={() => setTileTheme("OSM_STANDARD")}
          className={`px-2 py-1 text-xs font-mono font-medium rounded transition-colors ${
            tileTheme === "OSM_STANDARD"
              ? "bg-blue-600 text-white font-bold shadow"
              : "bg-navy-800 text-slate-300 hover:bg-navy-700 hover:text-white"
          }`}
        >
          OpenStreetMap
        </button>
        <button
          onClick={() => setTileTheme("DARK_CANVAS")}
          className={`px-2 py-1 text-xs font-mono font-medium rounded transition-colors ${
            tileTheme === "DARK_CANVAS"
              ? "bg-blue-600 text-white font-bold shadow"
              : "bg-navy-800 text-slate-300 hover:bg-navy-700 hover:text-white"
          }`}
        >
          Dark Canvas
        </button>
        <button
          onClick={() => setTileTheme("OSM_HOT")}
          className={`px-2 py-1 text-xs font-mono font-medium rounded transition-colors ${
            tileTheme === "OSM_HOT"
              ? "bg-blue-600 text-white font-bold shadow"
              : "bg-navy-800 text-slate-300 hover:bg-navy-700 hover:text-white"
          }`}
        >
          High Contrast
        </button>
      </div>

      {/* Top Right: Watermelon / shadcn style dropdown-menu-4 for State & Hotspot Selection */}
      <div ref={dropdownRef} className="absolute top-3 right-3 z-[1000]">
        {/* Dropdown Trigger Button */}
        <button
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="flex items-center gap-2 bg-navy-900/95 hover:bg-navy-800 text-white px-3.5 py-1.5 rounded-lg border border-navy-600 shadow-xl font-mono text-xs font-semibold transition-all group"
        >
          <Navigation className="w-3.5 h-3.5 text-saffron animate-pulse" />
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase text-slate-400 font-sans tracking-wider">Metropolitan Zone</span>
            <span className="text-white font-bold text-xs flex items-center gap-1.5">
              {activeZone.name}
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ml-1 ${
              isDropdownOpen ? "rotate-180 text-saffron" : ""
            }`}
          />
        </button>

        {/* Dropdown Content - matching dropdown-menu-4 pattern */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-72 bg-navy-950/98 backdrop-blur-md rounded-xl border border-navy-700 p-1.5 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-150 z-[1100]">
            <div className="px-2.5 py-1.5 border-b border-navy-800 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-saffron">
                SELECT CRIME INTERCEPT SECTOR
              </span>
            </div>

            {/* Menu Items */}
            <div className="space-y-1">
              {Object.values(HOTSPOT_ZONES).map((zone) => {
                const isSelected = zone.key === selectedZoneKey;
                return (
                  <div
                    key={zone.key}
                    onClick={() => {
                      setSelectedZoneKey(zone.key);
                      setIsDropdownOpen(false);
                    }}
                    className={`flex items-start gap-3 rounded-lg p-2.5 cursor-pointer transition-all ${
                      isSelected
                        ? "bg-navy-800/90 border border-saffron/40 shadow-md text-white"
                        : "hover:bg-navy-900/80 text-slate-300 hover:text-white"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shadow ${
                        isSelected ? "bg-saffron text-navy-950 font-bold" : "bg-navy-800 text-slate-400"
                      }`}
                    >
                      {zone.key === "NOIDA" && "🏢"}
                      {zone.key === "MUMBAI" && "🏛️"}
                      {zone.key === "LUCKNOW" && "📍"}
                      {zone.key === "KOLKATA" && "🌉"}
                      {zone.key === "BANGALORE" && "💻"}
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-sans text-white">{zone.name}</span>
                        {isSelected && (
                          <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" /> ACTIVE
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-sans truncate">{zone.description}</span>
                      <span className="text-[10px] font-mono text-saffron mt-0.5">{zone.badge}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Map Container */}
      <MapContainer
        center={activeZone.center}
        zoom={activeZone.zoom}
        style={{ height, width: "100%" }}
        scrollWheelZoom={true}
      >
        <MapController center={activeZone.center} zoom={activeZone.zoom} />

        {/* 100% Free, Zero API Key Tile Layers */}
        {tileTheme === "OSM_STANDARD" && (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
        )}

        {tileTheme === "DARK_CANVAS" && (
          <>
            <TileLayer
              attribution="Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
              maxZoom={16}
            />
            <TileLayer
              attribution=""
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
              maxZoom={16}
            />
          </>
        )}

        {tileTheme === "OSM_HOT" && (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles by Humanitarian OpenStreetMap Team'
            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            maxZoom={19}
          />
        )}

        {/* Suspect Cell Tower Radius Overlay */}
        <Circle
          center={[activeZone.tower.lat, activeZone.tower.lng]}
          radius={activeZone.tower.radius}
          pathOptions={{
            color: "#ff9933",
            fillColor: "#ff9933",
            fillOpacity: 0.12,
            dashArray: "6, 6",
            weight: 2,
          }}
        />

        {/* Suspect Cell Tower Marker */}
        <Marker
          position={[activeZone.tower.lat, activeZone.tower.lng]}
          icon={createTowerIcon(activeZone.tower.label)}
        >
          <Popup>
            <div className="p-1 min-w-[210px]">
              <div className="flex items-center gap-1.5 text-saffron font-bold text-xs mb-1">
                <Radio className="w-4 h-4" /> Suspect Cell Tower Node
              </div>
              <p className="text-xs text-slate-300">Zone: <span className="font-bold text-white">{activeZone.name}</span></p>
              <p className="text-xs text-slate-300">Tower ID: <span className="font-mono text-white">{activeZone.tower.id}</span></p>
              <p className="text-xs text-slate-300">Carrier: <span className="text-white">{activeZone.tower.carrier}</span></p>
              <p className="text-xs text-slate-300">Active IMEI: <span className="font-mono text-saffron font-bold">{activeZone.tower.imei}</span></p>
              <div className="mt-2 text-[10px] text-slate-400 bg-navy-950 p-1.5 rounded border border-navy-800">
                Suspect Triangulation Radius: {activeZone.tower.radius}m
              </div>
            </div>
          </Popup>
        </Marker>

        {/* Police Beat Patrol Markers for the active city */}
        {activeZone.policeUnits.map((unit) => (
          <Marker key={unit.id} position={[unit.lat, unit.lng]} icon={createPoliceIcon(unit.name)}>
            <Popup>
              <div className="p-1 min-w-[200px]">
                <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xs mb-1">
                  <Shield className="w-4 h-4" /> {unit.fullName}
                </div>
                <p className="text-xs text-slate-300">Status: <span className="text-emerald-400 font-semibold">{unit.status}</span></p>
                <p className="text-xs text-slate-300">Station: <span className="text-white">{unit.station}</span></p>
                <p className="text-[10px] text-slate-400 mt-1">Live GPS Patrol Beacon Connected</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* 5-6 High-Risk ATM Terminals for the active city */}
        {activeZone.atms.map((atm) => (
          <Marker
            key={atm.id}
            position={[atm.lat, atm.lng]}
            icon={createRadarIcon(atm.risk, atm.name.split(" ").slice(0, 3).join(" "))}
            eventHandlers={{
              click: () => onSelectATM && onSelectATM(atm),
            }}
          >
            <Popup>
              <div className="p-1 min-w-[250px]">
                <div className="flex items-center justify-between border-b border-navy-700 pb-1.5 mb-1.5">
                  <span className="font-bold text-xs text-white">{atm.name}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      atm.risk === "CRITICAL"
                        ? "bg-red-950 text-red-400 border border-red-800"
                        : "bg-amber-950 text-amber-400 border border-amber-800"
                    }`}
                  >
                    {atm.confidence}% CONFIDENCE
                  </span>
                </div>
                <div className="space-y-1 text-xs text-slate-300">
                  <p>Bank: <span className="text-white font-medium">{atm.bank}</span></p>
                  <p>Terminal ID: <span className="font-mono text-saffron">{atm.id}</span></p>
                  <p>Distance from Tower: <span className="text-white font-mono">{atm.distance}</span></p>
                  <p>Historical Syndicate Hits: <span className="text-red-400 font-bold">{atm.historicalHits} incidents</span></p>
                  <p className="flex items-center gap-1 text-blue-300">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    Police Intercept: <span className="font-semibold text-white">{atm.eta}</span>
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-navy-800">
                  {dispatchedUnits[atm.id] ? (
                    <div className="flex items-center justify-center gap-1.5 py-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 rounded">
                      <CheckCircle2 className="w-4 h-4" /> Patrol Dispatched
                    </div>
                  ) : (
                    <button
                      onClick={() => handleDispatch(atm.id)}
                      className="w-full py-1.5 px-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-red-950"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" /> Dispatch Beat Unit (Intercept)
                    </button>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
