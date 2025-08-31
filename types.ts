export interface Experience {
  title: string;
  company: string;
  dates: string;
  description: string;
}

export interface Education {
  degree: string;
  institution: string;
  dates: string;
}

export interface ResumeData {
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  summary: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  certifications?: string[];
}

export interface JobMatch {
  matchPercentage: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
}

export enum Tone {
    Professional = 'Professional',
    Enthusiastic = 'Enthusiastic',
    Conservative = 'Conservative',
}

export interface CoverLetter {
    content: string;
    tone: Tone;
}

export interface ResumeAnalysis {
    keywordSuggestions: string[];
    skillGapAnalysis: string[];
    certificationSuggestions: string[];
}

export interface SuggestedResume {
  content: ResumeData;
  improvements: string[];
}

export interface JobPosting {
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Hybrid' | 'Temporary';
  datePosted: string;
}

export interface JobSearchFilters {
  location: string;
  jobTypes: string[];
  datePosted: 'any' | 'day' | 'week' | 'month';
  experienceLevel: 'any' | 'entry' | 'mid' | 'senior' | 'executive';
}