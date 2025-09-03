import React from 'react';
import type { ModelMode } from '../types';

interface ModelModeSelectorProps {
  mode: ModelMode;
  setMode: (mode: ModelMode) => void;
  disabled: boolean;
}

export const ModelModeSelector: React.FC<ModelModeSelectorProps> = ({ mode, setMode, disabled }) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">حالت پردازش مدل</label>
      
      <div className="flex space-x-4 space-x-reverse rounded-md bg-gray-200 dark:bg-gray-900 p-2">
        <div className="flex-1">
            <input
                type="radio"
                id="quality-mode"
                name="model-mode"
                value="quality"
                checked={mode === 'quality'}
                onChange={() => setMode('quality')}
                disabled={disabled}
                className="sr-only peer"
            />
            <label
                htmlFor="quality-mode"
                className="block w-full text-center cursor-pointer rounded-md py-2 px-3 text-sm font-medium peer-checked:bg-teal-600 peer-checked:text-white text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"
            >
                کیفیت بالا (پیشنهادی)
            </label>
        </div>
        <div className="flex-1">
            <input
                type="radio"
                id="speed-mode"
                name="model-mode"
                value="speed"
                checked={mode === 'speed'}
                onChange={() => setMode('speed')}
                disabled={disabled}
                className="sr-only peer"
            />
            <label
                htmlFor="speed-mode"
                className="block w-full text-center cursor-pointer rounded-md py-2 px-3 text-sm font-medium peer-checked:bg-teal-600 peer-checked:text-white text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"
            >
                سرعت بالا
            </label>
        </div>
      </div>
      
      {mode === 'quality' && (
         <p className="text-xs text-gray-600 dark:text-gray-400 p-2 bg-gray-200/50 dark:bg-gray-900/50 rounded-md">
            در این حالت، مدل از قابلیت تفکر برای ارائه ترجمه‌های با کیفیت‌تر استفاده می‌کند.
         </p>
      )}
       {mode === 'speed' && (
         <p className="text-xs text-gray-600 dark:text-gray-400 p-2 bg-gray-200/50 dark:bg-gray-900/50 rounded-md">
            در این حالت، قابلیت تفکر مدل غیرفعال شده تا پاسخ‌ها با سرعت بیشتری تولید شوند.
         </p>
      )}
    </div>
  );
};
