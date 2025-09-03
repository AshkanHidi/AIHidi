import React from 'react';
import { PlusIcon, TrashIcon } from './icons';

interface ApiKeyManagerProps {
  apiKeys: string[];
  setApiKeys: React.Dispatch<React.SetStateAction<string[]>>;
  disabled: boolean;
}

export const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ apiKeys, setApiKeys, disabled }) => {
  const handleAddKey = () => {
    setApiKeys([...apiKeys, '']);
  };

  const handleKeyChange = (index: number, value: string) => {
    const newKeys = [...apiKeys];
    newKeys[index] = value;
    setApiKeys(newKeys);
  };

  const handleRemoveKey = (index: number) => {
    if (apiKeys.length <= 1) return;
    const newKeys = apiKeys.filter((_, i) => i !== index);
    setApiKeys(newKeys);
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        کلیدهای API خود را وارد کنید. در صورت استفاده از چند کلید، برنامه به صورت خودکار بین آن‌ها جابجا می‌شود.
      </p>
      {apiKeys.map((key, index) => (
        <div key={index} className="flex items-center space-x-2 space-x-reverse">
          <input
            type="password"
            placeholder={`کلید API شماره ${index + 1}`}
            value={key}
            onChange={(e) => handleKeyChange(index, e.target.value)}
            disabled={disabled}
            className="block w-full text-left ltr bg-gray-50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-gray-900 dark:text-gray-200 placeholder-gray-500 px-3 py-2"
          />
          {apiKeys.length > 1 && (
            <button
              onClick={() => handleRemoveKey(index)}
              disabled={disabled}
              className="p-2 text-gray-600 dark:text-gray-400 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      ))}
      <button
        onClick={handleAddKey}
        disabled={disabled}
        className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-teal-600 dark:text-teal-300 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <PlusIcon className="w-4 h-4 me-2" />
        افزودن کلید جدید
      </button>
    </div>
  );
};