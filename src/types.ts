export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  salary: string;
  description: string;
  tags: string[];
  postedAt: string;
  logo: string;
}

export interface Gig {
  id: string;
  title: string;
  freelancer: string;
  rating: number;
  reviewsCount: number;
  startingPrice: string;
  category: string;
  image: string;
  avatar: string;
}

export interface User {
  id: string;
  name: string;
  role: 'talent' | 'employer';
  avatar?: string;
}
