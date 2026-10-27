import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  lightBackground?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showSubtitle = true,
  lightBackground = true 
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }[size];

  const titleSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  }[size];

  const subSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
    xl: 'text-sm',
  }[size];

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Precision Engineered Combined Icon: Thermal Ingot + Heat Wave + Green Leaf */}
      <div className={`relative flex items-center justify-center shrink-0 rounded-xl p-1.5 shadow-sm ${
        lightBackground 
          ? 'bg-gradient-to-br from-[#0B1F3A] to-[#1565C0] text-white border border-[#1565C0]/30' 
          : 'bg-white text-[#0B1F3A] border border-white/20'
      } ${iconDimensions}`}>
        <svg 
          viewBox="0 0 48 48" 
          fill="none" 
          xmlns="file:///C:/Users/WIN%2010/Downloads/c.svg" 
          className="w-full h-full drop-shadow"
        >
          {/* Subtle Industrial Ingot / Chamber Outline */}
          <rect x="6" y="8" width="36" height="32" rx="6" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.3" strokeDasharray="3 2" />
          
          {/* Thermal Waves (Heat / Temperature treatment) */}
          <path 
            d="M14 28C14 28 16 22 19 22C22 22 21 32 25 32C28 32 29 26 32 26" 
            stroke="#60A5FA" 
            strokeWidth="3" 
            strokeLinecap="round" 
          />
          <path 
            d="M17 18C17 18 19 14 22 14C24 14 24.5 19 27.5 19C29.5 19 30.5 16 32 16" 
            stroke="#93C5FD" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeOpacity="0.85"
          />

          {/* Green Sustainability Leaf overlay */}
          <path 
            d="M24 11C31 11 36 17 36 24C36 31 30 36 22 37C22 30 25 24 30 19C25 22 20 27 19 34C15 31 13 25 15 20C17 14 20 11 24 11Z" 
            fill="#4ADE80" 
            fillOpacity="0.9"
          />
          <path 
            d="M22 36C24 28 29 21 35 15" 
            stroke="#166534" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
          />
        </svg>

        {/* Small SDG Green Accent Dot */}
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#4ADE80] border-2 border-[#0B1F3A] rounded-full shadow-sm animate-pulse" />
      </div>

      {/* Typography */}
      <div className="flex flex-col leading-none">
        <div className={`font-black tracking-wider flex items-center gap-1.5 ${titleSizes}`}>
          <span className="text-[#1565C0] font-extrabold tracking-tight">HEAT</span>
          <span className="text-[#2E7D32] font-black tracking-tight">LABEL</span>
        </div>
        {showSubtitle && (
          <span className={`font-semibold tracking-wider uppercase text-[#64748B] mt-1 ${subSizes}`}>
            Sustainable Thermal Mgmt
          </span>
        )}
      </div>
    </div>
  );
};
