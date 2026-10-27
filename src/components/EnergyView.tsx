import React, { useState } from 'react';
import { 
  Zap, 
  Plus, 
  Search, 
  Scale, 
  Gauge, 
  Leaf, 
  Calendar, 
  Flame, 
  AlertCircle, 
  Check, 
  X 
} from 'lucide-react';
import { 
  EnergyRecord, 
  TreatmentBatch, 
  EmissionFactor, 
  EnergySource, 
  User 
} from '../types';

interface EnergyViewProps {
  energyRecords: EnergyRecord[];
  batches: TreatmentBatch[];
  emissionFactors: EmissionFactor[];
  onAddEnergyRecord: (rec: Omit<EnergyRecord, 'id' | 'calculatedEmissionsKgCO2e' | 'energyPerKgMaterial' | 'recordedAt'>) => void;
  currentUser: User | null;
}

export const EnergyView: React.FC<EnergyViewProps> = ({
  energyRecords,
  batches,
  emissionFactors,
  onAddEnergyRecord,
  currentUser,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [batchId, setBatchId] = useState<number>(batches[0]?.id || 1);
  const [energySource, setEnergySource] = useState<EnergySource>('ELECTRICITY_GRID');
  const [consumptionValue, setConsumptionValue] = useState<number | ''>(350);
  const [unit, setUnit] = useState<'KWH' | 'M3' | 'LITERS' | 'MJ'>('KWH');
  const [emissionFactorId, setEmissionFactorId] = useState<number>(1);
  const [formError, setFormError] = useState('');

  const filteredRecords = energyRecords.filter(
    (r) =>
      (r.batchCode && r.batchCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      r.energySource.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalGridKwh = energyRecords
    .filter((r) => r.energySource === 'ELECTRICITY_GRID')
    .reduce((s, r) => s + r.consumptionValue, 0);

  const totalSolarKwh = energyRecords
    .filter((r) => r.energySource === 'ELECTRICITY_RENEWABLE')
    .reduce((s, r) => s + r.consumptionValue, 0);

  const totalGasM3 = energyRecords
    .filter((r) => r.energySource === 'NATURAL_GAS')
    .reduce((s, r) => s + r.consumptionValue, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consumptionValue || Number(consumptionValue) <= 0) {
      setFormError('Consumption reading must be greater than 0.');
      return;
    }

    const selectedBatch = batches.find((b) => b.id === Number(batchId));

    onAddEnergyRecord({
      batchId: Number(batchId),
      batchCode: selectedBatch?.batchCode,
      energySource,
      consumptionValue: Number(consumptionValue),
      unit,
      emissionFactorId: Number(emissionFactorId),
      recordedBy: currentUser?.id || 2,
      recordedByName: currentUser?.fullName || 'Technician',
    });

    setFormError('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-[#DCE5ED] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1565C0] text-white">
              MODULE E
            </span>
            <span className="text-xs text-[#2E7D32] font-semibold">SDG 7.3: Energy Efficiency</span>
          </div>
          <h2 className="text-xl font-black text-[#0B1F3A] flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <span>Industrial Energy Sub-Metering & Monitoring</span>
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Log furnace electrical power, combustible fuels, and track specific energy intensity ($kWh/kg$).
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1565C0] hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Log Meter Reading</span>
        </button>
      </div>

      {/* Energy Quick Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#DCE5ED] shadow-xs">
          <div className="text-xs font-semibold text-[#64748B] uppercase">Grid Electricity</div>
          <div className="text-xl font-black text-[#0B1F3A] mt-1 font-mono">
            {totalGridKwh.toLocaleString(undefined, { maximumFractionDigits: 1 })} kWh
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">Thermal-dominant base grid</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-emerald-200 bg-emerald-50/30 shadow-xs">
          <div className="text-xs font-semibold text-[#2E7D32] uppercase flex items-center gap-1">
            <Leaf className="w-3.5 h-3.5" />
            <span>Renewable Solar PPA</span>
          </div>
          <div className="text-xl font-black text-[#2E7D32] mt-1 font-mono">
            {totalSolarKwh.toLocaleString(undefined, { maximumFractionDigits: 1 })} kWh
          </div>
          <div className="text-[11px] text-[#2E7D32] mt-1">Scope 2 zero direct combustion</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#DCE5ED] shadow-xs">
          <div className="text-xs font-semibold text-[#64748B] uppercase">Natural Gas Fuel</div>
          <div className="text-xl font-black text-[#0B1F3A] mt-1 font-mono">
            {totalGasM3.toFixed(1)} m³
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">Atmospheric carburizing furnace</div>
        </div>
      </div>

      {/* Energy Records Table */}
      <div className="bg-white rounded-xl border border-[#DCE5ED] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#DCE5ED] flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#0B1F3A] flex items-center gap-2">
            <Gauge className="w-4 h-4 text-[#1565C0]" />
            <span>Batch Energy Consumption Logs</span>
          </h3>
          <div className="text-xs text-[#64748B] font-mono">
            {filteredRecords.length} Meter Logs
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F4F8FB] text-[#64748B] font-semibold uppercase tracking-wider border-b border-[#DCE5ED]">
                <th className="py-3 px-4">Log ID</th>
                <th className="py-3 px-4">Batch Code</th>
                <th className="py-3 px-4">Energy Source</th>
                <th className="py-3 px-4">Metered Reading</th>
                <th className="py-3 px-4">Specific Intensity (kWh/kg)</th>
                <th className="py-3 px-4">Emissions (kg CO₂e)</th>
                <th className="py-3 px-4">Recorded By & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE5ED]">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-[#F4F8FB]/60 transition-colors">
                  <td className="py-3 px-4 font-mono text-[#64748B]">
                    #{r.id}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#1565C0]">
                    {r.batchCode}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      r.energySource === 'ELECTRICITY_RENEWABLE'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : r.energySource === 'NATURAL_GAS'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-blue-50 text-[#1565C0] border border-blue-200'
                    }`}>
                      {r.energySource.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#0B1F3A]">
                    {r.consumptionValue.toFixed(1)} {r.unit}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-[#2E7D32]">
                    {r.energyPerKgMaterial.toFixed(4)} kWh/kg
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#0B1F3A]">
                    {r.calculatedEmissionsKgCO2e.toFixed(2)} kg CO₂e
                  </td>
                  <td className="py-3 px-4 text-[#64748B]">
                    <div>{r.recordedByName}</div>
                    <div className="text-[10px] font-mono">{r.recordedAt}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Meter Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#DCE5ED] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCE5ED]">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0B1F3A]">Log Energy Consumption Meter</h3>
                  <p className="text-xs text-[#64748B]">Link power meter reading to a specific treatment run</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#1F2937] mb-1">
                  Associate Heat Treatment Batch *
                </label>
                <select
                  value={batchId}
                  onChange={(e) => setBatchId(Number(e.target.value))}
                  className="w-full bg-[#F4F8FB] border border-[#DCE5ED] rounded-lg px-3 py-2 text-[#0B1F3A] font-semibold focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.batchCode} ({b.treatmentType} - {b.materialGrade} - {b.materialWeightKg}kg)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1F2937] mb-1">
                    Energy / Fuel Source *
                  </label>
                  <select
                    value={energySource}
                    onChange={(e) => {
                      const src = e.target.value as EnergySource;
                      setEnergySource(src);
                      if (src === 'NATURAL_GAS') {
                        setUnit('M3');
                        setEmissionFactorId(3);
                      } else if (src === 'DIESEL_FUEL') {
                        setUnit('LITERS');
                        setEmissionFactorId(4);
                      } else if (src === 'ELECTRICITY_RENEWABLE') {
                        setUnit('KWH');
                        setEmissionFactorId(2);
                      } else {
                        setUnit('KWH');
                        setEmissionFactorId(1);
                      }
                    }}
                    className="w-full bg-[#F4F8FB] border border-[#DCE5ED] rounded-lg px-3 py-2 text-[#0B1F3A] font-bold focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                  >
                    <option value="ELECTRICITY_GRID">Electricity (Grid Base)</option>
                    <option value="ELECTRICITY_RENEWABLE">Electricity (Renewable PV)</option>
                    <option value="NATURAL_GAS">Natural Gas (Pipeline)</option>
                    <option value="DIESEL_FUEL">Diesel Fuel (Backup)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#1F2937] mb-1">
                    Consumption Reading *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      required
                      value={consumptionValue}
                      onChange={(e) => setConsumptionValue(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full bg-[#F4F8FB] border border-[#DCE5ED] rounded-lg px-3 py-2 text-[#0B1F3A] font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                    />
                    <span className="px-3 py-2 bg-slate-100 border border-[#DCE5ED] rounded-lg text-[#0B1F3A] font-mono font-bold flex items-center">
                      {unit}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1F2937] mb-1">
                  Active Emission Factor *
                </label>
                <select
                  value={emissionFactorId}
                  onChange={(e) => setEmissionFactorId(Number(e.target.value))}
                  className="w-full bg-[#F4F8FB] border border-[#DCE5ED] rounded-lg px-3 py-2 text-[#0B1F3A] font-mono focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                >
                  {emissionFactors.map((ef) => (
                    <option key={ef.id} value={ef.id}>
                      {ef.energySource}: {ef.emissionFactorValue} {ef.unitNumerator}/{ef.unitDenominator} ({ef.sourceDocumentation})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#DCE5ED]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#DCE5ED] text-[#64748B] hover:bg-slate-100 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1565C0] hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs"
                >
                  Save Energy Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
