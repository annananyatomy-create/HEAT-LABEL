import React, { useState } from 'react';
import { 
  Trash2, 
  Plus, 
  Search, 
  Recycle, 
  AlertTriangle, 
  TrendingDown, 
  CheckCircle2, 
  Scale, 
  X, 
  Check 
} from 'lucide-react';
import { 
  WasteRecord, 
  TreatmentBatch, 
  WasteCategory, 
  RecyclingStatus, 
  User 
} from '../types';

interface WasteViewProps {
  wasteRecords: WasteRecord[];
  batches: TreatmentBatch[];
  onAddWasteRecord: (rec: Omit<WasteRecord, 'id' | 'recordedAt'>) => void;
  currentUser: User | null;
}

export const WasteView: React.FC<WasteViewProps> = ({
  wasteRecords,
  batches,
  onAddWasteRecord,
  currentUser,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [batchId, setBatchId] = useState<number>(batches[0]?.id || 1);
  const [rejectedPartsCount, setRejectedPartsCount] = useState<number | ''>(1);
  const [totalScrapWeightKg, setTotalScrapWeightKg] = useState<number | ''>(12.5);
  const [wasteCategory, setWasteCategory] = useState<WasteCategory>('QUENCH_DISTORTION');
  const [recyclingStatus, setRecyclingStatus] = useState<RecyclingStatus>('RECYCLED_SCRAP_DEALER');
  const [recoveredWeightKg, setRecoveredWeightKg] = useState<number | ''>(12.5);
  const [dispositionNotes, setDispositionNotes] = useState('');
  const [formError, setFormError] = useState('');

  const filteredRecords = wasteRecords.filter(
    (w) =>
      (w.batchCode && w.batchCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      w.wasteCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.dispositionNotes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalScrapKg = wasteRecords.reduce((s, r) => s + r.totalScrapWeightKg, 0);
  const totalRecoveredKg = wasteRecords.reduce((s, r) => s + r.recoveredWeightKg, 0);
  const totalDefectsCount = wasteRecords.reduce((s, r) => s + r.rejectedPartsCount, 0);
  const circularityRate = totalScrapKg > 0 ? (totalRecoveredKg / totalScrapKg) * 100 : 0;

  // Waste category distribution
  const categoryCounts: Record<string, number> = {};
  wasteRecords.forEach((r) => {
    categoryCounts[r.wasteCategory] = (categoryCounts[r.wasteCategory] || 0) + r.totalScrapWeightKg;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalScrapWeightKg === '' || Number(totalScrapWeightKg) < 0) {
      setFormError('Scrap weight must be 0 or positive.');
      return;
    }

    if (Number(recoveredWeightKg) > Number(totalScrapWeightKg)) {
      setFormError('Recovered metal mass cannot exceed total scrap mass.');
      return;
    }

    const selectedBatch = batches.find((b) => b.id === Number(batchId));

    onAddWasteRecord({
      batchId: Number(batchId),
      batchCode: selectedBatch?.batchCode,
      rejectedPartsCount: Number(rejectedPartsCount) || 0,
      totalScrapWeightKg: Number(totalScrapWeightKg),
      wasteCategory,
      recyclingStatus,
      recoveredWeightKg: Number(recoveredWeightKg) || 0,
      dispositionNotes: dispositionNotes.trim(),
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
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#2E7D32] text-white">
              MODULE G
            </span>
            <span className="text-xs text-[#0B1F3A] font-semibold">SDG 12.5: Waste Reduction & Circular Metals</span>
          </div>
          <h2 className="text-xl font-black text-[#0B1F3A] flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-500" />
            <span>Metallurgical Defect & Scrap Management</span>
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Audit defective workpieces, categorize thermal root causes, and monitor circular recycling recovery.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1565C0] hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Record Scrap Audit</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#DCE5ED] shadow-xs">
          <div className="text-xs font-semibold text-[#64748B] uppercase">Total Scrap Generated</div>
          <div className="text-xl font-black text-[#0B1F3A] mt-1 font-mono">
            {totalScrapKg.toFixed(1)} kg
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">Across all thermal cycles</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <div className="text-xs font-semibold text-[#2E7D32] uppercase flex items-center gap-1">
            <Recycle className="w-3.5 h-3.5" />
            <span>Circularity Recovery</span>
          </div>
          <div className="text-xl font-black text-[#2E7D32] mt-1 font-mono">
            {totalRecoveredKg.toFixed(1)} kg ({circularityRate.toFixed(1)}%)
          </div>
          <div className="text-[11px] text-[#2E7D32] mt-1">Diverted from landfill</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#DCE5ED] shadow-xs">
          <div className="text-xs font-semibold text-[#64748B] uppercase">Defective Workpieces</div>
          <div className="text-xl font-black text-[#0B1F3A] mt-1 font-mono">
            {totalDefectsCount} units
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">Total pieces flagged</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#DCE5ED] shadow-xs">
          <div className="text-xs font-semibold text-[#64748B] uppercase">Primary Defect Cause</div>
          <div className="text-base font-bold text-[#0B1F3A] mt-1 truncate">
            Scale Oxidation
          </div>
          <div className="text-[11px] text-amber-700 mt-1">Remelted in induction furnace</div>
        </div>
      </div>

      {/* Scrap Table */}
      <div className="bg-white rounded-xl border border-[#DCE5ED] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#DCE5ED] flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#0B1F3A]">Scrap Audit & Recycling Ledger (table: waste_records)</h3>
          <span className="text-xs text-[#64748B] font-mono">{filteredRecords.length} Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F4F8FB] text-[#64748B] font-semibold uppercase tracking-wider border-b border-[#DCE5ED]">
                <th className="py-3 px-4">Batch Code</th>
                <th className="py-3 px-4">Defect Pieces</th>
                <th className="py-3 px-4">Scrap Mass (kg)</th>
                <th className="py-3 px-4">Root Cause Defect Category</th>
                <th className="py-3 px-4">Circularity Disposition</th>
                <th className="py-3 px-4">Recovered (kg)</th>
                <th className="py-3 px-4">QA Disposition Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE5ED]">
              {filteredRecords.map((w) => (
                <tr key={w.id} className="hover:bg-[#F4F8FB]/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#1565C0]">
                    {w.batchCode}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#0B1F3A]">
                    {w.rejectedPartsCount} pcs
                  </td>
                  <td className="py-3 px-4 font-mono text-red-600 font-bold">
                    {w.totalScrapWeightKg.toFixed(2)} kg
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-[#1F2937]">
                      {w.wasteCategory.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      w.recyclingStatus === 'RECYCLED_SCRAP_DEALER' || w.recyclingStatus === 'IN_HOUSE_REMELT'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : w.recyclingStatus === 'RE_HEAT_TREATED'
                        ? 'bg-blue-100 text-[#1565C0] border border-blue-300'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {w.recyclingStatus.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#2E7D32]">
                    {w.recoveredWeightKg.toFixed(2)} kg
                  </td>
                  <td className="py-3 px-4 text-[#64748B] max-w-xs truncate">
                    {w.dispositionNotes || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Scrap Audit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#DCE5ED] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCE5ED]">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0B1F3A]">Record Scrap & Defect Audit</h3>
                  <p className="text-xs text-[#64748B]">Document metallurgical scrap and circular recycling</p>
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
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#1F2937] mb-1">
                  Heat Treatment Batch *
                </label>
                <select
                  value={batchId}
                  onChange={(e) => setBatchId(Number(e.target.value))}
                  className="w-full bg-[#F4F8FB] border border-[#DCE5ED] rounded-lg px-3 py-2 text-[#0B1F3A] font-semibold focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.batchCode} ({b.treatmentType} - {b.materialGrade})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1F2937] mb-1">
                    Rejected Pieces Count *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={rejectedPartsCount}
                    onChange={(e) => setRejectedPartsCount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-[#F4F8FB] border border-[#DCE5ED] rounded-lg px-3 py-2 text-[#0B1F3A] font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1F2937] mb-1">
                    Total Scrap Mass (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={totalScrapWeightKg}
                    onChange={(e) => {
                      const val = e.target.value === '' ? '' : Number(e.target.value);
                      setTotalScrapWeightKg(val);
                      if (val !== '') setRecoveredWeightKg(val); // default assume full recycling recovery
                    }}
                    className="w-full bg-[#F4F8FB] border border-[#DCE5ED] rounded-lg px-3 py-2 text-[#0B1F3A] font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1F2937] mb-1">
                    Defect Root Cause *
                  </label>
                  <select
                    value={wasteCategory}
                    onChange={(e) => setWasteCategory(e.target.value as WasteCategory)}
                    className="w-full bg-[#F4F8FB] border border-[#DCE5ED] rounded-lg px-3 py-2 text-[#0B1F3A] font-semibold focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                  >
                    <option value="SCALE_OXIDATION">Scale Oxidation (Surface)</option>
                    <option value="QUENCH_DISTORTION">Quench Distortion (Out-of-round)</option>
                    <option value="THERMAL_CRACKING">Thermal Cracking (Stress)</option>
                    <option value="OVERHEATING_BURNING">Overheating / Grain Burning</option>
                    <option value="DECARBURIZATION">Decarburization (Atmosphere)</option>
                    <option value="HARDNESS_NONCONFORMANCE">Hardness Nonconformance</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#1F2937] mb-1">
                    Circular Recycling Status *
                  </label>
                  <select
                    value={recyclingStatus}
                    onChange={(e) => setRecyclingStatus(e.target.value as RecyclingStatus)}
                    className="w-full bg-[#F4F8FB] border border-[#DCE5ED] rounded-lg px-3 py-2 text-[#0B1F3A] font-bold focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                  >
                    <option value="RECYCLED_SCRAP_DEALER">Recycled via Certified Scrap Dealer</option>
                    <option value="IN_HOUSE_REMELT">In-House Foundry Induction Re-Melt</option>
                    <option value="RE_HEAT_TREATED">Re-Heat Treated / Corrective Cycle</option>
                    <option value="LANDFILL_DISPOSAL">Landfill Disposal (Waste)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1F2937] mb-1">
                  Recovered / Recycled Metal Mass (kg) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={recoveredWeightKg}
                  onChange={(e) => setRecoveredWeightKg(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-[#F4F8FB] border border-[#DCE5ED] rounded-lg px-3 py-2 text-[#0B1F3A] font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1F2937] mb-1">
                  Corrective Actions & Disposition Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Parts segregated into certified recycling container. Adjust quench oil agitation."
                  value={dispositionNotes}
                  onChange={(e) => setDispositionNotes(e.target.value)}
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
                  Save Waste Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
