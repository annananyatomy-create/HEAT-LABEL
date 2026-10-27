# HEAT LABEL — Architecture and Specification Document

**Sustainable Heat Treatment Management System**  
*Built for College Demonstration, Industrial Compliance, and United Nations Sustainable Development Goals (SDGs)*

---

## 1. System Overview and Core Objectives

**HEAT LABEL** is an enterprise-grade industrial desktop management application designed to track, monitor, and optimize thermal metal treatment operations (Annealing, Hardening, Tempering, Normalizing, and Carburizing) while directly driving decarbonization and circularity.

The application integrates four core United Nations SDGs:
1. **SDG 7 (Affordable and Clean Energy - Target 7.3)**: Real-time tracking of specific energy intensity ($kWh/kg$), distinguishing between fossil grid power and on-site renewables.
2. **SDG 9 (Industry, Innovation, and Infrastructure - Target 9.4)**: Modernizing industrial furnace control recipes, soak-time optimization, and metallurgical temperature profiling.
3. **SDG 12 (Responsible Consumption and Production - Target 12.5)**: Defect root-cause categorization, scrap metal reduction, and circular recycling tracing.
4. **SDG 13 (Climate Action - Target 13.2)**: Rigorous carbon greenhouse gas (GHG) calculations ($kg\ CO_2e$) using verifiable, documented emission factors (CEA v19, IPCC 2006, EPA eGRID).

---

## 2. Multi-Tier Architectural Design

```
+---------------------------------------------------------------------------------+
|                               PRESENTATION LAYER                                |
|  Java Swing + FlatLaf Modern Industrial Look-and-Feel + JFreeChart Analytics    |
|  [MainFrame] [LoginDialog] [DashboardPanel] [MaterialPanel] [BatchPanel]        |
|  [EnergyPanel] [EmissionsPanel] [WastePanel] [ReportPanel] [SettingsPanel]      |
+---------------------------------------------------------------------------------+
                                       |
                                       v
+---------------------------------------------------------------------------------+
|                           SERVICE / BUSINESS LOGIC LAYER                        |
|  - AuthService (BCrypt password verification, session, RBAC)                    |
|  - MaterialService (Validation, grade specifications, inventory weights)        |
|  - TreatmentBatchService (Thermal cycle state machine, temp/time checks)        |
|  - EnergyService (kWh/kg specific energy calculations, fuel unit conversion)   |
|  - CarbonEmissionService (Emissions = Energy * EmissionFactor, formula audit)   |
|  - WasteManagementService (Rejection rates %, circular recovery tracking)       |
|  - SustainabilityService (SDG 7, 9, 12, 13 KPI aggregations and benchmarks)     |
|  - ReportExportService (Filtered CSV generation, audit trail logging)           |
+---------------------------------------------------------------------------------+
                                       |
                                       v
+---------------------------------------------------------------------------------+
|                           DATA ACCESS LAYER (DAO)                               |
|  - Generic DAO Interface & JDBC PreparedStatement implementations               |
|  - UserDAO, MaterialDAO, TreatmentBatchDAO, EnergyRecordDAO,                    |
|    EmissionFactorDAO, WasteRecordDAO, AuditLogDAO                               |
|  - Transaction Management (conn.setAutoCommit(false), commit, rollback)         |
|  - Connection Provider (Environment variable or application.properties config) |
+---------------------------------------------------------------------------------+
                                       |
                                       v
+---------------------------------------------------------------------------------+
|                              DATABASE LAYER (MySQL 8.0)                         |
|  Tables: users, materials, treatment_batches, energy_records, waste_records,    |
|          emission_factors, audit_logs                                           |
|  Views:  v_batch_sustainability_summary                                         |
+---------------------------------------------------------------------------------+
```

---

## 3. Mathematical Formulas and Calculation Methodologies

### 3.1 Specific Energy Intensity ($E_{\text{specific}}$)
$$\text{Specific Energy} \left(\frac{\text{kWh}}{\text{kg}}\right) = \frac{\sum E_{\text{consumed}} (\text{kWh})}{M_{\text{initial}} (\text{kg})}$$
*Where fuel sources (e.g. Natural Gas in $m^3$) are converted using standard Net Calorific Value (NCV) factors ($1\ m^3 \text{ Natural Gas} \approx 10.8\ \text{kWh}$).*

### 3.2 Estimated Carbon Greenhouse Gas Emissions ($E_{\text{GHG}}$)
$$\text{Emissions } (\text{kg CO}_2\text{e}) = \sum_{i} \left[ \text{Consumption}_i \times \text{EmissionFactor}_i \right]$$
- **Electricity Grid**: $0.716000\ \text{kg CO}_2\text{e/kWh}$ (CEA India Baseline v19 / regional grid equivalent)
- **Rooftop Solar PV**: $0.015000\ \text{kg CO}_2\text{e/kWh}$ (IPCC Life Cycle Assessment)
- **Natural Gas**: $2.020000\ \text{kg CO}_2\text{e/m}^3$ (IPCC 2006 guidelines)
- **Diesel Fuel**: $2.680000\ \text{kg CO}_2\text{e/liter}$ (GHG Protocol Stationary Combustion)

*Crucial Engineering Rule*: Grid electricity and combustible fuel calculations are kept distinct in database storage and reports to prevent misleading direct energy comparisons.

### 3.3 Material Rejection Rate ($R_{\text{waste}}$)
$$\text{Rejection Rate } (\%) = \left( \frac{\text{Total Scrap Weight (kg)}}{\text{Processed Material Initial Weight (kg)}} \right) \times 100\%$$

### 3.4 Circular Recovery & Recycling Efficiency ($C_{\text{rate}}$)
$$\text{Circularity Rate } (\%) = \left( \frac{\text{Diverted/Recycled Metal (kg)}}{\text{Total Scrap Weight (kg)}} \right) \times 100\%$$

---

## 4. Package Structure

```
com.heatlabel/
│
├── config/
│   ├── DatabaseConfig.java       # JDBC connection manager & env variable resolver
│   └── AppConstants.java         # Color palettes, UI dimensions, version info
│
├── model/
│   ├── User.java                 # User entity with Role enum
│   ├── Material.java             # Metallurgy grade, weight, heat numbers
│   ├── TreatmentBatch.java       # Process cycle, temperatures, soak time
│   ├── EnergyRecord.java         # Energy metered log and kWh/kg
│   ├── EmissionFactor.java       # Conversion factor & source citation
│   ├── WasteRecord.java          # Scrap weight, defect category, circularity
│   ├── AuditLog.java             # Security and compliance audit trail
│   └── SustainabilityReport.java # Aggregated SDG DTO
│
├── dao/
│   ├── BaseDAO.java              # Common CRUD signatures
│   ├── UserDAO.java
│   ├── MaterialDAO.java
│   ├── TreatmentBatchDAO.java
│   ├── EnergyRecordDAO.java
│   ├── EmissionFactorDAO.java
│   ├── WasteRecordDAO.java
│   └── AuditLogDAO.java
│
├── service/
│   ├── AuthService.java          # BCrypt authentication and session state
│   ├── MaterialService.java
│   ├── TreatmentBatchService.java
│   ├── EnergyService.java
│   ├── CarbonEmissionService.java
│   ├── WasteManagementService.java
│   ├── SustainabilityService.java
│   └── ReportExportService.java
│
├── ui/
│   ├── MainFrame.java            # Primary window with modern sidebar navigation
│   ├── LoginFrame.java           # Authentication dialog with HEAT LABEL logo
│   ├── components/               # Custom UI controls: MetricCard, RoundedPanel, Badge
│   ├── panels/
│   │   ├── DashboardPanel.java   # Metric cards, JFreeCharts, recent batches
│   │   ├── MaterialPanel.java    # CRUD table for materials & search
│   │   ├── BatchPanel.java       # Heat treatment batches & recipe wizard
│   │   ├── EnergyPanel.java      # Direct energy meters & kWh/kg logger
│   │   ├── EmissionsPanel.java   # Carbon calculator with formula transparency
│   │   ├── WastePanel.java       # Scrap tracker & circular recovery stats
│   │   ├── ReportsPanel.java     # Daily/Monthly/Yearly reports with CSV export
│   │   ├── SdgAlignmentPanel.java# Dedicated UN SDG 7, 9, 12, 13 breakdown
│   │   └── SettingsPanel.java    # DB config, emission factor modifiers
│
└── util/
    ├── PasswordUtil.java         # BCrypt hashing & validation
    ├── ValidationUtil.java       # Numerical and input validation
    ├── DateUtil.java             # Safe formatting and range parsing
    └── CsvExporter.java          # Clean comma-separated report generator
```

---

## 5. Security & Academic Integrity Standards
1. **SQL Injection Immunity**: 100% of queries use `PreparedStatement` with parameterized placeholders (`?`). No string concatenation in SQL queries.
2. **Credential Safety**: Passwords hashed with salted BCrypt ($2^{10}$ rounds). Database passwords read from environment variables (`HEAT_LABEL_DB_PASSWORD`) or `.gitignored` properties.
3. **Audit Trail**: Every significant create, update, delete, or configuration change writes an immutable audit record to `audit_logs`.
4. **Honest Sustainability Metrics**: No claims of "green superiority" solely on single-factor numbers. Baseline comparisons require equivalent steel grades and metallurgical cycles.
