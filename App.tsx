
import React, { useState, useEffect, useRef } from 'react';
import { Store } from './components/Store';
import { Learning } from './components/Learning';
import { NewsFeed } from './components/NewsFeed';
import { WorldNews } from './components/WorldNews';
import { Agenda } from './components/Agenda';
import { Events } from './components/Events';
import { Dashboard } from './components/Dashboard';
import { Notifications } from './components/Notifications';
import { Tofa } from './components/Tofa';
import { User, Product, CartItem } from './types';
import { 
  ShoppingCart, ShoppingBag, User as UserIcon, BookOpen, Home, Mail, 
  HelpCircle, X, Sparkles, Send, 
  Menu, Flame, Compass, ChevronRight, ArrowLeft, Info, History, PlusCircle, LogIn, Chrome, AlertCircle, Newspaper, CalendarDays,
  Minus, Plus, Trash2, CreditCard, Ticket, Facebook, Bell, MessageSquare, Trash, Clock, GraduationCap, Baby,
  Lock, Eye, EyeOff
} from 'lucide-react';
import { askSpiritualAssistant } from './services/geminiService';

const MOCK_USER: User = {
  id: 'u1',
  name: 'Adéwalé Koffi',
  email: 'adewale@example.com',
  role: 'user', 
  xp: 450,
  level: 2,
  badges: ['Initié Débutant', 'Lecteur Assidu'],
  enrolledCourses: ['c1'],
  birthDate: '1995-03-12',
  faSign: 'Gbe-Meji'
};

const BOKONON_USER: User = {
  id: 'b1',
  name: 'Bokonon Amoussa',
  email: 'bokonon@fa&vodoun.com',
  role: 'bokonon',
  xp: 15000,
  level: 10,
  badges: ['Grand Maître', 'Gardien des Arcanes', 'Sage Certifié'],
  enrolledCourses: [],
  birthDate: '1965-08-20',
  faSign: 'Fu-Meji'
};

interface Message {
    role: 'user' | 'ai';
    text: string;
}

interface ChatSession {
    id: string;
    title: string;
    messages: Message[];
    timestamp: number;
}

const WELCOME_MESSAGE: Message = { 
    role: 'ai', 
    text: 'Bonjour, je suis votre guide spirituel virtuel. Posez-moi une question sur le Fa ou la tradition.'
};

const QUICK_ACTIONS = [
    { label: "Qu'est-ce que le FA ?", icon: Sparkles, query: "Qu'est-ce que le FA ? Explique-moi ses fondements." },
    { label: "Qu'est-ce que le VODOUN ?", icon: Flame, query: "Qu'est-ce que le VODOUN ? Quelle est sa philosophie ?" },
    { label: "Connaître mon signe", icon: Compass, query: "Comment puis-je connaître mon signe du FA ?" }
];

const CartPage: React.FC<{
  cart: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  onCheckout: () => void;
  onBack: () => void;
}> = ({ cart, updateQuantity, removeFromCart, clearCart, onCheckout, onBack }) => (
  <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-brand-50 animate-fadeIn">
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-3xl font-serif font-bold text-brand-900">Mon Panier</h2>
      <button onClick={onBack} className="text-brand-600 font-bold hover:underline flex items-center gap-2">
        <ArrowLeft size={18} /> Continuer mes achats
      </button>
    </div>

    {cart.length === 0 ? (
      <div className="text-center py-20 space-y-4">
        <ShoppingCart size={64} className="mx-auto text-stone-200" />
        <p className="text-stone-500 text-lg italic">Votre panier est vide pour le moment.</p>
        <button onClick={onBack} className="bg-brand-900 text-white px-8 py-3 rounded-xl font-bold">Voir la boutique</button>
      </div>
    ) : (
      <div className="space-y-6">
        <div className="space-y-4">
          {cart.map(item => (
            <div key={item.id} className="flex flex-col sm:flex-row justify-between items-center p-6 bg-stone-50 rounded-[2rem] border border-stone-100 gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img src={item.image} className="w-20 h-20 rounded-2xl object-cover shadow-sm" alt={item.name} />
                <div>
                  <h4 className="font-bold text-brand-900">{item.name}</h4>
                  <p className="text-brand-600 font-bold">{item.price.toLocaleString()} F</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-stone-200 shadow-sm">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-brand-600"><Minus size={16} /></button>
                  <span className="font-bold w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-brand-600"><Plus size={16} /></button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:scale-110 transition-transform"><Trash2 size={20} /></button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-8 bg-brand-900 text-white rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <p className="text-brand-300 text-xs font-black uppercase tracking-widest">Total de la commande</p>
            <p className="text-4xl font-serif font-black">{cart.reduce((a, b) => a + (b.price * b.quantity), 0).toLocaleString()} FCFA</p>
          </div>
          <div className="flex gap-4">
            <button onClick={clearCart} className="px-6 py-4 bg-white/10 rounded-2xl font-bold hover:bg-white/20 transition-all">Vider le panier</button>
            <button onClick={onCheckout} className="px-10 py-4 bg-brand-500 text-brand-900 rounded-2xl font-black uppercase tracking-widest hover:bg-brand-400 transition-all shadow-xl">Payer maintenant</button>
          </div>
        </div>
      </div>
    )}
  </div>
);

const ContactPage: React.FC = () => (
  <div className="max-w-4xl mx-auto bg-white p-12 rounded-[3.5rem] shadow-2xl border border-brand-50 space-y-8 animate-fadeIn">
    <div className="text-center space-y-4">
      <div className="inline-flex items-center justify-center p-4 bg-brand-50 rounded-full"><Mail className="text-brand-600" size={32} /></div>
      <h2 className="text-4xl font-serif font-bold text-brand-900">Contactez le Temple</h2>
      <p className="text-stone-500 italic">Nos sages sont à votre écoute pour toute question spirituelle ou technique.</p>
    </div>
    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <input type="text" placeholder="Votre Nom" className="p-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500" />
      <input type="email" placeholder="Votre Email" className="p-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500" />
      <textarea placeholder="Votre message..." className="md:col-span-2 p-6 bg-stone-50 border border-stone-100 rounded-[2rem] outline-none focus:ring-2 focus:ring-brand-500 min-h-[150px]"></textarea>
      <button className="md:col-span-2 bg-brand-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-black transition-all shadow-xl">Envoyer ma requête</button>
    </form>
  </div>
);

const FAQPage: React.FC = () => (
  <div className="max-w-4xl mx-auto bg-white p-12 rounded-[3.5rem] shadow-2xl border border-brand-50 space-y-12 animate-fadeIn">
    <div className="text-center space-y-4">
      <div className="inline-flex items-center justify-center p-4 bg-brand-50 rounded-full"><HelpCircle className="text-brand-600" size={32} /></div>
      <h2 className="text-4xl font-serif font-bold text-brand-900">Questions Fréquentes</h2>
    </div>
    <div className="space-y-6">
      {[
        { q: "Qu'est-ce que le Fa ?", a: "Le Fa est un système de géomancie d'origine béninoise (Bénin) et nigériane (Yoruba), utilisé pour consulter le destin." },
        { q: "Comment se passe une consultation en ligne ?", a: "Un Bokonon (sage) interroge l'Agumaga (chapelet) pour vous et nous vous transmettons le rapport complet." },
        { q: "Les cours sont-ils certifiés ?", a: "Oui, chaque formation complétée donne droit à une graduation symbolique et un certificat d'initiation." }
      ].map((item, i) => (
        <div key={i} className="p-8 bg-stone-50 rounded-[2rem] border border-stone-100 space-y-2">
          <h4 className="font-bold text-brand-900 text-lg">Q: {item.q}</h4>
          <p className="text-stone-600 leading-relaxed italic">{item.a}</p>
        </div>
      ))}
    </div>
  </div>
);

const AboutPage: React.FC = () => (
  <div className="max-w-4xl mx-auto bg-white p-12 rounded-[3.5rem] shadow-2xl border border-brand-50 space-y-12 animate-fadeIn">
    <div className="text-center space-y-4">
      <div className="inline-flex items-center justify-center p-4 bg-brand-50 rounded-full"><Info className="text-brand-600" size={32} /></div>
      <h2 className="text-4xl font-serif font-bold text-brand-900">À Propos du Projet</h2>
    </div>
    <div className="prose prose-stone max-w-none text-center space-y-6">
      <p className="text-xl text-stone-600 leading-relaxed">
        Fa&Vodoun Connect est une initiative technologique visant à numériser et préserver les savoirs ancestraux du Bénin. 
        Notre mission est de rendre la sagesse du Fa accessible à la nouvelle génération tout en respectant l'authenticité des rites.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
        <div className="space-y-2">
          <div className="text-3xl font-black text-brand-600">Authenticité</div>
          <p className="text-sm text-stone-400 uppercase font-bold tracking-widest">Rites Certifiés</p>
        </div>
        <div className="space-y-2">
          <div className="text-3xl font-black text-brand-600">Transmission</div>
          <p className="text-sm text-stone-400 uppercase font-bold tracking-widest">Temple Digital</p>
        </div>
        <div className="space-y-2">
          <div className="text-3xl font-black text-brand-600">Communion</div>
          <p className="text-sm text-stone-400 uppercase font-bold tracking-widest">Réseau d'Initiés</p>
        </div>
      </div>
    </div>
  </div>
);

const AuthPage: React.FC<{ onSuccess: (role?: 'user' | 'bokonon') => void }> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (email === 'bokonon@fa&vodoun.com' && password === '1234567890') {
      onSuccess('bokonon');
    } else {
      onSuccess('user');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-10 md:p-14 rounded-[3.5rem] shadow-2xl border border-brand-50 space-y-8 animate-slideUp text-center">
      <div className="space-y-4">
        <div className="w-20 h-20 bg-brand-900 text-brand-400 rounded-3xl flex items-center justify-center mx-auto shadow-xl">
          <LogIn size={40} />
        </div>
        <h2 className="text-3xl font-serif font-bold text-brand-900 uppercase">Connexion</h2>
        <p className="text-stone-500 text-sm">Entrez dans votre espace sacré pour poursuivre votre initiation.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-brand-600 transition-colors" size={20} />
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500 transition-all" 
            />
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-brand-600 transition-colors" size={20} />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Mot de passe" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500 transition-all" 
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 hover:text-brand-600 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        
        <button onClick={handleLogin} className="w-full bg-brand-800 text-white py-5 rounded-2xl font-bold shadow-xl hover:bg-brand-900 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-3 group">
          <LogIn size={20} className="group-hover:translate-x-1 transition-transform" /> Se connecter
        </button>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-100"></div></div>
          <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest"><span className="bg-white px-4 text-stone-300">Ou continuer avec</span></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => onSuccess('user')} className="flex items-center justify-center gap-3 py-4 bg-white border border-stone-200 rounded-2xl font-bold text-stone-600 hover:bg-stone-50 transition-all shadow-sm">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
            <span className="text-sm">Google</span>
          </button>
          <button onClick={() => onSuccess('user')} className="flex items-center justify-center gap-3 py-4 bg-[#1877F2] text-white rounded-2xl font-bold hover:bg-[#166fe5] transition-all shadow-md">
            <Facebook size={20} fill="white" />
            <span className="text-sm">Facebook</span>
          </button>
        </div>
      </div>

      <p className="text-sm text-stone-500 pt-4">
        Pas encore de compte ? <span className="text-brand-700 font-bold cursor-pointer hover:underline">Créer un compte</span>
      </p>
    </div>
  );
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'store' | 'learning' | 'dashboard' | 'contact' | 'faq' | 'about' | 'cart' | 'auth' | 'news' | 'agenda' | 'events' | 'notifications' | 'tofa' | 'chat'>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authRedirect, setAuthRedirect] = useState<any>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [user, setUser] = useState<User>(MOCK_USER);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isDetailView, setIsDetailView] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  
  const [initialStoreId, setInitialStoreId] = useState<string | null>(null);
  const [initialLearningId, setInitialLearningId] = useState<string | null>(null);
  const [initialNewsId, setInitialNewsId] = useState<string | null>(null);
  const [initialAgendaDate, setInitialAgendaDate] = useState<string | null>(null);
  const [initialDashboardConsultId, setInitialDashboardConsultId] = useState<string | null>(null);
  
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('fa_chat_sessions');
    if (saved) return JSON.parse(saved);
    const initialSession: ChatSession = {
        id: Date.now().toString(),
        title: "Nouvelle discussion",
        messages: [WELCOME_MESSAGE],
        timestamp: Date.now()
    };
    return [initialSession];
  });

  const [currentSessionId, setCurrentSessionId] = useState<string>(sessions[0]?.id || "");
  const currentSession = sessions.find(s => s.id === currentSessionId) || sessions[0];
  const messages = currentSession?.messages || [WELCOME_MESSAGE];
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('fa_chat_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
      if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
  }, [messages, isTyping, currentPage]);

  useEffect(() => {
    setIsDetailView(false);
    if (currentPage !== 'store') setInitialStoreId(null);
    if (currentPage !== 'learning') setInitialLearningId(null);
    if (currentPage !== 'news' && currentPage !== 'events') setInitialNewsId(null);
    if (currentPage !== 'agenda') setInitialAgendaDate(null);
    if (currentPage !== 'dashboard') setInitialDashboardConsultId(null);
  }, [currentPage]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(p => p.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(p => {
        if (p.id === id) {
            const newQ = Math.max(1, p.quantity + delta);
            return { ...p, quantity: newQ };
        }
        return p;
    }));
  };

  const clearCart = () => setCart([]);

  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    if (diff < 3600000) return "À l'instant";
    if (diff < 86400000) return "Aujourd'hui";
    if (diff < 172800000) return "Hier";
    return new Date(timestamp).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const submitQuery = async (queryText: string) => {
    if (!queryText.trim() || isTyping) return;
    const userMsg: Message = { role: 'user', text: queryText };
    setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
            const isFirstUserMsg = !s.messages.some(m => m.role === 'user');
            return {
                ...s,
                title: isFirstUserMsg ? queryText.slice(0, 40) + (queryText.length > 40 ? "..." : "") : s.title,
                messages: [...s.messages, userMsg],
                timestamp: Date.now()
            };
        }
        return s;
    }));
    setIsTyping(true);
    const responseText = await askSpiritualAssistant(queryText);
    setIsTyping(false);
    const aiMsg: Message = { role: 'ai', text: responseText };
    setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
            return { ...s, messages: [...s.messages, aiMsg] };
        }
        return s;
    }));
  };

  const handleChatSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (chatInput.trim()) {
          submitQuery(chatInput);
          setChatInput('');
      }
  };

  const startNewSession = () => {
      const newSession: ChatSession = {
          id: Date.now().toString(),
          title: "Nouvelle discussion",
          messages: [WELCOME_MESSAGE],
          timestamp: Date.now()
      };
      setSessions([newSession, ...sessions]);
      setCurrentSessionId(newSession.id);
  };

  const deleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (sessions.length <= 1) return;
    const filtered = sessions.filter(s => s.id !== id);
    setSessions(filtered);
    if (currentSessionId === id) setCurrentSessionId(filtered[0].id);
  };

  const handleDeepNavigate = (page: any, id?: string) => {
    if (page === 'store' && id) setInitialStoreId(id);
    if (page === 'learning' && id) setInitialLearningId(id);
    if (page === 'news' && id) setInitialNewsId(id);
    if (page === 'agenda' && id) setInitialAgendaDate(id);
    if (page === 'dashboard' && id) setInitialDashboardConsultId(id);
    if (page === 'events' && id) setInitialNewsId(id); 
    setCurrentPage(page);
    setSideMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateProtected = (page: any) => {
    if (!isLoggedIn) {
        setAuthRedirect(page);
        setCurrentPage('auth');
    } else {
        setCurrentPage(page);
    }
    setSideMenuOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('home');
    setUser(MOCK_USER); // Reset to default mock
    setSideMenuOpen(false);
    setShowLogoutConfirm(false);
  };

  const navItems = [
    { id: 'home', label: 'Accueil', icon: Home, protected: false },
    { id: 'news', label: 'Actu', icon: Newspaper, protected: false },
    { id: 'events', label: 'Évènements', icon: Ticket, protected: false },
    { id: 'agenda', label: 'Agenda', icon: CalendarDays, protected: false },
    { id: 'store', label: 'Boutique', icon: ShoppingBag, protected: false },
    { id: 'learning', label: 'Temple', icon: BookOpen, protected: false },
  ];

  const handleAuthSuccess = (role?: 'user' | 'bokonon') => {
    setIsLoggedIn(true);
    if (role === 'bokonon') {
      setUser(BOKONON_USER);
    } else {
      setUser(MOCK_USER);
    }

    if (authRedirect) {
        setCurrentPage(authRedirect);
        setAuthRedirect(null);
    } else {
        setCurrentPage('dashboard');
    }
  };

  const renderChatPage = () => (
    <div className="flex flex-col lg:flex-row h-[calc(100dvh-64px)] md:h-[calc(100dvh-80px)] animate-fadeIn overflow-hidden bg-white">
        <div className={`lg:w-80 shrink-0 border-r border-brand-50 flex flex-col bg-stone-50/50 ${historyOpen ? 'fixed top-16 md:top-20 inset-x-0 bottom-0 z-[70] lg:relative lg:inset-auto bg-white backdrop-blur-xl animate-slideUp' : 'hidden lg:flex'}`}>
            <div className="p-8 border-b border-brand-50 flex justify-between items-center bg-white lg:bg-transparent shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-brand-900 text-white rounded-2xl shadow-xl">
                        <History size={20}/>
                    </div>
                    <div className="flex flex-col">
                        <h3 className="font-serif font-black text-brand-900 uppercase text-sm tracking-widest leading-none">Historique AI</h3>
                        <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mt-1">{sessions.length} échanges</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={startNewSession} className="p-3 bg-brand-500 text-brand-900 rounded-2xl hover:scale-105 transition-all shadow-lg active:scale-95 group">
                        <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>
            </div>

            <div className="flex-grow overflow-y-auto p-5 space-y-4 tradition-scrollbar bg-stone-50/30">
                {sessions.length > 0 ? (
                    sessions.map(s => (
                        <div 
                            key={s.id} 
                            onClick={() => { setCurrentSessionId(s.id); setHistoryOpen(false); }} 
                            className={`w-full text-left p-6 rounded-[2.5rem] border transition-all cursor-pointer group flex items-start gap-4 ${s.id === currentSessionId ? 'bg-brand-900 text-white border-brand-900 shadow-2xl ring-8 ring-brand-900/5 scale-[1.02]' : 'bg-white border-stone-100 hover:border-brand-200 hover:shadow-lg'}`}
                        >
                            <div className={`mt-0.5 shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-inner ${s.id === currentSessionId ? 'bg-white/20 text-white' : 'bg-brand-50 text-brand-600'}`}>
                                <MessageSquare size={18} />
                            </div>
                            <div className="flex-grow min-w-0">
                                <p className={`text-sm md:text-base font-black truncate leading-tight mb-2 ${s.id === currentSessionId ? 'text-white' : 'text-stone-800'}`}>{s.title}</p>
                                <div className="flex items-center gap-2">
                                    <Clock size={12} className={s.id === currentSessionId ? 'text-white/60' : 'text-stone-300'} />
                                    <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${s.id === currentSessionId ? 'text-white/60' : 'text-stone-400'}`}>{formatRelativeTime(s.timestamp)}</span>
                                </div>
                            </div>
                            <button onClick={(e) => deleteSession(e, s.id)} className={`p-2.5 rounded-xl transition-all ${s.id === currentSessionId ? 'hover:bg-white/20 text-white/40 hover:text-white' : 'opacity-0 lg:group-hover:opacity-100 hover:bg-red-50 text-stone-300 hover:text-red-500'}`}>
                                <Trash size={14}/>
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-6 opacity-30">
                        <div className="p-8 bg-stone-100 rounded-full">
                            <History size={64} className="text-stone-300" />
                        </div>
                        <p className="text-sm font-black uppercase tracking-[0.2em] text-stone-400">Aucun historique de chat</p>
                    </div>
                )}
            </div>
            
            <div className="p-8 border-t border-brand-50 bg-white text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] text-center italic shrink-0">
                Sélectionnez une discussion pour continuer
            </div>
        </div>

        <div className="flex-grow flex flex-col h-full relative overflow-hidden bg-white">
            <div className="lg:hidden p-4 border-b border-brand-50 flex justify-between items-center shrink-0 bg-white z-10 shadow-sm">
                <button onClick={() => setHistoryOpen(true)} className="flex items-center gap-1.5 text-brand-900 font-black text-[9px] uppercase tracking-[0.15em] bg-brand-50 px-3 py-1.5 rounded-full border border-brand-100 shadow-inner">
                    <History size={14} className="text-brand-600"/> Historique
                </button>
                <div className="flex flex-col items-center">
                    <span className="font-serif font-black text-brand-900 text-sm">Guide Spirituel</span>
                    <span className="text-[8px] font-black text-brand-500 uppercase tracking-[0.2em]">AI Connect</span>
                </div>
                <button onClick={startNewSession} className="text-brand-600 font-black text-[9px] uppercase tracking-[0.15em] flex items-center gap-1 p-1.5 hover:bg-brand-50 rounded-xl transition-colors">
                    <Plus size={16}/> Nouveau
                </button>
            </div>

            <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 pt-6 md:p-10 space-y-6 md:space-y-8 tradition-scrollbar bg-brand-50/10">
                <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 pb-4">
                    {messages.map((m, i) => (
                        <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-slideUp`}>
                            <div className={`flex gap-3 md:gap-5 max-w-[95%] md:max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl shrink-0 flex items-center justify-center shadow-md ${m.role === 'user' ? 'bg-brand-400 text-brand-900' : 'bg-brand-500 text-brand-900 font-serif font-black md:text-lg'}`}>
                                    {m.role === 'user' ? <UserIcon size={16} className="md:w-5 md:h-5"/> : "F"}
                                </div>
                                <div className={`p-4 md:p-8 rounded-2xl md:rounded-[3rem] text-sm md:text-xl leading-relaxed shadow-sm border ${m.role === 'user' ? 'bg-brand-900 text-white rounded-tr-none border-brand-800' : 'bg-white text-stone-800 rounded-tl-none border-stone-100'}`}>
                                    {m.role === 'user' ? m.text : (
                                        <div className="space-y-4">
                                            <div className="whitespace-pre-wrap">
                                                {m.text.split(/(\[ACTION_.*?\])/).map((part, index) => {
                                                    if (part.startsWith('[ACTION_CONSULTATION]')) return null;
                                                    if (part.startsWith('[ACTION_COURSE:')) return null;
                                                    if (part.startsWith('[ACTION_STORE:')) return null;
                                                    if (part.startsWith('[ACTION_AGENDA:')) return null;
                                                    if (part.startsWith('[ACTION_EVENT:')) return null;
                                                    
                                                    return part.split(/(\*\*.*?\*\*)/).map((subPart, subIdx) => {
                                                        if (subPart.startsWith('**') && subPart.endsWith('**')) {
                                                            return <strong key={subIdx} className="font-black text-brand-600">{subPart.slice(2, -2)}</strong>;
                                                        }
                                                        return subPart;
                                                    });
                                                })}
                                            </div>
                                            
                                            <div className="flex flex-wrap gap-3">
                                                {m.text.includes('[ACTION_CONSULTATION]') && (
                                                    <button 
                                                        onClick={() => setCurrentPage('tofa')}
                                                        className="bg-brand-500 text-brand-900 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] md:text-xs shadow-lg flex items-center gap-2 hover:scale-105 transition-all border-2 border-brand-600/20 active:scale-95"
                                                    >
                                                        <Sparkles size={16} fill="currentColor"/> Démarrer ma consultation sacrée
                                                    </button>
                                                )}

                                                {m.text.match(/\[ACTION_COURSE:(.*?)\]/) && (
                                                    <button 
                                                        onClick={() => {
                                                            const id = m.text.match(/\[ACTION_COURSE:(.*?)\]/)?.[1];
                                                            handleDeepNavigate('learning', id);
                                                        }}
                                                        className="bg-brand-900 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] md:text-xs shadow-lg flex items-center gap-2 hover:scale-105 transition-all active:scale-95"
                                                    >
                                                        <GraduationCap size={16}/> Voir cette formation
                                                    </button>
                                                )}

                                                {m.text.match(/\[ACTION_STORE:(.*?)\]/) && (
                                                    <button 
                                                        onClick={() => {
                                                            const id = m.text.match(/\[ACTION_STORE:(.*?)\]/)?.[1];
                                                            handleDeepNavigate('store', id);
                                                        }}
                                                        className="bg-brand-100 text-brand-900 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] md:text-xs shadow-lg flex items-center gap-2 hover:scale-105 transition-all border-2 border-brand-200 active:scale-95"
                                                    >
                                                        <ShoppingBag size={16}/> Voir en boutique
                                                    </button>
                                                )}

                                                {m.text.match(/\[ACTION_AGENDA:(.*?)\]/) && (
                                                    <button 
                                                        onClick={() => {
                                                            const date = m.text.match(/\[ACTION_AGENDA:(.*?)\]/)?.[1];
                                                            handleDeepNavigate('agenda', date);
                                                        }}
                                                        className="bg-brand-600 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] md:text-xs shadow-lg flex items-center gap-2 hover:scale-105 transition-all active:scale-95"
                                                    >
                                                        <Baby size={16}/> Découvrir les noms sacrés
                                                    </button>
                                                )}

                                                {m.text.match(/\[ACTION_EVENT:(.*?)\]/) && (
                                                    <button 
                                                        onClick={() => {
                                                            const id = m.text.match(/\[ACTION_EVENT:(.*?)\]/)?.[1];
                                                            setCurrentPage('events');
                                                        }}
                                                        className="bg-amber-500 text-brand-900 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] md:text-xs shadow-lg flex items-center gap-2 hover:scale-105 transition-all active:scale-95"
                                                    >
                                                        <Ticket size={16}/> Voir l'évènement
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start animate-fadeIn">
                             <div className="flex gap-3 md:gap-5">
                                <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-brand-500 text-brand-900 flex items-center justify-center shadow-md font-serif font-black md:text-lg">F</div>
                                <div className="bg-white p-4 md:p-8 rounded-2xl md:rounded-[3rem] rounded-tl-none border border-stone-100 flex gap-2 items-center shadow-sm">
                                    <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                    <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                </div>
                             </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-2 md:p-6 lg:p-8 border-t border-brand-50 bg-white shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
                <div className="max-w-4xl mx-auto space-y-2 md:space-y-6">
                    {!isTyping && messages.length < 3 && (
                        <div className="flex flex-wrap gap-1.5 justify-center">
                            {QUICK_ACTIONS.map((action, idx) => (
                                <button key={idx} onClick={() => submitQuery(action.query)} className="bg-stone-50 text-brand-800 text-[8px] md:text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-full hover:bg-stone-100 transition-all border border-stone-100 flex items-center gap-1.5 shadow-sm active:scale-95">
                                    <action.icon size={10} className="text-brand-600" /> {action.label}
                                </button>
                            ))}
                        </div>
                    )}
                    <form onSubmit={handleChatSubmit} className="relative group">
                        <input 
                            value={chatInput} 
                            onChange={(e) => setChatInput(e.target.value)} 
                            type="text" 
                            placeholder="Interrogez le guide..." 
                            className="w-full bg-stone-50 border-stone-100 border-2 p-3 md:p-5 lg:p-6 pr-14 md:pr-24 rounded-xl md:rounded-[2.5rem] focus:ring-[8px] focus:ring-brand-500/5 focus:border-brand-500 focus:bg-white transition-all outline-none text-xs md:text-xl shadow-inner font-medium" 
                        />
                        <button 
                            type="submit" 
                            disabled={!chatInput.trim() || isTyping} 
                            className="absolute right-1.5 md:right-3 top-1/2 -translate-y-1/2 bg-brand-900 text-white p-2.5 md:p-4 rounded-lg md:rounded-2xl hover:bg-black disabled:opacity-30 disabled:hover:scale-100 hover:scale-105 transition-all shadow-xl active:scale-90"
                        >
                            <Send size={18} className={isTyping ? 'animate-pulse' : 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform'} />
                        </button>
                    </form>
                    <p className="text-center text-[7px] md:text-[10px] font-black text-stone-300 uppercase tracking-[0.3em] mt-0.5">Sagesse africaine • AI Connect v2.5</p>
                </div>
            </div>
        </div>
    </div>
  );

  const renderContent = () => {
    switch (currentPage) {
      case 'home': return <NewsFeed onNavigate={handleDeepNavigate} />;
      case 'news': return <WorldNews initialArticleId={initialNewsId || undefined} onToggleDetail={setIsDetailView} />;
      case 'events': return <Events initialEventId={initialNewsId || undefined} onNavigate={handleDeepNavigate} onToggleDetail={setIsDetailView} />;
      case 'agenda': return <Agenda initialDateStr={initialAgendaDate || undefined} onNavigate={handleDeepNavigate} onToggleDetail={setIsDetailView} user={user} />;
      case 'tofa': return <Tofa onBack={() => setCurrentPage('home')} user={user} onNavigate={handleDeepNavigate} />;
      case 'chat': return renderChatPage();
      case 'store': return <Store initialProductId={initialStoreId || undefined} user={user} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} clearCart={clearCart} isLoggedIn={isLoggedIn} triggerAuth={() => navigateProtected('store')} onToggleDetail={setIsDetailView} />;
      case 'learning': return <Learning initialCourseId={initialLearningId || undefined} user={user} onToggleDetail={setIsDetailView} onNavigate={handleDeepNavigate} />;
      case 'dashboard': return <Dashboard user={user} products={[]} initialConsultationId={initialDashboardConsultId || undefined} onNavigate={handleDeepNavigate} onAddToCart={addToCart} />;
      case 'notifications': return <Notifications onNavigate={handleDeepNavigate} onClearUnread={() => setUnreadNotifications(0)} />;
      case 'cart': return <CartPage cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} clearCart={clearCart} onCheckout={() => { alert('Commande validée !'); clearCart(); setCurrentPage('home'); }} onBack={() => setCurrentPage('store')} />;
      case 'contact': return <ContactPage />;
      case 'faq': return <FAQPage />;
      case 'about': return <AboutPage />;
      case 'auth': return <AuthPage onSuccess={handleAuthSuccess} />;
      default: return <NewsFeed onNavigate={handleDeepNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-stone-900 bg-stone-50 overflow-x-hidden">
      <header className="fixed top-0 left-0 right-0 z-[60] bg-brand-900 shadow-xl border-b border-brand-800 h-16 md:h-20">
        <nav className="container mx-auto px-2.5 md:px-4 h-full">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center gap-2 md:gap-8 h-full">
                <div className="flex items-center gap-2 md:gap-3 cursor-pointer group" onClick={() => setCurrentPage('home')}>
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-brand-500 rounded-lg md:rounded-xl flex items-center justify-center text-brand-900 font-bold font-serif shadow-lg group-hover:rotate-12 transition-transform text-sm md:text-base">F</div>
                    <div className="flex flex-col">
                        <span className="text-sm md:text-xl font-serif font-bold text-white tracking-tight leading-none">Fa&Vodoun</span>
                        <span className="text-[7px] md:text-[10px] uppercase tracking-[0.1em] md:tracking-[0.2em] text-brand-300 opacity-80 font-semibold">Connect</span>
                    </div>
                </div>
                <div className="hidden lg:flex items-center gap-1 h-full">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => item.protected ? navigateProtected(item.id) : setCurrentPage(item.id as any)}
                            className={`h-full px-4 flex items-center gap-2 text-[11px] font-black tracking-[0.1em] uppercase transition-all relative group ${currentPage === item.id ? 'text-brand-300' : 'text-brand-100/70 hover:text-white'}`}
                        >
                            <item.icon size={16} className={currentPage === item.id ? 'text-brand-300' : 'text-brand-100/40 group-hover:text-white'} />
                            {item.label}
                            {currentPage === item.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-400 rounded-t-full"></div>}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex items-center gap-2.5 sm:gap-4 md:gap-5">
                <button 
                  onClick={() => setCurrentPage('chat')}
                  className={`p-1.5 md:p-2 rounded-full transition-colors relative ${currentPage === 'chat' ? 'bg-brand-500 text-brand-900' : 'text-brand-100 hover:bg-brand-800'}`}
                >
                    <MessageSquare size={20} className="md:w-[22px] md:h-[22px]" />
                    <span className="absolute -top-1 -right-1 bg-brand-400 text-brand-900 text-[7px] md:text-[8px] font-black w-3 md:w-3.5 h-3 md:h-3.5 rounded-full flex items-center justify-center border border-brand-900">AI</span>
                </button>
                <button 
                  onClick={() => setCurrentPage('notifications')}
                  className={`p-1.5 md:p-2 rounded-full transition-colors relative ${currentPage === 'notifications' ? 'bg-brand-500 text-brand-900' : 'text-brand-100 hover:bg-brand-800'}`}
                >
                    <Bell size={20} className="md:w-[22px] md:h-[22px]" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[7px] md:text-[9px] font-black w-3.5 md:w-4 h-3.5 md:h-4 rounded-full flex items-center justify-center border-2 border-brand-900">
                        {unreadNotifications}
                      </span>
                    )}
                </button>
                <button onClick={() => navigateProtected('cart')} className={`p-1.5 md:p-2 rounded-full transition-colors relative ${currentPage === 'cart' ? 'bg-brand-500 text-brand-900' : 'text-brand-100 hover:bg-brand-800'}`}>
                    <ShoppingCart size={20} className="md:w-[22px] md:h-[22px]" />
                    {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-brand-500 text-brand-900 text-[8px] md:text-[10px] font-bold w-3.5 md:w-4 h-3.5 md:h-4 rounded-full flex items-center justify-center border-2 border-brand-900">{cart.reduce((a,b) => a + b.quantity, 0)}</span>}
                </button>
                <button onClick={() => navigateProtected('dashboard')} className="flex p-0.5 bg-brand-800 hover:bg-brand-700 rounded-full border border-brand-700">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-brand-400 flex items-center justify-center text-brand-900 font-bold text-[10px] md:text-xs uppercase shadow-inner overflow-hidden">
                    {isLoggedIn ? (user.role === 'bokonon' ? <img src="https://i.pravatar.cc/150?u=amoussa" className="w-full h-full object-cover" /> : user.name.charAt(0)) : <LogIn size={14} />}
                  </div>
                </button>
                <button onClick={() => setSideMenuOpen(true)} className="flex items-center gap-1.5 px-2.5 py-1.5 md:px-5 md:py-2.5 bg-brand-800 hover:bg-brand-700 text-brand-50 rounded-full transition-all border border-brand-700 shadow-lg group">
                    <Menu size={20} className="md:w-[22px] md:h-[22px]" />
                </button>
            </div>
          </div>
        </nav>
      </header>
      <div className="h-16 md:h-20"></div>
      <main className={`flex-grow ${currentPage === 'chat' ? 'w-full' : 'container mx-auto px-4 py-8 md:py-12'}`}>{renderContent()}</main>

      {currentPage !== 'tofa' && currentPage !== 'chat' && !isDetailView && (
        <button 
          onClick={() => setCurrentPage('tofa')} 
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[105] bg-brand-900 text-white p-5 rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] hover:scale-110 hover:bg-brand-800 transition-all animate-bounce group"
          title="Signe de l'année (Tofa)"
        >
          <Sparkles size={28} className="group-hover:rotate-12 transition-transform" />
          <div className="absolute -top-1 -right-1 bg-brand-500 text-brand-900 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-brand-900">1</div>
        </button>
      )}

      <div className={`fixed inset-0 z-[100] transition-all duration-500 ${sideMenuOpen ? 'visible' : 'invisible'}`}>
          <div className={`absolute inset-0 bg-brand-900/60 backdrop-blur-md transition-opacity duration-500 ${sideMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setSideMenuOpen(false)}></div>
          <div className={`absolute top-0 right-0 h-full w-full max-w-[320px] bg-white shadow-2xl transition-transform duration-500 ease-out flex flex-col ${sideMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
              <div className="p-8 bg-brand-900 text-white flex justify-between items-center shrink-0"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-brand-500 rounded flex items-center justify-center text-brand-900 font-bold">F</div><span className="font-serif font-bold text-lg">Menu</span></div><button onClick={() => setSideMenuOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button></div>
              <div className="flex-grow overflow-y-auto p-6 space-y-2">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-4 pb-2">Navigation Principale</p>
                  {navItems.map(item => (<button key={item.id} onClick={() => { item.protected ? navigateProtected(item.id) : setCurrentPage(item.id as any); setSideMenuOpen(false); }} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${currentPage === item.id ? 'bg-brand-50 text-brand-900 font-bold' : 'text-stone-600 hover:bg-stone-50'}`}><item.icon size={20} className={currentPage === item.id ? 'text-brand-600' : 'text-stone-400'} /> {item.label}</button>))}
                  <div className="h-px bg-stone-100 my-4"></div>
                  <button onClick={() => { setCurrentPage('chat'); setSideMenuOpen(false); }} className="w-full flex items-center gap-4 p-4 rounded-2xl text-stone-600 hover:bg-stone-50 transition-all"><MessageSquare size={20} className="text-stone-400" /> Guide AI</button>
                  <button onClick={() => navigateProtected('dashboard')} className="w-full flex items-center gap-4 p-4 rounded-2xl text-stone-600 hover:bg-stone-50 transition-all"><UserIcon size={20} className="text-stone-400" /> Mon Profil</button>
                  <button onClick={() => { setCurrentPage('about'); setSideMenuOpen(false); }} className="w-full flex items-center gap-4 p-4 rounded-2xl text-stone-600 hover:bg-stone-50 transition-all"><Info size={20} className="text-stone-400" /> À Propos</button>
                  <button onClick={() => { setCurrentPage('faq'); setSideMenuOpen(false); }} className="w-full flex items-center gap-4 p-4 rounded-2xl text-stone-600 hover:bg-stone-50 transition-all"><HelpCircle size={20} className="text-stone-400" /> FAQ</button>
              </div>
              <div className="p-8 border-t border-stone-100 shrink-0">{isLoggedIn ? (<button onClick={() => setShowLogoutConfirm(true)} className="w-full bg-stone-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-lg">Déconnexion</button>) : (<button onClick={() => navigateProtected('dashboard')} className="w-full bg-brand-600 text-white py-4 rounded-2xl font-bold hover:bg-brand-700 transition-all shadow-lg">Se connecter</button>)}</div>
          </div>
      </div>

      {showLogoutConfirm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-brand-900/40 backdrop-blur-sm animate-[fadeIn_0.3s]" onClick={() => setShowLogoutConfirm(false)}></div>
              <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 max-w-sm w-full relative z-10 animate-[slideUp_0.4s_ease-out] text-center space-y-6">
                  <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mx-auto border border-brand-100"><AlertCircle size={40} className="text-brand-600" /></div>
                  <div className="space-y-2"><h3 className="text-2xl font-serif font-bold text-brand-900">Déconnexion</h3><p className="text-stone-500 text-sm">Êtes-vous sûr de vouloir quitter votre espace sacré ?</p></div>
                  <div className="flex flex-col gap-3"><button onClick={handleLogout} className="w-full bg-stone-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-lg">Confirmer</button><button onClick={() => setShowLogoutConfirm(false)} className="full py-4 text-stone-400 font-bold hover:text-brand-900 transition-all">Annuler</button></div>
              </div>
          </div>
      )}
    </div>
  );
}
