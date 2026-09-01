export interface CaseRecord {
  id: string;
  ncrpId: string;
  acknowledgementNo: string;
  category: string;
  subCategory: string;
  reportedDate: string;
  victimName: string;
  victimPhone: string;
  victimState: string;
  victimDistrict: string;
  totalLoss: number;
  blockedAmount: number;
  recoveryRate: number;
  status: "CRITICAL_TRIAGE" | "UNDER_INVESTIGATION" | "DISPATCHED" | "RESOLVED" | "FROZEN";
  suspectAccount: string;
  suspectBank: string;
  suspectIfsc: string;
  suspectUpi: string;
  suspectImei: string;
  suspectPhone: string;
  suspectIp: string;
  riskScore: number;
  cashOutLikelihood: number;
  timeToWithdrawMin: number;
  predictedAtmId: string;
  predictedAtmName: string;
  predictedDistrict: string;
}

export interface AtmHotspot {
  id: string;
  name: string;
  bank: string;
  district: string;
  address: string;
  lat: number;
  lng: number;
  riskLevel: "CRITICAL" | "HIGH" | "MEDIUM" | "ELEVATED";
  predictedCashOutAmount: number;
  estimatedWindowMin: number;
  probability: number;
  nearbyPoliceStation: string;
  stationDistanceKm: number;
  assignedPatrol: string;
  activeDispatches: number;
  muleSyndicateRef: string;
}

export interface AlertRecord {
  id: string;
  timestamp: string;
  type: "CASH_OUT_IMMINENT" | "RAPID_LAYERING" | "MULE_CLUSTER_ACTIVE" | "HIGH_VALUE_FRAUD" | "CROSS_STATE_HOP";
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  caseId: string;
  title: string;
  description: string;
  sourceBank: string;
  targetAccount: string;
  amount: number;
  status: "NEW" | "ACKNOWLEDGED" | "DISPATCHED" | "FROZEN" | "DISMISSED";
  confidenceScore: number;
  targetLocation: string;
}

export interface MuleNode {
  id: string;
  label: string;
  type: "PRIMARY_ACCUSED" | "LAYER_1_MULE" | "LAYER_2_MULE" | "LAYER_3_MULE" | "ATM_POINT" | "CRYPTO_OFFRAMP";
  accountNo: string;
  bank: string;
  holderName: string;
  balance: number;
  frozen: boolean;
  cluster: string;
  inflow: number;
  outflow: number;
  hops: number;
  geoDistrict: string;
  linkedComplaints: number;
  phone: string;
  imei: string;
}

export interface NetworkEdge {
  from: string;
  to: string;
  amount: number;
  timestamp: string;
  method: "IMPS" | "NEFT" | "RTGS" | "UPI" | "ATM_CASH";
  status: "FROZEN" | "TRANSFERRED" | "PENDING";
}

export const MOCK_CASES: CaseRecord[] = [
  {
    id: "CASE-2026-9812",
    ncrpId: "NCRP-DEMO-894321",
    acknowledgementNo: "202609019842100",
    category: "Financial Fraud",
    subCategory: "Digital Arrest / Sextortion / CBI Impersonation",
    reportedDate: "2026-09-01 19:42:15 IST",
    victimName: "Dr. Arvind Rameshwar",
    victimPhone: "9871234567",
    victimState: "Uttar Pradesh",
    victimDistrict: "Gautam Buddha Nagar (Noida)",
    totalLoss: 4250000,
    blockedAmount: 3100000,
    recoveryRate: 72.9,
    status: "CRITICAL_TRIAGE",
    suspectAccount: "918230918234",
    suspectBank: "State Bank of India",
    suspectIfsc: "SBIN0001423",
    suspectUpi: "paytmqr.283910@paytm",
    suspectImei: "867543029182736",
    suspectPhone: "919876543210",
    suspectIp: "103.212.45.89",
    riskScore: 94,
    cashOutLikelihood: 89,
    timeToWithdrawMin: 18,
    predictedAtmId: "ATM-UP-NOI-042",
    predictedAtmName: "HDFC Sector 62 E-Lobby",
    predictedDistrict: "Noida Sector 62",
  },
  {
    id: "CASE-2026-9813",
    ncrpId: "NCRP-DEMO-894322",
    acknowledgementNo: "202609019842101",
    category: "Financial Fraud",
    subCategory: "Part-Time Job / Telegram Task Scam",
    reportedDate: "2026-09-01 19:30:00 IST",
    victimName: "Priya Sundaram",
    victimPhone: "9845012345",
    victimState: "Karnataka",
    victimDistrict: "Bengaluru Urban",
    totalLoss: 1850000,
    blockedAmount: 1400000,
    recoveryRate: 75.6,
    status: "DISPATCHED",
    suspectAccount: "501004928172",
    suspectBank: "HDFC Bank",
    suspectIfsc: "HDFC0000128",
    suspectUpi: "rapidtask88@icici",
    suspectImei: "359871029384756",
    suspectPhone: "918765432109",
    suspectIp: "45.118.67.12",
    riskScore: 88,
    cashOutLikelihood: 82,
    timeToWithdrawMin: 32,
    predictedAtmId: "ATM-KA-BLR-109",
    predictedAtmName: "SBI ATM Koramangala 5th Block",
    predictedDistrict: "Bengaluru",
  },
  {
    id: "CASE-2026-9814",
    ncrpId: "NCRP-DEMO-894323",
    acknowledgementNo: "202609019842102",
    category: "Investment Fraud",
    subCategory: "Fake Institutional Trading App (FII Quota)",
    reportedDate: "2026-09-01 18:15:20 IST",
    victimName: "Rajeshwar Mittal",
    victimPhone: "9811098765",
    victimState: "Maharashtra",
    victimDistrict: "Mumbai Suburban",
    totalLoss: 9500000,
    blockedAmount: 4800000,
    recoveryRate: 50.5,
    status: "UNDER_INVESTIGATION",
    suspectAccount: "100293847561",
    suspectBank: "ICICI Bank",
    suspectIfsc: "ICIC0006281",
    suspectUpi: "apexcapital.fii@axl",
    suspectImei: "869102938475610",
    suspectPhone: "917654321098",
    suspectIp: "185.220.101.5",
    riskScore: 96,
    cashOutLikelihood: 95,
    timeToWithdrawMin: 12,
    predictedAtmId: "ATM-MH-MUM-018",
    predictedAtmName: "Axis Bank ATM Andheri East",
    predictedDistrict: "Mumbai",
  },
  {
    id: "CASE-2026-9815",
    ncrpId: "NCRP-DEMO-894324",
    acknowledgementNo: "202609019842103",
    category: "Loan Fraud",
    subCategory: "Instant Chinese Lending App Extortion",
    reportedDate: "2026-09-01 17:50:11 IST",
    victimName: "Deepak Kumar Sinha",
    victimPhone: "9431098765",
    victimState: "Bihar",
    victimDistrict: "Patna",
    totalLoss: 620000,
    blockedAmount: 510000,
    recoveryRate: 82.2,
    status: "FROZEN",
    suspectAccount: "330918273645",
    suspectBank: "Punjab National Bank",
    suspectIfsc: "PUNB0182700",
    suspectUpi: "speedcash.settle@ybl",
    suspectImei: "358910293847123",
    suspectPhone: "919123456780",
    suspectIp: "103.45.12.90",
    riskScore: 74,
    cashOutLikelihood: 45,
    timeToWithdrawMin: 140,
    predictedAtmId: "ATM-BR-PAT-004",
    predictedAtmName: "PNB Kankarbagh Main ATM",
    predictedDistrict: "Patna",
  }
];

export const MOCK_ATM_HOTSPOTS: AtmHotspot[] = [
  {
    id: "ATM-UP-NOI-042",
    name: "HDFC Sector 62 E-Lobby",
    bank: "HDFC Bank",
    district: "Gautam Buddha Nagar",
    address: "Plot B-9, Sector 62 Institutional Area, Noida",
    lat: 28.628,
    lng: 77.3649,
    riskLevel: "CRITICAL",
    predictedCashOutAmount: 1850000,
    estimatedWindowMin: 18,
    probability: 91.4,
    nearbyPoliceStation: "Sector 58 Police Station",
    stationDistanceKm: 1.2,
    assignedPatrol: "Cheetah Unit 09",
    activeDispatches: 2,
    muleSyndicateRef: "SYN-NOIDA-MEWRAT-04",
  },
  {
    id: "ATM-UP-GZB-019",
    name: "SBI ATM Mohan Nagar Cross",
    bank: "State Bank of India",
    district: "Ghaziabad",
    address: "Mohan Nagar Commercial Complex, Ghaziabad",
    lat: 28.6811,
    lng: 77.3872,
    riskLevel: "CRITICAL",
    predictedCashOutAmount: 1200000,
    estimatedWindowMin: 25,
    probability: 86.8,
    nearbyPoliceStation: "Sahibabad Police Station",
    stationDistanceKm: 1.8,
    assignedPatrol: "PCR Eagle 14",
    activeDispatches: 1,
    muleSyndicateRef: "SYN-NCR-JAM-11",
  },
  {
    id: "ATM-UP-LKO-078",
    name: "ICICI Hazratganj Metro ATM",
    bank: "ICICI Bank",
    district: "Lucknow",
    address: "Mahatma Gandhi Marg, Hazratganj, Lucknow",
    lat: 26.8528,
    lng: 80.9462,
    riskLevel: "HIGH",
    predictedCashOutAmount: 950000,
    estimatedWindowMin: 44,
    probability: 79.2,
    nearbyPoliceStation: "Hazratganj Police Station",
    stationDistanceKm: 0.6,
    assignedPatrol: "Tiger Beat 03",
    activeDispatches: 1,
    muleSyndicateRef: "SYN-UP-EAST-02",
  },
  {
    id: "ATM-HR-GUR-112",
    name: "Axis Cyber Hub Ground Floor ATM",
    bank: "Axis Bank",
    district: "Gurugram",
    address: "DLF Cyber City, DLF Phase 2, Gurugram",
    lat: 28.4952,
    lng: 77.0892,
    riskLevel: "HIGH",
    predictedCashOutAmount: 2400000,
    estimatedWindowMin: 35,
    probability: 82.5,
    nearbyPoliceStation: "DLF Phase 2 Police Station",
    stationDistanceKm: 1.4,
    assignedPatrol: "Rider Alpha 07",
    activeDispatches: 1,
    muleSyndicateRef: "SYN-MEWRAT-CALL-08",
  },
  {
    id: "ATM-DL-ROH-033",
    name: "PNB Sector 9 Rohini ATM",
    bank: "Punjab National Bank",
    district: "North West Delhi",
    address: "DC Chowk, Sector 9, Rohini, Delhi",
    lat: 28.7144,
    lng: 77.1235,
    riskLevel: "ELEVATED",
    predictedCashOutAmount: 680000,
    estimatedWindowMin: 62,
    probability: 68.0,
    nearbyPoliceStation: "Prashant Vihar Police Station",
    stationDistanceKm: 0.9,
    assignedPatrol: "PCR Unit 21",
    activeDispatches: 0,
    muleSyndicateRef: "SYN-DEL-JAM-03",
  }
];

export const MOCK_ALERTS: AlertRecord[] = [
  {
    id: "ALT-2026-09-8471",
    timestamp: "2 mins ago (19:46:12 IST)",
    type: "CASH_OUT_IMMINENT",
    severity: "CRITICAL",
    caseId: "NCRP-DEMO-894321",
    title: "ATM Cash-Out Imminent: Sector 62 E-Lobby",
    description: "Layer-3 mule account 918230918234 (SBI) balance ₹18.5L transferred via IMPS. High likelihood of ATM withdrawal within 18 minutes.",
    sourceBank: "SBI -> HDFC ATM",
    targetAccount: "918230918234",
    amount: 1850000,
    status: "NEW",
    confidenceScore: 94.2,
    targetLocation: "Noida Sector 62, UP",
  },
  {
    id: "ALT-2026-09-8470",
    timestamp: "11 mins ago (19:37:05 IST)",
    type: "RAPID_LAYERING",
    severity: "CRITICAL",
    caseId: "NCRP-DEMO-894323",
    title: "Rapid Multi-Hop Splitting (5 Accounts)",
    description: "Victim deposit of ₹95,00,000 split into 5 parallel mule streams across ICICI, Axis, Canara within 180 seconds.",
    sourceBank: "ICICI Bank Switch",
    targetAccount: "100293847561 (Cluster)",
    amount: 9500000,
    status: "ACKNOWLEDGED",
    confidenceScore: 97.8,
    targetLocation: "Mumbai / Surat Corridor",
  },
  {
    id: "ALT-2026-09-8469",
    timestamp: "24 mins ago (19:24:18 IST)",
    type: "MULE_CLUSTER_ACTIVE",
    severity: "HIGH",
    caseId: "NCRP-DEMO-894322",
    title: "Known Syndicate Sub-Cluster Activated",
    description: "Mule ring SYN-NCR-JAM-11 receiving multiple UPI micro-transfers totaling ₹14,00,000. Account opened in rural branch with fake KYC.",
    sourceBank: "Multiple UPI Handles",
    targetAccount: "501004928172",
    amount: 1400000,
    status: "DISPATCHED",
    confidenceScore: 89.4,
    targetLocation: "Ghaziabad / Sahibabad",
  },
  {
    id: "ALT-2026-09-8468",
    timestamp: "45 mins ago (19:03:40 IST)",
    type: "CROSS_STATE_HOP",
    severity: "MEDIUM",
    caseId: "NCRP-DEMO-894324",
    title: "Cross-State Routing: Bihar to West Bengal",
    description: "Fund transferred from Patna account to Asansol branch mule. Auto-notified West Bengal Cyber Nodal Cell.",
    sourceBank: "PNB -> Bandhan Bank",
    targetAccount: "330918273645",
    amount: 510000,
    status: "FROZEN",
    confidenceScore: 81.1,
    targetLocation: "Asansol, West Bengal",
  }
];

export const MOCK_MULE_NODES: MuleNode[] = [
  {
    id: "NODE-01",
    label: "Primary Inflow (Victim Dep)",
    type: "PRIMARY_ACCUSED",
    accountNo: "409182736152",
    bank: "State Bank of India",
    holderName: "CyberSafe Global Escrow Pvt Ltd (Shell)",
    balance: 4250000,
    frozen: false,
    cluster: "Alpha Entry",
    inflow: 4250000,
    outflow: 4250000,
    hops: 0,
    geoDistrict: "Noida Sec 18",
    linkedComplaints: 14,
    phone: "919876501928",
    imei: "867543029182736",
  },
  {
    id: "NODE-02",
    label: "Layer-1 Mule A",
    type: "LAYER_1_MULE",
    accountNo: "918230918234",
    bank: "HDFC Bank",
    holderName: "Mukesh Kumar Yadav",
    balance: 1850000,
    frozen: false,
    cluster: "Cluster North-1",
    inflow: 2000000,
    outflow: 150000,
    hops: 1,
    geoDistrict: "Ghaziabad",
    linkedComplaints: 6,
    phone: "918765019283",
    imei: "359871029384756",
  },
  {
    id: "NODE-03",
    label: "Layer-1 Mule B",
    type: "LAYER_1_MULE",
    accountNo: "201928374651",
    bank: "ICICI Bank",
    holderName: "Sunil S. Sharma",
    balance: 1250000,
    frozen: true,
    cluster: "Cluster North-1",
    inflow: 1250000,
    outflow: 0,
    hops: 1,
    geoDistrict: "Meerut",
    linkedComplaints: 4,
    phone: "917654019284",
    imei: "869102938475610",
  },
  {
    id: "NODE-04",
    label: "Layer-1 Mule C (Crypto)",
    type: "CRYPTO_OFFRAMP",
    accountNo: "602938475102",
    bank: "Axis Bank",
    holderName: "P2P Trader Deshraj",
    balance: 1000000,
    frozen: false,
    cluster: "Crypto Exchange P2P",
    inflow: 1000000,
    outflow: 980000,
    hops: 1,
    geoDistrict: "Jaipur",
    linkedComplaints: 22,
    phone: "919123019285",
    imei: "358910293847123",
  },
  {
    id: "NODE-05",
    label: "Layer-2 Cash Point",
    type: "ATM_POINT",
    accountNo: "771029384756",
    bank: "Kotak Mahindra Bank",
    holderName: "ATM Runner Deepak B.",
    balance: 850000,
    frozen: false,
    cluster: "Cash-Out Sector 62",
    inflow: 850000,
    outflow: 0,
    hops: 2,
    geoDistrict: "Noida Sec 62",
    linkedComplaints: 8,
    phone: "918899019286",
    imei: "863321029384799",
  }
];

export const MOCK_NETWORK_EDGES: NetworkEdge[] = [
  { from: "NODE-01", to: "NODE-02", amount: 2000000, timestamp: "19:43:10", method: "IMPS", status: "TRANSFERRED" },
  { from: "NODE-01", to: "NODE-03", amount: 1250000, timestamp: "19:43:45", method: "RTGS", status: "FROZEN" },
  { from: "NODE-01", to: "NODE-04", amount: 1000000, timestamp: "19:44:12", method: "UPI", status: "TRANSFERRED" },
  { from: "NODE-02", to: "NODE-05", amount: 850000, timestamp: "19:45:30", method: "IMPS", status: "PENDING" },
];

export const NATIONAL_STATS = {
  activeThreatLevel: "HIGH (DEFCON 2)",
  totalCases24h: 14820,
  casesChange24h: "+12.4%",
  amountDefrauded24h: 384200000, // ₹38.42 Cr
  amountBlocked24h: 261500000,   // ₹26.15 Cr
  recoverySuccessRate: 68.06,
  atmsUnderSurveillance: 1240,
  activeDispatches: 86,
  interceptedCashOuts24h: 49,
  topStates: [
    { state: "Uttar Pradesh", complaints: 3420, lossCr: 84.5, frozenRate: 71.2, hotAtmCount: 312 },
    { state: "Maharashtra", complaints: 2890, lossCr: 92.1, frozenRate: 66.8, hotAtmCount: 284 },
    { state: "Karnataka", complaints: 1940, lossCr: 54.3, frozenRate: 74.0, hotAtmCount: 168 },
    { state: "Telangana", complaints: 1620, lossCr: 41.8, frozenRate: 78.5, hotAtmCount: 142 },
    { state: "Delhi NCR", complaints: 1580, lossCr: 48.6, frozenRate: 69.4, hotAtmCount: 195 },
    { state: "Gujarat", complaints: 1120, lossCr: 29.4, frozenRate: 64.2, hotAtmCount: 110 },
  ],
  topTargetBanks: [
    { bank: "State Bank of India", muleAccountsDetected: 482, totalVolumeCr: 32.1, freezeEfficiency: "81%" },
    { bank: "HDFC Bank", muleAccountsDetected: 394, totalVolumeCr: 28.4, freezeEfficiency: "89%" },
    { bank: "ICICI Bank", muleAccountsDetected: 310, totalVolumeCr: 22.8, freezeEfficiency: "86%" },
    { bank: "Punjab National Bank", muleAccountsDetected: 245, totalVolumeCr: 15.6, freezeEfficiency: "72%" },
    { bank: "Axis Bank", muleAccountsDetected: 218, totalVolumeCr: 14.2, freezeEfficiency: "79%" },
    { bank: "Kotak Mahindra Bank", muleAccountsDetected: 172, totalVolumeCr: 11.9, freezeEfficiency: "84%" },
  ]
};

export const UP_STATE_DATA = {
  state: "Uttar Pradesh",
  nodalAgency: "UP State Cyber Crime Headquarters, Lucknow",
  stateNodalOfficer: "Shri Amitabh Yash, IPS (ADG Cyber Crime)",
  nodalContact: "+91 522 2209182 / cybercell-up@gov.in",
  districts: [
    { name: "Gautam Buddha Nagar (Noida)", casesToday: 412, lossLakhs: 840, recoveryRate: 78.4, hotAtms: 48, status: "RED_ALERT" },
    { name: "Ghaziabad", casesToday: 318, lossLakhs: 590, recoveryRate: 71.0, hotAtms: 36, status: "RED_ALERT" },
    { name: "Lucknow", casesToday: 295, lossLakhs: 620, recoveryRate: 74.2, hotAtms: 42, status: "HIGH_ALERT" },
    { name: "Kanpur Nagar", casesToday: 210, lossLakhs: 380, recoveryRate: 68.5, hotAtms: 28, status: "ELEVATED" },
    { name: "Varanasi", casesToday: 185, lossLakhs: 310, recoveryRate: 69.1, hotAtms: 22, status: "ELEVATED" },
    { name: "Prayagraj", casesToday: 160, lossLakhs: 240, recoveryRate: 65.4, hotAtms: 18, status: "MONITORING" },
    { name: "Meerut", casesToday: 155, lossLakhs: 290, recoveryRate: 66.8, hotAtms: 24, status: "HIGH_ALERT" },
    { name: "Agra", casesToday: 142, lossLakhs: 230, recoveryRate: 67.2, hotAtms: 19, status: "MONITORING" }
  ]
};

export const DATA_PIPELINE_STATUS = [
  { name: "National Cyber Crime Reporting Portal (NCRP API)", source: "Ministry of Home Affairs", status: "OPERATIONAL", latencyMs: 42, syncRate: "99.98%", recordsIngestedToday: "142,910 events" },
  { name: "NPCI UPI / IMPS Switch Real-time Feed", source: "National Payments Corporation of India", status: "OPERATIONAL", latencyMs: 18, syncRate: "99.99%", recordsIngestedToday: "1,842,000 txns" },
  { name: "CFCFRMS Citizen Financial Cyber Fraud System", source: "RBI / I4C Portal", status: "OPERATIONAL", latencyMs: 55, syncRate: "99.94%", recordsIngestedToday: "34,210 hold requests" },
  { name: "Telecom CDR / IMEI Location Gateway (DoT TAFCOP)", source: "Department of Telecommunications", status: "OPERATIONAL", latencyMs: 84, syncRate: "99.85%", recordsIngestedToday: "89,400 triangulations" },
  { name: "Central KYC Records Registry (CKYC)", source: "CERSAI", status: "OPERATIONAL", latencyMs: 120, syncRate: "99.70%", recordsIngestedToday: "12,800 verification queries" },
  { name: "National Automated Fingerprint / Face Registry (NAFIS)", source: "NCRB", status: "STANDBY", latencyMs: 210, syncRate: "99.40%", recordsIngestedToday: "1,420 biometrics" }
];
