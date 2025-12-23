
export type AppView = 'dashboard' | 'tts' | 'image' | 'video' | 'history' | 'pricing' | 'admin' | 'login' | 'academy' | 'ppt' | 'feed';

export interface AdminMessage {
  id: string;
  toUserId: string;
  from: string;
  content: string;
  timestamp: number;
  read: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  credits: number;
  maxCredits: number;
  plan: 'free' | 'weekly' | 'monthly' | 'yearly';
  lastLoginDateString?: string;
  lastLoginTimestamp?: number;
  referralCode: string;
  referralCount: number;
  referralCreditsEarned: number;
  referredBy?: string;
  footprint?: {
    ip: string;
    browser: string;
    location: string;
  };
}

export interface GenerationHistory {
  id: string;
  type: 'audio' | 'image' | 'video' | 'presentation';
  prompt: string;
  url: string; 
  timestamp: number;
  metadata?: any;
}

export interface Slide {
  title: string;
  content: string[];
  visualDirective: string;
  generatedImageUrl?: string; // Cache for generated slide visuals
}

export interface PresentationDeck {
  topic: string;
  slides: Slide[];
}

export interface PricingPlan {
  id: 'free' | 'weekly' | 'monthly' | 'yearly';
  name: string;
  price: number;
  interval: 'week' | 'month' | 'year';
  credits: number;
  features: string[];
}

export interface VideoTemplate {
  id: string;
  title: string;
  prompt: string;
  thumbnail: string;
  category: string;
}

export interface AppState {
  user: User | null;
  allUsers: User[]; 
  messages: AdminMessage[];
  history: GenerationHistory[];
  isLoading: boolean;
  themeIndex: number;
  lastDailyUpdate?: string;
  currentSalutation?: string; 
  dailyShowcase?: {
    imageUrl: string;
    prompt: string;
    videoUrl?: string;
  };
  systemSettings: {
    ttsEnabled: boolean;
    imageEnabled: boolean;
    videoEnabled: boolean;
    freeLimit: number;
    whatsappEnabled: boolean;
    whatsappNumber: string;
    paypalEmail: string;
    paypalEnv: 'sandbox' | 'live';
  };
}
