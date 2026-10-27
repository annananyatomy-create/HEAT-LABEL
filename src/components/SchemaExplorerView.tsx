import React, { useState } from 'react';
import { 
  Database, 
  Layers, 
  Code2, 
  Copy, 
  Check, 
  Table, 
  Key, 
  ShieldCheck, 
  FileCode, 
  Download, 
  ExternalLink,
  ChevronDown,
  Sparkles
} from 'lucide-react';

export const SchemaExplorerView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'tables' | 'architecture' | 'schema_sql' | 'seed_sql' | 'java_tree'>('tables');
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<string>('treatment_batches');

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2500);
  };

  const schemaTables = [
    {
      name: 'users',
      description: 'System operators, managers and admins with BCrypt password hashing',
      columns: [
        { name: 'id', type: 'BIGINT', pk: true, fk: null, nullable: false, comment: 'Primary key (auto_increment)' },
        { name: 'username', type: 'VARCHAR(50)', pk: false, fk: null, nullable: false, comment: 'Unique login credential' },
        { name: 'password_hash', type: 'VARCHAR(255)', pk: false, fk: null, nullable: false, comment: 'BCrypt salted hash' },
        { name: 'full_name', type: 'VARCHAR(100)', pk: false, fk: null, nullable: false, comment: 'Operator full legal name' },
        { name: 'email', type: 'VARCHAR(120)', pk: false, fk: null, nullable: false, comment: 'Unique email address' },
        { name: 'role', type: 'ENUM(ADMIN, OPERATOR, AUDITOR)', pk: false, fk: null, nullable: false, comment: 'Role-based access control' },
        { name: 'is_active', type: 'BOOLEAN', pk: false, fk: null, nullable: false, comment: 'Active status indicator' },
        { name: 'created_at', type: 'TIMESTAMP', pk: false, fk: null, nullable: false, comment: 'Audit record creation timestamp' },
      ],
    },
    {
      name: 'materials',
      description: 'Engineering alloy inventories subjected to thermal cycles',
      columns: [
        { name: 'id', type: 'BIGINT', pk: true, fk: null, nullable: false, comment: 'Primary key' },
        { name: 'material_code', type: 'VARCHAR(50)', pk: false, fk: null, nullable: false, comment: 'Unique material stock code' },
        { name: 'name', type: 'VARCHAR(100)', pk: false, fk: null, nullable: false, comment: 'Metallurgical alloy descriptor' },
        { name: 'grade', type: 'VARCHAR(50)', pk: false, fk: null, nullable: false, comment: 'e.g. AISI 4140, 1045, D2, 316L' },
        { name: 'standard_spec', type: 'VARCHAR(50)', pk: false, fk: null, nullable: true, comment: 'ASTM / DIN / ISO standard' },
        { name: 'batch_number', type: 'VARCHAR(60)', pk: false, fk: null, nullable: false, comment: 'Mill melt heat number' },
        { name: 'initial_weight_kg', type: 'DECIMAL(10,3)', pk: false, fk: null, nullable: false, comment: 'Gross batch weight in kg' },
        { name: 'component_description', type: 'TEXT', pk: false, fk: null, nullable: true, comment: 'Component geometry & application' },
        { name: 'supplier_name', type: 'VARCHAR(100)', pk: false, fk: null, nullable: true, comment: 'Traceable certified supplier' },
      ],
    },
    {
      name: 'treatment_batches',
      description: 'Core furnace cycles, temperature soaking, and cooling parameters',
      columns: [
        { name: 'id', type: 'BIGINT', pk: true, fk: null, nullable: false, comment: 'Primary key' },
        { name: 'batch_code', type: 'VARCHAR(50)', pk: false, fk: null, nullable: false, comment: 'Unique batch ID e.g. HT-2026-001' },
        { name: 'material_id', type: 'BIGINT', pk: false, fk: 'materials(id)', nullable: false, comment: 'FK to materials inventory' },
        { name: 'treatment_type', type: 'ENUM(...)', pk: false, fk: null, nullable: false, comment: 'ANNEALING, HARDENING, TEMPERING, etc.' },
        { name: 'furnace_id', type: 'VARCHAR(50)', pk: false, fk: null, nullable: false, comment: 'Chamber identifier' },
        { name: 'furnace_temperature_c', type: 'DECIMAL(6,2)', pk: false, fk: null, nullable: false, comment: 'Soaking temp in °C' },
        { name: 'holding_time_minutes', type: 'INT', pk: false, fk: null, nullable: false, comment: 'Dwell soak duration at peak' },
        { name: 'cooling_method', type: 'ENUM(...)', pk: false, fk: null, nullable: false, comment: 'WATER, OIL, AIR, FURNACE COOL' },
        { name: 'start_date', type: 'DATETIME', pk: false, fk: null, nullable: false, comment: 'Batch start timestamp' },
        { name: 'completion_date', type: 'DATETIME', pk: false, fk: null, nullable: true, comment: 'Cycle completion timestamp' },
        { name: 'operator_id', type: 'BIGINT', pk: false, fk: 'users(id)', nullable: false, comment: 'FK to technician operator' },
        { name: 'batch_status', type: 'ENUM(...)', pk: false, fk: null, nullable: false, comment: 'PLANNED, IN_PROGRESS, COMPLETED' },
        { name: 'target_hardness_hrc', type: 'DECIMAL(4,1)', pk: false, fk: null, nullable: true, comment: 'Target Rockwell C spec' },
        { name: 'actual_hardness_hrc', type: 'DECIMAL(4,1)', pk: false, fk: null, nullable: true, comment: 'Measured QA hardness' },
      ],
    },
    {
      name: 'emission_factors',
      description: 'Traceable emission coefficients for verifiable SDG 13 carbon calculations',
      columns: [
        { name: 'id', type: 'BIGINT', pk: true, fk: null, nullable: false, comment: 'Primary key' },
        { name: 'energy_source', type: 'ENUM(...)', pk: false, fk: null, nullable: false, comment: 'ELECTRICITY_GRID, SOLAR, GAS, DIESEL' },
        { name: 'emission_factor_value', type: 'DECIMAL(10,6)', pk: false, fk: null, nullable: false, comment: 'e.g. 0.716000 kg CO2e / unit' },
        { name: 'unit_numerator', type: 'VARCHAR(20)', pk: false, fk: null, nullable: false, comment: 'kg CO2e' },
        { name: 'unit_denominator', type: 'VARCHAR(20)', pk: false, fk: null, nullable: false, comment: 'kWh, m3, liter' },
        { name: 'geographic_region', type: 'VARCHAR(100)', pk: false, fk: null, nullable: false, comment: 'National grid or facility boundary' },
        { name: 'source_documentation', type: 'VARCHAR(255)', pk: false, fk: null, nullable: false, comment: 'CEA Baseline v19, IPCC 2006, etc.' },
        { name: 'is_active', type: 'BOOLEAN', pk: false, fk: null, nullable: false, comment: 'Active calculation flag' },
        { name: 'valid_from', type: 'DATE', pk: false, fk: null, nullable: false, comment: 'Regulatory effective date' },
      ],
    },
    {
      name: 'energy_records',
      description: 'Sub-metered electricity and fuel logs with calculated specific energy (kWh/kg)',
      columns: [
        { name: 'id', type: 'BIGINT', pk: true, fk: null, nullable: false, comment: 'Primary key' },
        { name: 'batch_id', type: 'BIGINT', pk: false, fk: 'treatment_batches(id)', nullable: false, comment: 'FK to treatment batch' },
        { name: 'energy_source', type: 'ENUM(...)', pk: false, fk: null, nullable: false, comment: 'Grid, Solar PV, Natural Gas, Diesel' },
        { name: 'consumption_value', type: 'DECIMAL(12,4)', pk: false, fk: null, nullable: false, comment: 'Metered consumption reading' },
        { name: 'unit', type: 'ENUM(KWH, M3, LITERS, MJ)', pk: false, fk: null, nullable: false, comment: 'Physical engineering unit' },
        { name: 'emission_factor_id', type: 'BIGINT', pk: false, fk: 'emission_factors(id)', nullable: false, comment: 'FK to traceable emission factor' },
        { name: 'calculated_emissions_kg_co2e', type: 'DECIMAL(12,4)', pk: false, fk: null, nullable: false, comment: 'Consumption * Factor' },
        { name: 'energy_per_kg_material', type: 'DECIMAL(10,4)', pk: false, fk: null, nullable: false, comment: 'Specific energy intensity (kWh/kg)' },
        { name: 'recorded_by', type: 'BIGINT', pk: false, fk: 'users(id)', nullable: false, comment: 'FK to recording operator' },
      ],
    },
    {
      name: 'waste_records',
      description: 'Scrap weight, metallurgical defect classification, and circular recycling',
      columns: [
        { name: 'id', type: 'BIGINT', pk: true, fk: null, nullable: false, comment: 'Primary key' },
        { name: 'batch_id', type: 'BIGINT', pk: false, fk: 'treatment_batches(id)', nullable: false, comment: 'FK to treatment batch' },
        { name: 'rejected_parts_count', type: 'INT', pk: false, fk: null, nullable: false, comment: 'Count of defective workpieces' },
        { name: 'total_scrap_weight_kg', type: 'DECIMAL(10,3)', pk: false, fk: null, nullable: false, comment: 'Total scrap metal mass' },
        { name: 'waste_category', type: 'ENUM(...)', pk: false, fk: null, nullable: false, comment: 'Oxidation, Cracking, Distortion, etc.' },
        { name: 'recycling_status', type: 'ENUM(...)', pk: false, fk: null, nullable: false, comment: 'Scrap dealer, Re-melt, Re-treated' },
        { name: 'recovered_weight_kg', type: 'DECIMAL(10,3)', pk: false, fk: null, nullable: false, comment: 'Circularity diverted metal mass' },
      ],
    },
    {
      name: 'audit_logs',
      description: 'Immutable security, calculation, and data modification audit trail',
      columns: [
        { name: 'id', type: 'BIGINT', pk: true, fk: null, nullable: false, comment: 'Primary key' },
        { name: 'user_id', type: 'BIGINT', pk: false, fk: 'users(id)', nullable: true, comment: 'FK to acting user' },
        { name: 'action_type', type: 'ENUM(...)', pk: false, fk: null, nullable: false, comment: 'LOGIN, INSERT, UPDATE, CALCULATION' },
        { name: 'entity_name', type: 'VARCHAR(60)', pk: false, fk: null, nullable: false, comment: 'Table or service component modified' },
        { name: 'details_json', type: 'TEXT', pk: false, fk: null, nullable: true, comment: 'JSON payload describing state change' },
        { name: 'logged_at', type: 'TIMESTAMP', pk: false, fk: null, nullable: false, comment: 'Exact server event timestamp' },
      ],
    },
  ];

  const activeTableObj = schemaTables.find((t) => t.name === selectedTable) || schemaTables[2];

  return (
    <div className="space-y-6">
      {/* Stage 1 Confirmation Banner */}
      <div className="bg-white rounded-xl p-5 border border-[#DCE5ED] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1565C0] text-white">
              STAGE 1 DELIVERABLE
            </span>
            <span className="text-xs text-[#2E7D32] font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              Architecture Confirmed & Normalized MySQL Schema Created
            </span>
          </div>
          <h2 className="text-xl font-black text-[#0B1F3A]">
            HEAT LABEL Relational Database & Architecture Specification
          </h2>
          <p className="text-xs text-[#64748B] mt-1 max-w-3xl">
            Normalized 3-tier architecture with MySQL 8.0, JDBC PreparedStatements, BCrypt security, 
            DECIMAL precision for thermal calculations, and documented UN SDG 7, 9, 12, 13 traceability.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveSubTab('schema_sql')}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#F4F8FB] hover:bg-slate-200 text-[#0B1F3A] border border-[#DCE5ED] rounded-lg text-xs font-semibold transition-colors"
          >
            <FileCode className="w-3.5 h-3.5 text-[#1565C0]" />
            <span>schema.sql</span>
          </button>
          <button
            onClick={() => setActiveSubTab('seed_sql')}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#F4F8FB] hover:bg-slate-200 text-[#0B1F3A] border border-[#DCE5ED] rounded-lg text-xs font-semibold transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span>seed_data.sql</span>
          </button>
        </div>
      </div>

      {/* Sub navigation pills */}
      <div className="flex items-center gap-2 border-b border-[#DCE5ED] pb-3 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab('tables')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
            activeSubTab === 'tables'
              ? 'bg-[#1565C0] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#0B1F3A] hover:bg-white'
          }`}
        >
          <Table className="w-4 h-4" />
          <span>Interactive Table Browser</span>
        </button>

        <button
          onClick={() => setActiveSubTab('architecture')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
            activeSubTab === 'architecture'
              ? 'bg-[#1565C0] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#0B1F3A] hover:bg-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>3-Tier Architecture & Formulas</span>
        </button>

        <button
          onClick={() => setActiveSubTab('java_tree')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
            activeSubTab === 'java_tree'
              ? 'bg-[#1565C0] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#0B1F3A] hover:bg-white'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Java Maven Project Structure</span>
        </button>

        <button
          onClick={() => setActiveSubTab('schema_sql')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
            activeSubTab === 'schema_sql'
              ? 'bg-[#1565C0] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#0B1F3A] hover:bg-white'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>DDL Script (schema.sql)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('seed_sql')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
            activeSubTab === 'seed_sql'
              ? 'bg-[#1565C0] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#0B1F3A] hover:bg-white'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Seed Data Script (seed_data.sql)</span>
        </button>
      </div>

      {/* SUB-TAB 1: Interactive Table Browser */}
      {activeSubTab === 'tables' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Table List Column */}
          <div className="bg-white rounded-xl border border-[#DCE5ED] shadow-xs p-3 space-y-1">
            <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#64748B] border-b border-[#DCE5ED] mb-2 flex items-center justify-between">
              <span>Database Tables (7)</span>
              <span className="font-mono text-[10px] text-[#2E7D32]">InnoDB</span>
            </div>
            {schemaTables.map((t) => (
              <button
                key={t.name}
                onClick={() => setSelectedTable(t.name)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
                  selectedTable === t.name
                    ? 'bg-[#1565C0] text-white shadow-xs'
                    : 'text-[#1F2937] hover:bg-[#F4F8FB]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Table className="w-3.5 h-3.5 opacity-70" />
                  <span className="font-mono">{t.name}</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  selectedTable === t.name ? 'bg-white/20' : 'bg-slate-100 text-[#64748B]'
                }`}>
                  {t.columns.length} cols
                </span>
              </button>
            ))}

            <div className="pt-3 mt-3 border-t border-[#DCE5ED] px-3">
              <div className="text-[11px] font-bold text-[#0B1F3A] mb-1">Database Views</div>
              <div className="text-xs font-mono text-[#2E7D32] bg-[#F4F8FB] p-2 rounded border border-[#DCE5ED]">
                v_batch_sustainability_summary
              </div>
            </div>
          </div>

          {/* Table Columns & Metadata Inspector */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-[#DCE5ED] shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#DCE5ED] bg-[#F4F8FB] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-[#0B1F3A]">
                    TABLE: {activeTableObj.name}
                  </span>
                  <span className="text-[10px] bg-[#2E7D32] text-white px-2 py-0.5 rounded-full font-bold">
                    MySQL 8.0 Normalized
                  </span>
                </div>
                <p className="text-xs text-[#64748B] mt-0.5">
                  {activeTableObj.description}
                </p>
              </div>

              <div className="text-xs text-[#64748B] font-mono">
                Engine: <span className="text-[#0B1F3A] font-bold">InnoDB</span> | Charset: <span className="text-[#0B1F3A] font-bold">utf8mb4</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#DCE5ED] bg-white text-[#64748B] font-semibold uppercase tracking-wider">
                    <th className="py-2.5 px-4">Column Name</th>
                    <th className="py-2.5 px-4">SQL Type</th>
                    <th className="py-2.5 px-4">Key Constraints</th>
                    <th className="py-2.5 px-4">Nullable</th>
                    <th className="py-2.5 px-4">Description / Precision Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCE5ED]">
                  {activeTableObj.columns.map((col) => (
                    <tr key={col.name} className="hover:bg-[#F4F8FB]/60 transition-colors">
                      <td className="py-2.5 px-4 font-mono font-bold text-[#0B1F3A]">
                        {col.name}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-[#1565C0] font-medium">
                        {col.type}
                      </td>
                      <td className="py-2.5 px-4">
                        {col.pk ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-amber-100 text-amber-800 border border-amber-300">
                            <Key className="w-3 h-3" /> PRIMARY KEY
                          </span>
                        ) : col.fk ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-blue-100 text-[#1565C0] border border-blue-300">
                            FK → {col.fk}
                          </span>
                        ) : (
                          <span className="text-[#64748B] font-mono text-[11px]">-</span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-[11px]">
                        {col.nullable ? (
                          <span className="text-[#64748B]">YES</span>
                        ) : (
                          <span className="text-[#2E7D32] font-semibold">NOT NULL</span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-[#1F2937]">
                        {col.comment}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: 3-Tier Architecture & Mathematical Formulas */}
      {activeSubTab === 'architecture' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Architectural Layers Card */}
          <div className="bg-white rounded-xl border border-[#DCE5ED] shadow-xs p-5 space-y-4">
            <h3 className="text-sm font-bold text-[#0B1F3A] flex items-center gap-2 pb-2 border-b border-[#DCE5ED]">
              <Layers className="w-4 h-4 text-[#1565C0]" />
              <span>Layered Architecture Design (Strict Separation of Concerns)</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#F4F8FB] border border-[#DCE5ED] rounded-lg">
                <div className="font-bold text-[#1565C0] flex items-center gap-1.5 mb-1">
                  <span>1. Presentation Layer (Java Swing + FlatLaf + JFreeChart)</span>
                </div>
                <p className="text-[#64748B]">
                  Packaged in <code className="font-mono bg-white px-1 py-0.5 rounded text-[#0B1F3A]">com.heatlabel.ui</code>. 
                  Responsive desktop panels (Dashboard, Materials, Batches, Energy, Carbon Calculator, Waste, Reports, Settings).
                </p>
              </div>

              <div className="p-3 bg-[#F4F8FB] border border-[#DCE5ED] rounded-lg">
                <div className="font-bold text-[#2E7D32] flex items-center gap-1.5 mb-1">
                  <span>2. Business Logic / Service Layer</span>
                </div>
                <p className="text-[#64748B]">
                  Packaged in <code className="font-mono bg-white px-1 py-0.5 rounded text-[#0B1F3A]">com.heatlabel.service</code>. 
                  Strict separation of concerns: AuthService (BCrypt), EnergyService (kWh/kg), CarbonEmissionService (Scope 1/2 formulas), 
                  WasteManagementService (circular recovery rates), and ReportExportService (CSV).
                </p>
              </div>

              <div className="p-3 bg-[#F4F8FB] border border-[#DCE5ED] rounded-lg">
                <div className="font-bold text-[#0B1F3A] flex items-center gap-1.5 mb-1">
                  <span>3. Data Access Layer (DAO & JDBC)</span>
                </div>
                <p className="text-[#64748B]">
                  Packaged in <code className="font-mono bg-white px-1 py-0.5 rounded text-[#0B1F3A]">com.heatlabel.dao</code>. 
                  100% PreparedStatements (immune to SQL injection), explicit multi-statement transaction management 
                  (<code className="font-mono">setAutoCommit(false)</code>), and Connection pooling.
                </p>
              </div>

              <div className="p-3 bg-[#F4F8FB] border border-[#DCE5ED] rounded-lg">
                <div className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                  <span>4. Relational Persistence Layer (MySQL 8.0)</span>
                </div>
                <p className="text-[#64748B]">
                  Database <code className="font-mono bg-white px-1 py-0.5 rounded text-[#0B1F3A]">heat_label_db</code> with foreign keys, 
                  DECIMAL(12,4) precision for thermal units, and audit trails.
                </p>
              </div>
            </div>
          </div>

          {/* Mathematical Formulations for SDGs */}
          <div className="bg-white rounded-xl border border-[#DCE5ED] shadow-xs p-5 space-y-4">
            <h3 className="text-sm font-bold text-[#0B1F3A] flex items-center gap-2 pb-2 border-b border-[#DCE5ED]">
              <Sparkles className="w-4 h-4 text-[#2E7D32]" />
              <span>Formulas & SDG Calculations</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#F4F8FB] border border-emerald-200 rounded-lg">
                <div className="font-bold text-[#2E7D32] mb-1">
                  SDG 7.3: Specific Energy Consumption ($E_{'{specific}'}$)
                </div>
                <div className="font-mono bg-white p-2 rounded border border-[#DCE5ED] text-[#0B1F3A] my-1">
                  E_specific (kWh/kg) = Total Energy Consumed (kWh) / Material Batch Weight (kg)
                </div>
                <p className="text-[#64748B] text-[11px]">
                  Enables true apples-to-apples furnace thermal efficiency comparison across varying batch sizes.
                </p>
              </div>

              <div className="p-3 bg-[#F4F8FB] border border-blue-200 rounded-lg">
                <div className="font-bold text-[#1565C0] mb-1">
                  SDG 13.2: Estimated Carbon Emissions ($kg\ CO_2e$)
                </div>
                <div className="font-mono bg-white p-2 rounded border border-[#DCE5ED] text-[#0B1F3A] my-1">
                  Emissions (kg CO2e) = Energy Consumed (kWh or m3) × Emission Factor
                </div>
                <p className="text-[#64748B] text-[11px]">
                  Electricity grid (0.716 kg/kWh) and fuel combustion (2.02 kg/m3 natural gas) are calculated separately with cited source baselines.
                </p>
              </div>

              <div className="p-3 bg-[#F4F8FB] border border-amber-200 rounded-lg">
                <div className="font-bold text-amber-800 mb-1">
                  SDG 12.5: Scrap Rejection & Circular Recovery Rates (%)
                </div>
                <div className="font-mono bg-white p-2 rounded border border-[#DCE5ED] text-[#0B1F3A] my-1">
                  Rejection Rate (%) = (Total Scrap Weight / Initial Batch Weight) × 100
                  Circularity (%) = (Diverted/Recycled Metal / Total Scrap Weight) × 100
                </div>
                <p className="text-[#64748B] text-[11px]">
                  Tracks metal pieces diverted back to induction remelt or certified scrap recovery rather than landfill.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Java Maven Project Structure */}
      {activeSubTab === 'java_tree' && (
        <div className="bg-white rounded-xl border border-[#DCE5ED] shadow-xs p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#DCE5ED] mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#0B1F3A] flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#1565C0]" />
                <span>Maven Project Architecture & Directory Layout</span>
              </h3>
              <p className="text-xs text-[#64748B]">
                Complies with standard Maven conventions (<code className="font-mono">pom.xml</code>, Java 17+, JFreeChart, FlatLaf, JDBC)
              </p>
            </div>
            <div className="text-xs font-mono text-[#1565C0] bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
              heat-label-management-system:1.0.0
            </div>
          </div>

          <div className="font-mono text-xs bg-[#0B1F3A] text-slate-200 p-4 rounded-lg overflow-x-auto space-y-1">
            <div className="text-emerald-400 font-bold">heat-label-management-system/</div>
            <div className="text-slate-400 pl-4">├── pom.xml                                <span className="text-slate-500"># Maven build configuration with MySQL, JFreeChart, FlatLaf, BCrypt</span></div>
            <div className="text-slate-400 pl-4">├── database/</div>
            <div className="text-slate-300 pl-8">│   ├── schema.sql                         <span className="text-emerald-400"># DDL for heat_label_db (7 tables + view)</span></div>
            <div className="text-slate-300 pl-8">│   ├── seed_data.sql                      <span className="text-emerald-400"># Realistic industrial seed records</span></div>
            <div className="text-slate-300 pl-8">│   └── README.md                          <span className="text-slate-500"># MySQL setup & Docker instructions</span></div>
            <div className="text-slate-400 pl-4">└── src/</div>
            <div className="text-slate-400 pl-8">    ├── main/</div>
            <div className="text-slate-400 pl-12">    │   ├── java/com/heatlabel/</div>
            <div className="text-blue-300 pl-16">    │   │   ├── App.java                  <span className="text-slate-500"># Application entry point with FlatLaf initialization</span></div>
            <div className="text-blue-300 pl-16">    │   │   ├── config/</div>
            <div className="text-slate-300 pl-20">    │   │   │   ├── DatabaseConfig.java   <span className="text-slate-500"># JDBC connection manager & env variable resolver</span></div>
            <div className="text-slate-300 pl-20">    │   │   │   └── AppConstants.java     <span className="text-slate-500"># Palettes (#1565C0, #2E7D32), SDG definitions</span></div>
            <div className="text-blue-300 pl-16">    │   │   ├── model/</div>
            <div className="text-slate-300 pl-20">    │   │   │   ├── User.java</div>
            <div className="text-slate-300 pl-20">    │   │   │   ├── Material.java</div>
            <div className="text-slate-300 pl-20">    │   │   │   ├── TreatmentBatch.java</div>
            <div className="text-slate-300 pl-20">    │   │   │   ├── EnergyRecord.java</div>
            <div className="text-slate-300 pl-20">    │   │   │   ├── EmissionFactor.java</div>
            <div className="text-slate-300 pl-20">    │   │   │   ├── WasteRecord.java</div>
            <div className="text-slate-300 pl-20">    │   │   │   └── AuditLog.java</div>
            <div className="text-blue-300 pl-16">    │   │   ├── dao/</div>
            <div className="text-slate-300 pl-20">    │   │   │   ├── BaseDAO.java          <span className="text-slate-500"># Generic CRUD interface with JDBC</span></div>
            <div className="text-slate-300 pl-20">    │   │   │   ├── UserDAO.java</div>
            <div className="text-slate-300 pl-20">    │   │   │   ├── MaterialDAO.java</div>
            <div className="text-slate-300 pl-20">    │   │   │   ├── TreatmentBatchDAO.java</div>
            <div className="text-slate-300 pl-20">    │   │   │   ├── EnergyRecordDAO.java</div>
            <div className="text-slate-300 pl-20">    │   │   │   ├── EmissionFactorDAO.java</div>
            <div className="text-slate-300 pl-20">    │   │   │   └── WasteRecordDAO.java</div>
            <div className="text-blue-300 pl-16">    │   │   ├── service/</div>
            <div className="text-slate-300 pl-20">    │   │   │   ├── AuthService.java      <span className="text-slate-500"># BCrypt hashing & session validation</span></div>
            <div className="text-slate-300 pl-20">    │   │   │   ├── MaterialService.java</div>
            <div className="text-slate-300 pl-20">    │   │   │   ├── TreatmentBatchService.java</div>
            <div className="text-slate-300 pl-20">    │   │   │   ├── EnergyService.java    <span className="text-slate-500"># kWh/kg specific energy calculations</span></div>
            <div className="text-slate-300 pl-20">    │   │   │   ├── CarbonEmissionService.java <span className="text-slate-500"># Formula: energy * factor</span></div>
            <div className="text-slate-300 pl-20">    │   │   │   ├── WasteManagementService.java</div>
            <div className="text-slate-300 pl-20">    │   │   │   └── ReportExportService.java <span className="text-slate-500"># CSV generation</span></div>
            <div className="text-blue-300 pl-16">    │   │   ├── ui/</div>
            <div className="text-slate-300 pl-20">    │   │   │   ├── MainFrame.java        <span className="text-slate-500"># Main window with sidebar navigation</span></div>
            <div className="text-slate-300 pl-20">    │   │   │   ├── LoginFrame.java       <span className="text-slate-500"># Branded login with HEAT LABEL logo</span></div>
            <div className="text-slate-300 pl-20">    │   │   │   └── panels/               <span className="text-slate-500"># DashboardPanel, MaterialPanel, BatchPanel, etc.</span></div>
            <div className="text-blue-300 pl-16">    │   │   └── util/</div>
            <div className="text-slate-300 pl-20">    │   │       ├── PasswordUtil.java     <span className="text-slate-500"># jBCrypt password verification</span></div>
            <div className="text-slate-300 pl-20">    │   │       ├── ValidationUtil.java   <span className="text-slate-500"># Input checks & error messages</span></div>
            <div className="text-slate-300 pl-20">    │   │       └── CsvExporter.java</div>
            <div className="text-slate-400 pl-12">    │   └── resources/</div>
            <div className="text-slate-300 pl-16">    │       ├── application.properties.example</div>
            <div className="text-slate-300 pl-16">    │       └── logback.xml</div>
            <div className="text-slate-400 pl-8">    └── test/java/com/heatlabel/</div>
            <div className="text-amber-300 pl-16">        ├── CalculationServiceTest.java  <span className="text-slate-500"># JUnit tests for kWh/kg and CO2e formulas</span></div>
            <div className="text-amber-300 pl-16">        └── PasswordUtilTest.java        <span className="text-slate-500"># BCrypt hashing verification tests</span></div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: schema.sql preview with 1-click copy */}
      {activeSubTab === 'schema_sql' && (
        <div className="bg-white rounded-xl border border-[#DCE5ED] shadow-xs p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#DCE5ED] mb-3">
            <div>
              <h3 className="text-sm font-bold text-[#0B1F3A] flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[#1565C0]" />
                <span>database/schema.sql (Complete MySQL 8.0 DDL)</span>
              </h3>
              <p className="text-xs text-[#64748B]">
                Copy and run directly in MySQL Workbench or terminal client
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(`-- HEAT LABEL MySQL Schema
CREATE DATABASE IF NOT EXISTS heat_label_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE heat_label_db;
-- (See database/schema.sql in repository root for full text)`, 'schema')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1565C0] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              {copied === 'schema' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied === 'schema' ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
            </button>
          </div>

          <div className="bg-[#0B1F3A] text-slate-200 p-4 rounded-lg font-mono text-xs overflow-x-auto max-h-[460px] space-y-1">
            <span className="text-emerald-400">-- ============================================================================</span><br />
            <span className="text-emerald-400">-- HEAT LABEL — Sustainable Heat Treatment Management System</span><br />
            <span className="text-emerald-400">-- Normalized Relational Database Schema (MySQL 8.0+)</span><br />
            <span className="text-emerald-400">-- Database: heat_label_db</span><br />
            <span className="text-emerald-400">-- ============================================================================</span><br />
            <br />
            <span className="text-blue-400">CREATE DATABASE IF NOT EXISTS</span> heat_label_db<br />
            &nbsp;&nbsp;&nbsp;&nbsp;CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;<br />
            <br />
            <span className="text-blue-400">USE</span> heat_label_db;<br />
            <br />
            <span className="text-blue-400">CREATE TABLE IF NOT EXISTS</span> users (<br />
            &nbsp;&nbsp;&nbsp;&nbsp;id BIGINT AUTO_INCREMENT PRIMARY KEY,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;username VARCHAR(50) NOT NULL UNIQUE,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;password_hash VARCHAR(255) NOT NULL COMMENT 'BCrypt salted hash',<br />
            &nbsp;&nbsp;&nbsp;&nbsp;full_name VARCHAR(100) NOT NULL,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;email VARCHAR(120) NOT NULL UNIQUE,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;role ENUM('ADMIN', 'OPERATOR', 'SUSTAINABILITY_AUDITOR') NOT NULL DEFAULT 'OPERATOR',<br />
            &nbsp;&nbsp;&nbsp;&nbsp;is_active BOOLEAN NOT NULL DEFAULT TRUE,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP<br />
            );<br />
            <br />
            <span className="text-blue-400">CREATE TABLE IF NOT EXISTS</span> materials (<br />
            &nbsp;&nbsp;&nbsp;&nbsp;id BIGINT AUTO_INCREMENT PRIMARY KEY,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;material_code VARCHAR(50) NOT NULL UNIQUE,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;name VARCHAR(100) NOT NULL,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;grade VARCHAR(50) NOT NULL,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;standard_spec VARCHAR(50) DEFAULT 'ASTM / DIN / ISO',<br />
            &nbsp;&nbsp;&nbsp;&nbsp;batch_number VARCHAR(60) NOT NULL,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;initial_weight_kg DECIMAL(10, 3) NOT NULL,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;component_description TEXT,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;supplier_name VARCHAR(100)<br />
            );<br />
            <br />
            <span className="text-blue-400">CREATE TABLE IF NOT EXISTS</span> treatment_batches (<br />
            &nbsp;&nbsp;&nbsp;&nbsp;id BIGINT AUTO_INCREMENT PRIMARY KEY,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;batch_code VARCHAR(50) NOT NULL UNIQUE,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;material_id BIGINT NOT NULL,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;treatment_type ENUM('ANNEALING', 'HARDENING', 'TEMPERING', 'NORMALIZING', 'CARBURIZING', 'STRESS_RELIEVING') NOT NULL,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;furnace_id VARCHAR(50) NOT NULL DEFAULT 'FURNACE-ALPHA-1',<br />
            &nbsp;&nbsp;&nbsp;&nbsp;furnace_temperature_c DECIMAL(6, 2) NOT NULL,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;holding_time_minutes INT NOT NULL,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;cooling_method ENUM('WATER_QUENCH', 'OIL_QUENCH', 'FORCED_AIR_COOL', 'STILL_AIR_COOL', 'FURNACE_COOL', 'POLYMER_QUENCH') NOT NULL,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;start_date DATETIME NOT NULL,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;completion_date DATETIME DEFAULT NULL,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;operator_id BIGINT NOT NULL,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;batch_status ENUM('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'ABORTED', 'UNDER_INSPECTION') NOT NULL DEFAULT 'PLANNED',<br />
            &nbsp;&nbsp;&nbsp;&nbsp;CONSTRAINT fk_batch_material FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE RESTRICT,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;CONSTRAINT fk_batch_operator FOREIGN KEY (operator_id) REFERENCES users(id) ON DELETE RESTRICT<br />
            );<br />
            <br />
            <span className="text-slate-400">-- (Full SQL schema with energy_records, waste_records, emission_factors, audit_logs and views is written in file /database/schema.sql)</span>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: seed_data.sql preview */}
      {activeSubTab === 'seed_sql' && (
        <div className="bg-white rounded-xl border border-[#DCE5ED] shadow-xs p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#DCE5ED] mb-3">
            <div>
              <h3 className="text-sm font-bold text-[#0B1F3A] flex items-center gap-2">
                <Database className="w-4 h-4 text-[#2E7D32]" />
                <span>database/seed_data.sql (Demonstration Dataset)</span>
              </h3>
              <p className="text-xs text-[#64748B]">
                Populates users, materials, heat cycles, energy submeters, scrap defects, and emissions
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(`USE heat_label_db;\n-- Seed script stored in /database/seed_data.sql`, 'seed')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2E7D32] hover:bg-green-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              {copied === 'seed' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied === 'seed' ? 'Copied Seed SQL!' : 'Copy Seed SQL'}</span>
            </button>
          </div>

          <div className="bg-[#0B1F3A] text-slate-200 p-4 rounded-lg font-mono text-xs overflow-x-auto max-h-[460px] space-y-1">
            <span className="text-emerald-400">-- Seed Users with Salted BCrypt Passwords:</span><br />
            <span className="text-blue-400">INSERT INTO</span> users (id, username, password_hash, full_name, email, role) <span className="text-blue-400">VALUES</span><br />
            (1, 'admin', '$2a$10$wT37tVptY7J6jLd85ZgJce6oB7f95zXo11F85q7y3R8o23n0ZzP4.', 'Dr. Rajesh Sharma', 'admin@heatlabel.org', 'ADMIN'),<br />
            (2, 'operator1', '$2a$10$tZ3U6vWvB8D7GkE5J5C1ee42k68Z.N48Y3c51Ww9VbA1K5h2J0rK.', 'Kavita Sundaram', 'kavita@heatlabel.org', 'OPERATOR');<br />
            <br />
            <span className="text-emerald-400">-- Standard Emission Factors (SDG 13 Traceability):</span><br />
            <span className="text-blue-400">INSERT INTO</span> emission_factors (id, energy_source, emission_factor_value, unit_numerator, unit_denominator, source_documentation) <span className="text-blue-400">VALUES</span><br />
            (1, 'ELECTRICITY_GRID', 0.716000, 'kg CO2e', 'kWh', 'CEA CO2 Baseline Database v19'),<br />
            (2, 'ELECTRICITY_RENEWABLE', 0.015000, 'kg CO2e', 'kWh', 'IPCC Life Cycle Assessment 2014'),<br />
            (3, 'NATURAL_GAS', 2.020000, 'kg CO2e', 'm3', 'IPCC 2006 Guidelines for National GHG Inventories');<br />
            <br />
            <span className="text-slate-400">-- (See /database/seed_data.sql for full 50+ lines of materials, batches, meter logs, and waste records)</span>
          </div>
        </div>
      )}
    </div>
  );
};
