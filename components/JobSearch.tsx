import React, { useState } from 'react';
import type { JobPosting, JobSearchFilters } from '../types';
import { Spinner } from './Spinner';
import { SearchIcon } from './icons';

interface JobSearchProps {
    initialJobs: JobPosting[];
    onSearch: (filters: JobSearchFilters) => void;
    isLoading: boolean;
    location: string;
}

const JobCard: React.FC<{ job: JobPosting }> = ({ job }) => (
    <div className="bg-white dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
        <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200">{job.title}</h4>
        <p className="font-semibold text-slate-700 dark:text-slate-300">{job.company}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400">{job.location}</p>
        <p className="text-sm my-2 text-slate-700 dark:text-slate-300">{job.description}</p>
        <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
                <span className="text-xs font-medium bg-slate-200 dark:bg-slate-600 px-2 py-1 rounded-full">{job.jobType}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{job.datePosted}</span>
            </div>
            <a href={job.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:underline">
                Apply
            </a>
        </div>
    </div>
);

export const JobSearch: React.FC<JobSearchProps> = ({ initialJobs, onSearch, isLoading, location: initialLocation }) => {
    const [filters, setFilters] = useState<JobSearchFilters>({
        location: initialLocation,
        jobTypes: ['Full-time', 'Remote'],
        datePosted: 'any',
        experienceLevel: 'any'
    });

    const handleFilterChange = (field: keyof JobSearchFilters, value: any) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };
    
    const handleJobTypeChange = (type: string) => {
        const newJobTypes = filters.jobTypes.includes(type)
            ? filters.jobTypes.filter(t => t !== type)
            : [...filters.jobTypes, type];
        handleFilterChange('jobTypes', newJobTypes);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(filters);
    };

    return (
        <div className="animate-fade-in">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Job Search</h3>
             <p className="mb-6 text-slate-600 dark:text-slate-400">
                Based on your resume, we've found some initial matches. Use the filters below to refine your search and discover more opportunities.
             </p>
             <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 -mt-4 text-center">
                Please note: These job listings are AI-generated examples and may not correspond to real-world openings.
            </p>

            <form onSubmit={handleSubmit} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Location</label>
                        <input type="text" id="location" value={filters.location} onChange={e => handleFilterChange('location', e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm bg-white dark:bg-slate-700 focus:border-slate-500 focus:ring-slate-500 sm:text-sm" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Experience Level</label>
                        <select id="experience" value={filters.experienceLevel} onChange={e => handleFilterChange('experienceLevel', e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm bg-white dark:bg-slate-700 focus:border-slate-500 focus:ring-slate-500 sm:text-sm">
                            <option value="any">Any</option>
                            <option value="entry">Entry-level</option>
                            <option value="mid">Mid-level</option>
                            <option value="senior">Senior</option>
                            <option value="executive">Executive</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Job Type</label>
                        <div className="mt-1 flex flex-wrap gap-2">
                           {['Full-time', 'Remote', 'Contract', 'Part-time'].map(type => (
                                <label key={type} className="flex items-center text-sm">
                                    <input type="checkbox" checked={filters.jobTypes.includes(type)} onChange={() => handleJobTypeChange(type)} className="h-4 w-4 rounded border-slate-300 text-slate-600 focus:ring-slate-500" />
                                    <span className="ml-2">{type}</span>
                                </label>
                           ))}
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Date Posted</label>
                        <select id="date" value={filters.datePosted} onChange={e => handleFilterChange('datePosted', e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm bg-white dark:bg-slate-700 focus:border-slate-500 focus:ring-slate-500 sm:text-sm">
                            <option value="any">Any time</option>
                            <option value="day">Past 24 hours</option>
                            <option value="week">Past week</option>
                            <option value="month">Past month</option>
                        </select>
                    </div>
                </div>
                <div className="mt-4 text-right">
                    <button type="submit" disabled={isLoading} className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:bg-slate-400">
                        {isLoading ? <Spinner /> : <SearchIcon className="h-5 w-5 mr-2" />}
                        {isLoading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </form>

            {isLoading && initialJobs.length === 0 ? (
                <p className="text-center text-slate-500">Searching for jobs...</p>
            ) : (
                <div className="space-y-4">
                    {initialJobs.length > 0 ? initialJobs.map((job, index) => (
                        <JobCard key={index} job={job} />
                    )) : <p className="text-center text-slate-500">No jobs found. Try adjusting your filters.</p>}
                </div>
            )}
        </div>
    );
};