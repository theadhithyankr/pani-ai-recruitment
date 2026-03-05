import 'dotenv/config';
import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import Groq from "groq-sdk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("pani.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    title TEXT,
    company TEXT,
    location TEXT,
    type TEXT,
    salary TEXT,
    description TEXT,
    tags TEXT,
    postedAt TEXT,
    logo TEXT
  );

  CREATE TABLE IF NOT EXISTS gigs (
    id TEXT PRIMARY KEY,
    title TEXT,
    freelancer TEXT,
    rating REAL,
    reviewsCount INTEGER,
    startingPrice TEXT,
    category TEXT,
    image TEXT,
    avatar TEXT
  );
`);

// Seed data if empty
const jobsCount = db.prepare("SELECT COUNT(*) as count FROM jobs").get() as { count: number };
if (jobsCount.count === 0) {
  const insertJob = db.prepare(`
    INSERT INTO jobs (id, title, company, location, type, salary, description, tags, postedAt, logo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const initialJobs = [
    {
      id: 'j1',
      title: 'Senior Frontend Engineer',
      company: 'TechNova',
      location: 'San Francisco, CA',
      type: 'Remote',
      salary: '$140k - $180k',
      description: 'We are looking for a React expert to lead our core product team. Experience with TypeScript and Tailwind is a must.',
      tags: JSON.stringify(['React', 'TypeScript', 'Tailwind']),
      postedAt: '2 hours ago',
      logo: 'https://picsum.photos/seed/tech/100/100'
    },
    {
      id: 'j2',
      title: 'Product Designer',
      company: 'CreativeFlow',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$110k - $150k',
      description: 'Join our design team to craft beautiful and intuitive user experiences for our million+ users.',
      tags: JSON.stringify(['Figma', 'UI/UX', 'Product']),
      postedAt: '5 hours ago',
      logo: 'https://picsum.photos/seed/design/100/100'
    },
    {
      id: 'j3',
      title: 'Backend Developer (Node.js)',
      company: 'DataStream',
      location: 'Austin, TX',
      type: 'Contract',
      salary: '$80 - $120 / hr',
      description: 'Help us scale our real-time data processing pipelines using Node.js and Redis.',
      tags: JSON.stringify(['Node.js', 'Redis', 'AWS']),
      postedAt: '1 day ago',
      logo: 'https://picsum.photos/seed/data/100/100'
    }
  ];

  for (const job of initialJobs) {
    insertJob.run(job.id, job.title, job.company, job.location, job.type, job.salary, job.description, job.tags, job.postedAt, job.logo);
  }
}

const gigsCount = db.prepare("SELECT COUNT(*) as count FROM gigs").get() as { count: number };
if (gigsCount.count === 0) {
  const insertGig = db.prepare(`
    INSERT INTO gigs (id, title, freelancer, rating, reviewsCount, startingPrice, category, image, avatar)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const initialGigs = [
    {
      id: 'g1',
      title: 'I will design a modern SaaS landing page',
      freelancer: 'Alex Rivera',
      rating: 4.9,
      reviewsCount: 124,
      startingPrice: '$150',
      category: 'Design',
      image: 'https://picsum.photos/seed/saas/400/300',
      avatar: 'https://i.pravatar.cc/150?u=alex'
    },
    {
      id: 'g2',
      title: 'I will build a custom Shopify store',
      freelancer: 'Sarah Chen',
      rating: 5.0,
      reviewsCount: 89,
      startingPrice: '$450',
      category: 'Development',
      image: 'https://picsum.photos/seed/shop/400/300',
      avatar: 'https://i.pravatar.cc/150?u=sarah'
    },
    {
      id: 'g3',
      title: 'I will write SEO optimized blog posts',
      freelancer: 'James Wilson',
      rating: 4.8,
      reviewsCount: 210,
      startingPrice: '$50',
      category: 'Writing',
      image: 'https://picsum.photos/seed/write/400/300',
      avatar: 'https://i.pravatar.cc/150?u=james'
    }
  ];

  for (const gig of initialGigs) {
    insertGig.run(gig.id, gig.title, gig.freelancer, gig.rating, gig.reviewsCount, gig.startingPrice, gig.category, gig.image, gig.avatar);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/jobs", (req, res) => {
    const search = req.query.search as string;
    let jobs;
    if (search) {
      jobs = db.prepare("SELECT * FROM jobs WHERE title LIKE ? OR company LIKE ? OR description LIKE ?").all(`%${search}%`, `%${search}%`, `%${search}%`);
    } else {
      jobs = db.prepare("SELECT * FROM jobs").all();
    }
    
    // Parse tags back to array
    const parsedJobs = jobs.map((job: any) => ({
      ...job,
      tags: JSON.parse(job.tags)
    }));
    
    res.json(parsedJobs);
  });

  app.get("/api/gigs", (req, res) => {
    const search = req.query.search as string;
    let gigs;
    if (search) {
      gigs = db.prepare("SELECT * FROM gigs WHERE title LIKE ? OR freelancer LIKE ?").all(`%${search}%`, `%${search}%`);
    } else {
      gigs = db.prepare("SELECT * FROM gigs").all();
    }
    res.json(gigs);
  });

  // Vite middleware for development
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });
  const AI_MODEL = 'llama-3.3-70b-versatile';

  async function aiGenerate(prompt: string, systemInstruction?: string): Promise<string> {
    const messages: Groq.Chat.ChatCompletionMessageParam[] = [];
    if (systemInstruction) messages.push({ role: 'system', content: systemInstruction });
    messages.push({ role: 'user', content: prompt });
    const completion = await groq.chat.completions.create({ messages, model: AI_MODEL });
    return completion.choices[0]?.message?.content?.trim() || '';
  }

  app.post('/api/ai', async (req, res) => {
    const { feature, payload } = req.body;
    try {
      switch (feature) {
        case 'chat': {
          const { prompt, userRole, type } = payload;
          const text = await aiGenerate(prompt, `You are "paniBot", a career and hiring assistant for pani.\nUser Role: ${userRole}\nContext: ${type === 'career' ? 'Helping talent find jobs.' : 'Helping employers hire talent.'}\nBe professional, encouraging, and concise.`);
          return res.json({ text });
        }
        case 'generateJobDescription': {
          const { title, company, type, requirements } = payload;
          const text = await aiGenerate(`Write a compelling job description for:\nTitle: ${title}\nCompany: ${company}\nType: ${type}\nKey notes: ${requirements || 'Standard role'}\n\nWrite 3-4 paragraphs: overview, responsibilities, qualifications, what we offer. Plain text only.`);
          return res.json({ text });
        }
        case 'generateFullJobPost': {
          const { title, company, type, location, requirements } = payload;
          const raw = await aiGenerate(`Generate a complete job post. Respond ONLY with valid JSON, no markdown:\n{"description":"<3-4 paragraphs>","salary":"<e.g. $120k – $160k/yr>","skills":"<comma-separated 5-8 skills>"}\n\nJob: ${title} at ${company}, ${type}, ${location}. Notes: ${requirements || 'none'}`);
          try { return res.json(JSON.parse(raw.replace(/```[a-z]*\n?|\n?```/g, '').trim())); }
          catch { return res.status(500).json({ error: 'Failed to parse AI response.' }); }
        }
        case 'generateCoverLetter': {
          const { candidateName, skills, jobTitle, company, jobDescription } = payload;
          const text = await aiGenerate(`Write a cover letter.\nCandidate: ${candidateName}\nSkills: ${skills || 'not specified'}\nApplying for: ${jobTitle} at ${company}\nJob: ${String(jobDescription).slice(0, 500)}\n\n3 short paragraphs, address to "Hiring Manager". Plain text only.`);
          return res.json({ text });
        }
        case 'analyzeResumeMatch': {
          const { resumeText, jobTitle, jobDescription, jobTags } = payload;
          const raw = await aiGenerate(`Analyze resume vs job. Respond ONLY with valid JSON:\n{"score":<0-100>,"strengths":["..."],"gaps":["..."],"tips":["..."]}\n\nJob: ${jobTitle}, Skills: ${jobTags.join(', ')}\nDescription: ${String(jobDescription).slice(0, 400)}\nResume: ${String(resumeText).slice(0, 1500)}`);
          try { return res.json(JSON.parse(raw.replace(/```[a-z]*\n?|\n?```/g, '').trim())); }
          catch { return res.json({ score: 0, strengths: [], gaps: [], tips: ['Analysis failed.'] }); }
        }
        case 'rankCandidates': {
          const { applications, jobTitle, jobDescription } = payload;
          if (!applications?.length) return res.json([]);
          const list = applications.map((a: any, i: number) => `${i+1}. ID="${a.id}" Name="${a.candidateName}" Cover="${String(a.coverLetter||'none').slice(0,200)}"`).join('\n');
          const raw = await aiGenerate(`Rank applicants for: ${jobTitle}\nJob: ${String(jobDescription).slice(0,400)}\n\n${list}\n\nRespond ONLY with JSON array:\n[{"id":"<id>","score":<0-100>,"reasoning":"<one sentence>"}]`);
          try { return res.json(JSON.parse(raw.replace(/```[a-z]*\n?|\n?```/g, '').trim())); }
          catch { return res.json(applications.map((a: any) => ({ id: a.id, score: 50, reasoning: 'Ranking unavailable.' }))); }
        }
        case 'generateInterviewQuestions': {
          const { jobTitle, jobDescription, count } = payload;
          const raw = await aiGenerate(`Generate ${count||8} interview questions for: ${jobTitle}\nJob: ${String(jobDescription).slice(0,400)}\n\nRespond ONLY with JSON array:\n[{"question":"...","category":"Technical|Behavioral|Situational|Culture","tip":"..."}]`);
          try { return res.json(JSON.parse(raw.replace(/```[a-z]*\n?|\n?```/g, '').trim())); }
          catch { return res.json([{ question: 'Could not generate questions.', category: 'General', tip: '' }]); }
        }
        case 'parseNaturalLanguageSearch': {
          const { query } = payload;
          const text = await aiGenerate(`Extract core job search keywords from: "${query}". Return ONLY the keywords as a short search string, nothing else.`);
          return res.json({ text: text || query });
        }
        default:
          return res.status(400).json({ error: 'Unknown AI feature' });
      }
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'AI request failed' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
