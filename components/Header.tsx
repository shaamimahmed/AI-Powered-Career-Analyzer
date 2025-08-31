import React from 'react';
import { BriefcaseIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg sticky top-0 z-50 border-b border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center">
          <BriefcaseIcon className="h-8 w-8 text-slate-700 dark:text-slate-400"/>
          <span className="ml-3 text-xl font-bold text-slate-800 dark:text-white">
            AI-Powered Career Analyzer
          </span>
        </div>
      </div>
    </header>
  );
};