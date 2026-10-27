import React from 'react';
import { 
  Database, 
  Search, 
  Bell, 
  Calendar, 
  Layers, 
  PlusCircle, 
  Shield, 
  RefreshCw 
} from 'lucide-react';
import { Logo } from './Logo';
import { User, UserRole } from '../types';

interface HeaderProps {
  currentUser: User | null;
  onSwitchRole: (role: UserRole) => void;
  onQuickAction: (action: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSwitchRole,
  onQuickAction,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <header className="h-16 bg-white border-b border-[#DCE5ED] px-6 flex items-center justify-between shrink-0 shadow-xs z-10">
      {/* Left: Distinctive HEAT LABEL Logo */}
      <div className="flex items-center gap-6">
        <Logo size="md" showSubtitle={true} lightBackground={true} />

        {/* Database & JDBC Connection Status Badge */}
        <div className="hidden lg:flex items-center gap-2 bg-[#F4F8FB] border border-[#DCE5ED] px-3 py-1.5 rounded-full text-xs">
          <div className="relative flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
            <span className="w-2 h-2 rounded-full bg-[#66BB6A] animate-ping absolute" />
          </div>
          <span className="font-mono font-semibold text-[#0B1F3A]">MySQL 8.0</span>
          <span className="text-[#64748B]">|</span>
          <span className="font-mono text-xs text-[#2E7D32] font-medium">heat_label_db</span>
          <span className="text-[10px] bg-[#1565C0]/10 text-[#1565C0] font-bold px-1.5 py-0.5 rounded">
            JDBC ACTIVE
          </span>
        </div>
      </div>

      {/* Center: Search Field */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search batches (HT-2026-001), materials (AISI 4140), or logs..."
            className="w-full bg-[#F4F8FB] border border-[#DCE5ED] rounded-lg pl-9 pr-4 py-1.5 text-xs text-[#1F2937] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#1565C0]/30 focus:border-[#1565C0] transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#64748B] hover:text-[#1F2937]"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Right: Quick Actions & Role Switcher */}
      <div className="flex items-center gap-3">
        {/* Quick Batch Creation Button */}
        <button
          onClick={() => onQuickAction('new-batch')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#1565C0] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Batch</span>
        </button>

        {/* Role Switcher Pill for College Evaluation */}
        <div className="flex items-center bg-[#F4F8FB] border border-[#DCE5ED] rounded-lg p-0.5">
          <div className="px-2 py-1 text-[11px] font-medium text-[#64748B] flex items-center gap-1">
            <Shield className="w-3 h-3 text-[#1565C0]" />
            <span className="hidden xl:inline">Role:</span>
          </div>
          {(['ADMIN', 'OPERATOR', 'SUSTAINABILITY_AUDITOR'] as UserRole[]).map((role) => {
            const isActive = currentUser?.role === role;
            const labels = {
              ADMIN: 'Admin',
              OPERATOR: 'Operator',
              SUSTAINABILITY_AUDITOR: 'Auditor',
            };
            return (
              <button
                key={role}
                onClick={() => onSwitchRole(role)}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  isActive
                    ? role === 'ADMIN'
                      ? 'bg-[#0B1F3A] text-white shadow-xs'
                      : role === 'OPERATOR'
                      ? 'bg-[#1565C0] text-white shadow-xs'
                      : 'bg-[#2E7D32] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#1F2937] hover:bg-white'
                }`}
                title={`Switch active session role to ${role}`}
              >
                {labels[role]}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
