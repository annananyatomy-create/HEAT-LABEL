import React, { useState } from 'react';
import { 
  CloudFog, 
  Calculator, 
  Settings2, 
  Check, 
  AlertCircle, 
  HelpCircle, 
  ExternalLink, 
  ShieldAlert, 
  Sparkles,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { EmissionFactor, EnergySource, User } from '../types';

interface CarbonCalculatorViewProps {
  emissionFactors: EmissionFactor[];
  onUpdateFactor: (id: number, value: number, sourceDoc: string) => void;
  currentUser: User | null;
}

export const CarbonCalculatorView: React.FC<CarbonCalculatorViewProps> = ({
  emissionFactors,
  onUpdateFactor,
  currentUser,
}) => {
  // Interactive Live Sandbox Calculator
  const [calcSource, setCalcSource] = useState<EnergySource>('ELECTRICITY_GRID');
  const [calcConsumption, setCalcConsumption] = useState<number>(450);
  const [calcBatchWeightKg, setCalcBatchWeightKg] = useState<number>(500);

  // Factor Editing State (Admin only)
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<number>(0.716);
  const [editDoc, setEditDoc] = useState<string>('');

  const activeFactor = emissionFactors.find((f) => f.energySource === calcSource) || emissionFactors[0];
  const calculatedEmissions = calcConsumption * activeFactor.emissionFactorValue;
  const specificCarbonPerKg = calcBatchWeightKg > 0 ? calculatedEmissions / calcBatchWeightKg : 0;

  const handleStartEdit = (f: EmissionFactor) => {
    setEditingId(f.id);
    setEditValue(f.emissionFactorValue);
    setEditDoc(f.sourceDocumentation);
  };

  const handleSaveEdit = (id: number) => {
    onUpdateFactor(id, editValue, editDoc);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-[#DCE5ED] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#2E7D32] text-white">
              MODULE F
            </span>
            <span className="text-xs text-[#1565C0] font-semibold">SDG 13.2: Climate Action</span>
          </div>
          <h2 className="text-xl font-black text-[#0B1F3A] flex items-center gap-2">
            <CloudFog className="w-5 h-5 text-[#2E7D32]" />
            <span>Verifiable Carbon Emission Calculator & Factor Registry</span>
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Transparent greenhouse gas quantification ($kg\ CO_2e$) based on verifiable emission factors.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono bg-emerald-50 text-[#2E7D32] px-2.5 py-1 rounded border border-emerald-200 font-bold">
            GHG Protocol Corporate Standard
          </span>
        </div>
      </div>

      {/* Formula Transparency Box */}
      <div className="bg-[#0B1F3A] text-white rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            <span>Mathematical Calculation Methodology & Audit Rule</span>
          </span>
          <span className="text-[11px] text-slate-300">ISO 14064-1 & IPCC 2006</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            <div className="text-emerald-300 font-bold mb-1">Standard Emissions Formula:</div>
            <div className="font-mono text-sm text-white bg-slate-950 p-2 rounded border border-slate-800">
              Emissions (kg CO₂e) = Energy Consumed × Emission Factor
            </div>
            <p className="text-slate-400 mt-2 text-[11px]">
              Electricity and fuel consumption are quantified separately to account for distinct thermodynamic 
              units ($kWh$ vs $m^3$ vs $liters$) and regional grid generation carbon intensities.
            </p>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            <div className="text-blue-300 font-bold mb-1">Scientific Integrity Rule:</div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              HEAT LABEL does not invent synthetic coefficients. All factors correspond to documented regulatory 
              baselines (e.g. CEA Baseline v19, IPCC LCA). Calculations are declared as estimated greenhouse gas 
              inventories rather than direct stack gas measurements.
            </p>
          </div>
        </div>
      </div>

      {/* Live Interactive Sandbox Calculator */}
      <div className="bg-white rounded-xl p-5 border border-[#DCE5ED] shadow-xs">
        <div className="flex items-center gap-2 pb-3 border-b border-[#DCE5ED] mb-4">
          <Calculator className="w-4 h-4 text-[#1565C0]" />
          <h3 className="text-sm font-bold text-[#0B1F3A]">Interactive Carbon Simulator (What-If Scenario)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs mb-5">
          <div>
            <label className="block font-semibold text-[#1F2937] mb-1">
              Select Energy / Thermal Vector
            </label>
            <select
              value={calcSource}
              onChange={(e) => setCalcSource(e.target.value as EnergySource)}
              className="w-full bg-[#F4F8FB] border border-[#DCE5ED] rounded-lg px-3 py-2 text-[#0B1F3A] font-bold focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
            >
              <option value="ELECTRICITY_GRID">Electricity (Grid Baseline)</option>
              <option value="ELECTRICITY_RENEWABLE">Electricity (Renewable Solar PV)</option>
              <option value="NATURAL_GAS">Natural Gas (Pipeline)</option>
              <option value="DIESEL_FUEL">Diesel Fuel (Backup)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#1F2937] mb-1">
              Consumption Value ({activeFactor.unitDenominator})
            </label>
            <input
              type="number"
              step="1"
              min="1"
              value={calcConsumption}
              onChange={(e) => setCalcConsumption(Number(e.target.value))}
              className="w-full bg-[#F4F8FB] border border-[#DCE5ED] rounded-lg px-3 py-2 text-[#0B1F3A] font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#1F2937] mb-1">
              Batch Processed Weight (kg)
            </label>
            <input
              type="number"
              step="1"
              min="1"
              value={calcBatchWeightKg}
              onChange={(e) => setCalcBatchWeightKg(Number(e.target.value))}
              className="w-full bg-[#F4F8FB] border border-[#DCE5ED] rounded-lg px-3 py-2 text-[#0B1F3A] font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
            />
          </div>
        </div>

        {/* Calculated Result Display */}
        <div className="bg-[#F4F8FB] border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-[#64748B] font-medium">Estimated Greenhouse Gas Footprint</div>
            <div className="text-2xl font-black text-[#2E7D32] font-mono mt-0.5">
              {calculatedEmissions.toFixed(3)} kg CO₂e
            </div>
            <div className="text-[11px] text-[#64748B] mt-1 font-mono">
              = {calcConsumption} {activeFactor.unitDenominator} × {activeFactor.emissionFactorValue} {activeFactor.unitNumerator}/{activeFactor.unitDenominator}
            </div>
          </div>

          <div className="sm:border-l sm:border-[#DCE5ED] sm:pl-6">
            <div className="text-xs text-[#64748B] font-medium">Specific Carbon Intensity</div>
            <div className="text-xl font-bold text-[#0B1F3A] font-mono mt-0.5">
              {specificCarbonPerKg.toFixed(4)} kg CO₂e / kg metal
            </div>
            <div className="text-[11px] text-[#2E7D32] mt-1 font-medium">
              Source: {activeFactor.sourceDocumentation}
            </div>
          </div>
        </div>
      </div>

      {/* Emission Factors Registry Table (Configurable by Admin) */}
      <div className="bg-white rounded-xl border border-[#DCE5ED] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#DCE5ED] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0B1F3A] flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-[#1565C0]" />
              <span>Configurable Emission Factor Registry (table: emission_factors)</span>
            </h3>
            <p className="text-xs text-[#64748B]">
              Admin-authorized factor coefficients with geographic scope and regulatory citations.
            </p>
          </div>

          {currentUser?.role !== 'ADMIN' && (
            <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium">
              Read-Only (Admin Role Required to Edit)
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F4F8FB] text-[#64748B] font-semibold uppercase tracking-wider border-b border-[#DCE5ED]">
                <th className="py-3 px-4">Energy / Fuel Source</th>
                <th className="py-3 px-4">Emission Factor Value</th>
                <th className="py-3 px-4">Units</th>
                <th className="py-3 px-4">Geographic Region</th>
                <th className="py-3 px-4">Source Documentation Citation</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE5ED]">
              {emissionFactors.map((f) => (
                <tr key={f.id} className="hover:bg-[#F4F8FB]/60 transition-colors">
                  <td className="py-3 px-4 font-bold text-[#0B1F3A]">
                    {f.energySource}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#2E7D32]">
                    {editingId === f.id ? (
                      <input
                        type="number"
                        step="0.000001"
                        value={editValue}
                        onChange={(e) => setEditValue(Number(e.target.value))}
                        className="w-28 bg-white border border-[#1565C0] rounded px-2 py-1 text-xs"
                      />
                    ) : (
                      f.emissionFactorValue.toFixed(6)
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#64748B]">
                    {f.unitNumerator} / {f.unitDenominator}
                  </td>
                  <td className="py-3 px-4 text-[#1F2937]">
                    {f.geographicRegion}
                  </td>
                  <td className="py-3 px-4 text-[#64748B]">
                    {editingId === f.id ? (
                      <input
                        type="text"
                        value={editDoc}
                        onChange={(e) => setEditDoc(e.target.value)}
                        className="w-full bg-white border border-[#1565C0] rounded px-2 py-1 text-xs"
                      />
                    ) : (
                      f.sourceDocumentation
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {currentUser?.role === 'ADMIN' ? (
                      editingId === f.id ? (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleSaveEdit(f.id)}
                            className="px-2 py-1 bg-[#2E7D32] text-white rounded text-[11px] font-bold"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-[11px]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(f)}
                          className="px-2.5 py-1 text-[#1565C0] hover:bg-blue-50 border border-blue-200 rounded font-semibold text-[11px]"
                        >
                          Edit Factor
                        </button>
                      )
                    ) : (
                      <span className="text-[#64748B] text-[11px]">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
