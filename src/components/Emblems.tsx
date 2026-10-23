import React from 'react';

export const TCAyYildizEmblem: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Dış Çember / Resmî Mühür Çerçevesi */}
    <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2.5" />
    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3,2" />
    {/* Hilal */}
    <path
      d="M52 24 A26 26 0 1 0 52 76 A20 20 0 1 1 52 24 Z"
      fill="currentColor"
    />
    {/* Yıldız */}
    <polygon
      points="62,40 64,47 71,47 65.5,51 67.5,58 62,53.5 56.5,58 58.5,51 53,47 60,47"
      fill="currentColor"
    />
  </svg>
);

export const SGKEmblem: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Modern SGK Tipografik Logo Rozeti */}
    <rect x="8" y="8" width="84" height="84" rx="20" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" />
    <circle cx="50" cy="40" r="18" stroke="currentColor" strokeWidth="3" />
    <path d="M30 74 C 30 58, 70 58, 70 74" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    <text x="50" y="90" textAnchor="middle" fontSize="10" fontWeight="900" fill="currentColor" fontFamily="sans-serif">
      SGK
    </text>
  </svg>
);

export const AdaletEmblem: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Terazi ve Adalet Rozeti */}
    <circle cx="50" cy="50" r="45" strokeWidth="2" />
    <line x1="50" y1="20" x2="50" y2="78" strokeWidth="3" />
    <line x1="26" y1="32" x2="74" y2="32" strokeWidth="3" strokeLinecap="round" />
    <circle cx="50" cy="22" r="3" fill="currentColor" />
    {/* Sol Kefe */}
    <line x1="26" y1="32" x2="16" y2="52" />
    <line x1="26" y1="32" x2="36" y2="52" />
    <path d="M14 52 Q26 62 38 52 Z" fill="currentColor" fillOpacity="0.2" />
    {/* Sağ Kefe */}
    <line x1="74" y1="32" x2="64" y2="52" />
    <line x1="74" y1="32" x2="84" y2="52" />
    <path d="M62 52 Q74 62 86 52 Z" fill="currentColor" fillOpacity="0.2" />
    {/* Taban */}
    <line x1="38" y1="78" x2="62" y2="78" strokeWidth="4" strokeLinecap="round" />
  </svg>
);
