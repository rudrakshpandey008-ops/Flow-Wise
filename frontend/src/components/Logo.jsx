import React from 'react';

export default function Logo({ size = 'md', showText = true }) {
  const sizes = {
    sm: { icon: 28, text: 'text-lg', gap: 'gap-1.5' },
    md: { icon: 36, text: 'text-xl', gap: 'gap-2' },
    lg: { icon: 48, text: 'text-3xl', gap: 'gap-3' },
    xl: { icon: 64, text: 'text-4xl', gap: 'gap-4' },
  };

  const s = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center ${s.gap}`}>
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Outer circle with gradient */}
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="48" y2="48">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
          <linearGradient id="pathGrad" x1="10" y1="10" x2="38" y2="38">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="50%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
        </defs>

        {/* Background circle */}
        <circle cx="24" cy="24" r="22" stroke="url(#logoGrad)" strokeWidth="2" fill="none" opacity="0.3" />

        {/* Compass / Flow path - main route */}
        <path
          d="M12 32C12 32 16 20 24 16C32 12 36 24 28 28C20 32 24 38 36 34"
          stroke="url(#pathGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Flow node dots */}
        <circle cx="12" cy="32" r="3" fill="#22C55E" />
        <circle cx="24" cy="16" r="2.5" fill="#34D399" />
        <circle cx="28" cy="28" r="2.5" fill="#38BDF8" />
        <circle cx="36" cy="34" r="3" fill="#38BDF8" />

        {/* Compass needle */}
        <path
          d="M24 10L26 14L24 13L22 14Z"
          fill="#22C55E"
        />

        {/* Secondary flow path */}
        <path
          d="M14 18C18 14 28 14 32 20"
          stroke="#22C55E"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="3 3"
          fill="none"
          opacity="0.5"
        />

        {/* Pulse ring */}
        <circle cx="24" cy="24" r="18" stroke="#22C55E" strokeWidth="0.5" fill="none" opacity="0.2" />
      </svg>

      {showText && (
        <span className={`${s.text} font-extrabold tracking-tight`}>
          <span className="text-flow-accent">FLOW</span>
          <span className="text-flow-text">WISE</span>
        </span>
      )}
    </div>
  );
}
