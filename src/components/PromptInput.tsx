import React from 'react';

export type PromptMode = 'default' | 'custom';

interface PromptInputProps {
  mode: PromptMode;
  setMode: (mode: PromptMode) => void;
  customPrompt: string;
  setCustomPrompt: (prompt: string) => void;
  disabled: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ mode, setMode, customPrompt, setCustomPrompt, disabled }) => {
  return (
    <div className="space-y-3">
      <div className="flex space-x-2 space-x-reverse rounded-xl bg-gray-200/60 dark:bg-gray-900/60 p-1">
        <div className="flex-1">
            <input
                type="radio"
                id="default-prompt"
                name="prompt-mode"
                value="default"
                checked={mode === 'default'}
                onChange={() => setMode('default')}
                disabled={disabled}
                className="sr-only peer"
            />
            <label
                htmlFor="default-prompt"
                className="block w-full text-center cursor-pointer rounded-lg py-1.5 px-2 text-sm font-medium peer-checked:bg-white dark:peer-checked:bg-gray-800/80 peer-checked:shadow text-gray-700 dark:text-gray-300 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed transition-colors"
            >
                پیش‌فرض
            </label>
        </div>
        <div className="flex-1">
            <input
                type="radio"
                id="custom-prompt"
                name="prompt-mode"
                value="custom"
                checked={mode === 'custom'}
                onChange={() => setMode('custom')}
                disabled={disabled}
                className="sr-only peer"
            />
            <label
                htmlFor="custom-prompt"
                className="block w-full text-center cursor-pointer rounded-lg py-1.5 px-2 text-sm font-medium peer-checked:bg-white dark:peer-checked:bg-gray-800/80 peer-checked:shadow text-gray-700 dark:text-gray-300 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed transition-colors"
            >
                سفارشی
            </label>
        </div>
      </div>
      
      {mode === 'default' && (
         <p className="text-xs text-gray-600 dark:text-gray-400 p-2 bg-gray-100 dark:bg-gray-900/50 rounded-md">
            استفاده از پرامپت پیش‌فرض برای بهترین کیفیت ترجمه توصیه می‌شود.
         </p>
      )}

      {mode === 'custom' && (
        <div className="mt-1">
          <textarea
            id="prompt"
            name="prompt"
            rows={2}
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            disabled={disabled}
            className="block w-full bg-gray-50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-gray-900 dark:text-gray-200 placeholder-gray-500 p-2 transition-opacity duration-300"
            placeholder="مثال: ترجمه بسیار روان و خودمانی باشد، مناسب برای سریال کمدی."
          />
        </div>
      )}
    </div>
  );
};
