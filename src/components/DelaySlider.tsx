import React from 'react';

interface DelaySliderProps {
  delay: number;
  setDelay: (delay: number) => void;
  disabled: boolean;
}

export const DelaySlider: React.FC<DelaySliderProps> = ({ delay, setDelay, disabled }) => {
  return (
    <div>
      <label htmlFor="delay" className="block text-sm font-medium text-gray-600 dark:text-gray-400">
        تاخیر بین درخواست‌ها (ثانیه)
        <span className="text-xs text-gray-600 dark:text-gray-400 ms-2">({delay} ثانیه)</span>
      </label>
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">برای جلوگیری از محدودیت‌های API، یک تاخیر بین هر درخواست تنظیم کنید.</p>
      <input
        id="delay"
        type="range"
        min="0"
        max="120"
        step="1"
        value={delay}
        onChange={(e) => setDelay(parseInt(e.target.value, 10))}
        disabled={disabled}
        className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
};
