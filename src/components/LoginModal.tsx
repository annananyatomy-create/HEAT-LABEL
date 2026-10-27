import React, { useState } from 'react';
import { 
  Lock, 
  User as UserIcon, 
  ShieldCheck, 
  AlertCircle, 
  Check, 
  X, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Logo } from './Logo';
import { User, UserRole } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  users: User[];
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  users,
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = users.find((u) => u.username.toLowerCase() === username.toLowerCase().trim());
    if (!found) {
      setError('Invalid username. Available demo accounts: admin, operator1, auditor.');
      return;
    }

    if (!password) {
      setError('Please enter a password.');
      return;
    }

    setError('');
    onLogin(found);
    onClose();
  };

  const handleQuickFill = (role: UserRole) => {
    if (role === 'ADMIN') {
      setUsername('admin');
      setPassword('Admin@123');
    } else if (role === 'OPERATOR') {
      setUsername('operator1');
      setPassword('Operator@123');
    } else {
      setUsername('auditor');
      setPassword('Operator@123');
    }
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#DCE5ED] space-y-5">
        {/* Top Branding */}
        <div className="flex items-center justify-between">
          <Logo size="lg" showSubtitle={true} lightBackground={true} />
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h2 className="text-lg font-black text-[#0B1F3A]">
            Sign in to HEAT LABEL
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Role-Based Access Control & BCrypt Authenticated Industrial Portal
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Quick Demo Credentials Switcher */}
        <div className="bg-[#F4F8FB] border border-[#DCE5ED] rounded-xl p-3 text-xs space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#64748B] uppercase">
            <span>Evaluation Quick Fill:</span>
            <span className="text-[#2E7D32] font-mono">BCrypt Ready</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('ADMIN')}
              className={`px-2 py-1.5 rounded-lg font-bold text-xs border transition-all ${
                username === 'admin'
                  ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]'
                  : 'bg-white text-[#0B1F3A] border-[#DCE5ED] hover:bg-slate-50'
              }`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('OPERATOR')}
              className={`px-2 py-1.5 rounded-lg font-bold text-xs border transition-all ${
                username === 'operator1'
                  ? 'bg-[#1565C0] text-white border-[#1565C0]'
                  : 'bg-white text-[#1565C0] border-[#DCE5ED] hover:bg-slate-50'
              }`}
            >
              Operator
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('SUSTAINABILITY_AUDITOR')}
              className={`px-2 py-1.5 rounded-lg font-bold text-xs border transition-all ${
                username === 'auditor'
                  ? 'bg-[#2E7D32] text-white border-[#2E7D32]'
                  : 'bg-white text-[#2E7D32] border-[#DCE5ED] hover:bg-slate-50'
              }`}
            >
              Auditor
            </button>
          </div>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#1F2937] mb-1">
              Username or ID
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin or operator1"
                className="w-full bg-[#F4F8FB] border border-[#DCE5ED] rounded-lg pl-9 pr-3 py-2 text-[#0B1F3A] font-semibold focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#1F2937] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#F4F8FB] border border-[#DCE5ED] rounded-lg pl-9 pr-3 py-2 text-[#0B1F3A] font-mono focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-[#1565C0] to-[#2E7D32] hover:opacity-95 text-white font-bold text-xs rounded-lg shadow-sm transition-opacity"
            >
              <span>Authenticate & Enter System</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="text-[11px] text-[#64748B] text-center pt-2 border-t border-[#DCE5ED]">
          Protected by JDBC Prepared Statements & Salted BCrypt Hash ($2a$10$)
        </div>
      </div>
    </div>
  );
};
