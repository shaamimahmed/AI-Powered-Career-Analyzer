import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ResumeInput } from './components/ResumeInput';
import { JobInput } from './components/JobInput';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { Spinner } from './components/Spinner';
import { parseResume, analyzeJobMatch, generateCoverLetter, getResumeSuggestions, generateSuggestedResume, searchJobs } from './services/geminiService';
import type { ResumeData, JobMatch, CoverLetter, ResumeAnalysis, SuggestedResume, JobPosting, JobSearchFilters } from './types';
import { Tone } from './types';
import { ErrorIcon, LightBulbIcon } from './components/icons';

const App: React.FC = () => {
  const [resumeText, setResumeText] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [jobMatch, setJobMatch] = useState<JobMatch | null>(null);
  const [coverLetter, setCoverLetter] = useState<CoverLetter | null>(null);
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysis | null>(null);
  const [suggestedResume, setSuggestedResume] = useState<SuggestedResume | null>(null);
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [isSearchingJobs, setIsSearchingJobs] = useState(false);


  const handleAnalysis = useCallback(async () => {
    if (!resumeText || !jobDescription) {
      setError('Please provide both a resume and a job description.');
      return;
    }
    setIsLoading(true);
    setError(null);
    // Reset all states
    setResumeData(null);
    setJobMatch(null);
    setCoverLetter(null);
    setResumeAnalysis(null);
    setSuggestedResume(null);
    setJobPostings([]);

    try {
      const parsedResume = await parseResume(resumeText);
      setResumeData(parsedResume);
      
      const initialFilters: JobSearchFilters = {
        location: parsedResume.contactInfo.location || '',
        jobTypes: ['Full-time', 'Remote'],
        datePosted: 'any',
        experienceLevel: 'any'
      };

      // Run all analyses in parallel
      const [match, analysis, initialCoverLetter, resume, jobs] = await Promise.all([
        analyzeJobMatch(parsedResume, jobDescription),
        getResumeSuggestions(parsedResume, jobDescription),
        generateCoverLetter(parsedResume, jobDescription, Tone.Professional),
        generateSuggestedResume(parsedResume, jobDescription),
        searchJobs(parsedResume, initialFilters)
      ]);
      
      setJobMatch(match);
      setResumeAnalysis(analysis);
      setCoverLetter(initialCoverLetter);
      setSuggestedResume(resume);
      setJobPostings(jobs);

    } catch (e) {
      console.error(e);
      setError('An error occurred during AI analysis. Please check your API key or network and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [resumeText, jobDescription]);

  const handleToneChange = async (newTone: Tone) => {
    if (!resumeData || !jobDescription) return;
    
    if (coverLetter) {
        setCoverLetter({ ...coverLetter, content: 'Generating new cover letter...' });
    }

    try {
        const newCoverLetter = await generateCoverLetter(resumeData, jobDescription, newTone);
        setCoverLetter(newCoverLetter);
    } catch (e) {
        console.error(e);
        setError('Failed to regenerate cover letter.');
        if (coverLetter) {
            setCoverLetter({ ...coverLetter, content: 'Error generating. Please try again.' });
        }
    }
  };

  const handleJobSearch = async (filters: JobSearchFilters) => {
    if (!resumeData) return;
    setIsSearchingJobs(true);
    try {
      const jobs = await searchJobs(resumeData, filters);
      setJobPostings(jobs);
    } catch (e) {
      console.error(e);
      setError('Failed to search for jobs.');
    } finally {
      setIsSearchingJobs(false);
    }
  };


  const hasResults = resumeData || jobMatch || coverLetter || resumeAnalysis;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-white">
              AI-Powered Career Analyzer
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Analyze your resume against a job description to generate a tailored cover letter, an optimized resume, and find relevant job opportunities.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 mb-8">
             <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white flex items-center">
                <span className="bg-slate-700 text-white rounded-full h-8 w-8 text-sm font-bold flex items-center justify-center mr-3">1</span>
                Provide Your Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              <ResumeInput value={resumeText} onChange={setResumeText} />
              <JobInput value={jobDescription} onChange={setJobDescription} />
            </div>
            <div className="text-center">
              <button
                onClick={handleAnalysis}
                disabled={isLoading || !resumeText || !jobDescription}
                className="bg-slate-700 text-white font-bold py-3 px-12 rounded-lg shadow-lg hover:bg-slate-800 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-slate-500 focus:ring-opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Spinner />
                    Analyzing...
                  </div>
                ) : (
                  'Run AI Analysis'
                )}
              </button>
            </div>
          </div>


          {error && (
            <div className="my-6 p-4 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-lg flex items-center justify-center">
              <ErrorIcon />
              <span className="ml-2">{error}</span>
            </div>
          )}
          
          {isLoading && !hasResults && (
            <div className="mt-8 text-center text-slate-600 dark:text-slate-400">
                <p className="flex items-center justify-center text-lg"><LightBulbIcon /> Our AI is warming up... This might take a moment.</p>
                <p className="text-sm mt-2">Analyzing skills, experience, and requirements to build your personalized application toolkit.</p>
            </div>
          )}

          {hasResults && (
            <div className="mt-12">
               <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white flex items-center">
                <span className="bg-slate-700 text-white rounded-full h-8 w-8 text-sm font-bold flex items-center justify-center mr-3">2</span>
                Explore Your AI Toolkit
              </h2>
              <AnalysisDashboard
                resumeData={resumeData}
                jobMatch={jobMatch}
                coverLetter={coverLetter}
                resumeAnalysis={resumeAnalysis}
                suggestedResume={suggestedResume}
                jobPostings={jobPostings}
                onToneChange={handleToneChange}
                onJobSearch={handleJobSearch}
                isLoading={isLoading}
                isSearchingJobs={isSearchingJobs}
              />
            </div>
          )}
        </div>
      </main>
      <footer className="text-center py-4 text-xs text-slate-500 dark:text-slate-400">
        Copyright© Shaamim Udding Ahmed | Built 2025
      </footer>
    </div>
  );
};

export default App;