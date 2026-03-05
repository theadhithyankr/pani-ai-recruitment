import { Job, Gig } from './types';

export const JOBS: Job[] = [
  {
    id: 'j1',
    title: 'Senior Frontend Engineer',
    company: 'TechNova',
    location: 'San Francisco, CA',
    type: 'Remote',
    salary: '$140k - $180k',
    description: 'We are looking for a React expert to lead our core product team. Experience with TypeScript and Tailwind is a must.',
    tags: ['React', 'TypeScript', 'Tailwind'],
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
    tags: ['Figma', 'UI/UX', 'Product'],
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
    tags: ['Node.js', 'Redis', 'AWS'],
    postedAt: '1 day ago',
    logo: 'https://picsum.photos/seed/data/100/100'
  }
];

export const GIGS: Gig[] = [
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
