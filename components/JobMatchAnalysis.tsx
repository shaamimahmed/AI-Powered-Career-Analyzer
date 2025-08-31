import React from 'react';
import type { JobMatch } from '../types';
import { SkeletonLoader } from './SkeletonLoader';
import { CheckCircleIcon, XCircleIcon } from './icons';

interface JobMatchAnalysisProps {
  jobMatch: JobMatch | null;
  isLoading: boolean;
}

const MatchPercentageCircle: React.FC<{ percentage: number }> = ({ percentage }) => {
    const circumference = 2 * Math.PI * 52;
    // Ensure offset calculation is correct even for 0 or 100 percentage
    const offset = circumference - (percentage / 100) * circumference;
    
    let colorClass = 'text-green-500';
    if (percentage < 75) colorClass = 'text-yellow-500';
    if (percentage < 50) colorClass = 'text-red-500';

    return (
        <div className="relative w-40 h-40">
            <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle className="text-slate-200 dark:text-slate-600" strokeWidth="10" stroke="currentColor" fill="transparent" r="52" cx="60" cy="60" />
                <circle
                    className={`${colorClass} transition-all duration-1000 ease-out`}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="52"
                    cx="60"
                    cy="60"
                    style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                    transform="rotate(-90 60 60)"
                />
            </svg>
            <div className={`absolute inset-0 flex items-center justify-center text-3xl font-bold ${colorClass}`}>
                {Math.round(percentage)}%
            </div>
        </div>
    );
};

export const JobMatchAnalysis: React.FC<JobMatchAnalysisProps> = ({ jobMatch, isLoading }) => {
  if (isLoading) {
    return <SkeletonLoader sections={3}/>;
  }

  if (!jobMatch) {
    return <p className="text-center text-slate-500">Run analysis to see your job match score.</p>;
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col items-center mb-8">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Overall Match Score</h3>
        <MatchPercentageCircle percentage={jobMatch.matchPercentage} />
        <p className="mt-4 text-center text-slate-600 dark:text-slate-400 max-w-lg">{jobMatch.summary}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-xl font-semibold mb-3 flex items-center text-green-600 dark:text-green-400">
            <CheckCircleIcon /> <span className="ml-2">Strengths</span>
          </h4>
          <ul className="space-y-2">
            {jobMatch.strengths.map((strength, index) => (
              <li key={index} className="p-3 bg-green-50 dark:bg-green-900/50 border-l-4 border-green-500 rounded-r-lg text-slate-800 dark:text-slate-200">{strength}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xl font-semibold mb-3 flex items-center text-red-600 dark:text-red-400">
            <XCircleIcon /> <span className="ml-2">Areas for Improvement</span>
          </h4>
          <ul className="space-y-2">
            {jobMatch.weaknesses.map((weakness, index) => (
              <li key={index} className="p-3 bg-red-50 dark:bg-red-900/50 border-l-4 border-red-500 rounded-r-lg text-slate-800 dark:text-slate-200">{weakness}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};