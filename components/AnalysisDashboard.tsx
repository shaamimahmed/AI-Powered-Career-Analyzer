import React, { useState } from 'react';
import type { ResumeData, JobMatch, CoverLetter, ResumeAnalysis, SuggestedResume, JobPosting, JobSearchFilters } from '../types';
import { Tone } from '../types';
import { JobMatchAnalysis } from './JobMatchAnalysis';
import { CoverLetterOutput } from './CoverLetterOutput';
import { ResumeOptimizer } from './ResumeOptimizer';
import { SuggestedResume as SuggestedResumeComponent } from './SuggestedResume';
import { JobSearch } from './JobSearch';
import { ChartIcon, DocumentTextIcon, SparklesIcon, DocumentIcon, SearchIcon } from './icons';

interface AnalysisDashboardProps {
  resumeData: ResumeData | null;
  jobMatch: JobMatch | null;
  coverLetter: CoverLetter | null;
  resumeAnalysis: ResumeAnalysis | null;
  suggestedResume: SuggestedResume | null;
  jobPostings: JobPosting[];
  onToneChange: (tone: Tone) => void;
  onJobSearch: (filters: JobSearchFilters) => void;
  isLoading: boolean;
  isSearchingJobs: boolean;
}

type Tab = 'match' | 'coverLetter' | 'optimizer' | 'resume' | 'jobs';

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = (props) => {
  const [activeTab, setActiveTab] = useState<Tab>('match');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'match':
        return <JobMatchAnalysis jobMatch={props.jobMatch} isLoading={props.isLoading && !props.jobMatch} />;
      case 'coverLetter':
        return <CoverLetterOutput coverLetter={props.coverLetter} onToneChange={props.onToneChange} />;
      case 'optimizer':
        return <ResumeOptimizer resumeAnalysis={props.resumeAnalysis} isLoading={props.isLoading && !props.resumeAnalysis}/>;
      case 'resume':
        return <SuggestedResumeComponent suggestedResume={props.suggestedResume} isLoading={props.isLoading && !props.suggestedResume}/>;
      case 'jobs':
        return <JobSearch 
            initialJobs={props.jobPostings} 
            onSearch={props.onJobSearch} 
            isLoading={props.isSearchingJobs} 
            location={props.resumeData?.contactInfo?.location || ''}
        />;
      default:
        return null;
    }
  };

  const TabButton = ({ tab, label, icon }: { tab: Tab, label: string, icon: JSX.Element }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex-1 flex items-center justify-center text-sm md:text-base font-semibold py-3 px-4 rounded-lg transition-all duration-300 group ${
        activeTab === tab
          ? 'bg-slate-700 text-white shadow-md'
          : 'bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
      }`}
      aria-current={activeTab === tab ? 'page' : undefined}
    >
      {React.cloneElement(icon, { className: `h-5 w-5 transition-colors ${activeTab === tab ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-400'}` })}
      <span className="ml-2 hidden md:inline">{label}</span>
    </button>
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-2 bg-slate-100 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-center space-x-1 md:space-x-2">
          <TabButton tab="match" label="Job Match" icon={<ChartIcon />} />
          <TabButton tab="coverLetter" label="Cover Letter" icon={<DocumentTextIcon />} />
          <TabButton tab="resume" label="New Resume" icon={<DocumentIcon />} />
          <TabButton tab="optimizer" label="Optimizer" icon={<SparklesIcon />} />
          <TabButton tab="jobs" label="Job Search" icon={<SearchIcon />} />
        </div>
      </div>
      <div className="p-6 md:p-8 min-h-[500px]">
        {renderTabContent()}
      </div>
    </div>
  );
};