import { GoogleGenAI, Type } from "@google/genai";
import type { ResumeData, JobMatch, CoverLetter, ResumeAnalysis, SuggestedResume, JobPosting, JobSearchFilters } from '../types';
import { Tone } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const resumeSchema = {
    type: Type.OBJECT,
    properties: {
        contactInfo: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                email: { type: Type.STRING },
                phone: { type: Type.STRING },
                location: { type: Type.STRING },
            },
            required: ['name', 'email']
        },
        summary: { type: Type.STRING },
        skills: { type: Type.ARRAY, items: { type: Type.STRING } },
        experience: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    company: { type: Type.STRING },
                    dates: { type: Type.STRING },
                    description: { type: Type.STRING, description: "A multi-line string with each line representing a bullet point of responsibilities/achievements. Start each line with '- '." },
                },
                required: ['title', 'company', 'description', 'dates']
            },
        },
        education: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    degree: { type: Type.STRING },
                    institution: { type: Type.STRING },
                    dates: { type: Type.STRING },
                },
                required: ['degree', 'institution']
            },
        },
        certifications: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of professional certifications."
        },
    },
    required: ['contactInfo', 'summary', 'skills', 'experience', 'education']
};

const jobMatchSchema = {
    type: Type.OBJECT,
    properties: {
        matchPercentage: { type: Type.NUMBER, description: "A number between 0 and 100." },
        summary: { type: Type.STRING },
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: ['matchPercentage', 'summary', 'strengths', 'weaknesses']
};

const resumeAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        keywordSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
        skillGapAnalysis: { type: Type.ARRAY, items: { type: Type.STRING } },
        certificationSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
     required: ['keywordSuggestions', 'skillGapAnalysis', 'certificationSuggestions']
};

const suggestedResumeSchema = {
    type: Type.OBJECT,
    properties: {
        content: resumeSchema,
        improvements: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of specific improvements made to the resume." }
    },
    required: ['content', 'improvements']
};

const jobPostingsSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING },
            company: { type: Type.STRING },
            location: { type: Type.STRING },
            description: { type: Type.STRING, description: "A brief 2-3 sentence description. End with the source, e.g., '(Source: LinkedIn)'." },
            url: { type: Type.STRING, description: "A plausible application URL from a major job board like LinkedIn or Indeed." },
            jobType: { type: Type.STRING, enum: ['Full-time', 'Part-time', 'Contract', 'Remote', 'Hybrid', 'Temporary'] },
            datePosted: { type: Type.STRING, description: "A human-readable date like '2 days ago' or '2023-10-27'" }
        },
        required: ['title', 'company', 'location', 'description', 'url', 'jobType', 'datePosted']
    }
}


const generateWithSchema = async <T,>(prompt: string, schema: object): Promise<T> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as T;
    } catch (error) {
        console.error("Gemini API call failed:", error);
        throw new Error("Failed to get a valid response from the AI model.");
    }
};

export const parseResume = async (resumeText: string): Promise<ResumeData> => {
    const prompt = `You are an expert HR recruitment assistant. Parse the following resume text and extract the information into a structured JSON object. For experience descriptions, combine them into a single string with newline separators for bullet points. Extract any professional certifications into the certifications array. If a section or field is not found, use a best-effort guess or return an empty string/array. Resume text: \n\n${resumeText}`;
    return generateWithSchema<ResumeData>(prompt, resumeSchema);
};

export const analyzeJobMatch = async (resumeData: ResumeData, jobDescription: string): Promise<JobMatch> => {
    const prompt = `You are an expert career coach. Analyze the provided resume JSON and the job description text. Provide a job match analysis as a JSON object. The match percentage should reflect how well the candidate's skills and experience align with the job requirements. The summary should be a brief overview of the match. Strengths are specific points where the candidate excels for this role. Weaknesses are areas where the candidate is lacking or could improve.\n\nResume Data: ${JSON.stringify(resumeData)}\n\nJob Description: ${jobDescription}`;
    return generateWithSchema<JobMatch>(prompt, jobMatchSchema);
};

export const getResumeSuggestions = async (resumeData: ResumeData, jobDescription: string): Promise<ResumeAnalysis> => {
    const prompt = `You are an ATS optimization expert. Compare the provided resume JSON and the job description. Provide actionable suggestions to improve the resume for this specific job application. Format the output as a JSON object. Be specific and concise.\n\nResume Data: ${JSON.stringify(resumeData)}\n\nJob Description: ${jobDescription}`;
    return generateWithSchema<ResumeAnalysis>(prompt, resumeAnalysisSchema);
};

export const generateSuggestedResume = async (resumeData: ResumeData, jobDescription: string): Promise<SuggestedResume> => {
    const prompt = `You are an expert resume writer specializing in ATS optimization. Take the following parsed resume data and rewrite it into a professional, modern, and improved resume tailored for the provided job description. 
    
    The goal is to create a powerful, achievement-oriented resume. Use strong action verbs and quantify results where possible. Rephrase summaries and align skills with the keywords and requirements in the job description.

    **CRITICAL INSTRUCTION FOR EXPERIENCE SECTION:** For each role in the 'experience' section, analyze the candidate's original responsibilities and the target job description. Based on this analysis, **regenerate** a new set of 3-5 professional, achievement-oriented bullet points. These new bullet points should directly showcase how the candidate's past experience aligns with the requirements of the target job. Avoid redundant points and do not simply copy from the original resume. Each bullet point MUST be a distinct line in a multi-line string, and each must start with '- '.

    Ensure the job duration (dates) is present for each role. If there are certifications, list them. Structure the entire resume in a clean, professional, and easy-to-read format.
    
    Format the output as a JSON object with a 'content' object matching the resume schema and an 'improvements' array of strings explaining the key changes you made.
    \n\nOriginal Resume Data: ${JSON.stringify(resumeData)}
    \n\nTarget Job Description: ${jobDescription}`;
    return generateWithSchema<SuggestedResume>(prompt, suggestedResumeSchema);
};

export const searchJobs = async (resumeData: ResumeData, filters: JobSearchFilters): Promise<JobPosting[]> => {
    const prompt = `
    You are a helpful job search assistant. Based on the provided resume data and search filters, generate a realistic list of 5 job postings.
    
    Resume Data: ${JSON.stringify(resumeData.skills)} and experience titles like ${resumeData.experience.map(e => e.title).join(', ')}.

    Search Filters:
    - Location: ${filters.location}
    - Job Types: ${filters.jobTypes.join(', ')}
    - Date Posted: ${filters.datePosted}
    - Experience Level: ${filters.experienceLevel}

    For each job, provide a title, company, location, a brief 2-3 sentence description, and a plausible application URL from a major job board like LinkedIn or Indeed (e.g., https://www.linkedin.com/jobs/view/12345678). At the end of the description, add the source, like "(Source: LinkedIn)". Ensure the jobs are highly relevant to the resume and filters. Format as a JSON array.`;
    
    // The schema validator expects an array at the top level, which is what jobPostingsSchema defines.
    const result = await generateWithSchema<{ jobs: JobPosting[] }>(prompt, { type: Type.OBJECT, properties: { jobs: jobPostingsSchema }, required: ['jobs'] });
    return result.jobs;
};


export const generateCoverLetter = async (resumeData: ResumeData, jobDescription: string, tone: Tone): Promise<CoverLetter> => {
    const prompt = `You are a professional resume writer. Using the provided resume JSON and job description, write a compelling and personalized cover letter. The tone should be ${tone}. The letter should highlight the candidate's most relevant skills and experiences for this specific role and company. Address it to 'Hiring Manager' and sign off with the candidate's name. Do not include contact information in the letter body itself. Ensure the output is a single block of text.\n\nResume Data: ${JSON.stringify(resumeData)}\n\nJob Description: ${jobDescription}`;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    return {
        content: response.text,
        tone: tone,
    };
};