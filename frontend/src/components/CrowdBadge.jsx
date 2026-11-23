import React from 'react';

export default function CrowdBadge({ score: propScore, level, category, size = 'md' }) {
  let score = typeof propScore === 'number' ? propScore : (typeof level === 'number' ? level : 50);
  let label = category;
  let colorClasses = '';
  let dotColor = '';

  if (!label) {
    if (score <= 25) {
      label = 'Low';
      colorClasses = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      dotColor = 'bg-emerald-400';
    } else if (score <= 50) {
      label = 'Moderate';
      colorClasses = 'bg-sky-400/15 text-sky-400 border-sky-400/30';
      dotColor = 'bg-sky-400';
    } else if (score <= 75) {
      label = 'High';
      colorClasses = 'bg-amber-400/15 text-amber-400 border-amber-400/30';
      dotColor = 'bg-amber-400';
    } else {
      label = 'Extremely High';
      colorClasses = 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      dotColor = 'bg-rose-400';
    }
  } else {
    const catLower = (label || '').toLowerCase();
    if (catLower === 'low') {
      colorClasses = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      dotColor = 'bg-emerald-400';
    } else if (catLower === 'moderate') {
      colorClasses = 'bg-sky-400/15 text-sky-400 border-sky-400/30';
      dotColor = 'bg-sky-400';
    } else if (catLower === 'high') {
      colorClasses = 'bg-amber-400/15 text-amber-400 border-amber-400/30';
      dotColor = 'bg-amber-400';
    } else {
      colorClasses = 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      dotColor = 'bg-rose-400';
    }
  }

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${colorClasses} ${sizeClasses[size] || sizeClasses.md}`}
    >
      <span className={`${dotSizes[size] || dotSizes.md} rounded-full ${dotColor} animate-pulse`} />
      {label} ({score}%)
    </span>
  );
}
