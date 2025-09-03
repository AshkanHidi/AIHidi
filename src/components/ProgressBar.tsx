import React from 'react';

interface TranslationProgressProps {
  progress: number;
  eta: string;
  currentChunk: number;
  totalChunks: number;
}

export const TranslationProgress: React.FC<TranslationProgressProps> = ({
  progress,
  eta,
  currentChunk,
  totalChunks,
}) => {
  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg p-4 rounded-xl border border-gray-200 dark:border-gray-700/80 shadow-md">
      <div className="flex justify-between items-center text-sm mb-2 flex-wrap gap-x-4 gap-y-1">
        <span className="font-semibold text-teal-600 dark:text-teal-400">وضعیت: در حال پردازش</span>
        <div className="flex gap-4 text-gray-700 dark:text-gray-300">
          {totalChunks > 1 && <span>{`بخش: ${currentChunk} / ${totalChunks}`}</span>}
          {eta && <span className="text-orange-500 dark:text-orange-400">{`زمان باقی‌مانده: ${eta}`}</span>}
        </div>
        <span className="font-semibold text-teal-600 dark:text-teal-400">{`پیشرفت: ${Math.round(progress)}%`}</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-gradient-to-r from-teal-400 to-teal-600 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
