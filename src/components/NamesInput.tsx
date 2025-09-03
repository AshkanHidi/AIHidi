import React from 'react';

interface NamesInputProps {
  namesGuide: string;
  setNamesGuide: (guide: string) => void;
  disabled: boolean;
}

export const NamesInput: React.FC<NamesInputProps> = ({ namesGuide, setNamesGuide, disabled }) => {
  return (
    <div className="space-y-3 h-full flex flex-col">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        راهنمای اسامی (اختیاری): برای اطمینان از نگارش صحیح اسامی، آن‌ها را در این بخش وارد کنید. (هر کدام در یک خط)
      </p>
      <div className="mt-1 flex-grow">
        <textarea
          id="names-guide"
          name="names-guide"
          value={namesGuide}
          onChange={(e) => setNamesGuide(e.target.value)}
          disabled={disabled}
          className="block w-full h-full bg-gray-50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-gray-900 dark:text-gray-200 placeholder-gray-500 p-2 resize-none"
          placeholder={`مثال:
Walter White = والتر وایت
Jesse Pinkman = جسی پینکمن`}
        />
      </div>
    </div>
  );
};
