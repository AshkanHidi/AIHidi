import type { SubtitleEntry } from '../types';

export const parseSrt = (content: string): SubtitleEntry[] => {
  const entries: SubtitleEntry[] = [];
  const pattern = /(\d+)\s*\n\s*(\d{2}:\d{2}:\d{2},\d{3}\s*-->\s*\d{2}:\d{2}:\d{2},\d{3})\s*\n\s*([\s\S]*?)(?=\n\n|\n*$)/g;
  
  // Normalize line endings
  const normalizedContent = content.replace(/\r\n/g, '\n').trim();

  let match;
  while ((match = pattern.exec(normalizedContent)) !== null) {
    entries.push({
      index: parseInt(match[1], 10),
      time: match[2].trim(),
      text: match[3].trim(),
    });
  }
  return entries;
};

export const stringifySrt = (entries: SubtitleEntry[]): string => {
  return entries
    .map(entry => `${entry.index}\n${entry.time}\n${entry.text}`)
    .join('\n\n');
};
