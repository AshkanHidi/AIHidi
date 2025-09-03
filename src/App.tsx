

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type { LogEntry, SubtitleEntry, ModelStatus } from './types';
import { FileUpload } from './components/FileUpload';
import { ApiKeyManager } from './components/ApiKeyManager';
import { PromptInput, PromptMode } from './components/PromptInput';
import { SubtitleDisplay } from './components/SubtitleDisplay';
import { TranslationProgress } from './components/ProgressBar';
import { LogOutput } from './components/LogOutput';
import { 
    CheckmarkIcon, 
    DownloadIcon, 
    PencilIcon,
    CogIcon,
    TerminalIcon,
    FileTextIcon,
    KeyIcon,
    ChipIcon,
    PlayIcon,
    StopCircleIcon,
    TelegramIcon,
    MailIcon
} from './components/icons';
import { parseSrt, stringifySrt } from './services/srtParser';
import { translateChunk, checkModelStatus } from './services/geminiService';
import { DelaySlider } from './components/DelaySlider';
import { NamesInput } from './components/NamesInput';
import { TemperatureSlider } from './components/TemperatureSlider';
import { ThemeToggle } from './components/ThemeToggle';
import { ModelManager } from './components/ModelManager';
import { ChunkSizeSelector } from './components/ChunkSizeSelector';

const ALL_MODELS = [
    'gemini-2.5-flash',
    'gemini-2.5-pro',
    'gemini-2.5-flash-lite',
    'gemini-live-2.5-flash-preview',
    'gemini-2.5-flash-preview-native-audio-dialog',
    'gemini-2.5-flash-exp-native-audio-thinking-dialog',
    'gemini-2.5-flash-preview-tts',
    'gemini-2.5-pro-preview-tts',
    'gemini-2.0-flash',
    'gemini-2.0-flash-preview-image-generation',
    'gemini-2.0-flash-lite',
    'gemini-2.0-flash-live-001',
    'gemini-1.5-flash',
];

const SettingsCard = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700/80 p-5 sm:p-6 h-full flex flex-col">
    <div className="flex items-center gap-3 mb-4">
      {icon}
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h2>
    </div>
    <div className="flex-grow">
      {children}
    </div>
  </div>
);


export default function App() {
  const [apiKeys, setApiKeys] = useState<string[]>(['']);
  const [customPrompt, setCustomPrompt] = useState<string>('ترجمه روان و محاوره‌ای باشد.');
  const [promptMode, setPromptMode] = useState<PromptMode>('default');
  const [namesGuide, setNamesGuide] = useState<string>('');
  const [chunkSize, setChunkSize] = useState<number>(25);
  const [delay, setDelay] = useState<number>(10);
  const [temperature, setTemperature] = useState<number>(0.3);
  
  const [translatedSrt, setTranslatedSrt] = useState<string>('');
  const [subtitleEntries, setSubtitleEntries] = useState<SubtitleEntry[]>([]);
  const [translatedEntries, setTranslatedEntries] = useState<SubtitleEntry[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [eta, setEta] = useState<string>('');
  const [currentChunk, setCurrentChunk] = useState<number>(0);
  const [totalChunks, setTotalChunks] = useState<number>(0);
  const isCancelledRef = useRef<boolean>(false);
  const apiKeyIndexRef = useRef<number>(0);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const [selectedModel, setSelectedModel] = useState<string>('');
  const [modelStatuses, setModelStatuses] = useState<Record<string, ModelStatus>>(() =>
    Object.fromEntries(ALL_MODELS.map(m => [m, 'unknown']))
  );
  const [isCheckingModels, setIsCheckingModels] = useState<boolean>(false);
  
  const [activeTab, setActiveTab] = useState<'settings' | 'subtitles' | 'log'>('settings');

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && localStorage.theme) {
      return localStorage.theme as 'light' | 'dark';
    }
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const addLog = useCallback((type: LogEntry['type'], message: string) => {
    const timestamp = new Date().toLocaleTimeString('fa-IR');
    setLogs(prev => [...prev, { type, message, timestamp }]);
  }, []);

  const handleClearLogs = useCallback(() => {
    setLogs([]);
    addLog('info', 'گزارش رویدادها پاک شد.');
  }, [addLog]);

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const parsedEntries = parseSrt(content);
      setSubtitleEntries(parsedEntries);
      addLog('info', `فایل "${file.name}" با موفقیت بارگذاری شد. تعداد ${parsedEntries.length} خط زیرنویس شناسایی شد.`);
      setFileName(file.name);
      setTranslatedSrt('');
      setTranslatedEntries([]);
      setIsComplete(false);
      setProgress(0);
      setLogs([]); 
      setCurrentChunk(0);
      setTotalChunks(0);
      setActiveIndex(null);
    };
    reader.readAsText(file);
  };

  const handleCancel = () => {
    addLog('error', 'دستور توقف توسط کاربر صادر شد. عملیات متوقف شد.');
    isCancelledRef.current = true;
    setIsTranslating(false);
    setEta('');
  };

  const handleCheckModels = useCallback(async () => {
      const keyToCheck = apiKeys.find(k => k.trim() !== '');
      if (!keyToCheck) {
          addLog('error', 'لطفاً حداقل یک کلید API معتبر وارد کنید.');
          return;
      }
      setIsCheckingModels(true);
      addLog('info', 'شروع بررسی وضعیت مدل‌ها...');
      const newStatuses: Record<string, ModelStatus> = {};
      ALL_MODELS.forEach(model => newStatuses[model] = 'checking');
      setModelStatuses(newStatuses);
      const promises = ALL_MODELS.map(modelName => checkModelStatus(keyToCheck, modelName).then(status => ({ modelName, status })));
      const results = await Promise.all(promises);
      const finalStatuses: Record<string, ModelStatus> = {};
      results.forEach(({ modelName, status }) => {
          finalStatuses[modelName] = status;
          addLog(status === 'available' ? 'success' : 'error', `مدل ${modelName} ${status === 'available' ? 'در دسترس است' : 'در دسترس نیست'}.`);
      });
      setModelStatuses(finalStatuses);
      const firstAvailable = ALL_MODELS.find(m => finalStatuses[m] === 'available');
      if (firstAvailable) {
          setSelectedModel(firstAvailable);
          addLog('info', `مدل ${firstAvailable} به عنوان پیش‌فرض انتخاب شد.`);
      } else {
          addLog('error', 'هیچ‌کدام از مدل‌ها با کلید API ارائه شده در دسترس نیستند.');
      }
      setIsCheckingModels(false);
      addLog('info', 'بررسی وضعیت مدل‌ها به پایان رسید.');
  }, [apiKeys, addLog]);

  const handleTranslate = useCallback(async () => {
    if (subtitleEntries.length === 0) {
      addLog('error', 'لطفاً ابتدا یک فایل زیرنویس بارگذاری کنید.');
      return;
    }
    const validApiKeys = apiKeys.filter(k => k.trim() !== '');
    if (validApiKeys.length === 0) {
        addLog('error', 'لطفاً حداقل یک کلید API معتبر وارد کنید.');
        return;
    }
    if (!selectedModel) {
      addLog('error', 'لطفاً یک مدل در دسترس را برای ترجمه انتخاب کنید.');
      return;
    }
    
    const chunks: SubtitleEntry[][] = [];
    for (let i = 0; i < subtitleEntries.length; i += chunkSize) {
      chunks.push(subtitleEntries.slice(i, i + chunkSize));
    }

    isCancelledRef.current = false;
    setIsTranslating(true);
    setIsComplete(false);
    setProgress(0);
    setLogs([]);
    setTranslatedSrt('');
    setTranslatedEntries([]);
    setCurrentChunk(0);
    setTotalChunks(chunks.length);
    apiKeyIndexRef.current = 0;
    addLog('info', `فرآیند ترجمه با مدل ${selectedModel} آغاز شد.`);
    
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    setEta('در حال محاسبه...');

    const allTranslatedEntries: SubtitleEntry[] = [];
    const chunkProcessingTimes: number[] = [];
    const failedChunkIndices: number[] = [];
    
    // --- PASS 1: Initial Translation ---
    addLog('info', 'مرحله اول: شروع ترجمه اولیه...');
    for (const [chunkIndex, chunk] of chunks.entries()) {
        setCurrentChunk(chunkIndex + 1);
        if (isCancelledRef.current) break;

        const chunkStartTime = Date.now();
        let success = false;
        
        // Retry loop (up to 3 times)
        for (let attempt = 1; attempt <= 3; attempt++) {
            if (isCancelledRef.current) break;
            const currentApiKey = validApiKeys[apiKeyIndexRef.current];
            try {
                addLog('info', `ترجمه بخش ${chunkIndex + 1}/${chunks.length} (تلاش ${attempt}/3)`);
                const originalTexts = chunk.map(entry => entry.text);
                const translatedTexts = await translateChunk(originalTexts, { mode: promptMode, customText: customPrompt }, selectedModel, namesGuide, temperature, currentApiKey);
                
                const translatedChunk = chunk.map((entry, i) => ({ ...entry, text: translatedTexts[i] || entry.text }));
                allTranslatedEntries.push(...translatedChunk);
                addLog('success', `بخش ${chunkIndex + 1} با موفقیت در تلاش ${attempt} ترجمه شد.`);
                success = true;
                break; // Exit retry loop on success
            } catch (error) {
                const message = error instanceof Error ? error.message : 'یک خطای ناشناخته رخ داد';
                addLog('error', `خطا در ترجمه بخش ${chunkIndex + 1} (تلاش ${attempt}/3): ${message}`);
                apiKeyIndexRef.current = (apiKeyIndexRef.current + 1) % validApiKeys.length;
                if (attempt < 3) {
                    addLog('info', `تلاش مجدد با کلید بعدی...`);
                }
            }
        }

        if (!success && !isCancelledRef.current) {
             addLog('error', `ترجمه بخش ${chunkIndex + 1} پس از 3 تلاش ناموفق بود. این بخش موقتا با متن اصلی حفظ می‌شود.`);
             failedChunkIndices.push(chunkIndex);
             allTranslatedEntries.push(...chunk); // Use original text as placeholder
        }
        
        chunkProcessingTimes.push(Date.now() - chunkStartTime);
        if (isCancelledRef.current) break;

        // Update UI
        setProgress(((chunkIndex + 1) / chunks.length) * 100);
        const sortedEntries = [...allTranslatedEntries].sort((a, b) => a.index - b.index);
        setTranslatedEntries(sortedEntries);
        setTranslatedSrt(stringifySrt(sortedEntries));
        
        // Calculate ETA
        const avgTime = chunkProcessingTimes.reduce((a, b) => a + b, 0) / chunkProcessingTimes.length;
        const remainingTime = (avgTime + delay * 1000) * (chunks.length - (chunkIndex + 1));
        const etaSeconds = Math.round(remainingTime / 1000);
        setEta(etaSeconds > 0 ? `${Math.floor(etaSeconds / 60)} دقیقه و ${etaSeconds % 60} ثانیه` : 'کمتر از چند ثانیه');
            
        // Delay
        if (delay > 0 && chunkIndex < chunks.length - 1) {
          addLog('info', `اعمال تاخیر ${delay} ثانیه‌ای...`);
          await sleep(delay * 1000);
        }
    }

    // --- PASS 2: Reprocessing Failed Chunks ---
    if (!isCancelledRef.current && failedChunkIndices.length > 0) {
      addLog('info', `مرحله دوم: شروع پردازش مجدد ${failedChunkIndices.length} بخش ناموفق...`);
      for (const chunkIndex of failedChunkIndices) {
        if (isCancelledRef.current) break;
        const chunk = chunks[chunkIndex];
        addLog('info', `پردازش مجدد بخش ${chunkIndex + 1}...`);

        let success = false;
        // Retry loop (up to 2 times)
        for (let attempt = 1; attempt <= 2; attempt++) {
            if (isCancelledRef.current) break;
            const currentApiKey = validApiKeys[apiKeyIndexRef.current];
            try {
                addLog('info', `ترجمه مجدد بخش ${chunkIndex + 1} (تلاش ${attempt}/2)`);
                const originalTexts = chunk.map(entry => entry.text);
                const translatedTexts = await translateChunk(originalTexts, { mode: promptMode, customText: customPrompt }, selectedModel, namesGuide, temperature, currentApiKey);
                
                const translatedChunk = chunk.map((entry, i) => ({ ...entry, text: translatedTexts[i] || entry.text }));
                
                const startIndex = chunkIndex * chunkSize;
                allTranslatedEntries.splice(startIndex, chunk.length, ...translatedChunk);
                
                addLog('success', `بخش ${chunkIndex + 1} در پردازش مجدد با موفقیت ترجمه شد.`);
                success = true;
                break; // Exit retry loop
            } catch (error) {
                const message = error instanceof Error ? error.message : 'یک خطای ناشناخته رخ داد';
                addLog('error', `خطا در ترجمه مجدد بخش ${chunkIndex + 1} (تلاش ${attempt}/2): ${message}`);
                apiKeyIndexRef.current = (apiKeyIndexRef.current + 1) % validApiKeys.length;
                if (attempt < 2) {
                    addLog('info', `تلاش مجدد با کلید بعدی...`);
                }
            }
        }

        if (!success && !isCancelledRef.current) {
            addLog('error', `پردازش مجدد بخش ${chunkIndex + 1} ناموفق بود. متن اصلی حفظ خواهد شد.`);
        }

        if (isCancelledRef.current) break;

        // Update UI after each reprocessed chunk
        const sortedEntries = [...allTranslatedEntries].sort((a, b) => a.index - b.index);
        setTranslatedEntries(sortedEntries);
        setTranslatedSrt(stringifySrt(sortedEntries));
        
        if (delay > 0) {
            await sleep(delay * 1000);
        }
      }
    }
    
    if (isCancelledRef.current) {
        addLog('info', 'عملیات ترجمه متوقف شد.');
    } else {
        addLog('success', 'ترجمه تمام زیرنویس‌ها با موفقیت به پایان رسید.');
        setIsComplete(true);
        setProgress(100);
    }
    
    // Final state updates
    const finalSortedEntries = [...allTranslatedEntries].sort((a, b) => a.index - b.index);
    setTranslatedEntries(finalSortedEntries);
    setTranslatedSrt(stringifySrt(finalSortedEntries));

    setIsTranslating(false);
    setEta('');
  }, [apiKeys, customPrompt, promptMode, subtitleEntries, delay, namesGuide, temperature, addLog, selectedModel, chunkSize]);


  const handleDownload = () => {
    if (!translatedSrt) {
        addLog('error', 'هیچ محتوای ترجمه شده‌ای برای دانلود وجود ندارد.');
        return;
    }
    const blob = new Blob([translatedSrt], { type: 'text/srt;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const originalFileName = fileName ? fileName.replace(/\.srt$/i, '') : 'subtitle';
    a.download = `${originalFileName}.[TranslatedByAshkanHidi].srt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addLog('info', 'فایل ترجمه شده دانلود شد.');
  };
  
  const UIElementsDisabled = isTranslating || isCheckingModels;
  
  const isEditingEnabled = useMemo(() => !isTranslating && translatedEntries.length > 0, [isTranslating, translatedEntries]);

  const handleEntryUpdate = useCallback((updatedIndex: number, newText: string) => {
    const updatedEntries = translatedEntries.map(entry => 
      entry.index === updatedIndex ? { ...entry, text: newText } : entry
    );
    setTranslatedEntries(updatedEntries);
    setTranslatedSrt(stringifySrt(updatedEntries));
    addLog('info', `زیرنویس خط ${updatedIndex} به صورت دستی ویرایش شد.`);
  }, [translatedEntries, addLog]);

  const navItems = [
    { id: 'settings', label: 'تنظیمات', icon: CogIcon },
    { id: 'subtitles', label: 'نمایشگر', icon: FileTextIcon },
    { id: 'log', label: 'رویدادها', icon: TerminalIcon }
  ];

  return (
    <div className="min-h-screen bg-transparent text-gray-900 dark:text-gray-200">
      <div className="max-w-screen-2xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex justify-between items-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
              ترجمه هوشمند <span className="text-teal-500">زیرنویس</span>
            </h1>
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </header>
        
        <main>
          <div className="mb-6">
            <nav className="bg-gray-200/60 dark:bg-gray-800/60 backdrop-blur-sm p-1.5 rounded-xl grid grid-cols-3 gap-1 sm:gap-2">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as 'settings' | 'subtitles' | 'log')}
                  className={`w-full flex justify-center items-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-opacity-75 ${
                    activeTab === item.id 
                    ? 'bg-white dark:bg-gray-900/70 text-teal-600 dark:text-teal-400 shadow' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-900/20'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        
          {isTranslating && (
            <div className="my-6">
                <TranslationProgress progress={progress} eta={eta} currentChunk={currentChunk} totalChunks={totalChunks}/>
            </div>
          )}

          <div className="transition-opacity duration-300">
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-6 md:col-span-2 xl:col-span-1">
                      <SettingsCard icon={<KeyIcon className="w-6 h-6 text-teal-500" />} title="راه اندازی">
                        <div className="space-y-6">
                          <ApiKeyManager apiKeys={apiKeys} setApiKeys={setApiKeys} disabled={UIElementsDisabled} />
                          <FileUpload onFileSelect={handleFileSelect} disabled={UIElementsDisabled} fileName={fileName} />
                        </div>
                      </SettingsCard>
                  </div>
                  <div className="flex flex-col gap-6">
                     <SettingsCard icon={<PencilIcon className="w-6 h-6 text-teal-500" />} title="شخصی‌سازی پرامپت">
                          <div className="space-y-6 h-full flex flex-col">
                              <PromptInput mode={promptMode} setMode={setPromptMode} customPrompt={customPrompt} setCustomPrompt={setCustomPrompt} disabled={UIElementsDisabled} />
                              <div className="flex-grow">
                                <NamesInput namesGuide={namesGuide} setNamesGuide={setNamesGuide} disabled={UIElementsDisabled} />
                              </div>
                          </div>
                      </SettingsCard>
                  </div>
                  <div className="flex flex-col gap-6">
                    <SettingsCard icon={<ChipIcon className="w-6 h-6 text-teal-500" />} title="تنظیمات مدل">
                      <ModelManager isChecking={isCheckingModels} onCheck={handleCheckModels} statuses={modelStatuses} allModels={ALL_MODELS} selectedModel={selectedModel} setSelectedModel={setSelectedModel} disabled={UIElementsDisabled} />
                      <hr className="border-gray-300 dark:border-gray-600 my-6" />
                      <div className="space-y-6">
                        <TemperatureSlider temperature={temperature} setTemperature={setTemperature} disabled={UIElementsDisabled} />
                        <ChunkSizeSelector chunkSize={chunkSize} setChunkSize={setChunkSize} disabled={UIElementsDisabled} />
                        <DelaySlider delay={delay} setDelay={setDelay} disabled={UIElementsDisabled} />
                      </div>
                    </SettingsCard>
                  </div>
                </div>
              
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700/50 space-y-4">
                    {isTranslating ? (
                        <button onClick={handleCancel} className="w-full flex items-center justify-center gap-3 text-lg bg-red-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-red-700 transition-colors shadow-md hover:shadow-lg">
                            <StopCircleIcon className="w-6 h-6" />
                            توقف عملیات
                        </button>
                    ) : (
                        <button onClick={handleTranslate} disabled={UIElementsDisabled || subtitleEntries.length === 0} className="w-full flex items-center justify-center gap-3 text-lg bg-teal-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-teal-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-teal-500/30 transform hover:-translate-y-1">
                            <PlayIcon className="w-6 h-6" />
                            شروع ترجمه
                        </button>
                    )}

                    {(translatedSrt && !isTranslating) && (
                        isComplete ? (
                            <button onClick={handleDownload} className="w-full flex items-center justify-center gap-3 bg-green-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-green-700 transition-colors shadow-md hover:shadow-lg">
                                <DownloadIcon className="w-6 h-6" />
                                دانلود فایل کامل
                            </button>
                        ) : (
                            <button onClick={handleDownload} className="w-full flex items-center justify-center gap-3 bg-orange-500 text-white font-bold py-3 px-4 rounded-xl hover:bg-orange-600 transition-colors shadow-md hover:shadow-lg">
                                <DownloadIcon className="w-6 h-6" />
                                دانلود فایل ناتمام (نتیجه جزئی)
                            </button>
                        )
                    )}

                    {isComplete && (
                        <div className="bg-green-100 dark:bg-green-900/50 border-l-4 border-green-500 text-green-800 dark:text-green-300 rounded-lg p-4 text-center flex justify-center items-center">
                            <CheckmarkIcon className="w-8 h-8 text-green-500 dark:text-green-400 me-3" />
                            <p className="font-semibold">ترجمه با موفقیت کامل شد!</p>
                        </div>
                    )}
                </div>
              </div>
            )}
            {activeTab === 'subtitles' && (
                <div className="h-[70vh] bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-xl shadow-md border border-gray-200 dark:border-gray-700/80 p-2 sm:p-4 flex flex-col">
                    <SubtitleDisplay className="flex-grow min-h-0" originalEntries={subtitleEntries} translatedEntries={translatedEntries} activeIndex={activeIndex} setActiveIndex={setActiveIndex} isEditingEnabled={isEditingEnabled} onEntryUpdate={handleEntryUpdate} />
                </div>
            )}
            {activeTab === 'log' && (
                <div className="h-[70vh] flex flex-col bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-xl shadow-md border border-gray-200 dark:border-gray-700/80 overflow-hidden">
                    <LogOutput logs={logs} onClearLogs={handleClearLogs} />
                </div>
            )}
          </div>
        </main>
      </div>

      <footer className="mt-8 pt-6 pb-6 border-t border-gray-200/50 dark:border-gray-700/50 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">تمامی حقوق این ابزار متعلق به اشکان هیدی است</p>
        
        <div className="flex justify-center items-center gap-6">
            <a href="https://t.me/ashkanhidi" target="_blank" rel="noopener noreferrer" className="p-2 text-gray-500 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors rounded-full hover:bg-gray-200 dark:hover:bg-gray-800" aria-label="Telegram">
                <TelegramIcon className="w-6 h-6" />
            </a>
            <a href="mailto:ashkanhidi@gmail.com" className="p-2 text-gray-500 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors rounded-full hover:bg-gray-200 dark:hover:bg-gray-800" aria-label="Gmail">
                <MailIcon className="w-6 h-6" />
            </a>
        </div>
      </footer>
    </div>
  );
}