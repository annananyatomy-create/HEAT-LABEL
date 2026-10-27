import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Calendar, 
  Filter, 
  TrendingDown, 
  Zap, 
  CloudFog, 
  Layers, 
  Trash2, 
  Check, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { 
  TreatmentBatch, 
  EnergyRecord, 
  WasteRecord, 
  Material 
} from '../types';

interface ReportsViewProps {
  batches: TreatmentBatch[];
  materials: Material[];
  energyRecords: EnergyRecord[];
  wasteRecords: WasteRecord[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  batches,
  materials,
  energyRecords,
  wasteRecords,
}) => {
  const [reportPeriod, setReportPeriod] = useState<'daily' | 'monthly' | 'yearly'>('monthly');
  const [selectedTreatment, setSelectedTreatment] = useState<string>('ALL');
  const [isExporting, setIsExporting] = useState(false);

  // Generate Report Table Data from database entities
  const reportRows = batches.map((b) => {
    const mat = materials.find((m) => m.id === b.materialId);
    const energy = energyRecords.filter((e) => e.batchId === b.id);
    const waste = wasteRecords.filter((w) => w.batchId === b.id);

    const totalEnergy = energy.reduce((s, e) => s + e.consumptionValue, 0);
    const totalEmissions = energy.reduce((s, e) => s + e.calculatedEmissionsKgCO2e, 0);
    const totalScrap = waste.reduce((s, w) => s + w.totalScrapWeightKg, 0);
    const recoveredScrap = waste.reduce((s, w) => s + w.recoveredWeightKg, 0);
    const weight = mat?.initialWeightKg || 0;
    const kwhPerKg = weight > 0 ? totalEnergy / weight : 0;
    const wastePct = weight > 0 ? (totalScrap / weight) * 100 : 0;

    return {
      batchCode: b.batchCode,
      date: b.startDate.substring(0, 10),
      treatmentType: b.treatmentType,
      materialGrade: mat?.grade || 'Steel',
      materialWeightKg: weight,
      furnaceTempC: b.furnaceTemperatureC,
      energyKwh: totalEnergy,
      emissionsKgCo2e: totalEmissions,
      kwhPerKg,
      scrapKg: totalScrap,
      recoveredKg: recoveredScrap,
      wastePercentage: wastePct,
      status: b.batchStatus,
    };
  }).filter((r) => selectedTreatment === 'ALL' || r.treatmentType === selectedTreatment);

  // Totals for Report Header
  const totalEnergySum = reportRows.reduce((s, r) => s + r.energyKwh, 0);
  const totalEmissionsSum = reportRows.reduce((s, r) => s + r.emissionsKgCo2e, 0);
  const totalWeightSum = reportRows.reduce((s, r) => s + r.materialWeightKg, 0);
  const totalScrapSum = reportRows.reduce((s, r) => s + r.scrapKg, 0);
  const avgKwhPerKg = totalWeightSum > 0 ? totalEnergySum / totalWeightSum : 0;

  // Real Browser CSV Export function
  const handleExportCSV = () => {
    setIsExporting(true);

    const headers = [
      'Batch Code',
      'Cycle Date',
      'Treatment Type',
      'Material Grade',
      'Weight (kg)',
      'Furnace Temp (°C)',
      'Energy (kWh)',
      'Emissions (kg CO2e)',
      'Energy Intensity (kWh/kg)',
      'Scrap (kg)',
      'Recovered (kg)',
      'Waste (%)',
      'Status',
    ];

    const csvContent = [
      headers.join(','),
      ...reportRows.map((r) =>
        [
          `"${r.batchCode}"`,
          `"${r.date}"`,
          `"${r.treatmentType}"`,
          `"${r.materialGrade}"`,
          r.materialWeightKg.toFixed(2),
          r.furnaceTempC.toFixed(1),
          r.energyKwh.toFixed(2),
          r.emissionsKgCo2e.toFixed(2),
          r.kwhPerKg.toFixed(4),
          r.scrapKg.toFixed(2),
          r.recoveredKg.toFixed(2),
          r.wastePercentage.toFixed(2),
          `"${r.status}"`,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `HEAT_LABEL_Sustainability_Report_${reportPeriod}_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setIsExporting(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-[#DCE5ED] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1565C0] text-white">
              MODULE H
            </span>
            <span className="text-xs text-[#2E7D32] font-semibold">ESG & Audit Compliance</span>
          </div>
          <h2 className="text-xl font-black text-[#0B1F3A] flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-[#2E7D32]" />
            <span>Sustainability & Energy Audit Reports</span>
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Aggregated operational metrics, carbon footprints, circularity ratios, and genuine CSV download.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 bg-[#2E7D32] hover:bg-green-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors shrink-0"
        >
          {isExporting ? <Check className="w-4 h-4 animate-bounce" /> : <Download className="w-4 h-4" />}
          <span>{isExporting ? 'Generating CSV...' : 'Export Verified CSV'}</span>
        </button>
      </div>

      {/* Filter and Period Selection Bar */}
      <div className="bg-white rounded-xl p-4 border border-[#DCE5ED] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#64748B] flex items-center gap-1">
            <Calendar className="w-4 h-4 text-[#1565C0]" /> Period:
          </span>
          <div className="flex bg-[#F4F8FB] border border-[#DCE5ED] rounded-lg p-0.5">
            {(['daily', 'monthly', 'yearly'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setReportPeriod(p)}
                className={`px-3 py-1 text-xs font-semibold rounded-md capitalize transition-all ${
                  reportPeriod === p
                    ? 'bg-[#1565C0] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#0B1F3A]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#64748B] flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Process Filter:
          </span>
          <select
            value={selectedTreatment}
            onChange={(e) => setSelectedTreatment(e.target.value)}
            className="bg-[#F4F8FB] border border-[#DCE5ED] rounded-lg px-3 py-1.5 text-xs text-[#0B1F3A] font-semibold focus:outline-none"
          >
            <option value="ALL">All Heat Treatments</option>
            <option value="HARDENING">Hardening Only</option>
            <option value="TEMPERING">Tempering Only</option>
            <option value="ANNEALING">Annealing Only</option>
            <option value="NORMALIZING">Normalizing Only</option>
            <option value="CARBURIZING">Carburizing Only</option>
          </select>
        </div>
      </div>

      {/* Report Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#DCE5ED] shadow-xs">
          <div className="text-xs font-semibold text-[#64748B]">Total Processed Mass</div>
          <div className="text-xl font-black text-[#0B1F3A] font-mono mt-0.5">
            {totalWeightSum.toLocaleString()} kg
          </div>
          <div className="text-[11px] text-[#2E7D32] mt-1">{reportRows.length} distinct batches</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#DCE5ED] shadow-xs">
          <div className="text-xs font-semibold text-[#64748B]">Total Energy Consumed</div>
          <div className="text-xl font-black text-[#1565C0] font-mono mt-0.5">
            {totalEnergySum.toFixed(1)} kWh
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">Intensity: {avgKwhPerKg.toFixed(3)} kWh/kg</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <div className="text-xs font-semibold text-[#2E7D32]">Estimated GHG Emissions</div>
          <div className="text-xl font-black text-[#2E7D32] font-mono mt-0.5">
            {totalEmissionsSum.toFixed(1)} kg CO₂e
          </div>
          <div className="text-[11px] text-[#2E7D32] mt-1">CEA v19 & IPCC baseline</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#DCE5ED] shadow-xs">
          <div className="text-xs font-semibold text-[#64748B]">Total Metal Scrap</div>
          <div className="text-xl font-black text-red-600 font-mono mt-0.5">
            {totalScrapSum.toFixed(1)} kg
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">
            Rejection: {totalWeightSum > 0 ? ((totalScrapSum / totalWeightSum) * 100).toFixed(2) : 0}%
          </div>
        </div>
      </div>

      {/* Tabulated Report */}
      <div className="bg-white rounded-xl border border-[#DCE5ED] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#DCE5ED] flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#0B1F3A]">Audited Heat-Treatment Run Logs</h3>
          <span className="text-xs text-[#64748B] font-mono">Export format: Comma Separated Values (.csv)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F4F8FB] text-[#64748B] font-semibold uppercase tracking-wider border-b border-[#DCE5ED]">
                <th className="py-2.5 px-3">Batch Code</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Grade</th>
                <th className="py-2.5 px-3">Load (kg)</th>
                <th className="py-2.5 px-3">Temp</th>
                <th className="py-2.5 px-3">Energy (kWh)</th>
                <th className="py-2.5 px-3">Emissions (kg CO₂e)</th>
                <th className="py-2.5 px-3">kWh / kg</th>
                <th className="py-2.5 px-3">Scrap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE5ED]">
              {reportRows.map((r) => (
                <tr key={r.batchCode} className="hover:bg-[#F4F8FB]/60 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-[#1565C0]">
                    {r.batchCode}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[#64748B]">
                    {r.date}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-[#0B1F3A]">
                    {r.treatmentType}
                  </td>
                  <td className="py-2.5 px-3 text-[#1F2937]">
                    {r.materialGrade}
                  </td>
                  <td className="py-2.5 px-3 font-mono">
                    {r.materialWeightKg} kg
                  </td>
                  <td className="py-2.5 px-3 font-mono font-semibold text-[#0B1F3A]">
                    {r.furnaceTempC}°C
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-[#1565C0]">
                    {r.energyKwh > 0 ? r.energyKwh.toFixed(1) : '-'}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-[#2E7D32]">
                    {r.emissionsKgCo2e > 0 ? r.emissionsKgCo2e.toFixed(1) : '-'}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-semibold text-[#0B1F3A]">
                    {r.kwhPerKg > 0 ? r.kwhPerKg.toFixed(4) : '-'}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-red-600 font-semibold">
                    {r.scrapKg.toFixed(1)} kg ({r.wastePercentage.toFixed(1)}%)
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
