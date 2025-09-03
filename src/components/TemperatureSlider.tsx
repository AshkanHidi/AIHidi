import React from 'react';

interface TemperatureSliderProps {
  temperature: number;
  setTemperature: (temp: number) => void;
  disabled: boolean;
}

export const TemperatureSlider: React.FC<TemperatureSliderProps> = ({ temperature, setTemperature, disabled }) => {
  return (
    <div>
      <label htmlFor="temperature" className="block text-sm font-medium text-gray-600 dark:text-gray-400">
        دما (Temperature)
        <span className="text-xs text-gray-600 dark:text-gray-400 ms-2">({temperature.toFixed(1)})</span>
      </label>
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">مقادیر کمتر باعث پاسخ‌های قطعی‌تر و مقادیر بیشتر باعث پاسخ‌های خلاقانه‌تر می‌شود.</p>
      
      <input
        id="temperature"
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={temperature}
        onChange={(e) => setTemperature(parseFloat(e.target.value))}
        disabled={disabled}
        className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-teal-500 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
      />
    </div>
  );
};
