import React from 'react';
import { EmblemType } from '../types/muvafakatname';

export const Emblem: React.FC<{ type: EmblemType; className?: string }> = ({ type, className = "w-12 h-12" }) => {
  if (type === 'none') return null;

  if (type === 'tc') {
    return (
      <div className={`flex flex-col items-center justify-center text-red-700 ${className}`} title="T.C. Ay Yıldız Resmi Arması">
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full drop-shadow-sm">
          {/* Circular frame */}
          <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 1.5" />
          {/* Crescent */}
          <path
            d="M 52 22 A 26 26 0 1 0 52 74 A 20.8 20.8 0 1 1 52 22 Z"
            fill="currentColor"
          />
          {/* Star rotated at 18 degrees */}
          <polygon
            points="63,48 57,45 61,40 55,41 53,35 50,40 44,40 48,44 45,50 51,46"
            fill="currentColor"
            transform="rotate(2 50 50)"
          />
        </svg>
        <span className="text-[9px] tracking-[0.2em] font-serif font-bold text-stone-700 mt-1 uppercase">
          T.C.
        </span>
      </div>
    );
  }

  if (type === 'justice') {
    return (
      <div className={`flex flex-col items-center justify-center text-stone-800 ${className}`} title="Adalet Terazisi Hukuki Arması">
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          {/* Central pillar */}
          <line x1="32" y1="8" x2="32" y2="54" strokeWidth="2.5" />
          <path d="M 24 54 L 40 54 L 37 58 L 27 58 Z" fill="currentColor" />
          <circle cx="32" cy="11" r="3" fill="currentColor" />
          {/* Balance beam */}
          <line x1="12" y1="20" x2="52" y2="20" strokeWidth="2.2" />
          <circle cx="32" cy="20" r="2.5" fill="currentColor" />
          {/* Left Pan */}
          <line x1="12" y1="20" x2="8" y2="34" />
          <line x1="12" y1="20" x2="16" y2="34" />
          <path d="M 6 34 Q 12 40 18 34 Z" fill="currentColor" />
          {/* Right Pan */}
          <line x1="52" y1="20" x2="48" y2="34" />
          <line x1="52" y1="20" x2="56" y2="34" />
          <path d="M 46 34 Q 52 40 58 34 Z" fill="currentColor" />
        </svg>
        <span className="text-[8px] tracking-[0.25em] font-serif font-semibold text-stone-600 mt-0.5 uppercase">
          HUKUK & ADALET
        </span>
      </div>
    );
  }

  if (type === 'company') {
    return (
      <div className={`flex flex-col items-center justify-center text-stone-700 ${className}`} title="Kurumsal Tescil Mührü">
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-full h-full">
          <circle cx="32" cy="32" r="28" strokeWidth="2" strokeDasharray="3 1.5" />
          <circle cx="32" cy="32" r="23" strokeWidth="1" />
          <polygon points="32,16 36,26 47,27 38,34 41,45 32,39 23,45 26,34 17,27 28,26" fill="currentColor" opacity="0.15" />
          <path d="M22 32 L30 38 L42 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-[8px] tracking-[0.18em] font-sans font-bold text-stone-600 mt-0.5 uppercase">
          RESMİ MÜHÜR
        </span>
      </div>
    );
  }

  return null;
};

export const TCAyYildizEmblem: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2.5" />
    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3,2" />
    <path
      d="M52 24 A26 26 0 1 0 52 76 A20 20 0 1 1 52 24 Z"
      fill="currentColor"
    />
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
    <circle cx="50" cy="50" r="45" strokeWidth="2" />
    <line x1="50" y1="20" x2="50" y2="78" strokeWidth="3" />
    <line x1="26" y1="32" x2="74" y2="32" strokeWidth="3" strokeLinecap="round" />
    <circle cx="50" cy="22" r="3" fill="currentColor" />
    <line x1="26" y1="32" x2="16" y2="52" />
    <line x1="26" y1="32" x2="36" y2="52" />
    <path d="M14 52 Q26 62 38 52 Z" fill="currentColor" fillOpacity="0.2" />
    <line x1="74" y1="32" x2="64" y2="52" />
    <line x1="74" y1="32" x2="84" y2="52" />
    <path d="M62 52 Q74 62 86 52 Z" fill="currentColor" fillOpacity="0.2" />
    <line x1="38" y1="78" x2="62" y2="78" strokeWidth="4" strokeLinecap="round" />
  </svg>
);
