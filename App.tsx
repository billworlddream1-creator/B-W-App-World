
import React, { useState, useEffect } from 'react';
import { AppView, User, GenerationHistory, AppState, AdminMessage } from './types';
import { INITIAL_SYSTEM_SETTINGS, PRICING_PLANS, APP_NAME, THEME_ACCENTS, NEW_USER_SALUTATIONS, RETURNING_USER_SALUTATIONS } from './constants';
import { aiService } from './services/geminiService';
import Dashboard from './pages/Dashboard';
import TTSPage from './pages/TTS';
import ImageGenPage from './pages/ImageGen';
import VideoGenPage from './pages/VideoGen';
import PresentationPage from './pages/Presentation';
import HistoryPage from './pages/History';
import PricingPage from './pages/Pricing';
import AdminPage from './pages/Admin';
import LoginPage from './pages/Login';
import Academy from './pages/Academy';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import GlobalFooter from './components/GlobalFooter';
import WorkNavigator from './components/WorkNavigator';

const WORK_SEQUENCE: AppView[] = [
  'dashboard',
  'academy',
  'tts',
  'image',
  'video',
  'ppt',
  'history'
];

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('bw_artifi_state_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...parsed, isLoading: false };
      } catch (e) {
        console.error("Failed to parse state", e);
      }
    }
    
    const dayOfYear = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    return {
      user: null,
      allUsers: [],
      messages: [],
      history: [],
      isLoading: false,
      themeIndex: dayOfYear % THEME_ACCENTS.length,
      systemSettings: INITIAL_SYSTEM_SETTINGS
    };
  });

  const [view, setView] = useState<AppView>(state.user ? 'dashboard' : 'login');

  // Keyboard Shortcuts for Workspace Switching
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!state.user || view === 'login') return;
      
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      const currentIndex = WORK_SEQUENCE.indexOf(view);
      if (currentIndex === -1) return;

      if (e.key === 'ArrowLeft') {
        const prevIndex = (currentIndex - 1 + WORK_SEQUENCE.length) % WORK_SEQUENCE.length;
        setView(WORK_SEQUENCE[prevIndex]);
      } else if (e.key === 'ArrowRight') {
        const nextIndex = (currentIndex + 1) % WORK_SEQUENCE.length;
        setView(WORK_SEQUENCE[nextIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, state.user]);

  // Daily Sync Logic
  useEffect(() => {
    const syncDailyContent = async () => {
      const today = new Date().toISOString().split('T')[0];
      const dayOfYear = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
      const currentThemeIndex = dayOfYear % THEME_ACCENTS.length;

      if (state.lastDailyUpdate !== today) {
        setState(prev => ({ 
          ...prev, 
          isLoading: true,
          themeIndex: currentThemeIndex
        }));

        try {
          const dailyPrompt = `A high-contrast cinematic black and white photo with subtle deep red highlights, minimalist architecture, 8k resolution, artistic composition.`;
          const imageUrl = await aiService.generateImage(dailyPrompt);
          
          setState(prev => ({
            ...prev,
            lastDailyUpdate: today,
            dailyShowcase: {
              imageUrl,
              prompt: dailyPrompt
            },
            isLoading: false
          }));
        } catch (e) {
          console.error("Daily forge failed", e);
          setState(prev => ({ ...prev, lastDailyUpdate: today, isLoading: false }));
        }
      }
    };

    if (state.user) {
      syncDailyContent();
    }
  }, [state.user, state.lastDailyUpdate]);

  useEffect(() => {
    const theme = THEME_ACCENTS[state.themeIndex] as any;
    const root = document.documentElement;
    root.style.setProperty('--accent-color', theme.color);
    root.style.setProperty('--accent-glow', theme.glow);
    root.style.setProperty('--bg-deep', theme.bg || '#0a0101');
    const rgb = theme.color.match(/[A-Za-z0-9]{2}/g)?.map((x: string) => parseInt(x, 16)) || [255,255,255];
    root.style.setProperty('--glass-border', `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.1)`);
    root.style.setProperty('--glass-bg', `rgba(${parseInt((theme.bg || '#0a0101').slice(1,3), 16)}, ${parseInt((theme.bg || '#0a0101').slice(3,5), 16)}, ${parseInt((theme.bg || '#0a0101').slice(5,7), 16)}, 0.7)`);
  }, [state.themeIndex]);

  useEffect(() => {
    localStorage.setItem('bw_artifi_state_v3', JSON.stringify({
      ...state,
      isLoading: false
    }));
  }, [state]);

  const handleLogin = (user: User, refCode?: string) => {
    const today = new Date().toISOString().split('T')[0];
    const dayOfYear = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    const timestamp = Date.now();
    let updatedUser = { ...user, lastLoginTimestamp: timestamp };

    const existingUser = state.allUsers.find(u => u.email === user.email);
    
    // Pick salutation
    let salutation = "";
    if (existingUser && existingUser.lastLoginDateString) {
      salutation = RETURNING_USER_SALUTATIONS[Math.floor(Math.random() * RETURNING_USER_SALUTATIONS.length)];
    } else {
      salutation = NEW_USER_SALUTATIONS[Math.floor(Math.random() * NEW_USER_SALUTATIONS.length)];
    }

    if (!existingUser && refCode) {
      const referee = state.allUsers.find(u => u.referralCode === refCode);
      if (referee) {
        const bonus = user.plan === 'free' ? 1 : 2;
        setState(prev => ({
          ...prev,
          allUsers: prev.allUsers.map(u => u.id === referee.id ? {
            ...u,
            credits: u.credits + bonus,
            referralCount: u.referralCount + 1,
            referralCreditsEarned: u.referralCreditsEarned + bonus
          } : u)
        }));
        updatedUser.referredBy = referee.id;
      }
    }

    updatedUser.footprint = {
      ip: `203.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      browser: navigator.userAgent.substring(0, 40),
      location: 'Verified Obsidian Terminal'
    };

    if (user.lastLoginDateString !== today) {
      updatedUser.credits = state.systemSettings.freeLimit;
      updatedUser.maxCredits = state.systemSettings.freeLimit;
      updatedUser.lastLoginDateString = today;
    }

    setState(prev => {
      const uExists = prev.allUsers.find(u => u.email === user.email);
      const newAllUsers = uExists 
        ? prev.allUsers.map(u => u.email === user.email ? updatedUser : u)
        : [...prev.allUsers, updatedUser];
      
      return { 
        ...prev, 
        user: updatedUser, 
        allUsers: newAllUsers,
        currentSalutation: salutation,
        themeIndex: dayOfYear % THEME_ACCENTS.length
      };
    });
    
    setView('dashboard');
  };

  const handleLogout = () => {
    setState(prev => ({ ...prev, user: null }));
    setView('login');
  };

  const addHistory = (item: Omit<GenerationHistory, 'id' | 'timestamp'>) => {
    const newItem: GenerationHistory = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    setState(prev => ({
      ...prev,
      history: [newItem, ...prev.history],
      user: prev.user ? { ...prev.user, credits: Math.max(0, prev.user.credits - 1) } : null
    }));
  };

  const updateSettings = (settings: AppState['systemSettings']) => {
    setState(prev => ({ ...prev, systemSettings: settings }));
  };

  const sendMessage = (toUserId: string, content: string) => {
    const newMessage: AdminMessage = {
      id: Math.random().toString(36).substr(2, 6),
      toUserId,
      from: 'B&W Artifi Support',
      content,
      timestamp: Date.now(),
      read: false
    };
    setState(prev => ({ ...prev, messages: [newMessage, ...prev.messages] }));
  };

  const addUser = (userData: Partial<User>) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 6),
      name: userData.name || 'Artisan Creator',
      email: userData.email || '',
      role: 'user',
      credits: state.systemSettings.freeLimit,
      maxCredits: state.systemSettings.freeLimit,
      plan: 'free',
      lastLoginDateString: '',
      referralCode: Math.random().toString(36).substr(2, 6).toUpperCase(),
      referralCount: 0,
      referralCreditsEarned: 0
    };
    setState(prev => ({ ...prev, allUsers: [...prev.allUsers, newUser] }));
  };

  const clearAllHistory = () => {
    if (confirm('Erase all synthetic memory?')) {
      setState(prev => ({ ...prev, history: [] }));
    }
  };

  const upgradePlan = (planId: string) => {
    if (!state.user) return;
    const plan = PRICING_PLANS.find(p => p.id === planId);
    if (!plan) return;

    setState(prev => ({
      ...prev,
      user: prev.user ? {
        ...prev.user,
        plan: plan.id as any,
        credits: plan.credits,
        maxCredits: plan.credits
      } : null
    }));
    setView('dashboard');
    alert(`Node upgraded to ${plan.name} status.`);
  };

  const renderContent = () => {
    if (view === 'login') return <LoginPage onLogin={handleLogin} />;
    if (!state.user) return null;
    
    switch (view) {
      case 'dashboard': return <Dashboard setView={setView} user={state.user} stats={{
        total: state.history.length,
        audio: state.history.filter(h => h.type === 'audio').length,
        image: state.history.filter(h => h.type === 'image').length,
        video: state.history.filter(h => h.type === 'video').length,
      }} themeName={THEME_ACCENTS[state.themeIndex].name} dailyShowcase={state.dailyShowcase} />;
      case 'academy': return <Academy />;
      case 'tts': return <TTSPage user={state.user} onGenerate={addHistory} settings={state.systemSettings} />;
      case 'image': return <ImageGenPage user={state.user} onGenerate={addHistory} settings={state.systemSettings} />;
      case 'video': return <VideoGenPage user={state.user} onGenerate={addHistory} settings={state.systemSettings} />;
      case 'ppt': return <PresentationPage user={state.user} onGenerate={addHistory} />;
      case 'history': return <HistoryPage history={state.history} />;
      case 'pricing': return <PricingPage onUpgrade={upgradePlan} currentPlan={state.user.plan || 'free'} />;
      case 'admin': return (
        <AdminPage 
          state={state} 
          onUpdateSettings={updateSettings} 
          onClearHistory={clearAllHistory}
          onSendMessage={sendMessage}
          onAddUser={addUser}
        />
      );
      default: return <Dashboard setView={setView} user={state.user} stats={{total: 0, audio: 0, image: 0, video: 0}} themeName={THEME_ACCENTS[state.themeIndex].name} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden transition-all duration-1000">
      {state.isLoading && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center space-y-4">
          <div className="h-16 w-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Synchronizing Daily Cycle...</p>
        </div>
      )}
      
      <Sidebar currentView={view} setView={setView} userRole={state.user?.role || 'user'} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar 
          user={state.user} 
          onLogout={handleLogout} 
          setView={setView} 
          notificationCount={state.messages.filter(m => m.toUserId === state.user?.id && !m.read).length}
          messages={state.messages.filter(m => m.toUserId === state.user?.id)}
          currentView={view}
          salutation={state.currentSalutation}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {state.user && <WorkNavigator currentView={view} setView={setView} />}
            {renderContent()}
            <GlobalFooter 
              whatsappEnabled={state.systemSettings.whatsappEnabled} 
              whatsappNumber={state.systemSettings.whatsappNumber} 
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
