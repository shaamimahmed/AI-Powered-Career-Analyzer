import React from 'react';
import type { ResumeAnalysis } from '../types';
import { SkeletonLoader } from './SkeletonLoader';
import { LightBulbIcon, AcademicCapIcon, AdjustmentsIcon } from './icons';

interface ResumeOptimizerProps {
  resumeAnalysis: ResumeAnalysis | null;
  isLoading: boolean;
}

const SuggestionSection: React.FC<{ title: string; suggestions: string[]; icon: JSX.Element }> = ({ title, suggestions, icon }) => (
  <div className="mb-6 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
    <h4 className="text-lg font-semibold mb-3 flex items-center text-slate-700 dark:text-slate-400">
      {icon} <span className="ml-2">{title}</span>
    </h4>
    {suggestions && suggestions.length > 0 ? (
        <ul className="space-y-2 list-disc list-inside text-slate-700 dark:text-slate-300">
        {suggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
        ))}
        </ul>
    ) : <p className="text-slate-500 dark:text-slate-400 italic">No specific suggestions in this area.</p>}
  </div>
);

export const ResumeOptimizer: React.FC<ResumeOptimizerProps> = ({ resumeAnalysis, isLoading }) => {
  if (isLoading) {
    return <SkeletonLoader sections={3} />;
  }

  if (!resumeAnalysis) {
    return <p className="text-center text-slate-500">Run analysis to see resume optimization suggestions.</p>;
  }

  return (
    <div className="animate-fade-in">
      <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Resume Optimization Suggestions</h3>
      <p className="mb-6 text-slate-600 dark:text-slate-400">Here are AI-powered tips to tailor your resume for this specific role and improve your chances with Applicant Tracking Systems (ATS).</p>
      
      <SuggestionSection title="Keyword Suggestions" suggestions={resumeAnalysis.keywordSuggestions} icon={<AdjustmentsIcon />} />
      <SuggestionSection title="Skill Gap Analysis" suggestions={resumeAnalysis.skillGapAnalysis} icon={<LightBulbIcon />} />
      <SuggestionSection title="Relevant Certifications" suggestions={resumeAnalysis.certificationSuggestions} icon={<AcademicCapIcon />} />
    </div>
  );
};