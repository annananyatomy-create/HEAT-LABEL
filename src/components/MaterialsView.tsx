import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Download, 
  AlertCircle, 
  Check, 
  X, 
  Scale, 
  Factory 
} from 'lucide-react';
import { Material, User } from '../types';

interface MaterialsViewProps {
  materials: Material[];
  onAddMaterial: (mat: Omit<Material, 'id' | 'createdAt'>) => void;
  onDeleteMaterial: (id: number) => void;
  currentUser: User | null;
}

export const MaterialsView: React.FC<MaterialsViewProps> = ({
  materials,
  onAddMaterial,
  onDeleteMaterial,
  currentUser,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  // Form State
  const [materialCode, setMaterialCode] = useState('');
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('AISI 4140');
  const [standardSpec, setStandardSpec] = useState('ASTM A29 / DIN 42CrMo4');
  const [batchNumber, setBatchNumber] = useState('');
  const [initialWeightKg, setInitialWeightKg] = useState<number | ''>(500);
  const [componentDescription, setComponentDescription] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [formError, setFormError] = useState('');

  const filteredMaterials = materials.filter(
    (m) =>
      m.materialCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialCode.trim() || !name.trim() || !batchNumber.trim() || !initialWeightKg) {
      setFormError('Please fill in all required fields (Code, Name, Melt Batch, Weight).');
      return;
    }

    if (Number(initialWeightKg) <= 0) {
      setFormError('Material weight must be greater than 0 kg.');
      return;
    }

    onAddMaterial({
      materialCode: materialCode.trim().toUpperCase(),
      name: name.trim(),
      grade: grade.trim(),
      standardSpec: standardSpec.trim(),
      batchNumber: batchNumber.trim().toUpperCase(),
      initialWeightKg: Number(initialWeightKg),
      componentDescription: componentDescription.trim(),
      supplierName: supplierName.trim(),
    });

    // Reset Form
    setMaterialCode('');
    setName('');
    setBatchNumber('');
    setComponentDescription('');
    setSupplierName('');
    setFormError('');
    setIsModalOpen(false);
  };

  const totalGrossWeight = materials.reduce((s, m) => s + m.initialWeightKg, 0);

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="bg-white rounded-xl p-5 border border-[#DCE5ED] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1565C0] text-white">
              MODULE C
            </span>
            <span className="text-xs text-[#64748B] font-mono">TABLE: materials</span>
          </div>
          <h2 className="text-xl font-black text-[#0B1F3A] flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#1565C0]" />
            <span>Material & Alloy Inventory Management</span>
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Register and track engineering alloy grades, melt batch certifications, and gross component mass.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <div className="text-xs text-[#64748B]">Total Processed Mass</div>
            <div className="text-sm font-black text-[#0B1F3A]">
              {totalGrossWeight.toLocaleString()} kg
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1565C0] hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Material</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by alloy grade, code, or melt batch number..."
            className="w-full bg-white border border-[#DCE5ED] rounded-lg pl-9 pr-4 py-2 text-xs text-[#1F2937] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#1565C0]/30"
          />
        </div>
        <div className="text-xs text-[#64748B] font-mono">
          Showing {filteredMaterials.length} of {materials.length} records
        </div>
      </div>

      {/* Materials Table */}
      <div className="bg-white rounded-xl border border-[#DCE5ED] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F4F8FB] text-[#64748B] font-semibold uppercase tracking-wider border-b border-[#DCE5ED]">
                <th className="py-3 px-4">Material Code</th>
                <th className="py-3 px-4">Grade & Standard</th>
                <th className="py-3 px-4">Melt Heat Batch</th>
                <th className="py-3 px-4">Initial Weight</th>
                <th className="py-3 px-4">Component Description</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE5ED]">
              {filteredMaterials.map((mat) => (
                <tr key={mat.id} className="hover:bg-[#F4F8FB]/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#1565C0]">
                    {mat.materialCode}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-[#0B1F3A]">{mat.grade}</div>
                    <div className="text-[11px] text-[#64748B]">{mat.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{mat.standardSpec}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[#0B1F3A]">
                    {mat.batchNumber}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#2E7D32]">
                    {mat.initialWeightKg.toLocaleString()} kg
                  </td>
                  <td className="py-3 px-4 text-[#1F2937] max-w-xs truncate">
                    {mat.componentDescription}
                  </td>
                  <td className="py-3 px-4 text-[#64748B]">
                    {mat.supplierName || 'Internal Warehouse'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {confirmDeleteId === mat.id ? (
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            onDeleteMaterial(mat.id);
                            setConfirmDeleteId(null);
                          }}
                          className="px-2 py-1 bg-red-600 text-white rounded text-[11px] font-bold"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-[11px]"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(mat.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete material record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Material Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#DCE5ED] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCE5ED]">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-[#1565C0] rounded-lg">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0B1F3A]">Register New Engineering Material</h3>
                  <p className="text-xs text-[#64748B]">Input certified metallurgical batch details</p>
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
                    Material Stock Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MAT-4140-008"
                    value={materialCode}
                    onChange={(e) => setMaterialCode(e.target.value)}
                    className="w-full bg-[#F4F8FB] border border-[#DCE5ED] rounded-lg px-3 py-2 text-[#0B1F3A] font-mono focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1F2937] mb-1">
                    Grade Designation *
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full bg-[#F4F8FB] border border-[#DCE5ED] rounded-lg px-3 py-2 text-[#0B1F3A] font-semibold focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                  >
                    <option value="AISI 4140">AISI 4140 (Cr-Mo Alloy)</option>
                    <option value="AISI 1045">AISI 1045 (Medium Carbon)</option>
                    <option value="AISI D2">AISI D2 (Tool Steel)</option>
                    <option value="AISI 316L">AISI 316L (Stainless)</option>
                    <option value="AISI 8620">AISI 8620 (Case Hardening)</option>
                    <option value="EN24 / 4340">EN24 / AISI 4340 (High Tensile)</option>
                    <option value="H13 Tool Steel">H13 (Hot Work Die)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1F2937] mb-1">
                  Full Material Name / Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chromium-Molybdenum Quench & Temper Steel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#F4F8FB] border border-[#DCE5ED] rounded-lg px-3 py-2 text-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1F2937] mb-1">
                    Melt Heat Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HEAT-MELT-9921"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    className="w-full bg-[#F4F8FB] border border-[#DCE5ED] rounded-lg px-3 py-2 text-[#0B1F3A] font-mono focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1F2937] mb-1">
                    Initial Gross Weight (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    required
                    placeholder="500.0"
                    value={initialWeightKg}
                    onChange={(e) => setInitialWeightKg(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-[#F4F8FB] border border-[#DCE5ED] rounded-lg px-3 py-2 text-[#0B1F3A] font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1F2937] mb-1">
                  Component Description & Intended Geometry
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Bevel gears for agricultural drive axles (50 units)"
                  value={componentDescription}
                  onChange={(e) => setComponentDescription(e.target.value)}
                  className="w-full bg-[#F4F8FB] border border-[#DCE5ED] rounded-lg px-3 py-2 text-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1F2937] mb-1">
                  Supplier / Mill Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apex Special Steels Ltd."
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
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
                  Save Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
