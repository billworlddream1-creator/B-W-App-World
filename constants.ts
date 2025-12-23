
import { PricingPlan, VideoTemplate } from './types';

export const APP_NAME = "B&W Artifi Ai";

export const THEME_ACCENTS = [
  { name: 'Solaris Prime', color: '#ffd700', glow: 'rgba(255, 215, 0, 0.4)', bg: '#0a0800' },
  { name: 'Auric Shadow', color: '#daa520', glow: 'rgba(218, 165, 32, 0.4)', bg: '#0d0b00' },
  { name: 'Gilded Abyss', color: '#b8860b', glow: 'rgba(184, 134, 11, 0.4)', bg: '#080700' },
  { name: 'Amber Void', color: '#ffbf00', glow: 'rgba(255, 191, 0, 0.4)', bg: '#110e00' },
  { name: 'Antique Brass', color: '#cd7f32', glow: 'rgba(205, 127, 50, 0.4)', bg: '#0c0a00' },
  { name: 'Midas Core', color: '#e5c100', glow: 'rgba(229, 193, 0, 0.4)', bg: '#090800' },
  { name: 'Citrine Dark', color: '#e4d00a', glow: 'rgba(228, 208, 10, 0.4)', bg: '#100e00' },
  { name: 'Bronze Silk', color: '#a57164', glow: 'rgba(165, 113, 100, 0.4)', bg: '#0e0b00' },
  { name: 'Trophy Gold', color: '#c5b358', glow: 'rgba(197, 179, 88, 0.4)', bg: '#0b0900' },
  { name: 'Radiant Ochre', color: '#cc7722', glow: 'rgba(204, 119, 34, 0.4)', bg: '#120f00' }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free Artisan',
    price: 0,
    interval: 'month',
    credits: 80,
    features: [
      'Monochrome Mastery', 
      '80 Daily Credits', 
      'Slide Nexus (5 Slide Max)',
      'Community Showcase'
    ]
  },
  {
    id: 'weekly',
    name: 'Silver Weekly',
    price: 9.99,
    interval: 'week',
    credits: 200,
    features: [
      'Priority Compute', 
      'Slide Nexus (10 Slide Max)',
      '7-Day History Archive', 
      'High-Res Synthetics'
    ]
  },
  {
    id: 'monthly',
    name: 'Obsidian Monthly',
    price: 29.99,
    interval: 'month',
    credits: 1000,
    features: [
      'Elite Video Nodes', 
      'Slide Nexus (15 Slide Max)',
      'Unlimited Archive', 
      'Alpha Model Access'
    ]
  },
  {
    id: 'yearly',
    name: 'Platinum Yearly',
    price: 199.99,
    interval: 'year',
    credits: 12000,
    features: [
      'Maximum Throughput', 
      'Slide Nexus (25 Slide Max)',
      'Personal API Key Support', 
      'Founder Access'
    ]
  }
];

export const VIDEO_TEMPLATES: VideoTemplate[] = [
  { id: 't1', title: 'Noir Cinema', prompt: 'High-contrast noir style detective office, smoke curling from an ashtray, Venetian blinds casting long shadows, 4k monochrome cinematic.', thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=400', category: 'Noir' },
  { id: 't2', title: 'Static Storm', prompt: 'Abstract black and white liquid metal flowing upwards, electricity sparks between droplets, hyper-realistic macro shot.', thumbnail: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=400', category: 'Abstract' },
  { id: 't3', title: 'Architectural Void', prompt: 'Brutalist concrete architecture in bright sunlight, extreme shadows, minimalist black and white photography, slow drone sweep.', thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400', category: 'Brutalist' },
  { id: 't4', title: 'Lunar Surface', prompt: 'Detailed cratered surface of the moon, black space background, sharp shadows from Earthlight, slow cinematic panning.', thumbnail: 'https://images.unsplash.com/photo-1522030239044-12f51ea89ebb?auto=format&fit=crop&q=80&w=400', category: 'Space' }
];

export const INITIAL_SYSTEM_SETTINGS = {
  ttsEnabled: true,
  imageEnabled: true,
  videoEnabled: true,
  freeLimit: 80,
  whatsappEnabled: true,
  whatsappNumber: '+1234567890',
  paypalEmail: 'billing@bw-artifi.ai',
  paypalEnv: 'sandbox' as const
};

export const SYSTEM_MESSAGES = [
  "Master the art of the monochrome. Subscribe for elite compute power.",
  "Run out of artisan credits? Upgrade to Obsidian for 1000 monthly units.",
  "Join the B&W elite. Platinum members receive 12,000 yearly credits.",
  "Your creative vision deserves uncompromised speed. Go Silver today.",
  "Refer a friend and earn +1 bonus credit instantly. Share the artistry.",
  "Neural nodes active. Optimized for high-contrast synthesis.",
  "Architectural precision detected in current workspace.",
  "Synchronizing with global monochrome trends."
];

export const NEW_USER_SALUTATIONS = [
  "Welcome to the Forge, Artisan. Your creative neural journey begins now.",
  "Initialize your vision. The Obsidian Core is ready for its first synthesis.",
  "New Architect detected. Accessing monochromatic toolsets...",
  "Welcome, Creator. Every shadow you cast here is a masterpiece in waiting.",
  "Identity verified. Welcome to the elite tier of AI artistry."
];

export const RETURNING_USER_SALUTATIONS = [
  "Welcome back, Architect. The nodes have been anticipating your return.",
  "Re-establishing secure connection... Your artistic legacy continues.",
  "Neural sync complete. Credits refreshed. What shall we forge today?",
  "Artisan online. Continuing high-contrast workspace from last session.",
  "Welcome back. Your previous syntheses are archived and ready for expansion."
];

export const SHOWCASE_ASSETS = [
  { type: 'image', url: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?auto=format&fit=crop&q=80&w=400' },
  { type: 'image', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400' },
  { type: 'image', url: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&q=80&w=400' },
  { type: 'image', url: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80&w=400' },
  { type: 'image', url: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?auto=format&fit=crop&q=80&w=400' }
];
