
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  MapPin, Clock, Check, ArrowRight, ArrowLeft, Sparkles, ChevronLeft, 
  ChevronRight, CalendarDays, Bell, Users, ShieldCheck, Ticket, Star, 
  CalendarX, Info, Quote as QuoteIcon, Camera, ImageIcon, Image as ImageIcon2, 
  History, PlayCircle, Eye, Volume2, Heart, AlertTriangle, CheckCircle2,
  Compass, HelpCircle, Baby, UserCheck, Award, X, Search, CreditCard, Send
} from 'lucide-react';
import { User } from '../types';

export interface TraditionalEvent {
    id: string;
    title: string;
    date: Date;
    location: string;
    image: string;
    gallery?: string[];
    type: 'Célébration' | 'Masques' | 'Spirituel' | 'Tradition';
    description: string;
    fullContent: string;
    guidePrice: number;
    schedule?: { time: string, activity: string }[];
}

// Cycle authentique du Fèzan (9 jours)
const FEZAN_DAYS = [
    { name: 'Houè / Akoué', status: 'Défavorable', color: 'text-red-600', symbol: '☼', meaning: "Jour du Jugement et du Conflit. Symbolise le soleil brûlant qui révèle les vérités cachées. Soyez honnête et évitez les disputes." },
    { name: 'Bô', status: 'Favorable', color: 'text-amber-600', symbol: '🛡', meaning: "Jour de la Protection et du Sort. Vibration protectrice et stabilisatrice. Idéal pour renforcer sa force de caractère." },
    { name: 'Hin / Fô', status: 'Défavorable', color: 'text-red-600', symbol: '☽', meaning: "Jour de la Misère et de la Retraite. Vibration invitant à l'introspection. Ce n'est pas le moment de chercher le gain matériel." },
    { name: 'Fâ', status: 'Favorable', color: 'text-green-600', symbol: '📜', meaning: "Jour de la Sagesse et de l'Oracle. La journée de la clarté. Parfait pour les consultations et la prise de décisions réfléchies." },
    { name: 'Mèdjo', status: 'Favorable', color: 'text-green-600', symbol: '❂', meaning: "Jour de l'Apparition et de la Création. Très favorable pour initier des projets et célébrer de nouveaux départs." },
    { name: 'Mèkou', status: 'Défavorable', color: 'text-red-600', symbol: '♰', meaning: "Jour du Repos et des Ancêtres. Journée de prudence. Évitez les festivités majeures et honorez la mémoire des disparus." },
    { name: 'Vodoun', status: 'Favorable', color: 'text-green-600', symbol: '☥', meaning: "Jour du Sacré et de l'Esprit. Vibration intense pour la connexion spirituelle. Moment idéal pour les offrandes." },
    { name: 'Azon', status: 'Défavorable', color: 'text-red-600', symbol: '⚕', meaning: "Jour de la Maladie et de la Prudence. Vigilance sur la santé et le tempérament. Journée pour rester calme." },
    { name: 'Vo', status: 'Favorable', color: 'text-green-600', symbol: '⚖', meaning: "Jour du Sacrifice et de la Purification. Excellent pour se libérer des ondes négatives et faire des actes de générosité." },
];

const FON_MONTHS = [
    "Àxwéjísù", "Lòxòsù", "Líxísù", "Fenvísù", "Gùdùgùdùsù", "Àyídósù", 
    "Liyasù", "Àvívósù", "Anyanyasù", "Kpanyasù", "Alunsù", "Wowosù"
];

interface BirthHero {
    name: string;
    image: string;
}

interface BirthName {
    m: string;
    f: string;
    meaning: string;
    description: string;
    heroes: BirthHero[];
}

const BIRTH_NAMES_DATA: Record<string, BirthName[]> = {
    'Fon / Goun': [
        { m: 'Sènami', f: 'Sènan', meaning: 'Le destin est favorable', description: "Un nom de gratitude profonde envers les divinités. Il est souvent attribué à un enfant dont la naissance apporte une solution ou une paix inattendue dans la famille. Ce nom porte une vibration de chance et de providence.", heroes: [{ name: "Sènan Kpanou (Artiste plasticienne)", image: "https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?auto=format&fit=crop&q=80&w=200" }, { name: "Sènami Gbeho (Activiste)", image: "https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?auto=format&fit=crop&q=80&w=200" }] },
        { m: 'Mahugnon', f: 'Houéfa', meaning: 'Sagesse divine', description: "Symbolise l'acceptation de la volonté suprême. Houéfa évoque la 'maison de paix' (Houé-Fa), suggérant que l'enfant est le pilier de l'harmonie familiale.", heroes: [{ name: "Houéfa 'Zeynab' Abib (Chanteuse)", image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=200" }, { name: "Mahugnon Kakpo (Écrivain)", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" }] },
        { m: 'Vignon', f: 'Vioutou', meaning: 'La bonté', description: "Célèbre la qualité intrinsèque de l'âme. Ces enfants sont considérés comme des cadeaux précieux qui embellissent la lignée par leur simple présence.", heroes: [{ name: "Vignon de Soumanou (Commerçant)", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200" }] },
        { m: 'Dossou', f: 'Dossa', meaning: 'Né(e) après des jumeaux', description: "Un nom à charge spirituelle forte. Dans la tradition, les enfants nés après des jumeaux (Hohovi) possèdent un lien direct avec les énergies du double et de l'abondance.", heroes: [{ name: "Dossou-Yovo (Légende Musique)", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200" }] },
        { m: 'Kpatcha', f: 'Nonhoué', meaning: 'Don de la terre', description: "Rend hommage à Sakpata, le maître de la terre. Indique une connexion forte avec les racines et la fertilité matérielle.", heroes: [{ name: "Kpatcha Gnassingbé (Homme d'État)", image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&q=80&w=200" }] }
    ],
    'Adja / Éwé': [
        { m: 'Kossi', f: 'Akossiwa', meaning: 'Né(e) le Dimanche', description: "Le dimanche est un jour de lumière. Les enfants nés ce jour sont réputés pour leur rayonnement social et leur capacité à guider les autres.", heroes: [{ name: "Kossi Aguessy (Designer)", image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=200" }, { name: "Akossiwa Gbakpé (Héroïne)", image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2a04?auto=format&fit=crop&q=80&w=200" }] },
        { m: 'Kodjo', f: 'Adjoavi', meaning: 'Né(e) le Lundi', description: "Le lundi symbolise le renouveau. Ce sont des bâtisseurs, des personnes pragmatiques qui savent transformer les idées en réalité.", heroes: [{ name: "Kodjo Agbéyomé (Premier Ministre)", image: "https://images.unsplash.com/photo-1542156822-6924d1a71964?auto=format&fit=crop&q=80&w=200" }] },
        { m: 'Komlan', f: 'Amlanvi', meaning: 'Né(e) le Mardi', description: "Le mardi est lié à l'action. Une vibration de courage et de détermination accompagne souvent ceux qui portent ces noms.", heroes: [{ name: "Komlan Violo (Intellectuel)", image: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=200" }] },
        { m: 'Koffi', f: 'Afiavi', meaning: 'Né(e) le Vendredi', description: "Jour de la beauté et de l'abondance. Le vendredi favorise les arts et les relations harmonieuses.", heroes: [{ name: "Kofi Annan (ONU)", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200" }, { name: "Koffi Olomidé (Star)", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200" }] },
        { m: 'Yawovi', f: 'Yawa', meaning: 'Né(e) le Jeudi', description: "Jour de la force et de la justice. Les Yawa sont réputés pour leur sens de l'équité et leur droiture.", heroes: [{ name: "Yawa Djigbodi Tségan", image: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=200" }] }
    ],
    'Yoruba / Nago': [
        { m: 'Olouwafèmi', f: 'Eniola', meaning: 'Dieu m\'aime', description: "Un nom de bénédiction absolue. Il affirme que l'enfant est le fruit d'un amour divin manifesté.", heroes: [{ name: "Femi Kuti (Musicien)", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200" }, { name: "Eniola Badmus (Actrice)", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" }] },
        { m: 'Babatoundé', f: 'Yetoundé', meaning: 'Le parent revenu', description: "Nommé ainsi lorsqu'on reconnaît dans l'enfant les traits ou l'esprit d'un grand-parent récemment disparu. C'est le cycle de la réincarnation.", heroes: [{ name: "Babatunde Fashola", image: "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&q=80&w=200" }, { name: "Yetunde Barnabas", image: "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=200" }] },
        { m: 'Ayodélé', f: 'Ayo', meaning: 'La joie arrive', description: "Annonce que la tristesse est terminée. L'enfant est le porteur officiel de la joie au sein du foyer.", heroes: [{ name: "Ayo 'Wizkid' Balogun", image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200" }] },
        { m: 'Olouwaségoun', f: 'Ifè', meaning: 'Dieu est vainqueur', description: "Célèbre la victoire sur l'adversité. Un nom de triomphe et de force de caractère.", heroes: [{ name: "Segun Odegbami (Légende)", image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200" }] },
        { m: 'Fèmi', f: 'Titi', meaning: 'Aime-moi', description: "Un nom d'appel à l'affection et à la tendresse. Ces enfants sont souvent le ciment affectif de leur communauté.", heroes: [{ name: "Titi Abubakar", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" }] }
    ],
    'Mina / Guin': [
        { m: 'Kangni', f: 'Kanyi', meaning: 'Premier fils/fille', description: "Le porteur de la responsabilité de l'aîné. Symbolise le leadership et l'exemple pour les cadets.", heroes: [{ name: "Kangni Alem (Écrivain)", image: "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&q=80&w=200" }] },
        { m: 'Messan', f: 'Mablé', meaning: 'Troisième enfant', description: "Le chiffre trois est sacré, il stabilise le foyer. Ce sont des médiateurs nés.", heroes: [{ name: "Messan Agbéyomé", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" }] },
        { m: 'Mawunyo', f: 'Koko', meaning: 'Dieu est bon', description: "Une proclamation de foi. Ces enfants portent une aura de bienveillance naturelle.", heroes: [{ name: "Koko Lawson (Artiste)", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" }] },
        { m: 'Anani', f: 'Essi', meaning: 'Second fils/fille', description: "Le pilier de soutien. L'Anani est celui qui aide l'aîné à maintenir la structure familiale.", heroes: [{ name: "Anani Santos (Juriste)", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200" }] }
    ]
};

interface AgendaProps {
  onToggleDetail?: (isDetail: boolean) => void;
  onNavigate: (page: any, id?: string) => void;
  initialDateStr?: string;
  user?: User;
}

export const Agenda: React.FC<AgendaProps> = ({ onToggleDetail, onNavigate, initialDateStr, user }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDateStr ? new Date(initialDateStr) : new Date());
  const [currentCalendarDate, setCurrentCalendarDate] = useState(initialDateStr ? new Date(initialDateStr) : new Date());
  const [calendarScrollProgress, setCalendarScrollProgress] = useState(0);
  const [activeSubTab, setActiveSubTab] = useState<'fezan' | 'naissance'>('fezan');
  const [selectedBirthName, setSelectedBirthName] = useState<BirthName | null>(null);
  const [selectedHeroForModal, setSelectedHeroForModal] = useState<BirthHero | null>(null);
  
  // Nouveaux états pour le formulaire de naissance
  const [targetGender, setTargetGender] = useState<'m' | 'f'>('m');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [birthContext, setBirthContext] = useState('');
  
  // État du processus de consultation
  const [birthConsultStep, setBirthConsultStep] = useState<'form' | 'payment' | 'final'>('form');
  const [isSubmittingBirth, setIsSubmittingBirth] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const selectedDayRef = useRef<HTMLDivElement>(null);
  const isAutoScrolling = useRef(false);

  const daysToShow = useMemo(() => {
    const start = new Date(2026, 0, 1);
    const end = new Date(2026, 11, 31);
    const days = [];
    let d = new Date(start);
    while (d <= end) {
        days.push(new Date(d));
        d.setDate(d.getDate() + 1);
    }
    return days;
  }, []);

  const getFezanForDate = (date: Date) => {
    const pivotDate = new Date(2026, 1, 1);
    pivotDate.setHours(0, 0, 0, 0);
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const diffInMs = targetDate.getTime() - pivotDate.getTime();
    const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));
    let targetIndex = (0 + diffInDays) % 9;
    if (targetIndex < 0) targetIndex += 9;
    return FEZAN_DAYS[targetIndex];
  };

  const getVibrationThought = (date: Date) => {
    const fezan = getFezanForDate(date);
    switch (fezan.name) {
        case 'Mèdjo': return "L'énergie de la création coule en vous. Osez initier ce qui vous tient à cœur.";
        case 'Mèkou': return "Le silence est un langage que les ancêtres comprennent. Écoutez plus que vous ne parlez.";
        case 'Vodoun': return "Le sacré s'invite dans votre quotidien. Soyez attentif aux synchronicités.";
        case 'Azon': return "Ménagez votre monture pour aller loin. La paix du corps précède celle de l'esprit.";
        case 'Vo': return "En vous dépouillant du superflu, vous faites de la place pour l'essentiel.";
        case 'Houè / Akoué': return "La vérité est une boussole qui ne trompe jamais. Suivez-la sans crainte.";
        case 'Bô': return "Votre force réside dans votre alignement. Les obstacles s'effacent devant une volonté pure.";
        case 'Hin / Fô': return "La nuit prépare le jour. Acceptez l'ombre pour mieux apprécier la lumière à venir.";
        case 'Fâ': return "La sagesse n'est pas dans les livres, mais dans l'écoute de votre propre oracle.";
        default: return "Que l'équilibre du Fèzan guide vos pas.";
    }
  };

  useEffect(() => {
    if (initialDateStr) {
        const d = new Date(initialDateStr);
        setSelectedDate(d);
    }
  }, [initialDateStr]);

  useEffect(() => {
    const scrollTimer = setTimeout(() => {
        if (selectedDayRef.current && scrollContainerRef.current) {
            isAutoScrolling.current = true;
            selectedDayRef.current.scrollIntoView({
                behavior: 'smooth',
                inline: 'start',
                block: 'nearest'
            });
            setTimeout(() => { isAutoScrolling.current = false; }, 1000);
        }
    }, 150);
    return () => clearTimeout(scrollTimer);
  }, []);

  const scrollToMonth = (targetDate: Date) => {
    if (scrollContainerRef.current) {
        isAutoScrolling.current = true;
        const targetDayIndex = daysToShow.findIndex(d => d.getFullYear() === targetDate.getFullYear() && d.getMonth() === targetDate.getMonth() && d.getDate() === 1);
        if (targetDayIndex !== -1) {
            const dayElement = scrollContainerRef.current.children[targetDayIndex] as HTMLElement;
            dayElement.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
        }
        setCurrentCalendarDate(targetDate);
        setTimeout(() => { isAutoScrolling.current = false; }, 1000);
    }
  };

  const handleCalendarScroll = () => {
    if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
        setCalendarScrollProgress(progress);
        if (!isAutoScrolling.current) {
            const containerRect = scrollContainerRef.current.getBoundingClientRect();
            const days = scrollContainerRef.current.children;
            const pivotX = containerRect.left + 100; 
            for (let i = 0; i < days.length; i++) {
                const dayEl = days[i] as HTMLElement;
                const rect = dayEl.getBoundingClientRect();
                if (rect.left <= pivotX && rect.right >= pivotX) {
                    const date = daysToShow[i];
                    if (date.getMonth() !== currentCalendarDate.getMonth() || date.getFullYear() !== currentCalendarDate.getFullYear()) {
                        setCurrentCalendarDate(new Date(date.getFullYear(), date.getMonth(), 1));
                    }
                    break;
                }
            }
        }
    }
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (scrollContainerRef.current) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;
        const scrollAmount = percentage * (scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth);
        scrollContainerRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const dayFezan = getFezanForDate(selectedDate);
  const dayThought = getVibrationThought(selectedDate);

  const isPast = (date: Date) => {
    const d = new Date(date); d.setHours(0, 0, 0, 0);
    const t = new Date(); t.setHours(0, 0, 0, 0);
    return d < t;
  };

  useEffect(() => {
    if (onToggleDetail) {
      onToggleDetail(!!selectedBirthName);
    }
  }, [selectedBirthName, onToggleDetail]);

  const handleGoogleSearch = (name: string) => {
    const url = `https://www.google.com/search?q=${encodeURIComponent(name)}`;
    window.open(url, '_blank');
  };

  const startBirthConsultation = () => {
    setIsSubmittingBirth(true);
    setTimeout(() => {
        setIsSubmittingBirth(false);
        setBirthConsultStep('payment');
    }, 1200);
  };

  const finalizeBirthPayment = () => {
    setIsSubmittingBirth(true);
    setTimeout(() => {
        setIsSubmittingBirth(false);
        setBirthConsultStep('final');
    }, 1500);
  };

  if (selectedBirthName) {
      return (
          <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
              <button 
                  onClick={() => { setSelectedBirthName(null); setBirthConsultStep('form'); }} 
                  className="flex items-center gap-2 text-brand-600 font-bold hover:underline group"
              >
                  <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Retour à la liste
              </button>

              <div className="bg-white rounded-[3.5rem] shadow-2xl border border-brand-50 overflow-hidden relative">
                  <div className="bg-brand-900 p-12 md:p-16 text-center text-white space-y-6 relative overflow-hidden">
                      <div className="absolute inset-0 opacity-5 flex items-center justify-center pointer-events-none">
                          <Baby size={300} />
                      </div>
                      <div className="relative z-10 space-y-4">
                          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-[0.2em]">
                              Signification du Nom
                          </span>
                          <h1 className="text-4xl md:text-6xl font-serif font-black uppercase tracking-tight">
                              {selectedBirthName.m} / {selectedBirthName.f}
                          </h1>
                          <p className="text-brand-300 text-lg md:text-xl font-serif italic">"{selectedBirthName.meaning}"</p>
                      </div>
                  </div>

                  <div className="p-8 md:p-16 space-y-12">
                      <section className="space-y-4">
                          <h3 className="text-2xl font-serif font-black text-brand-900 flex items-center gap-3">
                              <Info className="text-brand-50" /> Histoire & Vibration
                          </h3>
                          <p className="text-stone-600 text-lg leading-relaxed font-light italic">
                              {selectedBirthName.description}
                          </p>
                      </section>

                      <section className="bg-stone-50 p-8 rounded-[2.5rem] border border-stone-100 space-y-8">
                          <h3 className="text-xl font-serif font-bold text-brand-900 flex items-center gap-3">
                              <Award className="text-brand-600" /> Personnalités Illustres
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {selectedBirthName.heroes.map((hero, i) => (
                                  <div 
                                      key={i} 
                                      onClick={() => setSelectedHeroForModal(hero)}
                                      className="flex items-center gap-5 p-4 bg-white rounded-[2rem] shadow-sm border border-stone-100 group hover:shadow-md transition-all cursor-pointer"
                                  >
                                      <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-inner border border-stone-50 relative">
                                          <img src={hero.image} alt={hero.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                          <div className="absolute inset-0 bg-brand-900/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                              <Eye className="text-white" size={20} />
                                          </div>
                                      </div>
                                      <div className="space-y-1">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-brand-500">Portrait</span>
                                        <p className="text-sm font-black text-stone-700 leading-tight group-hover:text-brand-600">{hero.name}</p>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </section>

                      <div className="pt-8 border-t border-stone-100 space-y-10">
                          {birthConsultStep === 'final' ? (
                              <div className="text-center py-12 space-y-6 animate-slideUp bg-green-50/30 rounded-[3rem] p-8 border border-green-100">
                                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-xl text-green-600">
                                      <CheckCircle2 size={48} />
                                  </div>
                                  <div className="space-y-3">
                                      <h3 className="text-3xl font-serif font-black text-brand-900 uppercase">Consultation Lancée</h3>
                                      <p className="text-stone-500 max-w-sm mx-auto italic font-medium leading-relaxed">"Votre demande a été transmise aux Bokonons. Un rapport d'accord spirituel sera disponible dans votre tableau de bord sous 24H."</p>
                                  </div>
                                  <button onClick={() => onNavigate('dashboard', 'cons2')} className="bg-brand-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:scale-105 transition-all">VOIR LE DÉTAIL DE MA CONSULTATION</button>
                              </div>
                          ) : birthConsultStep === 'payment' ? (
                              <div className="space-y-10 animate-fadeIn">
                                  <div className="text-center space-y-3">
                                      <h4 className="text-2xl font-serif font-black text-brand-900 uppercase tracking-tight">Finaliser la Demande</h4>
                                      <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">Choisir l'offre de consultation</p>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                                      <div className="p-8 bg-stone-50 rounded-[2.5rem] border-2 border-stone-100 hover:border-brand-500 hover:bg-white transition-all cursor-pointer group shadow-sm flex flex-col items-center text-center space-y-3">
                                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-600 shadow-inner group-hover:bg-brand-50"><CreditCard size={24}/></div>
                                          <span className="text-[10px] font-black uppercase tracking-widest text-brand-500">Offre Standard</span>
                                          <h5 className="text-xl font-serif font-bold text-brand-900">Jet Unique</h5>
                                          <p className="text-3xl font-black text-brand-600">5.000 F</p>
                                      </div>
                                      <div className="p-8 bg-brand-50 rounded-[2.5rem] border-2 border-brand-200 hover:border-brand-500 hover:bg-white transition-all cursor-pointer group shadow-xl flex flex-col items-center text-center space-y-3 relative overflow-hidden">
                                          <div className="absolute top-0 right-0 bg-brand-500 text-brand-900 px-4 py-1.5 rounded-bl-2xl text-[8px] font-black uppercase tracking-widest">CONSEILLÉ</div>
                                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-600 shadow-inner"><Sparkles size={24}/></div>
                                          <span className="text-[10px] font-black uppercase tracking-widest text-brand-500">Pack Complet</span>
                                          <h5 className="text-xl font-serif font-bold text-brand-900">Rapport & Rituel</h5>
                                          <p className="text-3xl font-black text-brand-600">12.000 F</p>
                                      </div>
                                  </div>
                                  <button onClick={finalizeBirthPayment} className="w-full max-w-md mx-auto bg-brand-900 text-white py-6 px-6 rounded-[2rem] font-black uppercase tracking-wider md:tracking-[0.2em] text-[10px] md:text-xs shadow-2xl flex items-center justify-center gap-2 md:gap-4 hover:bg-black transition-all">
                                      {isSubmittingBirth ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <>PAYER ET VALIDER <Send size={18} /></>}
                                  </button>
                              </div>
                          ) : (
                              <>
                                <div className="text-center space-y-3">
                                    <h4 className="text-2xl font-serif font-black text-brand-900 uppercase">Consulter le Fa pour ce choix ?</h4>
                                    <p className="text-stone-500 text-sm leading-relaxed max-w-2xl mx-auto">
                                        Dans la tradition, le choix définitif du nom se fait après consultation de l'oracle pour s'assurer que le nom est en accord avec le Du (signe) de l'enfant.
                                    </p>
                                </div>

                                <div className="max-w-xl mx-auto bg-stone-50 p-8 md:p-10 rounded-[3rem] border border-stone-100 space-y-8 shadow-inner">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-600 block px-4">1. Pour qui est ce prénom ?</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button 
                                                onClick={() => setTargetGender('m')}
                                                className={`py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] border-2 transition-all flex flex-col items-center gap-2 ${targetGender === 'm' ? 'bg-brand-900 text-white border-brand-900 shadow-xl' : 'bg-white text-stone-400 border-stone-200'}`}
                                            >
                                                <span className="text-xl">♂</span>
                                                {selectedBirthName.m} (GARÇON)
                                            </button>
                                            <button 
                                                onClick={() => setTargetGender('f')}
                                                className={`py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] border-2 transition-all flex flex-col items-center gap-2 ${targetGender === 'f' ? 'bg-brand-900 text-white border-brand-900 shadow-xl' : 'bg-white text-stone-400 border-stone-200'}`}
                                            >
                                                <span className="text-xl">♀</span>
                                                {selectedBirthName.f} (FILLE)
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-600 block px-4">2. Les Parents</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input 
                                                type="text" 
                                                placeholder="Nom complet du Papa" 
                                                value={fatherName}
                                                onChange={(e) => setFatherName(e.target.value)}
                                                className="w-full p-4 bg-white border border-stone-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium"
                                            />
                                            <input 
                                                type="text" 
                                                placeholder="Nom complet de la Maman" 
                                                value={motherName}
                                                onChange={(e) => setMotherName(e.target.value)}
                                                className="w-full p-4 bg-white border border-stone-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-600 block px-4">3. Circonstances (Accouchement/Grossesse)</label>
                                        <textarea 
                                            placeholder="Décrivez brièvement les évènements marquants ou les rêves particuliers..." 
                                            value={birthContext}
                                            onChange={(e) => setBirthContext(e.target.value)}
                                            className="w-full p-5 bg-white border border-stone-200 rounded-[2rem] outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium min-h-[100px]"
                                        ></textarea>
                                    </div>

                                    <button 
                                        onClick={startBirthConsultation}
                                        className="w-full bg-brand-900 text-white py-5 px-6 rounded-[2rem] font-black uppercase tracking-wider md:tracking-[0.2em] text-[10px] md:text-xs shadow-2xl hover:bg-black hover:scale-[1.02] transition-all flex items-center justify-center gap-2 md:gap-4 group"
                                    >
                                        {isSubmittingBirth ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <>Démarrer une consultation <Sparkles size={18} className="group-hover:rotate-12 transition-transform shrink-0" /></>}
                                    </button>
                                </div>
                              </>
                          )}
                      </div>
                  </div>
              </div>

              {/* MODALE PHOTO PERSONNALITÉ - CORRIGÉE POUR ÉVITER LE DÉBORDEMENT */}
              {selectedHeroForModal && (
                  <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 animate-fadeIn">
                      <div className="absolute inset-0 bg-brand-900/70 backdrop-blur-md" onClick={() => setSelectedHeroForModal(null)}></div>
                      <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden relative z-10 animate-slideUp flex flex-col max-h-[90dvh]">
                          <div className="relative flex-grow overflow-hidden min-h-0">
                              <img src={selectedHeroForModal.image} className="w-full h-full object-cover" alt={selectedHeroForModal.name} />
                              <button 
                                  onClick={() => setSelectedHeroForModal(null)}
                                  className="absolute top-4 right-4 p-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white hover:text-brand-900 transition-all shadow-xl z-20"
                              >
                                  <X size={20} />
                              </button>
                              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white">
                                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-400 block mb-1">Illustre Porteur du Nom</span>
                                  <h3 className="text-2xl md:text-3xl font-serif font-black">{selectedHeroForModal.name}</h3>
                              </div>
                          </div>
                          <div className="p-6 md:p-8 bg-white shrink-0 border-t border-stone-50 flex flex-col gap-4">
                              <p className="text-stone-500 text-xs italic text-center leading-relaxed">
                                  Découvrez le parcours de cette personnalité inspirante sur le web.
                              </p>
                              <button 
                                  onClick={() => handleGoogleSearch(selectedHeroForModal.name)}
                                  className="w-full md:w-auto bg-brand-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3 group"
                              >
                                  RECHERCHER SUR GOOGLE <Search size={16} className="group-hover:scale-110 transition-transform" />
                              </button>
                          </div>
                      </div>
                  </div>
              )}
          </div>
      );
  }

  return (
    <div className="space-y-12 pb-20 animate-fadeIn overflow-x-hidden">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-4 bg-brand-100 rounded-full mb-2">
            <CalendarDays className="text-brand-600" size={32} />
        </div>
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-brand-900 tracking-tight uppercase">Agenda de la Tradition</h1>
        <p className="text-stone-500 text-lg max-w-xl mx-auto italic">Synchronisez votre vie avec le Fèzan, le calendrier sacré du Bénin.</p>
      </div>

      <section id="daily-planner" className="max-w-6xl mx-auto space-y-10">
        <div className="bg-white rounded-[3rem] shadow-2xl border border-brand-50 p-6 md:p-10 space-y-8 sticky top-20 z-40 backdrop-blur-md bg-white/95">
            <div className="flex justify-between items-center px-4">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-brand-500 uppercase tracking-widest">Cycle Sacré du Fèzan</span>
                    <h3 className="text-2xl md:text-3xl font-serif font-black text-brand-900 capitalize leading-tight flex items-baseline gap-3">
                        {currentCalendarDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                        <span className="text-brand-500 font-sans text-sm md:text-lg opacity-80 font-bold uppercase tracking-widest">{FON_MONTHS[currentCalendarDate.getMonth()]}</span>
                    </h3>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => scrollToMonth(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() - 1, 1))} className="p-3 bg-stone-50 hover:bg-brand-100 text-stone-600 rounded-2xl border border-stone-100 transition-all shadow-sm"><ChevronLeft size={20}/></button>
                    <button onClick={() => scrollToMonth(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1, 1))} className="p-3 bg-stone-50 hover:bg-brand-100 text-stone-600 rounded-2xl border border-stone-100 transition-all shadow-sm"><ChevronRight size={20}/></button>
                </div>
            </div>

            <div 
                ref={scrollContainerRef} 
                onScroll={handleCalendarScroll}
                className="flex gap-3 md:gap-4 overflow-x-auto pt-6 pb-6 px-4 snap-x tradition-scrollbar"
            >
                {daysToShow.map((date, idx) => {
                    const isSelected = selectedDate.toDateString() === date.toDateString();
                    const isToday = new Date().toDateString() === date.toDateString();
                    const past = isPast(date);
                    const fezanInfo = getFezanForDate(date);

                    return (
                        <div 
                            key={idx}
                            ref={isSelected ? selectedDayRef : null}
                            onClick={() => setSelectedDate(date)}
                            className={`flex flex-col items-center justify-center min-w-[75px] md:min-w-[100px] h-24 md:h-32 rounded-[2rem] border transition-all cursor-pointer snap-start relative ${
                                isSelected 
                                ? 'bg-brand-900 border-brand-900 text-white shadow-2xl -translate-y-2 scale-105 z-10' 
                                : isToday 
                                ? 'bg-brand-50 border-brand-400 text-brand-900' 
                                : 'bg-stone-50 border-stone-100 text-stone-400 hover:bg-white hover:border-brand-200'
                            }`}
                        >
                            <span className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-60">
                                {date.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', '')}
                            </span>
                            <span className="text-2xl md:text-3xl font-serif font-black leading-none">
                                {date.getDate()}
                            </span>
                            <div className={`mt-1 h-1 w-1 rounded-full ${fezanInfo.status === 'Favorable' ? 'bg-green-500' : 'bg-red-400'}`}></div>
                            {past && !isSelected && <div className="absolute top-2 right-2"><History size={10} className="text-stone-300"/></div>}
                        </div>
                    );
                })}
            </div>

            <div className="hidden lg:block max-w-md mx-auto px-10 mt-4">
                <div 
                    onClick={handleTrackClick}
                    className="h-3 w-full bg-stone-200 rounded-full relative overflow-hidden shadow-inner cursor-pointer"
                >
                    <div 
                        className="absolute top-0 bottom-0 bg-brand-600 rounded-full transition-all duration-200 ease-out shadow-sm pointer-events-none"
                        style={{ width: '5%', left: `${calendarScrollProgress * 0.95}%` }}
                    />
                </div>
            </div>

            {/* SYSTÈME D'ONGLETS FEZAN / NAISSANCE */}
            <div className="pt-8 border-t border-stone-100">
                <div className="flex items-center justify-center gap-2 md:gap-4 max-w-sm mx-auto p-1.5 bg-stone-50 border border-stone-200 rounded-full shadow-inner">
                    <button 
                        onClick={() => setActiveSubTab('fezan')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeSubTab === 'fezan' ? 'bg-brand-900 text-white shadow-xl' : 'text-stone-400 hover:text-brand-900'}`}
                    >
                        <Compass size={14} /> Fèzan
                    </button>
                    <button 
                        onClick={() => setActiveSubTab('naissance')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeSubTab === 'naissance' ? 'bg-brand-900 text-white shadow-xl' : 'text-stone-400 hover:text-brand-900'}`}
                    >
                        <Baby size={14} /> Naissance
                    </button>
                </div>
            </div>
        </div>

        <div className="animate-slideUp max-w-4xl mx-auto space-y-12">
            {activeSubTab === 'fezan' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-[3.5rem] shadow-2xl border border-brand-50 p-10 flex flex-col items-center text-center space-y-8 relative overflow-hidden group">
                        <div className={`absolute top-0 left-0 w-full h-2 ${dayFezan.status === 'Favorable' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-500 block">Vibration Fèzan</span>
                            <h3 className="text-4xl font-serif font-black text-brand-900 uppercase tracking-tight">{dayFezan.name}</h3>
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${dayFezan.status === 'Favorable' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                {dayFezan.status === 'Favorable' ? <CheckCircle2 size={12}/> : <AlertTriangle size={12}/>}
                                {dayFezan.status}
                            </div>
                        </div>
                        <div className="bg-stone-50 w-48 h-48 rounded-[3rem] flex items-center justify-center shadow-inner border border-stone-100 group-hover:scale-105 transition-transform duration-700">
                            <span className="text-8xl drop-shadow-sm">{dayFezan.symbol}</span>
                        </div>
                        <div className="space-y-4">
                            <p className="text-stone-600 text-sm italic leading-relaxed">"{dayFezan.meaning}"</p>
                            <button className="p-3 bg-brand-50 text-brand-600 rounded-full hover:bg-brand-100 transition-colors"><Volume2 size={20}/></button>
                        </div>
                    </div>

                    <div className="bg-brand-900 rounded-[3.5rem] shadow-2xl p-10 flex flex-col items-center justify-center text-center space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-brand-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                        <QuoteIcon className="text-brand-400 rotate-180" size={48} />
                        <div className="space-y-6 relative z-10">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-300 block">Conseil de la Vibration</span>
                            <p className="text-2xl md:text-3xl font-serif font-bold text-white leading-relaxed italic">"{dayThought}"</p>
                            <div className="h-0.5 w-16 bg-brand-500 mx-auto"></div>
                            <p className="text-[9px] text-brand-200 uppercase font-medium tracking-[0.2em]">Sagesse Fèzan du Jour</p>
                        </div>
                        <div className="flex gap-4 pt-4">
                            <button className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"><Heart size={18}/> <span className="text-[10px] font-black">SAUVEGARDER</span></button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-10 animate-fadeIn">
                    <div className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-2xl border border-brand-50 space-y-12">
                        <div className="text-center space-y-3">
                            <div className="inline-flex items-center gap-2 bg-brand-50 px-4 py-1.5 rounded-full border border-brand-100 text-[10px] font-black uppercase text-brand-600 tracking-widest">
                                <Baby size={14}/> Guide de Naissance
                            </div>
                            <h3 className="text-3xl md:text-4xl font-serif font-black text-brand-900 uppercase">Noms du Jour</h3>
                            <p className="text-stone-500 italic max-w-lg mx-auto">Voici les noms indigènes recommandés pour un enfant né ce jour selon les dialectes majeurs du Bénin. Cliquez pour plus de détails.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                            {Object.entries(BIRTH_NAMES_DATA).map(([dialect, names]) => (
                                <div key={dialect} className="space-y-6">
                                    <div className="flex items-center gap-3 border-b-2 border-brand-100 pb-3">
                                        <div className="w-2 h-6 bg-brand-900 rounded-full"></div>
                                        <h4 className="font-serif font-black text-xl text-brand-900 uppercase tracking-tight">{dialect}</h4>
                                    </div>
                                    <div className="space-y-4">
                                        {names.map((n, i) => (
                                            <div 
                                                key={i} 
                                                onClick={() => setSelectedBirthName(n)}
                                                className="p-6 bg-stone-50 rounded-[2.2rem] border border-stone-100 space-y-4 group hover:bg-white hover:shadow-xl transition-all cursor-pointer relative"
                                            >
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-black text-brand-900 text-lg uppercase tracking-tight">{n.m}</span>
                                                        <span className="text-[7px] font-black bg-brand-100 text-brand-800 px-3 py-1 rounded-full uppercase tracking-[0.1em]">GARÇON</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-black text-brand-600 text-lg uppercase tracking-tight">{n.f}</span>
                                                        <span className="text-[7px] font-black bg-brand-900 text-white px-3 py-1 rounded-full uppercase tracking-[0.1em]">FILLE</span>
                                                    </div>
                                                </div>
                                                <div className="pt-3 border-t border-stone-200/50 flex justify-between items-center">
                                                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest italic leading-relaxed">"{n.meaning}"</p>
                                                    <div className="flex items-center gap-1.5 group/link">
                                                        <span className="text-[9px] font-black text-brand-600/60 uppercase tracking-widest group-hover/link:text-brand-600 transition-colors">Plus de détail</span>
                                                        <ChevronRight size={14} className="text-stone-300 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-[3.5rem] p-10 md:p-14 border border-brand-50 shadow-2xl text-center space-y-8 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-400 to-transparent"></div>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 shadow-inner group-hover:rotate-12 transition-transform duration-500">
                        <Compass size={32} />
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-2xl md:text-3xl font-serif font-black text-brand-900 uppercase">Interroger le destin</h3>
                        <p className="text-stone-500 text-base md:text-lg max-w-2xl mx-auto italic leading-relaxed">
                            "Souhaitez-vous entreprendre une action spécifique aujourd'hui ? Demandez au Fa si cette vibration vous est favorable ou quel jour serait le plus propice pour votre succès."
                        </p>
                    </div>
                </div>
                <button onClick={() => onNavigate('tofa')} className="bg-brand-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl hover:bg-black hover:scale-105 transition-all flex items-center justify-center gap-4 mx-auto group/btn">Consulter le Fa <Sparkles size={18} className="group-hover/btn:rotate-12 transition-transform" /></button>
                <div className="pt-4 opacity-40"><p className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.3em]">"Que cette journée de {dayFezan.name} soit pour vous une source d'équilibre."</p></div>
            </div>
        </div>
      </section>
    </div>
  );
};
