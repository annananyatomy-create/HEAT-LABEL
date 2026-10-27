import React from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  Flame, 
  Zap, 
  CloudFog, 
  Trash2, 
  FileSpreadsheet, 
  Globe2, 
  Database, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  UserCheck 
} from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User | null;
  onLogout: () => void;
  onOpenLogin: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
  onOpenLogin,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Main Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'batches', label: 'Heat Treatments', icon: Flame, badge: 'Live' },
    { id: 'materials', label: 'Materials & Grades', icon: Layers, badge: null },
    { id: 'energy', label: 'Energy Monitoring', icon: Zap, badge: 'kWh/kg' },
    { id: 'emissions', label: 'Carbon Calculator', icon: CloudFog, badge: 'CO₂e' },
    { id: 'waste', label: 'Waste & Scrap', icon: Trash2, badge: 'SDG 12' },
    { id: 'reports', label: 'Sustainability Reports', icon: FileSpreadsheet, badge: 'CSV' },
    { id: 'sdg', label: 'UN SDG Alignment', icon: Globe2, badge: 'UN 7/9/12/13' },
    { id: 'schema', label: 'Stage 1: DB & Architecture', icon: Database, badge: 'MySQL' },
    { id: 'settings', label: 'System Settings', icon: Settings, badge: null },
  ];

  return (
    <aside className="w-64 bg-[#0B1F3A] text-slate-200 flex flex-col shrink-0 border-r border-slate-800 select-none">
      {/* Top Section / Brand Tagline */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            ISO 14001 & UN SDG
          </span>
          <span className="text-[10px] bg-blue-900/60 text-blue-300 font-mono px-1.5 py-0.5 rounded border border-blue-700/50">
            v1.0.0
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 leading-tight">
          Industrial Heat-Treatment Management & Decarbonization System
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Core Operations
        </div>
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#1565C0] text-white shadow-md shadow-blue-900/40 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-slate-800 text-blue-300 border border-slate-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-3 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Decarbonization & Circularity
        </div>
        {navItems.slice(4, 8).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#2E7D32] text-white shadow-md shadow-green-900/40 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-3 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          System & Architecture
        </div>
        {navItems.slice(8).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-slate-700 text-white shadow-md font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Session Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60">
        {currentUser ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1565C0] to-[#2E7D32] flex items-center justify-center text-white font-bold text-xs shrink-0 shadow">
                {currentUser.fullName.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">
                  {currentUser.fullName}
                </div>
                <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 shrink-0" />
                  <span className="truncate">{currentUser.role}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onLogout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#1565C0] hover:bg-blue-600 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            <UserCheck className="w-4 h-4" />
            <span>Sign In to System</span>
          </button>
        )}
      </div>
    </aside>
  );
};
