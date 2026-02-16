
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { generateDailyWisdom, generateNewsSummary } from '../services/geminiService';
import { 
  Sparkles, Newspaper, Calendar, Heart, MessageCircle, Share2, ShoppingBag, 
  ChevronLeft, ChevronRight, GraduationCap, Globe, ArrowRight, 
  Star, ShoppingCart, Play, Zap, Award, BookOpen, Clock, User as UserIcon,
  Check, Eye, Flame, Shield, TrendingUp, MapPin, AlertCircle, Timer, ZapOff,
  Users, Quote, Ticket
} from 'lucide-react';
import { NewsArticle, Product, Course } from '../types';

interface NewsFeedProps {
    onNavigate: (page: 'home' | 'store' | 'learning' | 'dashboard' | 'contact' | 'faq' | 'about' | 'cart' | 'auth' | 'news' | 'agenda' | 'events', id?: string) => void;
}

// Data Mocks for the regular feed
const MOCK_FEATURED_STORE: Partial<Product>[] = [
  { id: '1', name: 'Le Grand Livre du Fa', price: 15000, image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800', description: 'Guide complet pour les initiés.' },
  { id: '2', name: 'Chapelet de Divination', price: 5000, image: 'https://images.unsplash.com/photo-1605274280925-9dd1ba746654?auto=format&fit=crop&q=80&w=800', description: 'Outil traditionnel en noix de palme.' },
  { id: '3', name: 'Kit Rituel Purific.', price: 25000, image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&q=80&w=800', description: 'Herbes et huiles consacrées.' },
  { id: '4', name: 'Statuette Legba', price: 45000, image: 'https://images.unsplash.com/photo-1590739293166-791786523152?auto=format&fit=crop&q=80&w=800', description: 'Protection du foyer.' }
];

const MOCK_FEATURED_COURSES: Partial<Course>[] = [
  { id: 'c1', title: 'Fondamentaux du Fa', trainer: { name: 'Bokonon Amoussa', avatar: '', bio: '' }, description: 'Comprendre l\'origine du Fa.', duration: '2h 15m', rating: 4.8 },
  { id: 'c2', title: 'Les 16 Signes Mères', trainer: { name: 'Bokonon Amoussa', avatar: '', bio: '' }, description: 'Analyse approfondie des Du.', duration: '8h 45m', rating: 4.9 },
  { id: 'c3', title: 'Secrets des Plantes', trainer: { name: 'Mère Sika', avatar: '', bio: '' }, description: 'Identification des herbes Aman.', duration: '4h 30m', rating: 4.7 }
];

const MOCK_FEATURED_EVENTS = [
    { id: 'e1', title: "Vodoun Days - Ouidah", location: "Ouidah", image: "https://images.unsplash.com/photo-1590739293166-791786523152?auto=format&fit=crop&q=80&w=800", date: "10 Janvier", type: "Célébration" },
    { id: 'e4', title: "Procession Egungun", location: "Porto-Novo", image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=800", date: "5 Novembre", type: "Tradition" }
];

const MOCK_URGENT_ALERTS = [
    { id: 'u1', type: 'OFFRE', title: "Flash : -20% sur les Chapelets", desc: "Plus que quelques heures !", image: "https://images.unsplash.com/photo-1605274280925-9dd1ba746654?auto=format&fit=crop&q=80&w=800", icon: Zap, color: 'bg-amber-500', link: 'store', linkId: '2' },
    { id: 'u2', type: 'RITUEL', title: "Live Spirituel Imminent", desc: "Purification collective ce soir à 18h.", image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=800", icon: Flame, color: 'bg-red-500', link: 'home' },
    { id: 'u3', type: 'COURS', title: "Nouveau : Les Signes Dérivés", desc: "Disponible maintenant en vidéo HD.", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800", icon: GraduationCap, color: 'bg-blue-500', link: 'learning', linkId: 'c2' },
    { id: 'u4', type: 'NEWS', title: "Vibration : Énergie Gbe-Meji", desc: "Vibration de chance exceptionnelle aujourd'hui.", image: "https://images.unsplash.com/photo-1590739293166-791786523152?auto=format&fit=crop&q=80&w=800", icon: Sparkles, color: 'bg-green-500', link: 'news' },
];

const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=1920",
    title: "Le Temple du Savoir",
    subtitle: "Explorez les mystères du Fa et du Vodoun avec authenticité.",
    cta: "S'initier",
    link: "learning"
  },
  {
    image: "https://images.unsplash.com/photo-1590739293166-791786523152?auto=format&fit=crop&q=80&w=1920",
    title: "Consultez votre Destin",
    subtitle: "Recevez votre rapport de consultation sous 24h.",
    cta: "Interroger",
    link: "tofa"
  },
  {
    image: "https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&q=80&w=1920",
    title: "Nos Traditions",
    subtitle: "Découvrez l'agenda des fêtes et évènements sacrés.",
    cta: "Explorer",
    link: "events"
  }
];

const MOCK_NEWS_EXPANDED = [
    { id: 'n1', title: "Festival des Divinités Noires", excerpt: "Ouidah s'apprête à accueillir des milliers de pèlerins pour la célébration annuelle de la force vitale.", image: "https://images.unsplash.com/photo-1590739293166-791786523152?auto=format&fit=crop&q=80&w=800", category: "spiritual", date: "Il y a 2h", author: "Dah Zannou", location: "Ouidah" },
    { id: 'n2', title: "Découverte de Manuscrits Anciens", excerpt: "Des parchemins révélant des variantes oubliées du signe Gbe-Meji ont été retrouvés dans une bibliothèque d'Abomey.", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800", category: "culture", date: "Il y a 4h", author: "Pr. Koffi", location: "Abomey" },
    { id: 'n3', title: "Le Marché des Guérisseurs", excerpt: "Reportage exclusif sur les herboristes de Dantokpa et leurs remèdes séculaires pour la paix du cœur.", image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=800", category: "community", date: "Il y a 6h", author: "Sènan B.", location: "Cotonou" },
    { id: 'n4', title: "Initiation Collective à Porto-Novo", excerpt: "Une cérémonie rare a réuni plus de cent aspirants sous l'égide des grands Bokonons de la ville.", image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=800", category: "spiritual", date: "Hier", author: "Bokonon Amoussa", location: "Porto-Novo" },
    { id: 'n5', title: "L'Art de la Forge Sacrée", excerpt: "Rencontre avec les artisans qui fabriquent les attributs des divinités du fer dans la région d'Allada.", image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=800", category: "culture", date: "Hier", author: "Moussa T.", location: "Allada" },
    { id: 'n6', title: "Protection des Forêts Sacrées", excerpt: "Le gouvernement lance un plan de préservation pour les bois sacrés restants, poumons spirituels du sud.", image: "https://images.unsplash.com/photo-1518911710364-17ec553bde5d?auto=format&fit=crop&q=80&w=800", category: "community", date: "Il y a 2 jours", author: "Hermann G.", location: "Sud-Bénin" },
    { id: 'n7', title: "Restauration du Palais d'Abomey", excerpt: "Les fresques murales retrouvent leurs couleurs d'origine grâce à des techniques traditionnelles de conservation.", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800", category: "culture", date: "Il y a 3 jours", author: "Lucie D.", location: "Abomey" },
    { id: 'n8', title: "Sagesse des Anciens sur l'Eau", excerpt: "Un guide pratique sur les rituels de bénédiction de l'eau pour la santé familiale selon le Fa.", image: "https://images.unsplash.com/photo-1560759226-14da22a643ef?auto=format&fit=crop&q=80&w=800", category: "spiritual", date: "La semaine dernière", author: "Mère Sika", location: "Grand-Popo" }
];

export const NewsFeed: React.FC<NewsFeedProps> = ({ onNavigate }) => {
    const [visibleItems, setVisibleItems] = useState(6);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [urgentScrollProgress, setUrgentScrollProgress] = useState(0);
    const [heroIndex, setHeroIndex] = useState(0);
    const feedRef = useRef<HTMLDivElement>(null);
    const urgentScrollRef = useRef<HTMLDivElement>(null);

    // Auto-slide logic for Hero
    useEffect(() => {
        const interval = setInterval(() => {
            setHeroIndex(prev => (prev + 1) % HERO_SLIDES.length);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    const loadMore = useCallback(() => {
        if (isLoadingMore || visibleItems >= 30) return;
        setIsLoadingMore(true);
        // Simulation d'une consultation spirituelle
        setTimeout(() => {
            setVisibleItems(prev => prev + 6);
            setIsLoadingMore(false);
        }, 1200);
    }, [isLoadingMore, visibleItems]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 800) {
                loadMore();
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadMore]);

    const handleUrgentScroll = () => {
        if (urgentScrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = urgentScrollRef.current;
            const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
            setUrgentScrollProgress(progress);
        }
    };

    const handleUrgentTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (urgentScrollRef.current) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = x / rect.width;
            const scrollAmount = percentage * (urgentScrollRef.current.scrollWidth - urgentScrollRef.current.clientWidth);
            urgentScrollRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const renderHero = () => (
        <section className="relative w-full h-[250px] md:h-[340px] -mt-12 mb-0 overflow-hidden bg-brand-900">
            {HERO_SLIDES.map((slide, idx) => (
                <div 
                    key={idx}
                    className={`absolute inset-0 w-full h-full transition-all duration-[2000ms] ease-in-out transform ${idx === heroIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}
                >
                    <img src={slide.image} className="w-full h-full object-cover" alt={slide.title} />
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-950/90 via-brand-950/40 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center">
                        <div className="container mx-auto px-6 md:px-12 space-y-3 md:space-y-4 animate-fadeIn">
                            <div className="max-w-2xl space-y-1 md:space-y-2">
                                <span className={`inline-block bg-brand-500 text-brand-950 px-3 py-0.5 rounded-full text-[8px] md:text-xs font-black uppercase tracking-[0.3em] transform transition-all duration-1000 ${idx === heroIndex ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                                    Tradition
                                </span>
                                <h1 className={`text-xl md:text-4xl font-serif font-black text-white uppercase tracking-tighter leading-none transition-all duration-1000 delay-300 ${idx === heroIndex ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                                    {slide.title}
                                </h1>
                                <p className={`text-brand-100 text-[10px] md:text-base font-light italic transition-all duration-1000 delay-500 ${idx === heroIndex ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                                    {slide.subtitle}
                                </p>
                            </div>
                            <div className={`pt-0.5 md:pt-1 transition-all duration-1000 delay-700 ${idx === heroIndex ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                                <button 
                                    onClick={() => onNavigate(slide.link as any)}
                                    className="bg-brand-500 text-brand-950 px-4 py-2.5 md:px-6 md:py-3.5 rounded-xl md:rounded-full font-black uppercase tracking-widest text-[8px] md:text-xs shadow-2xl hover:bg-white transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                                >
                                    {slide.cta} <ArrowRight size={14}/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Carousel Indicators */}
            <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center gap-2">
                {HERO_SLIDES.map((_, idx) => (
                    <button 
                        key={idx}
                        onClick={() => setHeroIndex(idx)}
                        className={`h-1 transition-all duration-500 rounded-full ${idx === heroIndex ? 'w-8 bg-brand-500 shadow-[0_0_10px_rgba(209,152,75,0.8)]' : 'w-1.5 bg-white/30 hover:bg-white/50'}`}
                    />
                ))}
            </div>

            {/* Side Navigation for Desktop */}
            <div className="hidden lg:flex absolute bottom-3 right-8 z-20 gap-2">
                <button onClick={() => setHeroIndex(prev => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)} className="p-2.5 border border-white/20 text-white rounded-full hover:bg-white hover:text-brand-900 transition-all backdrop-blur-sm"><ChevronLeft size={16}/></button>
                <button onClick={() => setHeroIndex(prev => (prev + 1) % HERO_SLIDES.length)} className="p-2.5 border border-white/20 text-white rounded-full hover:bg-white hover:text-brand-900 transition-all backdrop-blur-sm"><ChevronRight size={16}/></button>
            </div>
        </section>
    );

    const renderHorizontalUrgentList = () => (
        <div className="relative pt-1 pb-4 -mx-4">
            <div className="flex items-center justify-between mb-3 px-6">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-brand-700 rounded-full"></div>
                    <h2 className="text-xl md:text-2xl font-serif font-bold text-brand-900 tracking-tight">À la une</h2>
                </div>
                <div className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-red-100 shadow-sm animate-pulse">
                    <Timer size={12} /> Live
                </div>
            </div>
            
            <div 
                ref={urgentScrollRef}
                onScroll={handleUrgentScroll}
                className="flex gap-4 overflow-x-auto px-6 pb-4 snap-x tradition-scrollbar"
            >
                {MOCK_URGENT_ALERTS.map((alert) => (
                    <div 
                        key={alert.id}
                        onClick={() => onNavigate(alert.link as any, alert.linkId)}
                        className="w-[72vw] md:w-[380px] bg-white rounded-[2.5rem] shadow-xl border border-brand-50 shrink-0 snap-start hover:scale-[1.02] transition-all cursor-pointer group relative overflow-hidden"
                    >
                        <div className="relative h-48 md:h-56 overflow-hidden">
                            <img src={alert.image} className="w-full h-full object-cover transition-transform duration-[6s] group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                            <div className="absolute top-4 left-4">
                                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] shadow-xl flex items-center gap-1.5 border border-white/20">
                                    <Star size={10} fill="currentColor" /> À LA UNE
                                </span>
                            </div>
                            <div className="absolute bottom-4 left-4 right-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className={`p-2 rounded-xl text-white shadow-lg ${alert.color}`}>
                                        <alert.icon size={14} />
                                    </div>
                                    <span className="text-[10px] font-black text-white/90 uppercase tracking-[0.2em]">
                                        {alert.type}
                                    </span>
                                </div>
                                <h4 className="font-serif font-bold text-xl text-white leading-tight group-hover:text-brand-400 transition-colors">{alert.title}</h4>
                            </div>
                        </div>
                        <div className="p-5 bg-white flex justify-between items-center group-hover:bg-brand-50 transition-colors">
                            <p className="text-stone-500 text-xs italic line-clamp-1 pr-3">"{alert.desc}"</p>
                            <div className="text-brand-600 group-hover:translate-x-1.5 transition-transform shrink-0">
                                <ArrowRight size={18} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="hidden lg:block max-w-[200px] mx-auto px-6 mt-2">
                <div 
                    /* Fix: handleTrackClick was undefined, changed to handleUrgentTrackClick */
                    onClick={handleUrgentTrackClick}
                    className="h-2 w-full bg-stone-200 rounded-full relative overflow-hidden shadow-inner cursor-pointer"
                >
                    <div 
                        className="absolute top-0 bottom-0 bg-brand-600 rounded-full transition-all duration-200 ease-out shadow-sm pointer-events-none"
                        style={{ 
                            width: '25%', 
                            left: `${urgentScrollProgress * 0.75}%` 
                        }}
                    />
                </div>
            </div>
        </div>
    );

    const renderNewsCard = (article: typeof MOCK_NEWS_EXPANDED[0]) => (
        <div 
            key={article.id} 
            onClick={() => onNavigate('news', article.id)} 
            className="bg-white rounded-[3rem] shadow-lg hover:shadow-2xl transition-all duration-700 border border-brand-50 overflow-hidden group flex flex-col cursor-pointer animate-slideUp"
        >
            <div className="relative overflow-hidden aspect-[16/10]">
                <img src={article.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[4s]" alt={article.title} />
                <div className="absolute top-5 left-5">
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-xl text-white backdrop-blur-md ${article.category === 'spiritual' ? 'bg-amber-600/80' : article.category === 'culture' ? 'bg-blue-600/80' : 'bg-green-600/80'}`}>
                        {article.category === 'spiritual' ? 'Spiritualité' : article.category === 'culture' ? 'Culture' : 'Communauté'}
                    </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-white text-brand-900 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl">
                        LIRE L'ÉDITION <ArrowRight size={14}/>
                    </span>
                </div>
            </div>
            <div className="p-8 space-y-5 flex-grow flex flex-col">
                <div className="flex items-center gap-3 text-stone-400">
                    <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center font-black text-brand-600 shadow-inner border border-stone-100 uppercase text-[10px]">
                        {article.author.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase text-brand-900 leading-none">{article.author}</span>
                        <span className="text-[9px] font-bold text-stone-400 uppercase mt-0.5">{article.date} • {article.location}</span>
                    </div>
                </div>
                <h3 className="text-xl font-serif font-black text-brand-900 group-hover:text-brand-600 transition-colors uppercase leading-tight">
                    {article.title}
                </h3>
                <p className="text-stone-500 italic line-clamp-3 text-sm font-medium flex-grow leading-relaxed">
                    "{article.excerpt}"
                </p>
            </div>
        </div>
    );

    const renderStoreCard = (p: Partial<Product>) => (
        <div 
            key={p.id} 
            onClick={() => onNavigate('store', p.id)}
            className="bg-white rounded-[2.5rem] shadow-lg overflow-hidden border border-brand-50 group hover:shadow-2xl transition-all animate-slideUp cursor-pointer"
        >
            <div className="relative aspect-square overflow-hidden">
                <img src={p.image} className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" />
                <div className="absolute top-5 left-5"><span className="bg-brand-500 text-brand-900 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl">Boutique</span></div>
            </div>
            <div className="p-6 space-y-3">
                <h3 className="text-lg font-serif font-bold text-brand-900 leading-tight group-hover:text-brand-600 transition-colors">{p.name}</h3>
                <div className="flex justify-between items-center">
                    <span className="text-lg font-serif font-bold text-brand-600">{p.price?.toLocaleString()} F</span>
                    <button className="bg-brand-900 text-white p-2.5 rounded-xl shadow-lg hover:bg-black transition-all">
                        <ShoppingCart size={18} />
                    </button>
                </div>
            </div>
        </div>
    );

    const renderCourseCard = (c: Partial<Course>) => (
        <div key={c.id} className="bg-white rounded-[2.5rem] shadow-lg overflow-hidden border border-brand-50 flex flex-col md:flex-row animate-slideUp group cursor-pointer" onClick={() => onNavigate('learning', c.id)}>
            <div className="md:w-1/3 relative overflow-hidden">
                <img src="https://images.unsplash.com/photo-1518911710364-17ec553bde5d?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute top-5 left-5"><span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-2xl">Formation</span></div>
            </div>
            <div className="md:w-2/3 p-6 space-y-3 flex flex-col justify-center">
                <h3 className="text-xl font-serif font-bold text-brand-900 leading-tight group-hover:text-brand-600 transition-colors">{c.title}</h3>
                <p className="text-stone-500 text-xs italic line-clamp-2">"{c.description}"</p>
                <div className="flex items-center justify-between pt-1">
                    <span className="text-stone-400 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5"><Clock size={12} /> {c.duration}</span>
                    <button className="bg-brand-900 text-white px-5 py-2 rounded-xl font-bold uppercase tracking-widest text-[9px] shadow-xl">Rejoindre</button>
                </div>
            </div>
        </div>
    );

    const renderEventCard = (e: typeof MOCK_FEATURED_EVENTS[0]) => (
        <div key={e.id} onClick={() => onNavigate('events', e.id)} className="bg-brand-900 text-white rounded-[3rem] shadow-xl overflow-hidden group cursor-pointer flex flex-col animate-slideUp">
            <div className="relative h-40 overflow-hidden">
                <img src={e.image} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-[3s]" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900 to-transparent"></div>
                <div className="absolute top-5 left-5">
                    <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10 shadow-xl">
                        Évènement
                    </span>
                </div>
            </div>
            <div className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-brand-400">
                    <Calendar size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">{e.date} • {e.location}</span>
                </div>
                <h3 className="text-xl font-serif font-black">{e.title}</h3>
                <div className="flex justify-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-500 flex items-center gap-1.5">Découvrir <ArrowRight size={12}/></span>
                </div>
            </div>
        </div>
    );

    const renderFeedItems = () => {
        const items = [];
        for (let i = 0; i < visibleItems; i++) {
            // Bloc 1: Actu
            if (i < MOCK_NEWS_EXPANDED.length) {
                items.push(renderNewsCard(MOCK_NEWS_EXPANDED[i]));
            }
            
            // Intercaler du contenu
            if (i === 1) items.push(<div key="store-row-1" className="grid grid-cols-1 md:grid-cols-2 gap-8">{renderStoreCard(MOCK_FEATURED_STORE[0])}{renderStoreCard(MOCK_FEATURED_STORE[1])}</div>);
            if (i === 2) items.push(renderEventCard(MOCK_FEATURED_EVENTS[0]));
            if (i === 5) items.push(renderCourseCard(MOCK_FEATURED_COURSES[0]));
            
            // Cycle de répétition
            if (i >= MOCK_NEWS_EXPANDED.length) {
                const cycleIdx = i % MOCK_NEWS_EXPANDED.length;
                if (i % 5 === 0) items.push(renderStoreCard(MOCK_FEATURED_STORE[i % 4]));
                else if (i % 7 === 0) items.push(renderEventCard(MOCK_FEATURED_EVENTS[i % 2]));
                else items.push(renderNewsCard(MOCK_NEWS_EXPANDED[cycleIdx]));
            }
        }
        return items;
    };

    return (
        <div className="w-full pb-20 space-y-6">
            
            {/* IMMERSIVE HERO SECTION - MINIMIZED HEIGHT TO SHOW "A LA UNE" PEAKING */}
            {renderHero()}

            <div className="max-w-4xl mx-auto px-4 md:px-0">
                <div className="animate-fadeIn">
                    {renderHorizontalUrgentList()}
                </div>

                <div className="space-y-10 py-6" ref={feedRef}>
                    
                    {renderFeedItems()}

                    <div className="flex justify-center pt-6">
                        <div className="flex flex-col items-center gap-4 text-stone-300">
                            {isLoadingMore ? (
                                <>
                                    <div className="w-8 h-8 border-4 border-stone-100 border-t-brand-500 rounded-full animate-spin shadow-lg"></div>
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-600 animate-pulse">Archives célestes...</p>
                                </>
                            ) : (
                                <div className="w-1 h-10 bg-stone-100 rounded-full opacity-50"></div>
                            )}
                        </div>
                    </div>
                </div>

                <section className="bg-brand-900 rounded-[2.5rem] p-10 text-white text-center space-y-6 relative overflow-hidden group shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-full bg-brand-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10 space-y-3">
                        <h2 className="text-2xl md:text-4xl font-serif font-bold">L'Union Sacrée</h2>
                        <p className="text-brand-200 text-base max-w-md mx-auto">Recevez les sagesses de la tradition.</p>
                    </div>
                    <div className="relative z-10 max-w-md mx-auto flex flex-col sm:flex-row gap-3">
                        <input type="email" placeholder="Email..." className="flex-grow px-5 py-3.5 bg-white/10 backdrop-blur-md rounded-xl outline-none border border-white/20 text-white placeholder-brand-300 text-sm" />
                        <button className="px-6 py-3.5 bg-brand-500 text-brand-900 rounded-xl font-black uppercase tracking-widest hover:bg-brand-400 transition-all shadow-xl text-xs">S'unir</button>
                    </div>
                </section>
            </div>
        </div>
    );
};
