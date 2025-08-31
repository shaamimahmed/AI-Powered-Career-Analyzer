import React, { useState } from 'react';
import type { CoverLetter } from '../types';
import { Tone } from '../types';
import { SkeletonLoader } from './SkeletonLoader';
import { CopyIcon } from './icons';

interface CoverLetterOutputProps {
  coverLetter: CoverLetter | null;
  onToneChange: (tone: Tone) => void;
}

export const CoverLetterOutput: React.FC<CoverLetterOutputProps> = ({ coverLetter, onToneChange }) => {
    const [copied, setCopied] = useState(false);

    const ToneButton = ({ tone, label }: { tone: Tone, label: string }) => {
        const isActive = coverLetter?.tone === tone;
        return (
            <button
                onClick={() => onToneChange(tone)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive
                        ? 'bg-slate-700 text-white'
                        : 'bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500'
                }`}
            >
                {label}
            </button>
        );
    };

    if (!coverLetter) {
        return <SkeletonLoader sections={1} linesPerSection={10} />;
    }

    const handleCopy = () => {
        if(coverLetter?.content) {
            navigator.clipboard.writeText(coverLetter.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Generated Cover Letter</h3>
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium mr-2">Tone:</span>
                    <ToneButton tone={Tone.Professional} label="Professional" />
                    <ToneButton tone={Tone.Enthusiastic} label="Enthusiastic" />
                    <ToneButton tone={Tone.Conservative} label="Conservative" />
                </div>
            </div>
            <div className="relative group">
                <div className="p-6 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 whitespace-pre-wrap font-serif leading-relaxed text-slate-800 dark:text-slate-200 min-h-[300px]">
                    {coverLetter.content}
                </div>
                <button 
                    onClick={handleCopy}
                    className="absolute top-3 right-3 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-200 font-bold py-1 px-2 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Copy cover letter"
                >
                    {copied ? 'Copied!' : <CopyIcon />}
                </button>
            </div>
        </div>
    );
};