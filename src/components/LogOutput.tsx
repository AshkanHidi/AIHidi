import React, { useEffect, useRef } from 'react';
import type { LogEntry } from '../types';
import { TrashIcon } from './icons';

interface LogOutputProps {
  logs: LogEntry[];
  onClearLogs: () => void;
}

const logColorClasses = {
  info: 'text-gray-600 dark:text-gray-400',
  success: 'text-green-600 dark:text-green-400',
  error: 'text-red-600 dark:text-red-400',
};

export const LogOutput: React.FC<LogOutputProps> = ({ logs, onClearLogs }) => {
    const logContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

  return (
    <div className="h-full flex flex-col">
        <div className="flex justify-between items-center p-3 border-b border-gray-300/70 dark:border-gray-700/60 bg-white/30 dark:bg-black/20 shrink-0">
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">رویدادها</h3>
            <button
                onClick={onClearLogs}
                disabled={logs.length === 0}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-200/60 dark:bg-gray-700/60 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="پاک کردن گزارش رویدادها"
            >
                <TrashIcon className="w-4 h-4" />
                <span>پاک کردن</span>
            </button>
        </div>
        <div ref={logContainerRef} className="flex-grow p-4 overflow-y-auto text-sm">
            {logs.length > 0 ? logs.map((log, index) => (
              <div key={index} className={`flex items-start ${logColorClasses[log.type]}`}>
                  <span className="text-gray-500 dark:text-gray-500 me-3 select-none">{log.timestamp}</span>
                  <p className="flex-1 whitespace-pre-wrap break-words">{log.message}</p>
              </div>
            )) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <p>هیچ رویدادی برای نمایش وجود ندارد.</p>
              </div>
            )}
        </div>
    </div>
  );
};
