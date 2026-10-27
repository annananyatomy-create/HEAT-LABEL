import React from 'react';
import { 
  Globe2, 
  Zap, 
  Factory, 
  Recycle, 
  CloudFog, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Scale, 
  ArrowRight 
} from 'lucide-react';

export const SdgAlignmentView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-[#DCE5ED] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#2E7D32] text-white">
              SECTION 9
            </span>
            <span className="text-xs text-[#1565C0] font-semibold">United Nations 2030 Agenda</span>
          </div>
          <h2 className="text-xl font-black text-[#0B1F3A] flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-[#2E7D32]" />
            <span>UN Sustainable Development Goals (SDG) Alignment</span>
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Explicit mapping of HEAT LABEL telemetry to international sustainability indicators and targets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold bg-[#F4F8FB] text-[#0B1F3A] px-3 py-1.5 rounded-lg border border-[#DCE5ED]">
            SDGs 7, 9, 12, 13
          </span>
        </div>
      </div>

      {/* Critical Scientific Note Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <div className="font-bold text-amber-900">
            Metallurgical Baseline Comparison Integrity Rule
          </div>
          <p className="text-amber-800 mt-1 leading-relaxed">
            HEAT LABEL does <strong>not</strong> automatically declare a thermal batch "environmentally superior" solely 
            because its total energy consumption ($kWh$) was lower. A fast 60-minute solution anneal inherently uses less energy 
            than a 6-hour deep carburizing cycle. Direct environmental comparisons are scientifically valid only when 
            evaluating identical material grades (e.g. AISI 4140 vs AISI 4140), batch weights, and target metallurgical hardness specs.
          </p>
        </div>
      </div>

      {/* Four SDG Core Framework Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SDG 7 Card */}
        <div className="bg-white rounded-xl border border-amber-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-amber-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-amber-500 text-white font-black text-base flex items-center justify-center shadow-xs">
                7
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0B1F3A]">Affordable and Clean Energy</h3>
                <span className="text-[11px] font-semibold text-amber-700">Target 7.3: Energy Efficiency</span>
              </div>
            </div>
            <Zap className="w-5 h-5 text-amber-500" />
          </div>

          <p className="text-xs text-[#64748B] leading-relaxed">
            Double the global rate of improvement in energy efficiency. In heat-treatment facilities, furnaces account for 
            over 80% of total electrical load.
          </p>

          <div className="bg-[#F4F8FB] p-3 rounded-lg border border-[#DCE5ED] space-y-1.5 text-xs">
            <div className="font-semibold text-[#0B1F3A] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>HEAT LABEL Implementation:</span>
            </div>
            <p className="text-[#64748B] text-[11px]">
              Computes <strong>Specific Energy Intensity</strong> ($kWh/kg$) on every furnace cycle. Highlights standby heat losses 
              and tracks the transition from baseline coal-grid power to dedicated on-site solar PV Power Purchase Agreements (PPAs).
            </p>
          </div>
        </div>

        {/* SDG 9 Card */}
        <div className="bg-white rounded-xl border border-blue-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-blue-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#1565C0] text-white font-black text-base flex items-center justify-center shadow-xs">
                9
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0B1F3A]">Industry, Innovation & Infrastructure</h3>
                <span className="text-[11px] font-semibold text-[#1565C0]">Target 9.4: Clean Thermal Retrofitting</span>
              </div>
            </div>
            <Factory className="w-5 h-5 text-[#1565C0]" />
          </div>

          <p className="text-xs text-[#64748B] leading-relaxed">
            Upgrade infrastructure and retrofit industries to make them sustainable, with increased resource-use efficiency 
            and greater adoption of clean, environmentally sound technologies.
          </p>

          <div className="bg-[#F4F8FB] p-3 rounded-lg border border-[#DCE5ED] space-y-1.5 text-xs">
            <div className="font-semibold text-[#0B1F3A] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>HEAT LABEL Implementation:</span>
            </div>
            <p className="text-[#64748B] text-[11px]">
              Modernizes thermal chamber recipe control (Annealing, Quenching, Tempering) via digital soak monitoring, 
              optical pyrometer audit logs, and eliminating energy-wasting batch over-soaking.
            </p>
          </div>
        </div>

        {/* SDG 12 Card */}
        <div className="bg-white rounded-xl border border-emerald-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#2E7D32] text-white font-black text-base flex items-center justify-center shadow-xs">
                12
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0B1F3A]">Responsible Consumption & Production</h3>
                <span className="text-[11px] font-semibold text-[#2E7D32]">Target 12.5: Scrap Reduction & Circular Metals</span>
              </div>
            </div>
            <Recycle className="w-5 h-5 text-[#2E7D32]" />
          </div>

          <p className="text-xs text-[#64748B] leading-relaxed">
            By 2030, substantially reduce waste generation through prevention, reduction, recycling, and reuse.
          </p>

          <div className="bg-[#F4F8FB] p-3 rounded-lg border border-[#DCE5ED] space-y-1.5 text-xs">
            <div className="font-semibold text-[#0B1F3A] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>HEAT LABEL Implementation:</span>
            </div>
            <p className="text-[#64748B] text-[11px]">
              Categorizes defect root causes (quench distortion, oxidation scaling, thermal cracking) and verifies circular 
              divergence of metal back into foundry induction re-melt or certified alloy recycling channels.
            </p>
          </div>
        </div>

        {/* SDG 13 Card */}
        <div className="bg-white rounded-xl border border-teal-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-teal-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-teal-600 text-white font-black text-base flex items-center justify-center shadow-xs">
                13
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0B1F3A]">Climate Action</h3>
                <span className="text-[11px] font-semibold text-teal-700">Target 13.2: Operational Carbon Accounting</span>
              </div>
            </div>
            <CloudFog className="w-5 h-5 text-teal-600" />
          </div>

          <p className="text-xs text-[#64748B] leading-relaxed">
            Integrate climate change measures into national policies, strategies, and operational manufacturing planning.
          </p>

          <div className="bg-[#F4F8FB] p-3 rounded-lg border border-[#DCE5ED] space-y-1.5 text-xs">
            <div className="font-semibold text-[#0B1F3A] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>HEAT LABEL Implementation:</span>
            </div>
            <p className="text-[#64748B] text-[11px]">
              Provides verifiable greenhouse gas accounting (kg CO₂e = Energy × Emission Factor) 
              with documented regulatory citations, distinguishing Scope 1 (gas/diesel) from Scope 2 (grid/solar).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
