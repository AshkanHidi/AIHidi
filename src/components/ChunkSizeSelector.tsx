import React from 'react';

interface ChunkSizeSelectorProps {
  chunkSize: number;
  setChunkSize: (size: number) => void;
  disabled: boolean;
}

const sizeOptions = [
  { label: 'بهینه', value: 25 },
  { label: 'متوسط', value: 50 },
  { label: 'زیاد', value: 100 },
];

export const ChunkSizeSelector: React.FC<ChunkSizeSelectorProps> = ({ chunkSize, setChunkSize, disabled }) => {

  return (
    <div>
      <label htmlFor="chunk-size-select" className="block text-sm font-medium text-gray-600 dark:text-gray-400">
        تعداد خطوط ارسالی در هر درخواست
      </label>
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
        تعداد خطوطی که در هر درخواست به مدل ارسال می‌شود. مقادیر کمتر سریع‌تر پردازش می‌شوند اما ممکن است هزینه کل را افزایش دهند.
      </p>
      <select
        id="chunk-size-select"
        value={chunkSize}
        onChange={(e) => setChunkSize(parseInt(e.target.value, 10))}
        disabled={disabled}
        className="block w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-gray-900 dark:text-gray-200 placeholder-gray-500 px-3 py-2"
        aria-label="انتخاب تعداد خطوط ارسالی"
      >
        {sizeOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label} ({option.value} خط)
          </option>
        ))}
      </select>
    </div>
  );
};
