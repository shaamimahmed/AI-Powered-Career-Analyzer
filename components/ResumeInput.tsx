import React from 'react';

interface ResumeInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const ResumeInput: React.FC<ResumeInputProps> = ({ value, onChange }) => {
  return (
    <div className="bg-white dark:bg-slate-700/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 h-full flex flex-col">
      <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">Your Resume</h3>
      
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
        Paste the full text of your resume below. For best results, ensure it's well-formatted.
      </p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your resume text here..."
        className="w-full flex-grow p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-slate-500 focus:outline-none transition-colors duration-200 text-sm"
        rows={15}
        aria-label="Resume Text Input"
      />
    </div>
  );
};