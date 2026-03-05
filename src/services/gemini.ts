// All AI calls are proxied through the Express server — API key never touches the browser.

async function callAI<T = string>(feature: string, payload: Record<string, unknown>): Promise<T> {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ feature, payload }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data as T;
}

export async function askAssistant(prompt: string, context: { type: 'career' | 'hiring'; userRole: string }): Promise<string | undefined> {
  const data = await callAI<{ text: string }>('chat', { prompt, userRole: context.userRole, type: context.type });
  return data.text;
}

export async function generateJobDescription(title: string, company: string, type: string, requirements: string): Promise<string> {
  const data = await callAI<{ text: string }>('generateJobDescription', { title, company, type, requirements });
  return data.text;
}

export async function generateFullJobPost(title: string, company: string, type: string, location: string, requirements: string): Promise<{ description: string; salary: string; skills: string }> {
  return callAI('generateFullJobPost', { title, company, type, location, requirements });
}

export async function generateCoverLetter(candidateName: string, skills: string, jobTitle: string, company: string, jobDescription: string): Promise<string> {
  const data = await callAI<{ text: string }>('generateCoverLetter', { candidateName, skills, jobTitle, company, jobDescription });
  return data.text;
}

export async function analyzeResumeMatch(resumeText: string, jobTitle: string, jobDescription: string, jobTags: string[]): Promise<{ score: number; strengths: string[]; gaps: string[]; tips: string[] }> {
  return callAI('analyzeResumeMatch', { resumeText, jobTitle, jobDescription, jobTags });
}

export async function rankCandidates(applications: { id: string; candidateName: string; coverLetter?: string }[], jobTitle: string, jobDescription: string): Promise<{ id: string; score: number; reasoning: string }[]> {
  return callAI('rankCandidates', { applications, jobTitle, jobDescription });
}

export async function generateInterviewQuestions(jobTitle: string, jobDescription: string, count = 8): Promise<{ question: string; category: string; tip: string }[]> {
  return callAI('generateInterviewQuestions', { jobTitle, jobDescription, count });
}

export async function parseNaturalLanguageSearch(query: string): Promise<string> {
  const data = await callAI<{ text: string }>('parseNaturalLanguageSearch', { query });
  return data.text || query;
}
