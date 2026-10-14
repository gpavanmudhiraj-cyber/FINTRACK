import React from 'react';

const Logo = ({ size = 36, showText = true, className = '' }) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <defs>
          <linearGradient id="fintrackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <linearGradient id="fintrackInner" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.75" />
          </linearGradient>
        </defs>

        {/* Rounded square base with gradient */}
        <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#fintrackGrad)" />

        {/* Chart bars */}
        <rect x="12" y="28" width="5" height="10" rx="1.5" fill="url(#fintrackInner)" />
        <rect x="21.5" y="22" width="5" height="16" rx="1.5" fill="url(#fintrackInner)" />
        <rect x="31" y="16" width="5" height="22" rx="1.5" fill="url(#fintrackInner)" />

        {/* Upward trend line */}
        <path
          d="M13 22 L23 15 L33 10"
          stroke="#ffffff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.95"
        />

        {/* Arrow head */}
        <path
          d="M28 10 L33 10 L33 15"
          stroke="#ffffff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.95"
        />
      </svg>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            FinTrack
          </span>
          <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 tracking-wide uppercase mt-0.5">
            Personal Finance
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;