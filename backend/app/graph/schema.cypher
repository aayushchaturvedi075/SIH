// ==========================================================
// IntelliTrace Neo4j Graph Schema & Constraints (Layer 5)
// ==========================================================

// 1. Constraints for Unique Entity Tokens
CREATE CONSTRAINT unique_victim_token IF NOT EXISTS
FOR (v:Victim) REQUIRE v.token IS UNIQUE;

CREATE CONSTRAINT unique_account_token IF NOT EXISTS
FOR (a:Account) REQUIRE a.token IS UNIQUE;

CREATE CONSTRAINT unique_device_token IF NOT EXISTS
FOR (d:Device) REQUIRE d.token IS UNIQUE;

CREATE CONSTRAINT unique_upi_token IF NOT EXISTS
FOR (u:UPI) REQUIRE u.token IS UNIQUE;

CREATE CONSTRAINT unique_atm_id IF NOT EXISTS
FOR (atm:ATMTerminal) REQUIRE atm.atm_id IS UNIQUE;

// 2. Indexes for High-Speed Traversal
CREATE INDEX index_account_bank IF NOT EXISTS
FOR (a:Account) ON (a.bank);

CREATE INDEX index_account_is_frozen IF NOT EXISTS
FOR (a:Account) ON (a.is_frozen);

CREATE INDEX index_atm_district IF NOT EXISTS
FOR (atm:ATMTerminal) ON (atm.district);

CREATE INDEX index_transfer_timestamp IF NOT EXISTS
FOR ()-[r:TRANSFERRED_TO]-() ON (r.timestamp);

// 3. Node Sample Structure:
// (:Victim {token: "TOK_VICTIM_01", name: "Dr. Arvind Rameshwar", district: "Noida", state: "Uttar Pradesh"})
// (:Account {token: "TOK_MULE_01", bank: "State Bank of India", ifsc: "SBIN0001423", holder_name: "CyberSafe Global", balance: 4250000.0, is_frozen: false, layer: 1})
// (:Device {token: "TOK_IMEI_01", imei: "867543029182736", model: "Android Handset"})
// (:UPI {token: "TOK_UPI_01", vpa: "paytmqr.283910@paytm"})
// (:ATMTerminal {atm_id: "ATM-UP-NOI-042", name: "HDFC Sector 62 E-Lobby", bank: "HDFC Bank", district: "Noida", lat: 28.628, lng: 77.3649})
