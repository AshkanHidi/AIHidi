import React from 'react';

// IMDb icon
export const ImdbIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="IMDb Icon">
    <rect width="48" height="24" rx="3" fill="#F5C518" />
    <text x="24" y="16" fontFamily="Verdana, sans-serif" fontSize="12" fontWeight="bold" fill="black" textAnchor="middle">IMDb</text>
  </svg>
);

// Rotten Tomatoes Fresh icon
export const RottenTomatoesFreshIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Rotten Tomatoes Fresh Rating">
        <path d="M16.9 3.8C15.5 2.4 13.5 2 12 2s-3.5.4-4.9 1.8C5.2 5.7 4.2 8.3 4.4 11c.2 3.1 2.1 5.9 4.9 7.2.8.4 1.7.6 2.7.6s1.9-.2 2.7-.6c2.8-1.3 4.7-4.1 4.9-7.2.2-2.7-.8-5.3-2.7-7.2z" fill="#FA320A" />
        <path d="M12.5 2.1c-.2 0-.4 0-.5.1.8 1.1 1.2 2.4 1.2 3.8v.1c.1 0 .3.1.4.1s.3 0 .4-.1V6c0-1.4.4-2.7 1.2-3.8-.2-.1-.4-.1-.5-.1h-2z" fill="#9C0303" />
    </svg>
);

// Rotten Tomatoes Rotten icon
export const RottenTomatoesRottenIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Rotten Tomatoes Rotten Rating">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm3.5 13.5c-1.1-1.1-2.9-1.1-4 0-1.1 1.1-1.1 2.9 0 4 .6.5 1.2.8 1.9.8.7 0 1.4-.3 1.9-.8.1-.1.2-.2.2-.3.6-.6.9-1.3.9-2.1s-.3-1.5-.9-2.1l-.1-.2c-1-1.1-2.8-1.1-3.9-.1l-.1.1c-1.1 1.1-1.1 2.9 0 4 .6.5 1.2.8 1.9.8.7 0 1.4-.3 1.9-.8l.2-.3c.6-.6.9-1.3.9-2.1s-.3-1.5-.9-2.1c-1.1-1.1-2.9-1.1-4 0-1.1 1.1-1.1 2.9 0 4" fill="#54A314" stroke="#2E7D32" strokeWidth="0.5" />
    </svg>
);


// Metacritic score display component
export const MetacriticScore: React.FC<{ score: string, className?: string }> = ({ score, className }) => {
    const numericScore = parseInt(score.split('/')[0], 10);
    let bgColor = 'bg-gray-500';
    let textColor = 'text-white';
    
    if (!isNaN(numericScore)) {
        if (numericScore >= 61) {
            bgColor = 'bg-green-600';
        } else if (numericScore >= 40) {
            bgColor = 'bg-yellow-500';
            textColor = 'text-black';
        } else {
            bgColor = 'bg-red-600';
        }
    }

    return (
        <div className={`w-8 h-8 flex items-center justify-center rounded ${bgColor} ${className}`}>
            <span className={`${textColor} font-bold text-sm`}>{!isNaN(numericScore) ? numericScore : '?'}</span>
        </div>
    );
};
