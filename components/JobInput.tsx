import React from 'react';

interface JobInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const JobInput: React.FC<JobInputProps> = ({ value, onChange }) => {
  return (
    <div className="bg-white dark:bg-slate-700/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 h-full flex flex-col">
      <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">Job Description</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Paste the job description you are interested in applying for.
      </p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the job description here..."
        className="w-full flex-grow p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-slate-500 focus:outline-none transition-colors duration-200 text-sm"
        rows={15}
        aria-label="Job Description Input"
      />
    </div>
  );
};