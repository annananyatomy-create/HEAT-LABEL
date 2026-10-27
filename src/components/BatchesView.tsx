import React, { useState } from 'react';
import { 
  Flame, 
  Plus, 
  Search, 
  Clock, 
  Thermometer, 
  CheckCircle2, 
  PlayCircle, 
  AlertCircle, 
  X, 
  Check, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { 
  TreatmentBatch, 
  Material, 
  TreatmentType, 
  CoolingMethod, 
  BatchStatus, 
  User 
} from '../types';

interface BatchesViewProps {
  batches: TreatmentBatch[];
  materials: Material[];
  onAddBatch: (batch: Omit<TreatmentBatch, 'id'>) => void;
  onUpdateBatchStatus: (id: number, status: BatchStatus, actualHardness?: number) => void;
  currentUser: User | null;
  isCreateModalOpen?: boolean;
  setIsCreateModalOpen?: (open: boolean) => void;
}

export const BatchesView: React.FC<BatchesViewProps> = ({
  batches,
  materials,
  onAddBatch,
  onUpdateBatchStatus,
  currentUser,
  isCreateModalOpen: propModalOpen,
  setIsCreateModalOpen: setPropModalOpen,
}) => {
  const [localModalOpen, setLocalModalOpen] = useState(false);
  const isModalOpen = propModalOpen !== undefined ? propModalOpen : localModalOpen;
  const setIsModalOpen = setPropModalOpen || setLocalModalOpen;

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');

  // Form State
  const [batchCode, setBatchCode] = useState(`HT-2026-00${batches.length + 1}`);
  const [materialId, setMaterialId] = useState<number>(materials[0]?.id || 1);
  const [treatmentType, setTreatmentType] = useState<TreatmentType>('HARDENING');
  const [furnaceId, setFurnaceId] = useState('FURNACE-ALPHA-1');
  const [furnaceTempC, setFurnaceTempC] = useState<number | ''>(850);
  const [holdingTimeMinutes, setHoldingTimeMinutes] = useState<number | ''>(120);
  const [coolingMethod, setCoolingMethod] = useState<CoolingMethod>('OIL_QUENCH');
  const [targetHardnessHrc, setTargetHardnessHrc] = useState<number | ''>(54.0);
  const [processNotes, setProcessNotes] = useState('');
  const [formError, setFormError] = useState('');

  const filteredBatches = batches.filter((b) => {
    const matchesSearch = 
      b.batchCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.materialGrade && b.materialGrade.toLowerCase().includes(searchTerm.toLowerCase())) ||
      b.treatmentType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'ALL' || b.treatmentType === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchCode.trim() || !materialId || !furnaceTempC || !holdingTimeMinutes) {
      setFormError('Please enter all required process parameters.');
      return;
    }

    if (Number(furnaceTempC) < 150 || Number(furnaceTempC) > 1300) {
      setFormError('Furnace temperature must be in typical metallurgical range (150°C - 1300°C).');
      return;
    }

    const selectedMat = materials.find((m) => m.id === Number(materialId));

    onAddBatch({
      batchCode: batchCode.trim().toUpperCase(),
      materialId: Number(materialId),
      materialName: selectedMat?.name,
      materialGrade: selectedMat?.grade,
      materialWeightKg: selectedMat?.initialWeightKg,
      treatmentType,
      furnaceId,
      furnaceTemperatureC: Number(furnaceTempC),
      holdingTimeMinutes: Number(holdingTimeMinutes),
      coolingMethod,
      startDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
      completionDate: null,
      operatorId: currentUser?.id || 2,
      operatorName: currentUser?.fullName || 'Technician',
      batchStatus: 'IN_PROGRESS',
      targetHardnessHrc: targetHardnessHrc === '' ? null : Number(targetHardnessHrc),
      actualHardnessHrc: null,
      processNotes: processNotes.trim(),
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
              MODULE D
            </span>
            <span className="text-xs text-[#64748B] font-mono">TABLE: treatment_batches</span>
          </div>
          <h2 className="text-xl font-black text-[#0B1F3A] flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#1565C0]" />
            <span>Heat-Treatment Thermal Batch Management</span>
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Configure furnace heating cycles, soak duration, quench mediums, and QA hardness verification.
          </p>
        </div>

        <button
          onClick={() => {
            setBatchCode(`HT-2026-00${batches.length + 1}`);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#1565C0] hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Launch Heat Batch</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by batch code (HT-2026-001) or grade..."
            className="w-full bg-white border border-[#DCE5ED] rounded-lg pl-9 pr-4 py-2 text-xs text-[#1F2937] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#1565C0]/30"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[#64748B] flex items-center gap-1 font-medium">
            <Filter className="w-3.5 h-3.5" /> Type:
          </span>
          {['ALL', 'HARDENING', 'TEMPERING', 'ANNEALING', 'NORMALIZING', 'CARBURIZING'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                filterType === t
                  ? 'bg-[#1565C0] text-white'
                  : 'bg-white text-[#64748B] hover:text-[#0B1F3A] border border-[#DCE5ED]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Batches Table */}
      <div className="bg-white rounded-xl border border-[#DCE5ED] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F4F8FB] text-[#64748B] font-semibold uppercase tracking-wider border-b border-[#DCE5ED]">
                <th className="py-3 px-4">Batch Code</th>
                <th className="py-3 px-4">Material / Alloy Grade</th>
                <th className="py-3 px-4">Treatment Category</th>
                <th className="py-3 px-4">Chamber & Temp</th>
                <th className="py-3 px-4">Soak Time</th>
                <th className="py-3 px-4">Cooling Method</th>
                <th className="py-3 px-4">Hardness (Target / Actual)</th>
                <th className="py-3 px-4">Status & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE5ED]">
              {filteredBatches.map((b) => (
                <tr key={b.id} className="hover:bg-[#F4F8FB]/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#1565C0]">
                    {b.batchCode}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-[#0B1F3A]">{b.materialGrade || 'Grade AISI'}</div>
                    <div className="text-[11px] text-[#64748B]">{b.materialName}</div>
                    <div className="text-[10px] text-[#2E7D32] font-mono">{b.materialWeightKg} kg</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-blue-50 text-[#1565C0] border border-blue-200">
                      {b.treatmentType}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-[#0B1F3A] flex items-center gap-1">
                      <Thermometer className="w-3.5 h-3.5 text-amber-600" />
                      <span>{b.furnaceTemperatureC}°C</span>
                    </div>
                    <div className="text-[10px] text-[#64748B] font-mono">{b.furnaceId}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[#0B1F3A]">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#64748B]" />
                      <span>{b.holdingTimeMinutes} min</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#1F2937] font-medium">
                    {b.coolingMethod.replace(/_/g, ' ')}
                  </td>
                  <td className="py-3 px-4 font-mono">
                    <span className="text-[#64748B]">{b.targetHardnessHrc ?? '-'}</span>
                    <span className="text-slate-400 mx-1">/</span>
                    <span className="font-bold text-[#0B1F3A]">{b.actualHardnessHrc ? `${b.actualHardnessHrc} HRC` : 'Pending QA'}</span>
                  </td>
                  <td className="py-3 px-4">
                    {b.batchStatus === 'IN_PROGRESS' ? (
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                          In Progress
                        </span>
                        <button
                          onClick={() => onUpdateBatchStatus(b.id, 'COMPLETED', b.targetHardnessHrc ? b.targetHardnessHrc + 0.3 : 50)}
                          className="px-2 py-1 bg-[#2E7D32] hover:bg-green-700 text-white rounded text-[10px] font-bold shadow-xs transition-colors"
                          title="Complete cycle and record measured QA hardness"
                        >
                          Complete
                        </button>
                      </div>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {b.batchStatus}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Launch Batch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#DCE5ED] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCE5ED]">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-[#1565C0] rounded-lg">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0B1F3A]">Configure Heat-Treatment Batch</h3>
                  <p className="text-xs text-[#64748B]">Thermal cycle recipe and process parameters</p>
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1F2937] mb-1">
                    Batch Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={batchCode}
                    onChange={(e) => setBatchCode(e.target.value)}
                    className="w-full bg-[#F4F8FB] border border-[#DCE5ED] rounded-lg px-3 py-2 text-[#0B1F3A] font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1F2937] mb-1">
                    Select Material Stock *
                  </label>
                  <select
                    value={materialId}
                    onChange={(e) => setMaterialId(Number(e.target.value))}
                    className="w-full bg-[#F4F8FB] border border-[#DCE5ED] rounded-lg px-3 py-2 text-[#0B1F3A] font-semibold focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                  >
                    {materials.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.materialCode} ({m.grade} - {m.initialWeightKg}kg)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1F2937] mb-1">
                    Treatment Category *
                  </label>
                  <select
                    value={treatmentType}
                    onChange={(e) => setTreatmentType(e.target.value as TreatmentType)}
                    className="w-full bg-[#F4F8FB] border border-[#DCE5ED] rounded-lg px-3 py-2 text-[#0B1F3A] font-bold focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                  >
                    <option value="HARDENING">HARDENING (Austenitize & Quench)</option>
                    <option value="TEMPERING">TEMPERING (Stress Relief & Toughening)</option>
                    <option value="ANNEALING">ANNEALING (Softening & Ductility)</option>
                    <option value="NORMALIZING">NORMALIZING (Grain Refinement)</option>
                    <option value="CARBURIZING">CARBURIZING (Case Hardening)</option>
                    <option value="STRESS_RELIEVING">STRESS RELIEVING (Thermal)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#1F2937] mb-1">
                    Furnace Chamber *
                  </label>
                  <select
                    value={furnaceId}
                    onChange={(e) => setFurnaceId(e.target.value)}
                    className="w-full bg-[#F4F8FB] border border-[#DCE5ED] rounded-lg px-3 py-2 text-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                  >
                    <option value="FURNACE-ALPHA-1">FURNACE-ALPHA-1 (Electric Pit 120kW)</option>
                    <option value="FURNACE-ALPHA-2">FURNACE-ALPHA-2 (Atmosphere Sealed)</option>
                    <option value="FURNACE-BETA-1">FURNACE-BETA-1 (Bogie Hearth)</option>
                    <option value="FURNACE-GAMMA-1">FURNACE-GAMMA-1 (Gas Carburizer)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1F2937] mb-1">
                    Furnace Peak Temp (°C) *
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="100"
                    max="1400"
                    required
                    value={furnaceTempC}
                    onChange={(e) => setFurnaceTempC(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-[#F4F8FB] border border-[#DCE5ED] rounded-lg px-3 py-2 text-[#0B1F3A] font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1F2937] mb-1">
                    Soak Duration (Minutes) *
                  </label>
                  <input
                    type="number"
                    min="10"
                    required
                    value={holdingTimeMinutes}
                    onChange={(e) => setHoldingTimeMinutes(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-[#F4F8FB] border border-[#DCE5ED] rounded-lg px-3 py-2 text-[#0B1F3A] font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1F2937] mb-1">
                    Cooling Method *
                  </label>
                  <select
                    value={coolingMethod}
                    onChange={(e) => setCoolingMethod(e.target.value as CoolingMethod)}
                    className="w-full bg-[#F4F8FB] border border-[#DCE5ED] rounded-lg px-3 py-2 text-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                  >
                    <option value="OIL_QUENCH">OIL QUENCH (Accelerated Martensite)</option>
                    <option value="WATER_QUENCH">WATER QUENCH (Severe)</option>
                    <option value="POLYMER_QUENCH">POLYMER QUENCH (Controlled)</option>
                    <option value="FORCED_AIR_COOL">FORCED AIR COOL (Normalizing)</option>
                    <option value="STILL_AIR_COOL">STILL AIR COOL (Tempering)</option>
                    <option value="FURNACE_COOL">FURNACE COOL (Slow Anneal)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#1F2937] mb-1">
                    Target Hardness (HRC)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="10"
                    max="70"
                    placeholder="e.g. 54.0"
                    value={targetHardnessHrc}
                    onChange={(e) => setTargetHardnessHrc(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-[#F4F8FB] border border-[#DCE5ED] rounded-lg px-3 py-2 text-[#0B1F3A] font-mono focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1F2937] mb-1">
                  Process Execution Notes / Thermocouple Placement
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Nitrogen protective atmosphere active. Thermocouple #3 attached to core section."
                  value={processNotes}
                  onChange={(e) => setProcessNotes(e.target.value)}
                  className="w-full bg-[#F4F8FB] border border-[#DCE5ED] rounded-lg px-3 py-2 text-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                />
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
                  Launch Thermal Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
