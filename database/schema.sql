-- ============================================================================
-- HEAT LABEL — Sustainable Heat Treatment Management System
-- Normalized Relational Database Schema (MySQL 8.0+)
-- Database: heat_label_db
-- Target SDGs: SDG 7 (Clean Energy), SDG 9 (Industry & Innovation), 
--              SDG 12 (Responsible Consumption), SDG 13 (Climate Action)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS heat_label_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE heat_label_db;

-- ----------------------------------------------------------------------------
-- 1. USERS & ROLES
-- Stores credentials with BCrypt password hashes, system roles, and timestamps.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL COMMENT 'BCrypt salted hash',
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    role ENUM('ADMIN', 'OPERATOR', 'SUSTAINABILITY_AUDITOR') NOT NULL DEFAULT 'OPERATOR',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_role (role),
    INDEX idx_user_username (username)
) ENGINE=InnoDB COMMENT='System operators, managers and admins with role-based access';

-- ----------------------------------------------------------------------------
-- 2. MATERIALS
-- Raw component materials subjected to thermal treatment cycles.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS materials (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    material_code VARCHAR(50) NOT NULL UNIQUE COMMENT 'Unique material identifier e.g. MAT-4140-01',
    name VARCHAR(100) NOT NULL COMMENT 'e.g. Chromium-Molybdenum Alloy Steel',
    grade VARCHAR(50) NOT NULL COMMENT 'e.g. AISI 4140 / 42CrMo4 / SS 316L',
    standard_spec VARCHAR(50) DEFAULT 'ASTM / DIN / ISO' COMMENT 'Metallurgical standard reference',
    batch_number VARCHAR(60) NOT NULL COMMENT 'Supplier or mill melt heat number',
    initial_weight_kg DECIMAL(10, 3) NOT NULL COMMENT 'Gross weight of batch in kg',
    component_description TEXT COMMENT 'Component type, geometry and intended application',
    supplier_name VARCHAR(100) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_material_grade (grade),
    INDEX idx_material_batch (batch_number)
) ENGINE=InnoDB COMMENT='Raw and fabricated metal inventories entering heat treatment cycles';

-- ----------------------------------------------------------------------------
-- 3. TREATMENT BATCHES
-- Core heat-treatment processing runs (furnace recipes, cycle parameters).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS treatment_batches (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    batch_code VARCHAR(50) NOT NULL UNIQUE COMMENT 'e.g. HT-2026-001',
    material_id BIGINT NOT NULL,
    treatment_type ENUM('ANNEALING', 'HARDENING', 'TEMPERING', 'NORMALIZING', 'CARBURIZING', 'STRESS_RELIEVING') NOT NULL,
    furnace_id VARCHAR(50) NOT NULL DEFAULT 'FURNACE-ALPHA-1' COMMENT 'Identifier for furnace chamber',
    furnace_temperature_c DECIMAL(6, 2) NOT NULL COMMENT 'Holding temperature in Celsius (e.g. 850.00)',
    holding_time_minutes INT NOT NULL COMMENT 'Soak duration at peak temperature in minutes',
    cooling_method ENUM('WATER_QUENCH', 'OIL_QUENCH', 'FORCED_AIR_COOL', 'STILL_AIR_COOL', 'FURNACE_COOL', 'POLYMER_QUENCH') NOT NULL,
    start_date DATETIME NOT NULL,
    completion_date DATETIME DEFAULT NULL,
    operator_id BIGINT NOT NULL,
    batch_status ENUM('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'ABORTED', 'UNDER_INSPECTION') NOT NULL DEFAULT 'PLANNED',
    target_hardness_hrc DECIMAL(4, 1) DEFAULT NULL COMMENT 'Target Rockwell C hardness after cycle',
    actual_hardness_hrc DECIMAL(4, 1) DEFAULT NULL COMMENT 'Observed QA Rockwell C hardness',
    process_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_batch_material FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE RESTRICT,
    CONSTRAINT fk_batch_operator FOREIGN KEY (operator_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_batch_status (batch_status),
    INDEX idx_batch_treatment_type (treatment_type),
    INDEX idx_batch_start_date (start_date)
) ENGINE=InnoDB COMMENT='Execution logs of furnace cycles, temperature profiles, and QA results';

-- ----------------------------------------------------------------------------
-- 4. EMISSION FACTORS
-- Standardized carbon emission factors with source traceability and regional scope.
-- Formula: emissions (kg CO2e) = energy consumed * emission factor
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS emission_factors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    energy_source ENUM('ELECTRICITY_GRID', 'ELECTRICITY_RENEWABLE', 'NATURAL_GAS', 'DIESEL_FUEL', 'LPG') NOT NULL,
    emission_factor_value DECIMAL(10, 6) NOT NULL COMMENT 'e.g. 0.710000 kg CO2e per kWh or 2.020000 per m3',
    unit_numerator VARCHAR(20) NOT NULL DEFAULT 'kg CO2e',
    unit_denominator VARCHAR(20) NOT NULL COMMENT 'kWh, m3, liter, MJ',
    geographic_region VARCHAR(100) NOT NULL DEFAULT 'Regional Electrical Grid / National Standard',
    source_documentation VARCHAR(255) NOT NULL COMMENT 'e.g. CEA CO2 Baseline Database v19 / IPCC 2006 / EPA eGRID 2024',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    valid_from DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_ef_source_active (energy_source, is_active)
) ENGINE=InnoDB COMMENT='Documented emission conversion coefficients for verifiable SDG 13 reporting';

-- ----------------------------------------------------------------------------
-- 5. ENERGY RECORDS
-- Records direct energy consumption (electric meters, gas flow meters, fuel tanks).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS energy_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    batch_id BIGINT NOT NULL,
    energy_source ENUM('ELECTRICITY_GRID', 'ELECTRICITY_RENEWABLE', 'NATURAL_GAS', 'DIESEL_FUEL', 'LPG') NOT NULL,
    consumption_value DECIMAL(12, 4) NOT NULL COMMENT 'Actual metered value e.g. 480.5000 kWh',
    unit ENUM('KWH', 'M3', 'LITERS', 'MJ') NOT NULL DEFAULT 'KWH',
    emission_factor_id BIGINT NOT NULL,
    calculated_emissions_kg_co2e DECIMAL(12, 4) NOT NULL COMMENT 'Computed as consumption_value * emission_factor_value',
    energy_per_kg_material DECIMAL(10, 4) NOT NULL COMMENT 'Energy (kWh equiv) divided by material weight processed',
    meter_reading_start DECIMAL(12, 4) DEFAULT NULL,
    meter_reading_end DECIMAL(12, 4) DEFAULT NULL,
    recorded_by BIGINT NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_energy_batch FOREIGN KEY (batch_id) REFERENCES treatment_batches(id) ON DELETE CASCADE,
    CONSTRAINT fk_energy_factor FOREIGN KEY (emission_factor_id) REFERENCES emission_factors(id) ON DELETE RESTRICT,
    CONSTRAINT fk_energy_recorder FOREIGN KEY (recorded_by) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_energy_source (energy_source),
    INDEX idx_energy_batch (batch_id)
) ENGINE=InnoDB COMMENT='Direct energy meter logs linked to specific treatment batches';

-- ----------------------------------------------------------------------------
-- 6. WASTE & REJECTION RECORDS
-- Tracks metallurgical defects, scrap metal generation, and circular recycling.
-- Supports SDG 12: Responsible Consumption and Production.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS waste_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    batch_id BIGINT NOT NULL,
    rejected_parts_count INT NOT NULL DEFAULT 0 COMMENT 'Number of defective pieces',
    total_scrap_weight_kg DECIMAL(10, 3) NOT NULL COMMENT 'Weight of rejected scrap in kg',
    waste_category ENUM('SCALE_OXIDATION', 'THERMAL_CRACKING', 'QUENCH_DISTORTION', 'OVERHEATING_BURNING', 'DECARBURIZATION', 'HARDNESS_NONCONFORMANCE') NOT NULL,
    recycling_status ENUM('RECYCLED_SCRAP_DEALER', 'IN_HOUSE_REMELT', 'RE_HEAT_TREATED', 'LANDFILL_DISPOSAL') NOT NULL DEFAULT 'RECYCLED_SCRAP_DEALER',
    recovered_weight_kg DECIMAL(10, 3) NOT NULL DEFAULT 0.000 COMMENT 'Metal successfully diverted back into production/recycling loop',
    disposition_notes TEXT,
    recorded_by BIGINT NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_waste_batch FOREIGN KEY (batch_id) REFERENCES treatment_batches(id) ON DELETE CASCADE,
    CONSTRAINT fk_waste_recorder FOREIGN KEY (recorded_by) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_waste_category (waste_category),
    INDEX idx_waste_recycling (recycling_status)
) ENGINE=InnoDB COMMENT='Scrap audit logs, defect root causes, and material circularity metrics';

-- ----------------------------------------------------------------------------
-- 7. AUDIT LOGS
-- Immutable system operation trace for enterprise governance and academic scrutiny.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT DEFAULT NULL,
    action_type ENUM('LOGIN', 'LOGOUT', 'INSERT', 'UPDATE', 'DELETE', 'CALCULATION', 'CONFIG_CHANGE', 'REPORT_EXPORT') NOT NULL,
    entity_name VARCHAR(60) NOT NULL COMMENT 'e.g. treatment_batches, materials, emission_factors',
    entity_id VARCHAR(60) DEFAULT NULL COMMENT 'Primary key or reference identifier',
    details_json TEXT COMMENT 'Structured details of the change or calculation parameters',
    ip_address VARCHAR(45) DEFAULT '127.0.0.1',
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_audit_action (action_type),
    INDEX idx_audit_entity (entity_name),
    INDEX idx_audit_time (logged_at)
) ENGINE=InnoDB COMMENT='Compliance and security trail for all critical operations';

-- ----------------------------------------------------------------------------
-- 8. SUMMARY VIEWS (FOR FAST REPORTING & DASHBOARD QUERYING)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_batch_sustainability_summary AS
SELECT 
    b.id AS batch_id,
    b.batch_code,
    b.treatment_type,
    b.furnace_temperature_c,
    b.holding_time_minutes,
    b.batch_status,
    b.start_date,
    b.completion_date,
    m.name AS material_name,
    m.grade AS material_grade,
    m.initial_weight_kg AS processed_weight_kg,
    COALESCE(SUM(e.consumption_value), 0.0000) AS total_energy_kwh,
    COALESCE(SUM(e.calculated_emissions_kg_co2e), 0.0000) AS total_emissions_kg_co2e,
    CASE 
        WHEN m.initial_weight_kg > 0 
        THEN ROUND(COALESCE(SUM(e.consumption_value), 0) / m.initial_weight_kg, 4)
        ELSE 0.0000 
    END AS energy_kwh_per_kg,
    COALESCE(SUM(w.total_scrap_weight_kg), 0.000) AS total_scrap_kg,
    COALESCE(SUM(w.recovered_weight_kg), 0.000) AS recovered_scrap_kg,
    CASE 
        WHEN m.initial_weight_kg > 0 
        THEN ROUND((COALESCE(SUM(w.total_scrap_weight_kg), 0) / m.initial_weight_kg) * 100, 2)
        ELSE 0.00 
    END AS waste_rejection_percentage,
    u.full_name AS operator_name
FROM treatment_batches b
JOIN materials m ON b.material_id = m.id
JOIN users u ON b.operator_id = u.id
LEFT JOIN energy_records e ON b.id = e.batch_id
LEFT JOIN waste_records w ON b.id = w.batch_id
GROUP BY 
    b.id, b.batch_code, b.treatment_type, b.furnace_temperature_c, 
    b.holding_time_minutes, b.batch_status, b.start_date, b.completion_date,
    m.name, m.grade, m.initial_weight_kg, u.full_name;
