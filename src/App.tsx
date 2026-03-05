import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, 
  Search, 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  ChevronRight, 
  Filter, 
  User, 
  Menu, 
  X,
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
  ShieldCheck,
  Building2,
  Bookmark
} from 'lucide-react';
import { Job, Gig } from './types';
import { askAssistant } from './services/gemini';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Animation Variants ---

const wordVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12
    }
  }
} as any;

const charVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20
    }
  }
} as any;

// --- Components ---

const Navbar = ({ onHome, onToggleAssistant }: { onHome: () => void; onToggleAssistant: () => void }) => (
  <motion.nav 
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="bg-white border-b border-brand-border px-6 py-4 flex items-center justify-between sticky top-0 z-50"
  >
    <div className="flex items-center gap-8">
      <div 
        className="flex items-center gap-1.5 cursor-pointer" 
        onClick={onHome}
      >
        <span className="font-black text-2xl tracking-tighter text-brand-dark">
          pani<span className="text-brand-primary">.</span>
        </span>
      </div>
      
      <div className="hidden lg:flex items-center gap-6">
        <div className="relative group">
          <button className="text-brand-light font-semibold hover:text-brand-primary transition-colors flex items-center gap-1">
            Explore <ChevronRight size={14} className="rotate-90" />
          </button>
        </div>
        <button className="text-brand-light font-semibold hover:text-brand-primary transition-colors">pani Pro</button>
      </div>
    </div>
    
    <div className="flex items-center gap-6">
      <div className="hidden md:flex items-center gap-6">
        <button className="text-brand-light font-semibold hover:text-brand-primary transition-colors">Become a Seller</button>
        <button className="text-brand-light font-semibold hover:text-brand-primary transition-colors">Sign In</button>
        <button className="btn-fiverr-outline py-2 px-5 text-sm">Join</button>
      </div>
      <button 
        onClick={onToggleAssistant}
        className="text-brand-primary p-2 hover:bg-brand-primary/5 rounded-full transition-colors"
      >
        <Sparkles size={20} />
      </button>
      <button className="md:hidden p-2 text-brand-dark">
        <Menu size={24} />
      </button>
    </div>
  </motion.nav>
);

const CategoryBar = () => (
  <div className="bg-white border-b border-brand-border overflow-x-auto whitespace-nowrap px-6 py-3 hidden md:block">
    <div className="max-w-7xl mx-auto flex justify-between gap-8">
      {['Graphics & Design', 'Digital Marketing', 'Writing & Translation', 'Video & Animation', 'Music & Audio', 'Programming & Tech', 'Business', 'Lifestyle', 'AI Services'].map(cat => (
        <button key={cat} className="text-brand-light text-sm font-medium hover:text-brand-primary transition-colors border-b-2 border-transparent hover:border-brand-primary pb-1">
          {cat}
        </button>
      ))}
    </div>
  </div>
);

const Hero = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const [query, setQuery] = useState('');

  return (
    <div className="bg-[#0a4226] py-24 px-6 relative overflow-hidden">
      {/* Background Image Placeholder / Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-tight mb-8">
            Find the perfect <span className="italic font-normal">freelance</span> services for your business
          </h1>
          
          <div className="flex bg-white rounded-md overflow-hidden shadow-2xl mb-8">
            <div className="flex-1 flex items-center px-4 py-4 gap-3">
              <Search size={20} className="text-brand-light" />
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSearch(query)}
                placeholder='Try "building mobile app"'
                className="flex-1 outline-none text-brand-dark font-medium placeholder:text-brand-light"
              />
            </div>
            <button 
              onClick={() => onSearch(query)}
              className="bg-brand-primary text-white px-8 font-bold hover:bg-brand-secondary transition-colors"
            >
              Search
            </button>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 text-white">
            <span className="text-sm font-bold">Popular:</span>
            {['Website Design', 'WordPress', 'Logo Design', 'AI Services'].map(tag => (
              <button 
                key={tag} 
                onClick={() => { setQuery(tag); onSearch(tag); }}
                className="px-3 py-1 border border-white rounded-full text-xs font-bold hover:bg-white hover:text-brand-dark transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Hero Image Mockup */}
      <div className="absolute right-0 bottom-0 top-0 w-1/3 hidden xl:block">
        <img 
          src="https://picsum.photos/seed/professional/800/1000" 
          alt="Professional" 
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute bottom-8 left-8 bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20 text-white">
          <p className="text-xs font-bold">Valentina, <span className="font-normal">AI Artist</span></p>
        </div>
      </div>
    </div>
  );
};

const TrustSection = () => (
  <div className="bg-[#fafafa] py-8 px-6 border-b border-brand-border">
    <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-12 opacity-40 grayscale">
      <span className="text-brand-light font-bold">Trusted by:</span>
      {['Google', 'Netflix', 'P&G', 'PayPal', 'Meta'].map(brand => (
        <span key={brand} className="text-2xl font-black tracking-tighter">{brand}</span>
      ))}
    </div>
  </div>
);

const JobCard = ({ job, onClick }: { job: Job; onClick: () => void }) => (
  <motion.div 
    variants={itemVariants}
    whileHover={{ 
      y: -8, 
      boxShadow: '0 25px 50px -12px rgba(79, 70, 229, 0.15)',
      borderColor: '#4f46e5'
    }}
    onClick={onClick}
    className="card-minimal p-8 flex flex-col md:flex-row gap-8 group cursor-pointer border-2 border-transparent"
  >
    <motion.div 
      whileHover={{ rotate: [0, -10, 10, 0] }}
      className="w-20 h-20 rounded-2xl border border-slate-100 overflow-hidden shrink-0 bg-slate-50 flex items-center justify-center shadow-sm"
    >
      <img 
        src={job.logo} 
        alt={job.company} 
        className="w-14 h-14 object-contain" 
        referrerPolicy="no-referrer" 
      />
    </motion.div>
    <div className="flex-1">
      <div className="flex flex-wrap items-center gap-4 mb-3">
        <h3 className="text-2xl font-bold text-slate-900 group-hover:text-brand-primary transition-colors">{job.title}</h3>
        <motion.span 
          whileHover={{ scale: 1.1 }}
          className="badge bg-indigo-50 text-brand-primary px-3 py-1 rounded-full text-xs font-bold border border-indigo-100"
        >
          {job.type}
        </motion.span>
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-slate-500 font-medium mb-6">
        <span className="flex items-center gap-2"><Building2 size={18} className="text-brand-primary" /> {job.company}</span>
        <span className="flex items-center gap-2"><MapPin size={18} className="text-slate-400" /> {job.location}</span>
        <span className="flex items-center gap-2"><DollarSign size={18} className="text-emerald-500" /> {job.salary}</span>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {job.tags.map(tag => (
          <motion.span 
            key={tag} 
            whileHover={{ scale: 1.05, backgroundColor: '#f1f5f9' }}
            className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold border border-slate-100"
          >
            {tag}
          </motion.span>
        ))}
      </div>
    </div>
    <div className="flex flex-col justify-between items-end gap-6">
      <motion.button 
        whileHover={{ scale: 1.3, color: '#4f46e5', rotate: 15 }}
        whileTap={{ scale: 0.8 }}
        className="text-slate-300 transition-colors p-2 hover:bg-indigo-50 rounded-full"
      >
        <Bookmark size={24} />
      </motion.button>
      <div className="flex flex-col items-end">
        <span className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-widest">{job.postedAt}</span>
        <motion.button 
          animate={{ 
            boxShadow: [
              '0 0 0 0px rgba(79, 70, 229, 0)',
              '0 0 0 10px rgba(79, 70, 229, 0.1)',
              '0 0 0 0px rgba(79, 70, 229, 0)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          whileHover={{ scale: 1.05, x: 5 }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary py-3 px-8 text-sm font-bold shadow-lg shadow-indigo-100"
        >
          Apply Now
        </motion.button>
      </div>
    </div>
  </motion.div>
);

const GigCard = ({ gig }: { gig: Gig }) => (
  <motion.div 
    variants={itemVariants}
    whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
    className="card-minimal overflow-hidden flex flex-col group cursor-pointer"
  >
    <div className="h-44 overflow-hidden relative">
      <motion.img 
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.6 }}
        src={gig.image} 
        alt={gig.title} 
        className="w-full h-full object-cover" 
        referrerPolicy="no-referrer" 
      />
      <div className="absolute top-3 right-3">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 rounded-full bg-white/90 backdrop-blur shadow-sm flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
        >
          <Bookmark size={16} />
        </motion.button>
      </div>
    </div>
    <div className="p-5 flex-1 flex flex-col">
      <div className="flex items-center gap-2.5 mb-4">
        <img src={gig.avatar} alt={gig.freelancer} className="w-7 h-7 rounded-full border border-slate-100" referrerPolicy="no-referrer" />
        <span className="font-medium text-sm text-slate-700">{gig.freelancer}</span>
      </div>
      <h3 className="text-base font-medium text-slate-900 mb-4 line-clamp-2 group-hover:text-brand-primary transition-colors leading-snug">{gig.title}</h3>
      <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-1 text-sm">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span className="font-semibold text-slate-900">{gig.rating}</span>
          <span className="text-slate-400 text-xs">({gig.reviewsCount})</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">Starting at</span>
          <span className="font-bold text-slate-900">{gig.startingPrice}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

const AssistantSidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const response = await askAssistant(userMsg, { type: 'career', userRole: 'talent' });
      setMessages(prev => [...prev, { role: 'bot', text: response || "I'm here to help!" }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "Error connecting to assistant." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full md:w-[400px] bg-white z-[70] flex flex-col shadow-2xl"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="bg-indigo-50 p-2 rounded-lg text-brand-primary">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">paniBot Assistant</h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">AI Career Coach</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
              {messages.length === 0 && (
                <div className="text-center py-12 px-6">
                  <div className="bg-white w-16 h-16 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
                    <Zap size={24} className="text-brand-primary" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">How can I help today?</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">Ask me about resume optimization, interview strategies, or finding the perfect gig.</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={cn(
                  "max-w-[85%] p-4 text-sm rounded-2xl shadow-sm",
                  msg.role === 'user' 
                    ? "ml-auto bg-brand-primary text-white" 
                    : "mr-auto bg-white border border-slate-100 text-slate-700"
                )}>
                  {msg.text}
                </div>
              ))}
              {loading && (
                <div className="mr-auto bg-white border border-slate-100 p-4 rounded-2xl flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce delay-75" />
                  <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce delay-150" />
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-white">
              <div className="flex gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-slate-400"
                />
                <button 
                  onClick={handleSend}
                  className="bg-brand-primary text-white p-2.5 rounded-lg shadow-lg shadow-indigo-200 hover:bg-brand-secondary transition-colors"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const JobDetailsModal = ({ job, onClose }: { job: Job | null; onClose: () => void }) => (
  <AnimatePresence>
    {job && (
      <>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100]"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[800px] md:max-h-[90vh] bg-white z-[110] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          <div className="relative h-48 bg-brand-primary/5 p-8 flex items-end">
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 bg-white/80 hover:bg-white rounded-full shadow-sm text-slate-400 hover:text-slate-900 transition-all"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center p-4">
                <img src={job.logo} alt={job.company} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              </div>
              <div className="mb-2">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">{job.title}</h2>
                <p className="text-brand-primary font-bold">{job.company}</p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Location</p>
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <MapPin size={16} className="text-brand-primary" />
                  {job.location}
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Salary Range</p>
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <DollarSign size={16} className="text-emerald-500" />
                  {job.salary}
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Job Type</p>
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Clock size={16} className="text-brand-primary" />
                  {job.type}
                </div>
              </div>
            </div>

            <div className="prose prose-slate max-w-none">
              <h4 className="text-xl font-bold text-slate-900 mb-4">About the role</h4>
              <p className="text-slate-600 leading-relaxed mb-8">{job.description}</p>
              
              <h4 className="text-xl font-bold text-slate-900 mb-4">Requirements & Skills</h4>
              <div className="flex flex-wrap gap-3 mb-8">
                {job.tags.map(tag => (
                  <span key={tag} className="px-4 py-2 bg-indigo-50 text-brand-primary rounded-xl text-sm font-bold border border-indigo-100">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">
              Posted {job.postedAt}
            </div>
            <div className="flex gap-4">
              <button className="px-8 py-4 text-slate-600 font-bold hover:bg-slate-100 rounded-2xl transition-all">
                Save for later
              </button>
              <button className="btn-primary px-12 py-4 shadow-xl shadow-indigo-200">
                Apply Now
              </button>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const GigDetailsModal = ({ gig, onClose }: { gig: Gig | null; onClose: () => void }) => (
  <AnimatePresence>
    {gig && (
      <>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100]"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[800px] md:max-h-[90vh] bg-white z-[110] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          <div className="relative h-64 overflow-hidden">
            <img src={gig.image} alt={gig.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-all"
            >
              <X size={20} />
            </button>
            <div className="absolute bottom-8 left-8 right-8">
              <div className="flex items-center gap-3 mb-4">
                <img src={gig.avatar} alt={gig.freelancer} className="w-10 h-10 rounded-full border-2 border-white" referrerPolicy="no-referrer" />
                <div>
                  <p className="text-white font-bold">{gig.freelancer}</p>
                  <p className="text-white/70 text-xs font-medium uppercase tracking-widest">Top Rated Seller</p>
                </div>
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight leading-tight">{gig.title}</h2>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Rating</p>
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Star size={16} className="fill-yellow-400 text-yellow-400" />
                  {gig.rating} <span className="text-slate-400 font-medium">({gig.reviewsCount} reviews)</span>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Starting Price</p>
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <DollarSign size={16} className="text-emerald-500" />
                  {gig.startingPrice}
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Category</p>
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Zap size={16} className="text-brand-primary" />
                  {gig.category}
                </div>
              </div>
            </div>

            <div className="prose prose-slate max-w-none">
              <h4 className="text-xl font-bold text-slate-900 mb-4">Service Description</h4>
              <p className="text-slate-600 leading-relaxed mb-8">
                I will provide high-quality {gig.category.toLowerCase()} services tailored to your needs. 
                With years of experience in the industry, I guarantee professional results and timely delivery.
                Contact me for custom requirements or bulk orders.
              </p>
              
              <h4 className="text-xl font-bold text-slate-900 mb-4">What's included</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                {['High-resolution files', 'Commercial use license', 'Unlimited revisions', 'Source files included'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-slate-600 font-medium">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                      <ChevronRight size={12} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="p-4 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                <Bookmark size={24} />
              </button>
              <button className="px-8 py-4 text-slate-600 font-bold hover:bg-slate-100 rounded-2xl transition-all">
                Contact Seller
              </button>
            </div>
            <button className="btn-primary px-12 py-4 shadow-xl shadow-indigo-200">
              Continue ({gig.startingPrice})
            </button>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default function App() {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'jobs' | 'gigs'>('jobs');
  const [isLoaded, setIsLoaded] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        const jobsRes = await fetch(`/api/jobs?search=${encodeURIComponent(searchQuery)}`);
        const gigsRes = await fetch(`/api/gigs?search=${encodeURIComponent(searchQuery)}`);
        
        if (jobsRes.ok) setJobs(await jobsRes.json());
        if (gigsRes.ok) setGigs(await gigsRes.json());
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    if (isLoaded) {
      fetchData();
    }
  }, [isLoaded, searchQuery]);

  return (
    <div className="min-h-screen bg-white">
      <AnimatePresence>
        {!isLoaded && (
          <motion.div 
            key="splash"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center"
          >
            <div className="flex items-center gap-1.5">
              <span className="font-black text-4xl tracking-tighter text-brand-dark">
                pani<span className="text-brand-primary">.</span>
              </span>
            </div>
            <div className="mt-8 w-48 h-1 bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-full h-full bg-brand-primary"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar onHome={() => { setSearchQuery(''); }} onToggleAssistant={() => setIsAssistantOpen(true)} />
      <CategoryBar />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <Hero onSearch={(q) => setSearchQuery(q)} />
        <TrustSection />
        
        <main className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
            <h2 className="text-3xl font-bold text-brand-dark">
              {searchQuery ? `Search results for "${searchQuery}"` : "Popular professional services"}
            </h2>
            
            <div className="flex bg-slate-100 p-1 rounded-md">
              <button 
                onClick={() => setActiveTab('gigs')}
                className={cn(
                  "px-6 py-2 rounded-md text-sm font-bold transition-all",
                  activeTab === 'gigs' ? "bg-white text-brand-primary shadow-sm" : "text-brand-light hover:text-brand-dark"
                )}
              >
                Gigs
              </button>
              <button 
                onClick={() => setActiveTab('jobs')}
                className={cn(
                  "px-6 py-2 rounded-md text-sm font-bold transition-all",
                  activeTab === 'jobs' ? "bg-white text-brand-primary shadow-sm" : "text-brand-light hover:text-brand-dark"
                )}
              >
                Jobs
              </button>
            </div>
          </div>

          {isLoadingData ? (
            <div className="py-24 flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
              <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Loading talent...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === 'gigs' ? (
                <motion.div 
                  key="gigs"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                >
                  {gigs.length > 0 ? gigs.map(gig => (
                    <motion.div 
                      key={gig.id}
                      whileHover={{ y: -4 }}
                      onClick={() => setSelectedGig(gig)}
                      className="card-gig group cursor-pointer"
                    >
                      <div className="h-48 overflow-hidden relative">
                        <img src={gig.image} alt={gig.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <img src={gig.avatar} alt={gig.freelancer} className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
                          <span className="text-sm font-bold text-brand-dark">{gig.freelancer}</span>
                          <span className="text-xs text-brand-light ml-auto">Level 2 Seller</span>
                        </div>
                        <h3 className="text-brand-dark text-sm font-medium mb-4 line-clamp-2 group-hover:text-brand-primary transition-colors leading-snug">{gig.title}</h3>
                        <div className="flex items-center gap-1 mb-4">
                          <Star size={14} className="fill-[#ffbe5b] text-[#ffbe5b]" />
                          <span className="text-sm font-bold text-[#ffbe5b]">{gig.rating}</span>
                          <span className="text-xs text-brand-light">({gig.reviewsCount})</span>
                        </div>
                        <div className="pt-3 border-t border-brand-border flex items-center justify-between">
                          <Bookmark size={16} className="text-brand-light hover:text-red-500 transition-colors" />
                          <div className="text-right">
                            <span className="text-[10px] font-bold text-brand-light uppercase block">Starting at</span>
                            <span className="text-lg font-bold text-brand-dark">{gig.startingPrice}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="col-span-full py-24 text-center">
                      <p className="text-slate-400 font-medium">No gigs found matching your search.</p>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  key="jobs"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 gap-4"
                >
                  {jobs.length > 0 ? jobs.map(job => (
                    <JobCard key={job.id} job={job} onClick={() => setSelectedJob(job)} />
                  )) : (
                    <div className="py-24 text-center">
                      <p className="text-slate-400 font-medium">No jobs found matching your search.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}

          <div className="mt-16 flex justify-center">
            <button className="btn-fiverr-outline px-12">Show More</button>
          </div>
        </main>

        {/* Fiverr-style Features Section */}
        <section className="bg-[#f1fdf7] py-24 px-6">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-brand-dark mb-8">A whole world of freelance talent at your fingertips</h2>
              <div className="space-y-8">
                {[
                  { title: "The best for every budget", desc: "Find high-quality services at every price point. No hourly rates, just project-based pricing." },
                  { title: "Quality work done quickly", desc: "Find the right freelancer to begin working on your project within minutes." },
                  { title: "Protected payments, every time", desc: "Always know what you'll pay upfront. Your payment isn't released until you approve the work." },
                  { title: "24/7 support", desc: "Questions? Our round-the-clock support team is available to help anytime, anywhere." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full border-2 border-brand-light flex items-center justify-center text-brand-light shrink-0 mt-1">
                      <ChevronRight size={14} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-brand-dark mb-2">{item.title}</h4>
                      <p className="text-brand-light leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative rounded-lg overflow-hidden shadow-2xl">
              <img 
                src="https://picsum.photos/seed/workspace/1000/800" 
                alt="Workspace" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <motion.button 
                whileHover={{ scale: 1.1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl">
                  <Zap size={32} className="text-brand-primary fill-brand-primary ml-1" />
                </div>
              </motion.button>
            </div>
          </div>
        </section>

        <footer className="bg-white px-6 py-16 border-t border-brand-border">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-16">
            <div>
              <h4 className="font-bold text-brand-dark mb-6">Categories</h4>
              <ul className="space-y-4 text-sm text-brand-light">
                <li><a href="#" className="hover:underline">Graphics & Design</a></li>
                <li><a href="#" className="hover:underline">Digital Marketing</a></li>
                <li><a href="#" className="hover:underline">Writing & Translation</a></li>
                <li><a href="#" className="hover:underline">Video & Animation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-brand-dark mb-6">About</h4>
              <ul className="space-y-4 text-sm text-brand-light">
                <li><a href="#" className="hover:underline">Careers</a></li>
                <li><a href="#" className="hover:underline">Press & News</a></li>
                <li><a href="#" className="hover:underline">Partnerships</a></li>
                <li><a href="#" className="hover:underline">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-brand-dark mb-6">Support</h4>
              <ul className="space-y-4 text-sm text-brand-light">
                <li><a href="#" className="hover:underline">Help & Support</a></li>
                <li><a href="#" className="hover:underline">Trust & Safety</a></li>
                <li><a href="#" className="hover:underline">Selling on pani</a></li>
                <li><a href="#" className="hover:underline">Buying on pani</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-brand-dark mb-6">Community</h4>
              <ul className="space-y-4 text-sm text-brand-light">
                <li><a href="#" className="hover:underline">Events</a></li>
                <li><a href="#" className="hover:underline">Blog</a></li>
                <li><a href="#" className="hover:underline">Forum</a></li>
                <li><a href="#" className="hover:underline">Podcast</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-brand-dark mb-6">More From pani</h4>
              <ul className="space-y-4 text-sm text-brand-light">
                <li><a href="#" className="hover:underline">pani Pro</a></li>
                <li><a href="#" className="hover:underline">pani Logo Maker</a></li>
                <li><a href="#" className="hover:underline">pani Guides</a></li>
                <li><a href="#" className="hover:underline">Get Inspired</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-brand-border flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-6">
              <span className="font-black text-2xl tracking-tighter text-brand-light">pani<span className="text-brand-border">.</span></span>
              <p className="text-xs text-brand-light">© pani International Ltd. 2024</p>
            </div>
            <div className="flex gap-6">
              {[Globe, User, ArrowRight].map((Icon, i) => (
                <button key={i} className="text-brand-light hover:text-brand-dark transition-colors">
                  <Icon size={20} />
                </button>
              ))}
            </div>
          </div>
        </footer>
      </motion.div>

      <AssistantSidebar isOpen={isAssistantOpen} onClose={() => setIsAssistantOpen(false)} />
      <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      <GigDetailsModal gig={selectedGig} onClose={() => setSelectedGig(null)} />
    </div>
  );
}
