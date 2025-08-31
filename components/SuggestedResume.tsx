import React, { useState } from 'react';
import type { SuggestedResume as SuggestedResumeType, ResumeData } from '../types';
import { SkeletonLoader } from './SkeletonLoader';
import { DownloadIcon, LightBulbIcon, MailIcon, PhoneIcon, LocationMarkerIcon } from './icons';

interface SuggestedResumeProps {
  suggestedResume: SuggestedResumeType | null;
  isLoading: boolean;
}

const ResumeSection: React.FC<{ title: string, children: React.ReactNode, className?: string }> = ({ title, children, className = '' }) => (
    <div className={`mb-6 ${className}`}>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 border-b-2 border-slate-700 dark:border-slate-300 pb-2 mb-4 uppercase tracking-wider">{title}</h2>
        {children}
    </div>
);


const ResumeContent: React.FC<{resume: ResumeData}> = ({ resume }) => {
    return (
        <div className="font-serif text-slate-800 dark:text-slate-200">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{resume.contactInfo.name}</h1>
                <div className="flex items-center justify-center gap-x-6 gap-y-1 mt-3 text-sm text-slate-600 dark:text-slate-400 flex-wrap">
                    {resume.contactInfo.location && <span className="flex items-center gap-1.5"><LocationMarkerIcon className="h-4 w-4" />{resume.contactInfo.location}</span>}
                    {resume.contactInfo.phone && <span className="flex items-center gap-1.5"><PhoneIcon className="h-4 w-4" />{resume.contactInfo.phone}</span>}
                    {resume.contactInfo.email && <span className="flex items-center gap-1.5"><MailIcon className="h-4 w-4" />{resume.contactInfo.email}</span>}
                </div>
            </div>

            {/* Summary */}
            <ResumeSection title="Summary">
                <p className="text-base leading-relaxed">{resume.summary}</p>
            </ResumeSection>

            {/* Skills */}
            <ResumeSection title="Skills">
                <div className="flex flex-wrap gap-2">
                    {resume.skills.map((skill, index) => (
                        <span key={index} className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-medium px-3 py-1 rounded-full">{skill}</span>
                    ))}
                </div>
            </ResumeSection>
            
            {/* Experience */}
            <ResumeSection title="Experience">
                {resume.experience.map((job, index) => (
                    <div key={index} className="mb-5 break-inside-avoid">
                        <div className="flex justify-between items-start mb-1">
                           <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{job.title}</h3>
                                <h4 className="font-semibold text-md text-slate-700 dark:text-slate-300">{job.company}</h4>
                           </div>
                           <p className="text-sm font-medium text-slate-500 dark:text-slate-400 text-right shrink-0 ml-4">{job.dates}</p>
                        </div>
                        <ul className="list-disc pl-5 mt-1 space-y-1 text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                            {job.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.replace(/^- /, '')}</li>)}
                        </ul>
                    </div>
                ))}
            </ResumeSection>
            
            {/* Certifications */}
            {resume.certifications && resume.certifications.length > 0 && (
                 <ResumeSection title="Certifications">
                     <ul className="list-disc list-outside ml-5 mt-1 space-y-1 text-base grid grid-cols-1 md:grid-cols-2 gap-x-8">
                        {resume.certifications.map((cert, index) => (
                            <li key={index}>{cert}</li>
                        ))}
                     </ul>
                </ResumeSection>
            )}

            {/* Education */}
            <ResumeSection title="Education" className="break-inside-avoid">
                {resume.education.map((edu, index) => (
                    <div key={index} className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="text-lg font-bold">{edu.institution}</h3>
                            <p className="text-md text-slate-700 dark:text-slate-300">{edu.degree}</p>
                        </div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 text-right shrink-0 ml-4">{edu.dates}</p>
                    </div>
                ))}
            </ResumeSection>
        </div>
    );
}

const generateResumeTxt = (resume: ResumeData): string => {
    let txt = '';
    
    // Header
    txt += `${resume.contactInfo.name}\n`;
    txt += `${resume.contactInfo.location} | ${resume.contactInfo.phone} | ${resume.contactInfo.email}\n`;
    txt += "=================================================================\n\n";

    // Summary
    txt += "SUMMARY\n";
    txt += "-----------------------------------------------------------------\n";
    txt += `${resume.summary}\n\n`;

    // Skills
    txt += "SKILLS\n";
    txt += "-----------------------------------------------------------------\n";
    txt += resume.skills.join(', ') + '\n\n';

    // Experience
    txt += "EXPERIENCE\n";
    txt += "-----------------------------------------------------------------\n";
    resume.experience.forEach(job => {
        txt += `${job.title.toUpperCase()} | ${job.company}\n`;
        txt += `  ${job.dates}\n`;
        job.description.split('\n').forEach(line => {
            if (line.trim()) {
                txt += `  - ${line.replace(/^- /, '')}\n`;
            }
        });
        txt += '\n';
    });

    // Certifications
    if (resume.certifications && resume.certifications.length > 0) {
        txt += "CERTIFICATIONS\n";
        txt += "-----------------------------------------------------------------\n";
        resume.certifications.forEach(cert => {
            txt += `- ${cert}\n`;
        });
        txt += '\n';
    }

    // Education
    txt += "EDUCATION\n";
    txt += "-----------------------------------------------------------------\n";
    resume.education.forEach(edu => {
        txt += `${edu.institution} - ${edu.degree}\n`;
        txt += `  ${edu.dates}\n\n`;
    });

    return txt;
};


export const SuggestedResume: React.FC<SuggestedResumeProps> = ({ suggestedResume, isLoading }) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownloadTxt = () => {
        if (!suggestedResume?.content || isDownloading) return;

        setIsDownloading(true);
        try {
            const txtContent = generateResumeTxt(suggestedResume.content);
            const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'new-resume.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to download TXT:", error);
        } finally {
            setIsDownloading(false);
        }
    };

    if (isLoading) {
        return <SkeletonLoader sections={4} />;
    }

    if (!suggestedResume) {
        return <p className="text-center text-slate-500">Run analysis to see your AI-generated resume.</p>;
    }
    
    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">New Resume (ATS-Friendly)</h3>
                <div className="flex items-center space-x-2">
                    <button onClick={handleDownloadTxt} disabled={isDownloading} className="flex items-center px-4 py-2 text-sm font-medium rounded-md bg-slate-700 text-white hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed">
                       <DownloadIcon className="h-4 w-4 mr-2" />
                       {isDownloading ? 'Downloading...' : 'Download as .txt'}
                    </button>
                </div>
            </div>
             <p className="mb-6 text-slate-600 dark:text-slate-400">This resume has been professionally rewritten by AI with action verbs and quantifiable achievements to be friendly for Applicant Tracking Systems (ATS).</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="p-8 bg-white dark:bg-slate-100 rounded-lg border border-slate-200 dark:border-slate-300 shadow-sm">
                        <ResumeContent resume={suggestedResume.content} />
                    </div>
                </div>
                <div>
                     <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 sticky top-24">
                        <h4 className="text-lg font-semibold mb-3 flex items-center text-slate-700 dark:text-slate-400">
                            <LightBulbIcon />
                            <span className="ml-2">Key Improvements</span>
                        </h4>
                        <ul className="space-y-2 list-disc list-inside text-slate-700 dark:text-slate-300 text-sm">
                            {suggestedResume.improvements.map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};