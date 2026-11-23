import React from 'react';
import { AlertTriangle, Info, AlertCircle, CheckCircle } from 'lucide-react';
import { formatTimeAgo } from '../utils/demoData';

const typeConfig = {
  warning: {
    icon: AlertTriangle,
    borderColor: 'border-l-amber-500',
    iconColor: 'text-amber-400',
    bgAccent: 'bg-amber-500/10',
  },
  info: {
    icon: Info,
    borderColor: 'border-l-sky-500',
    iconColor: 'text-sky-400',
    bgAccent: 'bg-sky-500/10',
  },
  danger: {
    icon: AlertCircle,
    borderColor: 'border-l-red-500',
    iconColor: 'text-red-400',
    bgAccent: 'bg-red-500/10',
  },
  success: {
    icon: CheckCircle,
    borderColor: 'border-l-green-500',
    iconColor: 'text-green-400',
    bgAccent: 'bg-green-500/10',
  },
};

export default function AlertCard({ type = 'info', title, message, timestamp, location }) {
  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <div
      className={`bg-flow-card rounded-xl border-l-4 ${config.borderColor} border border-flow-border p-4 hover:bg-flow-cardLight`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${config.bgAccent} flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${config.iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-semibold text-flow-text">{title}</h4>
            {timestamp && (
              <span className="text-xs text-flow-muted whitespace-nowrap flex-shrink-0">
                {formatTimeAgo(timestamp)}
              </span>
            )}
          </div>
          <p className="text-sm text-flow-muted mt-1 line-clamp-2">{message}</p>
          {location && (
            <span className="inline-block mt-2 text-xs text-flow-muted bg-flow-dark px-2 py-0.5 rounded-full">
              📍 {location}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
