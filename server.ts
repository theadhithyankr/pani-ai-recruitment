import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

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
