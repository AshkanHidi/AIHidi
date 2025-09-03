import React from 'react';
import type { ModelStatus } from '../types';

interface ModelSelectionProps {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  allModels: string[];
  statuses: Record<string, ModelStatus>;
  disabled: boolean;
}

export const ModelSelection: React.FC<ModelSelectionProps> = ({ selectedModel, setSelectedModel, allModels, statuses, disabled }) => {
  const getStatusText = (status: ModelStatus) => {
    switch (status) {
      case 'available':
        return ' (در دسترس)';
      case 'error':
        return ' (غیرقابل دسترس)';
      case 'checking':
        return ' (در حال بررسی)';
      default:
        return ' (وضعیت نامشخص)';
    }
  };

  return (
    <div className="space-y-2 mt-4">
      <label htmlFor="model-select" className="block text-sm font-medium text-gray-600 dark:text-gray-400">
        انتخاب مدل
      </label>
      <div className="mt-1">
        {allModels.length > 0 ? (
          <select
            id="model-select"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={disabled}
            className="block w-full text-left ltr bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-gray-900 dark:text-gray-200 placeholder-gray-500 px-3 py-2"
            aria-label="انتخاب مدل دستی"
          >
            <option value="" disabled>یک مدل را انتخاب کنید...</option>
            {allModels.map(model => {
              const status = statuses[model] || 'unknown';
              const isAvailable = status === 'available';
              return (
                <option
                  key={model}
                  value={model}
                  className={!isAvailable ? 'text-gray-500 dark:text-gray-400' : ''}
                >
                  {model}{getStatusText(status)}
                </option>
              );
            })}
          </select>
        ) : (
          <p className="text-xs text-center text-gray-500 dark:text-gray-400 p-2 bg-gray-200/50 dark:bg-gray-900/50 rounded-md">
            لیست مدل‌ها برای بارگذاری موجود نیست.
          </p>
        )}
      </div>
    </div>
  );
};
