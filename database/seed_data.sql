-- ============================================================================
-- HEAT LABEL — Seed Data Script
-- Populates heat_label_db with realistic industrial sample records
-- Passwords:
--   admin    -> Admin@123    (BCrypt hash below)
--   operator -> Operator@123 (BCrypt hash below)
-- ============================================================================

USE heat_label_db;

-- 1. Insert Initial Users
INSERT INTO users (id, username, password_hash, full_name, email, role, is_active) VALUES
(1, 'admin', '$2a$10$wT37tVptY7J6jLd85ZgJce6oB7f95zXo11F85q7y3R8o23n0ZzP4.', 'Dr. Rajesh Sharma (Plant Director)', 'admin@heatlabel.org', 'ADMIN', 1),
(2, 'operator1', '$2a$10$tZ3U6vWvB8D7GkE5J5C1ee42k68Z.N48Y3c51Ww9VbA1K5h2J0rK.', 'Kavita Sundaram (Thermal Process Engineer)', 'kavita@heatlabel.org', 'OPERATOR', 1),
(3, 'auditor', '$2a$10$xR9U6tWvB8D7GkE5J5C1ee42k68Z.N48Y3c51Ww9VbA1K5h2J0rK.', 'Marcus Vance (ESG & SDG Lead Auditor)', 'marcus@heatlabel.org', 'SUSTAINABILITY_AUDITOR', 1)
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

-- 2. Insert Standard Emission Factors (Documented & Verifiable Sources)
-- SDG 13 Transparency: Clean electricity grid vs fossil fuel combustion factors
INSERT INTO emission_factors (id, energy_source, emission_factor_value, unit_numerator, unit_denominator, geographicRegion, source_documentation, is_active, valid_from, notes) VALUES
(1, 'ELECTRICITY_GRID', 0.716000, 'kg CO2e', 'kWh', 'National Grid Average (Baseline)', 'Central Electricity Authority (CEA) CO2 Baseline Database v19', 1, '2025-01-01', 'Includes grid generation mix and transmission loss factor'),
(2, 'ELECTRICITY_RENEWABLE', 0.015000, 'kg CO2e', 'kWh', 'On-Site Rooftop Solar PV & PPA', 'IPCC Life Cycle Assessment 2014 / NREL Rooftop Solar LCA', 1, '2025-01-01', 'Embodied lifecycle emissions of PV panels only, zero direct combustion'),
(3, 'NATURAL_GAS', 2.020000, 'kg CO2e', 'm3', 'Industrial Pipeline Gas', 'IPCC 2006 Guidelines for National GHG Inventories, Vol 2 Energy', 1, '2025-01-01', 'Net calorific basis: 38.5 MJ/m3, 56.1 t CO2/TJ'),
(4, 'DIESEL_FUEL', 2.680000, 'kg CO2e', 'liter', 'Auxiliary Backup Generator', 'UK DEFRA / GHG Protocol Stationary Combustion Guidance', 1, '2025-01-01', 'High-speed diesel generator direct combustion')
ON DUPLICATE KEY UPDATE emission_factor_value=VALUES(emission_factor_value);

-- 3. Insert Material Inventory Records
INSERT INTO materials (id, material_code, name, grade, standard_spec, batch_number, initial_weight_kg, component_description, supplier_name) VALUES
(1, 'MAT-4140-001', 'Chromium-Molybdenum Alloy Steel', 'AISI 4140', 'ASTM A29 / DIN 42CrMo4', 'HEAT-MELT-8821A', 450.000, 'Automotive transmission transmission gear blanks (40 pcs)', 'Apex Special Steels Ltd.'),
(2, 'MAT-1045-002', 'Medium Carbon Engineering Steel', 'AISI 1045', 'ASTM A108 / EN8D', 'HEAT-MELT-7742B', 620.000, 'Heavy industrial conveyor shaft couplings (15 units)', 'Bharat Heavy Forgings'),
(3, 'MAT-D2-003', 'High-Carbon High-Chromium Cold Work Steel', 'AISI D2', 'ASTM A681 / DIN 1.2379', 'HEAT-MELT-9034C', 180.000, 'Progressive stamping punch and blanking die inserts', 'Bohler Specialty Steels'),
(4, 'MAT-316L-004', 'Austenitic Stainless Steel', 'AISI 316L', 'ASTM A240 / DIN 1.4404', 'HEAT-MELT-6651D', 320.000, 'Chemical plant pressure relief valves and flanges', 'Sandvik Materials Technology'),
(5, 'MAT-8620-005', 'Nickel-Chromium-Molybdenum Case-Hardening Steel', 'AISI 8620', 'ASTM A322 / DIN 21NiCrMo2', 'HEAT-MELT-4439E', 510.000, 'Heavy planetary pinion gear shafts (25 pcs)', 'Apex Special Steels Ltd.')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 4. Insert Treatment Batches (Annealing, Hardening, Tempering, Normalizing, Carburizing)
INSERT INTO treatment_batches (id, batch_code, material_id, treatment_type, furnace_id, furnace_temperature_c, holding_time_minutes, cooling_method, start_date, completion_date, operator_id, batch_status, target_hardness_hrc, actual_hardness_hrc, process_notes) VALUES
(1, 'HT-2026-001', 1, 'HARDENING', 'FURNACE-ALPHA-1', 860.00, 120, 'OIL_QUENCH', '2026-10-18 08:30:00', '2026-10-18 12:45:00', 2, 'COMPLETED', 54.0, 54.5, 'Martensitic transformation achieved. Quench oil temperature maintained at 60°C.'),
(2, 'HT-2026-002', 1, 'TEMPERING', 'FURNACE-ALPHA-2', 540.00, 90, 'STILL_AIR_COOL', '2026-10-18 14:00:00', '2026-10-18 16:30:00', 2, 'COMPLETED', 32.0, 31.8, 'Stress relieved; impact toughness verified via Charpy impact specimens.'),
(3, 'HT-2026-003', 2, 'NORMALIZING', 'FURNACE-BETA-1', 870.00, 150, 'FORCED_AIR_COOL', '2026-10-19 09:15:00', '2026-10-19 14:30:00', 2, 'COMPLETED', 20.0, 21.0, 'Refining coarse ferrite-pearlite grain structure post forging.'),
(4, 'HT-2026-004', 3, 'ANNEALING', 'FURNACE-ALPHA-1', 850.00, 240, 'FURNACE_COOL', '2026-10-20 07:00:00', '2026-10-20 18:00:00', 2, 'COMPLETED', 18.0, 17.5, 'Slow furnace cool at 15°C/hr down to 500°C for spheroidal carbide structure.'),
(5, 'HT-2026-005', 4, 'ANNEALING', 'FURNACE-ALPHA-1', 1050.00, 60, 'WATER_QUENCH', '2026-10-22 10:00:00', '2026-10-22 12:15:00', 2, 'COMPLETED', 15.0, 15.0, 'Solution annealing for carbide dissolution in austenitic matrix.'),
(6, 'HT-2026-006', 5, 'CARBURIZING', 'FURNACE-GAMMA-1', 930.00, 360, 'OIL_QUENCH', '2026-10-23 06:00:00', '2026-10-23 15:00:00', 2, 'COMPLETED', 60.0, 59.8, 'Gas carburizing with 0.95% carbon potential. Case depth 1.2mm.'),
(7, 'HT-2026-007', 1, 'HARDENING', 'FURNACE-ALPHA-1', 860.00, 120, 'OIL_QUENCH', '2026-10-24 08:00:00', NULL, 2, 'IN_PROGRESS', 54.0, NULL, 'Currently soaking at 860°C. Batch undergoing thermocouple verification.')
ON DUPLICATE KEY UPDATE batch_code=VALUES(batch_code);

-- 5. Insert Energy Consumption Records
-- Links energy to batches and calculates kWh/kg and kg CO2e accurately
INSERT INTO energy_records (id, batch_id, energy_source, consumption_value, unit, emission_factor_id, calculated_emissions_kg_co2e, energy_per_kg_material, recorded_by, recorded_at) VALUES
-- Batch 1: 450 kg material, 385.5 kWh electricity grid -> 385.5 * 0.716 = 276.018 kg CO2e, 0.8567 kWh/kg
(1, 1, 'ELECTRICITY_GRID', 385.5000, 'KWH', 1, 276.0180, 0.8567, 2, '2026-10-18 12:50:00'),
-- Batch 2: 450 kg material, 165.0 kWh electricity grid -> 165.0 * 0.716 = 118.140 kg CO2e, 0.3667 kWh/kg
(2, 2, 'ELECTRICITY_GRID', 165.0000, 'KWH', 1, 118.1400, 0.3667, 2, '2026-10-18 16:35:00'),
-- Batch 3: 620 kg material, 520.0 kWh electricity grid -> 520.0 * 0.716 = 372.320 kg CO2e, 0.8387 kWh/kg
(3, 3, 'ELECTRICITY_GRID', 520.0000, 'KWH', 1, 372.3200, 0.8387, 2, '2026-10-19 14:35:00'),
-- Batch 4: 180 kg material, 410.0 kWh electricity solar (renewable PPA) -> 410.0 * 0.015 = 6.150 kg CO2e, 2.2778 kWh/kg
(4, 4, 'ELECTRICITY_RENEWABLE', 410.0000, 'KWH', 2, 6.1500, 2.2778, 2, '2026-10-20 18:10:00'),
-- Batch 5: 320 kg material, 280.0 kWh electricity grid -> 280.0 * 0.716 = 200.480 kg CO2e, 0.8750 kWh/kg
(5, 5, 'ELECTRICITY_GRID', 280.0000, 'KWH', 1, 200.4800, 0.8750, 2, '2026-10-22 12:20:00'),
-- Batch 6: 510 kg material, 48.0 m3 Natural Gas -> 48.0 * 2.020 = 96.960 kg CO2e (equivalent 518.4 kWh -> 1.0165 kWh/kg)
(6, 6, 'NATURAL_GAS', 48.0000, 'M3', 3, 96.9600, 1.0165, 2, '2026-10-23 15:10:00')
ON DUPLICATE KEY UPDATE consumption_value=VALUES(consumption_value);

-- 6. Insert Waste and Scrap Management Records
-- SDG 12: Circular economy metrics, tracking rejected components and recycling
INSERT INTO waste_records (id, batch_id, rejected_parts_count, total_scrap_weight_kg, waste_category, recycling_status, recovered_weight_kg, disposition_notes, recorded_by, recorded_at) VALUES
(1, 1, 1, 11.250, 'QUENCH_DISTORTION', 'RECYCLED_SCRAP_DEALER', 11.250, 'Excessive out-of-round distortion on 1 transmission gear. Sent to ISO-14001 certified metal recycler.', 2, '2026-10-18 13:00:00'),
(2, 2, 0, 0.000, 'SCALE_OXIDATION', 'RECYCLED_SCRAP_DEALER', 0.000, 'Zero defects. Protective nitrogen purge prevented decarburization.', 2, '2026-10-18 16:40:00'),
(3, 3, 2, 24.800, 'SCALE_OXIDATION', 'IN_HOUSE_REMELT', 24.800, 'Excess surface oxidation scale removed via shot blasting. Diverted to foundry induction furnace.', 2, '2026-10-19 15:00:00'),
(4, 4, 1, 8.500, 'THERMAL_CRACKING', 'RECYCLED_SCRAP_DEALER', 8.500, 'Micro-cracking along keyway fillet radius. Sent to high-alloy recovery channel.', 2, '2026-10-20 18:20:00'),
(5, 5, 0, 0.000, 'SCALE_OXIDATION', 'RE_HEAT_TREATED', 0.000, 'All components passed passivity and corrosion resistance tests.', 2, '2026-10-22 12:30:00'),
(6, 6, 1, 20.400, 'HARDNESS_NONCONFORMANCE', 'RE_HEAT_TREATED', 20.400, 'Core hardness 2 HRC below spec. Re-tempering schedule scheduled to salvage workpiece.', 2, '2026-10-23 15:30:00')
ON DUPLICATE KEY UPDATE total_scrap_weight_kg=VALUES(total_scrap_weight_kg);

-- 7. Insert Initial Audit Logs
INSERT INTO audit_logs (id, user_id, action_type, entity_name, entity_id, details_json, ip_address, logged_at) VALUES
(1, 1, 'LOGIN', 'users', '1', '{"message": "Admin user authenticated successfully", "client": "HEAT-LABEL-DESKTOP"}', '192.168.1.10', '2026-10-24 08:00:00'),
(2, 1, 'CONFIG_CHANGE', 'emission_factors', '1', '{"source": "ELECTRICITY_GRID", "value": 0.716, "regulation": "CEA v19"}', '192.168.1.10', '2026-10-24 08:05:00'),
(3, 2, 'INSERT', 'treatment_batches', 'HT-2026-007', '{"treatmentType": "HARDENING", "furnaceTemp": 860.0, "material": "AISI 4140"}', '192.168.1.25', '2026-10-24 08:00:00'),
(4, 2, 'CALCULATION', 'energy_records', '6', '{"batchCode": "HT-2026-006", "calculatedEmissionsKgCO2e": 96.96, "kwhPerKg": 1.0165}', '192.168.1.25', '2026-10-23 15:10:00');
