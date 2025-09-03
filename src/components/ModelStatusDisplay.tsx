import React from 'react';
import { CheckCircleIcon, XCircleIcon, ClockIcon, QuestionMarkCircleIcon } from './icons';
import type { ModelStatus } from '../types';

interface ModelStatusDisplayProps {
  statuses: Record<string, ModelStatus>;
  sortedModels: string[];
}

const statusConfig: Record<ModelStatus, { text: string; icon: React.FC<{ className?: string }>; color: string; animate?: boolean }> = {
  available: { text: 'در دسترس', icon: CheckCircleIcon, color: 'text-green-500 dark:text-green-400' },
  error: { text: 'خطا/عدم دسترسی', icon: XCircleIcon, color: 'text-red-500 dark:text-red-400' },
  checking: { text: 'در حال بررسی...', icon: ClockIcon, color: 'text-blue-500 dark:text-blue-400', animate: true },
  unknown: { text: 'بررسی نشده', icon: QuestionMarkCircleIcon, color: 'text-gray-500' },
};

export const ModelStatusDisplay: React.FC<ModelStatusDisplayProps> = ({ statuses, sortedModels }) => {
  if (Object.values(statuses).every(s => s === 'unknown')) {
    return (
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 p-2 bg-gray-200/50 dark:bg-gray-900/50 rounded-md">
            برای انتخاب مدل، ابتدا وضعیت‌ها را بررسی کنید.
        </p>
    );
  }

  return (
    <div className="space-y-2 bg-gray-200/50 dark:bg-gray-900/50 p-3 rounded-xl border border-gray-300 dark:border-gray-700 shadow-inner">
      <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 px-1 pb-2 border-b border-gray-300/80 dark:border-gray-600/80">
        لیست مدل‌های هوش مصنوعی
      </h4>
      <ul className="space-y-1 max-h-40 overflow-y-auto p-1">
        {sortedModels.map(modelName => {
          const status = statuses[modelName] || 'unknown';
          const config = statusConfig[status];
          const Icon = config.icon;
          const isUnavailable = status === 'error' || status === 'unknown';

          return (
            <li 
              key={modelName} 
              className={`flex items-center justify-between text-xs p-1.5 rounded-md transition-colors ${isUnavailable ? 'opacity-70' : ''}`}
            >
              <div className="flex items-center min-w-0">
                <Icon className={`w-4 h-4 flex-shrink-0 me-2 ${config.animate ? 'animate-spin' : ''} ${config.color}`} />
                <span className="font-mono text-left ltr text-gray-700 dark:text-gray-300 truncate" title={modelName}>{modelName}</span>
              </div>
              <span className={`font-semibold whitespace-nowrap ms-2 ${config.color}`}>{config.text}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};