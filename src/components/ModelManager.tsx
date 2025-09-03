import React from 'react';
import { ChipIcon, ExclamationTriangleIcon } from './icons';
import { ModelSelection } from './ModelSelection';
import { ModelStatusDisplay } from './ModelStatusDisplay';
import type { ModelStatus } from '../types';

interface ModelManagerProps {
    isChecking: boolean;
    onCheck: () => void;
    statuses: Record<string, ModelStatus>;
    allModels: string[];
    selectedModel: string;
    setSelectedModel: (model: string) => void;
    disabled: boolean;
}

export const ModelManager: React.FC<ModelManagerProps> = ({
    isChecking,
    onCheck,
    statuses,
    allModels,
    selectedModel,
    setSelectedModel,
    disabled
}) => {
    const statusOrder: Record<ModelStatus, number> = {
        'available': 1,
        'checking': 2,
        'unknown': 3,
        'error': 4,
    };

    const sortedModels = [...allModels].sort((a, b) => {
        const statusA = statuses[a] || 'unknown';
        const statusB = statuses[b] || 'unknown';
        if (statusOrder[statusA] !== statusOrder[statusB]) {
            return statusOrder[statusA] - statusOrder[statusB];
        }
        return a.localeCompare(b);
    });
    
    const selectedModelStatus = statuses[selectedModel];
    const showWarning = selectedModel && selectedModelStatus && selectedModelStatus !== 'available';

    return (
        <div className="space-y-4">
            <div>
                <button
                    onClick={onCheck}
                    disabled={isChecking || disabled}
                    className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-lg shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChipIcon className="w-5 h-5 me-2" />
                    {isChecking ? 'در حال بررسی...' : 'بررسی وضعیت مدل‌ها'}
                </button>
            </div>

            <ModelStatusDisplay statuses={statuses} sortedModels={sortedModels} />
            
            <ModelSelection
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
                allModels={allModels}
                statuses={statuses}
                disabled={disabled}
            />

            {showWarning && (
                <div className="flex items-start gap-3 p-3 text-sm text-yellow-800 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg border border-yellow-300 dark:border-yellow-600/50">
                    <ExclamationTriangleIcon className="w-5 h-5 mt-0.5 text-yellow-500 flex-shrink-0" />
                    <p>
                        <strong>هشدار:</strong> مدل انتخاب شده در حال حاضر در دسترس نیست یا وضعیت آن نامشخص است. استفاده از آن ممکن است منجر به شکست عملیات ترجمه شود.
                    </p>
                </div>
            )}
        </div>
    );
};
