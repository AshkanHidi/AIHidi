import React, { useState, useMemo, useRef, useEffect } from 'react';
import { FileTextIcon, GlobeIcon, PencilIcon, CheckmarkIcon, XCircleIcon } from './icons';
import type { SubtitleEntry } from '../types';

interface SubtitleDisplayProps {
  originalEntries: SubtitleEntry[];
  translatedEntries: SubtitleEntry[];
  activeIndex: number | null;
  setActiveIndex: (index: number | null) => void;
  isEditingEnabled: boolean;
  onEntryUpdate: (index: number, newText: string) => void;
  className?: string;
}

interface SubtitlePaneProps {
  entries: SubtitleEntry[];
  placeholder: string;
  activeIndex: number | null;
  setActiveIndex?: (index: number | null) => void;
  isTranslatedPane?: boolean;
  translatedMap?: Map<number, string>;
  isEditingEnabled?: boolean;
  onEntryUpdate?: (index: number, newText: string) => void;
}

const SubtitlePane: React.FC<SubtitlePaneProps> = ({
  entries,
  placeholder,
  isTranslatedPane = false,
  translatedMap,
  activeIndex,
  setActiveIndex,
  isEditingEnabled = false,
  onEntryUpdate,
}) => {
  const entryRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isTranslatedPane && activeIndex !== null) {
      const element = entryRefs.current.get(activeIndex);
      element?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeIndex, isTranslatedPane, entries]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = `${ta.scrollHeight}px`;
    }
  }, [editText, editingIndex]);

  const handleStartEdit = (entry: SubtitleEntry, translatedText: string | undefined) => {
    if (!isEditingEnabled || !onEntryUpdate || translatedText === undefined) return;
    setEditingIndex(entry.index);
    setEditText(translatedText);
  };
  
  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditText('');
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && onEntryUpdate) {
      onEntryUpdate(editingIndex, editText);
    }
    handleCancelEdit();
  };

  const renderEntry = (entry: SubtitleEntry) => {
    const isSelected = activeIndex === entry.index;
    const translatedText = isTranslatedPane ? translatedMap?.get(entry.index) : undefined;
    const isTranslated = translatedText !== undefined;
    const textToShow = translatedText ?? entry.text;
    const isEditingThisEntry = editingIndex === entry.index;

    if (isTranslatedPane && isEditingThisEntry) {
      return (
        <div
          key={`${entry.index}-editing`}
          className="mb-1.5 p-2 rounded-lg bg-teal-500/20 ring-2 ring-teal-500"
        >
          <p className="text-xs text-gray-500">{entry.index}</p>
          <p className="text-xs text-teal-600 dark:text-teal-400 font-mono">{entry.time}</p>
          <textarea
            ref={textareaRef}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="block w-full text-sm bg-gray-50 dark:bg-gray-900/50 rounded-md p-1.5 my-1 border border-gray-400 dark:border-gray-600 focus:ring-teal-500 focus:border-teal-500 resize-none overflow-hidden"
            rows={1}
            autoFocus
            onFocus={(e) => e.currentTarget.select()}
          />
          <div className="flex items-center justify-end space-x-2 space-x-reverse mt-2">
            <button onClick={handleSaveEdit} className="p-1.5 text-green-500 rounded-full hover:bg-green-500/20" aria-label="ذخیره">
              <CheckmarkIcon className="w-5 h-5" />
            </button>
            <button onClick={handleCancelEdit} className="p-1.5 text-red-500 rounded-full hover:bg-red-500/20" aria-label="لغو">
              <XCircleIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      );
    }

    const canBeClickedForEdit = isTranslatedPane && isEditingEnabled && isTranslated;
    const canBeClickedForSelect = !isTranslatedPane;

    const baseClass = 'mb-1.5 p-2 rounded-lg transition-all duration-200 relative group';
    const clickableClass = (canBeClickedForEdit || canBeClickedForSelect) ? 'cursor-pointer hover:bg-gray-200/70 dark:hover:bg-gray-700/50' : '';
    
    let stateClass = '';
    if (isSelected) {
        stateClass = 'ring-2 ring-offset-2 ring-offset-gray-100/40 dark:ring-offset-gray-900/40 ';
        if (isTranslatedPane) {
            stateClass += isTranslated 
                ? 'ring-teal-500 bg-teal-500/20'
                : 'ring-yellow-500 bg-yellow-500/20';
        } else {
            stateClass += 'ring-teal-500 bg-teal-500/20';
        }
    } else if (isTranslatedPane && isTranslated) {
        stateClass = 'bg-teal-500/10';
    }

    return (
      <div
        key={entry.index}
        ref={(el) => { if (el) entryRefs.current.set(entry.index, el); else entryRefs.current.delete(entry.index); }}
        onClick={() => {
            if (canBeClickedForEdit) {
                handleStartEdit(entry, translatedText);
            } else if (canBeClickedForSelect) {
                setActiveIndex?.(isSelected ? null : entry.index);
            }
        }}
        className={`${baseClass} ${clickableClass} ${stateClass}`}
      >
        <p className="text-xs text-gray-500">{entry.index}</p>
        <p className="text-xs text-teal-600 dark:text-teal-400 font-mono">{entry.time}</p>
        <p className="text-sm whitespace-pre-wrap break-words">{textToShow}</p>
        {canBeClickedForEdit && (
          <div className="absolute top-1 left-1 p-1 rounded-full bg-white dark:bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity">
            <PencilIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full flex-grow min-h-0 text-gray-800 dark:text-gray-300 relative overflow-y-auto">
      <div className="p-2">
        {entries.length > 0 ? (
          entries.map(renderEntry)
        ) : (
          <p className="text-center text-gray-500 p-8">{placeholder}</p>
        )}
      </div>
    </div>
  );
};


export const SubtitleDisplay: React.FC<SubtitleDisplayProps> = ({ originalEntries, translatedEntries, activeIndex, setActiveIndex, isEditingEnabled, onEntryUpdate, className = '' }) => {
  
  const [activeTab, setActiveTab] = useState<'original' | 'translated'>('original');

  const translatedMap = useMemo(() => {
    return new Map(translatedEntries.map(entry => [entry.index, entry.text]));
  }, [translatedEntries]);

  const PaneContainer = ({ title, icon: Icon, children }: { title: string, icon: React.FC<any>, children: React.ReactNode }) => (
    <div className="bg-gray-100/40 dark:bg-gray-900/40 rounded-xl border border-gray-300/70 dark:border-gray-700/60 flex flex-col overflow-hidden shadow-inner h-full">
      <h3 className="flex items-center gap-3 text-base sm:text-lg font-semibold p-3 sm:p-4 border-b border-gray-300/70 dark:border-gray-700/60 bg-white/30 dark:bg-black/20 text-gray-800 dark:text-gray-200 shrink-0">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-teal-500" />
        {title}
      </h3>
      {children}
    </div>
  );

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="md:hidden flex border-b border-gray-300/50 dark:border-gray-600/50 shrink-0">
        <button
          onClick={() => setActiveTab('original')}
          className={`flex-1 flex justify-center items-center gap-2 py-2.5 px-4 text-sm font-medium transition-colors ${
            activeTab === 'original'
              ? 'border-b-2 border-teal-500 text-teal-600 dark:text-teal-400'
              : 'text-gray-500 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
          }`}
        >
          <FileTextIcon className="w-5 h-5" />
          متن اصلی
        </button>
        <button
          onClick={() => setActiveTab('translated')}
          className={`flex-1 flex justify-center items-center gap-2 py-2.5 px-4 text-sm font-medium transition-colors ${
            activeTab === 'translated'
              ? 'border-b-2 border-teal-500 text-teal-600 dark:text-teal-400'
              : 'text-gray-500 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
          }`}
        >
           <GlobeIcon className="w-5 h-5" />
          متن ترجمه شده
        </button>
      </div>
      
      <div className="flex-grow flex flex-col md:flex-row gap-6 min-h-0">
        <div className={`w-full md:w-1/2 min-h-0 ${activeTab === 'original' ? 'flex' : 'hidden'} md:flex flex-col`}>
            <PaneContainer title="متن اصلی" icon={FileTextIcon}>
                <SubtitlePane 
                    entries={originalEntries}
                    placeholder="محتوای فایل زیرنویس اصلی در اینجا نمایش داده می‌شود..."
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                />
            </PaneContainer>
        </div>

        <div className={`w-full md:w-1/2 min-h-0 ${activeTab === 'translated' ? 'flex' : 'hidden'} md:flex flex-col`}>
           <PaneContainer title="متن ترجمه شده" icon={GlobeIcon}>
                <SubtitlePane 
                    entries={originalEntries}
                    placeholder="نتیجه ترجمه در اینجا نمایش داده می‌شود..."
                    isTranslatedPane={true}
                    translatedMap={translatedMap}
                    activeIndex={activeIndex}
                    isEditingEnabled={isEditingEnabled}
                    onEntryUpdate={onEntryUpdate}
                />
            </PaneContainer>
        </div>
      </div>
    </div>
  );
};