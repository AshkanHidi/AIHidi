import React, { useRef } from 'react';
import { UploadIcon } from './icons';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled: boolean;
  fileName: string | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled, fileName }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onFileSelect(event.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">فایل زیرنویس (SRT) خود را بارگذاری کنید.</p>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={disabled}
        accept=".srt"
        className="hidden"
      />
      <button
        onClick={handleClick}
        disabled={disabled}
        className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-700/50 hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <UploadIcon className="w-5 h-5 me-2" />
        <span className="truncate">{fileName ? `فایل: ${fileName}` : 'برای انتخاب فایل کلیک کنید'}</span>
      </button>
    </div>
  );
};