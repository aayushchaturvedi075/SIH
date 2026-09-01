-- ==========================================================
-- IntelliTrace PostGIS Geospatial Database Schema (Layer 6)
-- ==========================================================

CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. ATM Terminals Table with Geometry Point (SRID 4326 WGS84)
CREATE TABLE IF NOT EXISTS atm_terminals (
    atm_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    bank VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    cctv_active BOOLEAN DEFAULT TRUE,
    daily_cash_volume_inr DOUBLE PRECISION DEFAULT 2500000.0,
    risk_level VARCHAR(20) DEFAULT 'HIGH',
    geom GEOMETRY(Point, 4326)
);

-- GIST Index for high-speed ST_DWithin and ST_Distance searches
CREATE INDEX IF NOT EXISTS idx_atm_terminals_geom ON atm_terminals USING GIST(geom);

-- 2. Police Stations & Beat Patrol Units Table
CREATE TABLE IF NOT EXISTS police_beat_units (
    unit_id VARCHAR(50) PRIMARY KEY,
    station_name VARCHAR(200) NOT NULL,
    patrol_vehicle_type VARCHAR(50) NOT NULL, -- Cheetah Bike, PCR Van
    district VARCHAR(100) NOT NULL,
    current_lat DOUBLE PRECISION NOT NULL,
    current_lng DOUBLE PRECISION NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    geom GEOMETRY(Point, 4326)
);

CREATE INDEX IF NOT EXISTS idx_police_beat_geom ON police_beat_units USING GIST(geom);

-- 3. Pre-populate spatial geometry from coordinates
UPDATE atm_terminals SET geom = ST_SetSRID(ST_MakePoint(lng, lat), 4326) WHERE geom IS NULL;
UPDATE police_beat_units SET geom = ST_SetSRID(ST_MakePoint(current_lng, current_lat), 4326) WHERE geom IS NULL;
