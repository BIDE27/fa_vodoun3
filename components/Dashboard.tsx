
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { User, Product, Course } from '../types';
import { 
  Package, Users, DollarSign, BookOpen, Star, Clock, 
  CheckCircle, ChevronRight, ShoppingBag, Sparkles, 
  GraduationCap, Award, HelpCircle, ArrowUpRight, ArrowRight,
  History, Calendar, ShieldCheck, Zap, ArrowLeft, ScrollText, UserCheck, Compass, Info, LayoutDashboard, List, FileCheck, Timer, CreditCard, Tag, MapPin, Send, Check,
  Activity, Briefcase, Heart, MessageSquare, AlertCircle, Eye, MoreHorizontal, UserPlus, TrendingUp, Settings,
  Plus, PlusCircle, Trash2, Search, X, ShoppingCart, Flame
} from 'lucide-react';

interface DashboardProps {
    user: User;
    products: Product[];
    initialConsultationId?: string;
    onNavigate?: (page: any, id?: string) => void;
    onAddToCart?: (product: Product) => void;
}

// --- MOCK DATA FOR THE 16 MEJI SELECTOR ---
const MEJI_SIGNS = [
    { name: 'Gbe-Meji', symbol: 'I I\nI I\nI I\nI I' },
    { name: 'Yeku-Meji', symbol: 'II II\nII II\nII II\nII II' },
    { name: 'Woli-Meji', symbol: 'II II\nI I\nI I\nII II' },
    { name: 'Di-Meji', symbol: 'I I\nII II\nII II\nI I' },
    { name: 'Abla-Meji', symbol: 'I I\nI I\nII II\nII II' },
    { name: 'Akla-Meji', symbol: 'II II\nII II\nI I\nI I' },
    { name: 'Guda-Meji', symbol: 'I I\nII II\nII II\nII II' },
    { name: 'Sa-Meji', symbol: 'II II\nII II\nII II\nI I' },
    { name: 'Lete-Meji', symbol: 'I I\nI I\nI I\nII II' },
    { name: 'Tula-Meji', symbol: 'II II\nI I\nI I\nI I' },
    { name: 'Trukpin-Meji', symbol: 'II II\nI I\nII II\nII II' },
    { name: 'Ka-Meji', symbol: 'II II\nII II\nI I\nII II' },
    { name: 'Ce-Meji', symbol: 'I I\nII II\nI I\nI I' },
    { name: 'Loso-Meji', symbol: 'I I\nI I\nII II\nI I' },
    { name: 'Winlin-Meji', symbol: 'I I\nII II\nII II\nI I' },
    { name: 'Fu-Meji', symbol: 'II II\nII II\nII II\nII II' },
];

// --- MOCK DATA FOR USER DASHBOARD ---
const PROGRESS_DATA = [
    { name: 'Sem 1', xp: 120 },
    { name: 'Sem 2', xp: 250 },
    { name: 'Sem 3', xp: 180 },
    { name: 'Sem 4', xp: 450 },
];

const SKILL_DISTRIBUTION = [
    { name: 'Géomancie', value: 400 },
    { name: 'Botanique', value: 300 },
    { name: 'Histoire', value: 200 },
    { name: 'Rituels', value: 100 },
];

const COLORS = ['#6b4028', '#d1984b', '#a26131', '#f0e6cb'];

const MOCK_ENROLLED_COURSES = [
    { id: 'c1', title: 'Fondamentaux du Fa', progress: 100, lastAccessed: 'Hier', instructor: 'Bokonon Amoussa' },
    { id: 'c2', title: 'Les 16 Signes Mères', progress: 45, lastAccessed: 'Il y a 2h', instructor: 'Bokonon Amoussa' },
    { id: 'c3', title: 'Secrets des Plantes', progress: 12, lastAccessed: 'La semaine dernière', instructor: 'Mère Sika' },
];

const MOCK_CERTIFICATES = [
    { id: 'cert1', title: 'Certificat: Initiation au Fa', date: '15 Oct 2023', course: 'Fondamentaux du Fa' },
    { id: 'cert2', title: 'Initié de Premier Cycle', date: '20 Déc 2023', course: 'Cursus Général' },
];

const MOCK_QUIZ_DETAILED = [
    { id: 'q1', title: 'Alphabet du Fa', status: 'Terminé', score: '90/100', date: '12 Oct' },
    { id: 'q2', title: 'Mythologie Fon', status: 'Terminé', score: '75/100', date: '05 Nov' },
    { id: 'q3', title: 'Rituels de l\'Eau', status: 'En cours', score: '-', date: '-' },
    { id: 'q4', title: 'Botanique Sacrée', status: 'Non commencé', score: '-', date: '-' },
];

const MOCK_ORDERS = [
    { id: 'ORD-5421', date: '10 Oct 2023', total: 15000, itemsCount: 1, status: 'Livré' },
    { id: 'ORD-6782', date: '12 Nov 2023', total: 32500, itemsCount: 3, status: 'Expédié' },
    { id: 'ORD-8910', date: '05 Jan 2024', total: 5000, itemsCount: 1, status: 'En préparation' },
];

const MOCK_COURSE_PURCHASES = [
    { id: 'c2', title: 'Les 16 Signes Mères', date: '11 Nov 2023', price: 5000, status: 'Activé' },
    { id: 'c3', title: 'Secrets des Plantes', date: '28 Déc 2023', price: 7500, status: 'Activé' },
    { id: 'c5', title: 'L\'Art du Chapelet', date: '15 Fév 2024', price: 12000, status: 'Paiement en attente' },
];

const MOCK_RECOMMENDED_PRODUCTS: Product[] = [
  { 
    id: '1', 
    name: 'Le Grand Livre du Fa', 
    price: 15000, 
    category: 'livre', 
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
    description: 'Guide complet pour les initiés et les curieux de la géomancie.'
  },
  { 
    id: '2', 
    name: 'Chapelet de Divination', 
    nameFon: 'Agumaga',
    price: 5000, 
    category: 'accessoire', 
    image: 'https://images.unsplash.com/photo-1605274280925-9dd1ba746654?auto=format&fit=crop&q=80&w=800',
    description: 'Outil traditionnel authentique en noix de palme.'
  },
  { 
    id: 'a1', 
    name: 'Caméléon vivant', 
    nameFon: 'Agamon gbèdégbè',
    price: 12000, 
    category: 'animal', 
    image: 'https://images.unsplash.com/photo-1523626797181-8c5ae80d40c2?auto=format&fit=crop&q=80&w=800',
    description: 'Animal sacré utilisé pour les rituels de transformation.'
  },
  { 
    id: 'a2', 
    name: 'Tête de Caméléon', 
    nameFon: 'Agamon ta',
    price: 4500, 
    category: 'animal', 
    image: 'https://images.unsplash.com/photo-1523626797181-8c5ae80d40c2?auto=format&fit=crop&q=80&w=800',
    description: 'Composant essentiel pour de nombreuses préparations médicinales.'
  },
  { 
    id: 'a3', 
    name: 'Perroquet vivant', 
    nameFon: 'Kessè gbèdégbè',
    price: 45000, 
    category: 'animal', 
    image: 'https://images.unsplash.com/photo-1552728089-57bdde30fc3e?auto=format&fit=crop&q=80&w=800',
    description: 'Le messager des paroles sacrées.'
  },
  { 
    id: 'a4', 
    name: 'Plume de perroquet', 
    nameFon: 'Kessè foun',
    price: 2500, 
    category: 'animal', 
    image: 'https://images.unsplash.com/photo-1534431871927-1049964e525f?auto=format&fit=crop&q=80&w=800',
    description: 'Utilisée pour les parures rituelles et les talismans.'
  },
  { 
    id: 'a5', 
    name: 'Bouc de sacrifice', 
    nameFon: 'Gbôbo',
    price: 35000, 
    category: 'animal', 
    image: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&q=80&w=800',
    description: 'Pour les rituels majeurs de purification.'
  },
  { 
    id: 'a6', 
    name: 'Coq de sacrifice', 
    nameFon: 'Koklo-su',
    price: 6500, 
    category: 'animal', 
    image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80&w=800',
    description: 'Élément central des offrandes quotidiennes.'
  },
  { 
    id: 'v1', 
    name: 'Feuilles d\'hysope', 
    nameFon: 'Kessu kessu',
    price: 1500, 
    category: 'vegetal', 
    image: 'https://images.unsplash.com/photo-1628102431525-4672624231b2?auto=format&fit=crop&q=80&w=800',
    description: 'Herbe de purification pour les bains rituels.'
  },
  { 
    id: 'v2', 
    name: 'Feuille de Moringa', 
    nameFon: 'Patagonba',
    price: 2000, 
    category: 'vegetal', 
    image: 'https://images.unsplash.com/photo-1596438459194-f275f413d6ff?auto=format&fit=crop&q=80&w=800',
    description: 'Plante aux mille vertus pour la force spirituelle.'
  },
  { 
    id: 'v3', 
    name: 'Petit Cola', 
    nameFon: 'Ahowé',
    price: 500, 
    category: 'vegetal', 
    image: 'https://images.unsplash.com/photo-1625940629601-8f2570086b06?auto=format&fit=crop&q=80&w=800',
    description: 'Symbole de longévité et composant d\'offrandes.'
  },
  { 
    id: 'acc1', 
    name: 'Pagne Blanc', 
    nameFon: 'Avô wiwi',
    price: 8500, 
    category: 'accessoire', 
    image: 'https://images.unsplash.com/photo-1589367920969-ab8e05090ca0?auto=format&fit=crop&q=80&w=800',
    description: 'Tissu de pureté requis pour les cérémonies.'
  },
  { 
    id: 'acc2', 
    name: 'Cauris sacrés', 
    nameFon: 'Akoué',
    price: 3000, 
    category: 'accessoire', 
    image: 'https://images.unsplash.com/photo-1605274280925-9dd1ba746654?auto=format&fit=crop&q=80&w=800',
    description: 'Utilisés pour la parure et le sacrifice.'
  },
  { 
    id: 'a7', 
    name: 'Scorpion mort', 
    nameFon: 'Agléza koukou',
    price: 3500, 
    category: 'animal', 
    image: 'https://images.unsplash.com/photo-1543236208-1647a6946654?auto=format&fit=crop&q=80&w=800',
    description: 'Élément de protection occulte puissante.'
  },
  { 
    id: 'a8', 
    name: 'Hibou vivant', 
    nameFon: 'Favi gbèdégbè',
    price: 25000, 
    category: 'animal', 
    image: 'https://images.unsplash.com/photo-1544253303-34e83712e09e?auto=format&fit=crop&q=80&w=800',
    description: 'Le veilleur nocturne, animal de vision.'
  },
  { 
    id: 'v4', 
    name: 'Clou de girofle', 
    nameFon: 'Atikun',
    price: 1000, 
    category: 'vegetal', 
    image: 'https://images.unsplash.com/photo-1599307767316-776533bb941c?auto=format&fit=crop&q=80&w=800',
    description: 'Pour attirer la faveur et purifier les paroles.'
  },
  { 
    id: '3', 
    name: 'Kit Rituel Purific.', 
    price: 25000, 
    category: 'rituel', 
    image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&q=80&w=800',
    description: 'Herbes, huiles et encens sacrés pour la maison.'
  },
  { 
    id: 'acc3', 
    name: 'Perles traditionnelles', 
    nameFon: 'Djè',
    price: 4500, 
    category: 'accessoire', 
    image: 'https://images.unsplash.com/photo-1596944210908-27810358a74a?auto=format&fit=crop&q=80&w=800',
    description: 'Perles chargées énergétiquement.'
  }
];

// --- BOKONON SPECIFIC MOCK DATA ---
const BOKONON_CONSULTATIONS = [
  { id: 'cons-101', user: 'Koffi Adewale', motive: 'Travail', date: 'Aujourd\'hui, 10:45', status: 'En attente', description: 'Recherche de clarté sur un nouveau projet agricole.' },
  { id: 'cons-102', user: 'Sènan Bignon', motive: 'Famille', date: 'Hier, 16:20', status: 'En attente', description: 'Conflit foncier entre frères. Besoin de médiation du Fa.' },
  { id: 'cons-103', user: 'Gildas Akpo', motive: 'Santé', date: 'Il y a 2 jours', status: 'En cours', description: 'Rêves récurrents de serpents. Demande de protection.' },
  { id: 'cons-104', user: 'Lucie Durand', motive: 'Voyage', date: 'Il y a 3 jours', status: 'Terminé', result: 'Cé-Mèji', interpretation: 'Le voyage sera sous le signe du verbe éclairé.' }
];

const BOKONON_COURSES_STATS = [
  { id: 'c1', title: 'Fondamentaux du Fa', students: 540, rating: 4.8, revenue: '2.5M F' },
  { id: 'c2', title: 'Les 16 Signes Mères', students: 230, rating: 4.9, revenue: '1.1M F' },
  { id: 'c5', title: 'L\'Art du Chapelet', students: 85, rating: 5.0, revenue: '850K F' },
];

const REVENUE_TREND = [
  { month: 'Jan', val: 150000 },
  { month: 'Fév', val: 320000 },
  { month: 'Mar', val: 280000 },
  { month: 'Avr', val: 450000 },
  { month: 'Mai', val: 600000 },
  { month: 'Juin', val: 550000 },
];

interface Consultation {
    id: string;
    type: string;
    date: string;
    status: 'Terminé' | 'En attente' | 'En cours';
    result: string;
    symbol?: string;
    interpretation?: string;
    advice?: string;
    bokonon?: string;
    description?: string;
    userName?: string;
}

const MOCK_CONSULTATIONS: Consultation[] = [
    { 
        id: 'cons1', 
        type: 'Spéciale', 
        date: '20 Nov', 
        status: 'Terminé', 
        result: 'Gbe-Meji',
        symbol: 'I I\nI I\nI I\nI I',
        bokonon: 'Bokonon Amoussa',
        interpretation: "Gbe-Meji est le signe de la lumière and de la vérité. Il indique que vos projets actifs sont alignés avec votre mission de vie. La clarté vous accompagnera dans vos décisions.",
        advice: "Continuez sur votre lancée avec honnêteté. Évitez les raccourcis faciles et privilégiez la persévérance. Une offrande de remerciement aux ancêtres est recommandée."
    },
    { 
        id: 'cons2', 
        type: 'Mensuelle', 
        date: '01 Déc', 
        status: 'En attente', 
        result: '-',
        bokonon: 'En attente d\'attribution'
    },
];

type DashTab = 'overview' | 'courses' | 'consultations' | 'purchases';
type BokononTab = 'maitre-overview' | 'maitre-consults' | 'maitre-academy' | 'maitre-finances';

export const Dashboard: React.FC<DashboardProps> = ({ user, products, initialConsultationId, onNavigate, onAddToCart }) => {
    const [selectedConsultationId, setSelectedConsultationId] = useState<string | null>(initialConsultationId || null);
    const [activeTab, setActiveTab] = useState<DashTab>('overview');
    const [bokononTab, setBokononTab] = useState<BokononTab>('maitre-overview');
    const [showRitualBooking, setShowRitualBooking] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [selectedSignForRitual, setSelectedSignForRitual] = useState<string | null>(null);
    const [ritualInterpretation, setRitualInterpretation] = useState('');
    const [selectedProductsForReport, setSelectedProductsForReport] = useState<Product[]>([]);
    const [showProductPicker, setShowProductPicker] = useState(false);
    const [productSearch, setProductSearch] = useState('');
    const [isValidatingRitual, setIsValidatingRitual] = useState(false);
    const [ritualValidated, setRitualValidated] = useState(false);

    const handleTabClick = (tabId: DashTab) => {
        setActiveTab(tabId);
    };

    useEffect(() => {
        if (initialConsultationId) {
            setSelectedConsultationId(initialConsultationId);
            setActiveTab('consultations');
        }
    }, [initialConsultationId]);

    // Lookup harmonisé pour inclure les consultations du Bokonon dans le moteur de rendu des détails
    const selectedConsultation = useMemo(() => {
        const unified = [
            ...MOCK_CONSULTATIONS,
            ...BOKONON_CONSULTATIONS.map(c => ({
                id: c.id,
                type: c.motive,
                date: c.date,
                status: c.status as any,
                result: c.result || '-',
                userName: c.user,
                description: c.description,
                bokonon: c.status === 'Terminé' ? 'Bokonon Amoussa' : 'Moi-même (Maître)',
                symbol: c.status === 'Terminé' ? 'I I\nII II\nI I\nI I' : '', // Placeholder
                interpretation: c.interpretation || '',
                advice: 'Conseils à formuler lors du jet.'
            }))
        ];
        return unified.find(c => c.id === selectedConsultationId);
    }, [selectedConsultationId]);

    const handleBookRitual = (e: React.FormEvent) => {
        e.preventDefault();
        setBookingSuccess(true);
        setTimeout(() => {
            setBookingSuccess(false);
            setShowRitualBooking(false);
        }, 2500);
    };

    const handleBuyAllRecommended = () => {
        const recommended = (products.length > 0 ? products : MOCK_RECOMMENDED_PRODUCTS).slice(0, 3);
        if (onAddToCart) {
            recommended.forEach(p => onAddToCart(p));
            onNavigate?.('cart');
        }
    };

    const handleValidateRitual = () => {
        if (!selectedSignForRitual) return;
        setIsValidatingRitual(true);
        setTimeout(() => {
            setIsValidatingRitual(false);
            setRitualValidated(true);
            setTimeout(() => {
                setSelectedConsultationId(null);
                setRitualValidated(false);
                setSelectedSignForRitual(null);
                setRitualInterpretation('');
                setSelectedProductsForReport([]);
            }, 2500);
        }, 1500);
    };

    const toggleProductInReport = (product: Product) => {
        setSelectedProductsForReport(prev => 
            prev.find(p => p.id === product.id) 
                ? prev.filter(p => p.id !== product.id)
                : [...prev, product]
        );
    };

    // --- RITUAL CATALOG FULL PAGE VIEW ---
    if (showProductPicker) {
        return (
            <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn pb-20">
                <button 
                    onClick={() => setShowProductPicker(false)} 
                    className="flex items-center gap-2 text-brand-600 font-bold hover:underline group mb-4"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Retour au rapport
                </button>

                <div className="bg-white rounded-[3rem] shadow-2xl border border-brand-50 overflow-hidden relative animate-slideUp flex flex-col min-h-[80vh]">
                    <div className="p-8 md:p-14 bg-brand-900 text-white flex justify-between items-center shrink-0 border-b border-white/5">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <ShoppingBag size={24} className="text-brand-400" />
                                <h3 className="text-2xl md:text-5xl font-serif font-black uppercase tracking-tighter">Catalogue Rituel</h3>
                            </div>
                            <p className="text-brand-300 text-[10px] md:text-sm font-black uppercase tracking-[0.3em]">Sélectionnez les articles du rapport spirituel</p>
                        </div>
                        <button 
                            onClick={() => setShowProductPicker(false)} 
                            className="p-4 md:p-6 bg-white/10 rounded-full hover:bg-white/20 transition-all hover:rotate-90 duration-300 shadow-xl"
                        >
                            <X size={28} />
                        </button>
                    </div>
                    
                    <div className="p-6 md:p-10 bg-stone-50 border-b border-stone-100 shrink-0">
                        <div className="relative max-w-3xl mx-auto">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-400" size={24} />
                            <input 
                                type="text" 
                                placeholder="Chercher un produit, un végétal ou un animal sacré..." 
                                value={productSearch}
                                onChange={(e) => setProductSearch(e.target.value)}
                                className="w-full pl-16 pr-8 py-5 md:py-6 bg-white border-2 border-stone-200 rounded-[2rem] md:rounded-[3rem] outline-none focus:ring-8 focus:ring-brand-500/5 focus:border-brand-500 transition-all text-base md:text-xl font-medium shadow-inner"
                            />
                        </div>
                    </div>

                    <div className="flex-grow p-6 md:p-12 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                            {(products.length > 0 ? products : MOCK_RECOMMENDED_PRODUCTS)
                                .filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()))
                                .map(p => {
                                    const isSelected = selectedProductsForReport.some(item => item.id === p.id);
                                    return (
                                        <div 
                                            key={p.id} 
                                            onClick={() => toggleProductInReport(p)}
                                            className={`p-6 rounded-[2.5rem] md:rounded-[3.5rem] border-2 transition-all cursor-pointer group flex flex-col h-full ${isSelected ? 'bg-brand-50 border-brand-500 shadow-2xl scale-[1.02] ring-8 ring-brand-500/5' : 'bg-white border-stone-100 hover:border-brand-200 hover:shadow-xl'}`}
                                        >
                                            <div className="aspect-square rounded-[2rem] md:rounded-[2.8rem] overflow-hidden mb-6 relative shadow-inner bg-stone-50">
                                                <img src={p.image} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" alt="" />
                                                {isSelected && (
                                                    <div className="absolute inset-0 bg-brand-900/60 backdrop-blur-[2px] flex flex-col items-center justify-center animate-fadeIn">
                                                        <CheckCircle size={64} className="text-white drop-shadow-2xl" strokeWidth={1.5} />
                                                        <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] mt-3">SÉLECTIONNÉ</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="px-2 space-y-2 mb-6">
                                                <h5 className="font-serif font-black text-brand-900 text-lg md:text-2xl tracking-tight leading-tight line-clamp-1">{p.name}</h5>
                                                <p className="text-[10px] md:text-xs text-stone-400 font-black uppercase tracking-[0.2em]">{p.category}</p>
                                            </div>
                                            <div className="mt-auto pt-5 flex justify-between items-center border-t border-stone-100">
                                                <span className="font-serif font-black text-brand-600 text-lg md:text-2xl">{p.price.toLocaleString()} F</span>
                                                <button 
                                                    className={`px-5 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl text-[9px] md:text-[11px] font-black uppercase tracking-widest transition-all ${isSelected ? 'bg-brand-900 text-white shadow-lg' : 'bg-stone-50 text-stone-400 group-hover:bg-brand-500 group-hover:text-white group-hover:shadow-xl'}`}
                                                >
                                                    {isSelected ? 'AJOUTÉ' : 'CHOISIR'}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>

                    <div className="p-8 md:p-14 bg-stone-50 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center gap-6 shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-[1.5rem] bg-brand-900 flex items-center justify-center text-white shadow-xl">
                                <span className="text-xl md:text-3xl font-serif font-black">{selectedProductsForReport.length}</span>
                            </div>
                            <div className="text-left">
                                <p className="text-xs md:text-lg font-serif font-black text-brand-900 uppercase">Articles dans le rapport</p>
                                <p className="text-[10px] md:text-xs font-black text-brand-500 uppercase tracking-widest">Prêts pour validation spirituelle</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setShowProductPicker(false)}
                            className="w-full md:w-auto bg-brand-900 text-white px-12 md:px-20 py-5 md:py-7 rounded-2xl md:rounded-[2.5rem] font-black uppercase tracking-[0.25em] text-[11px] md:sm shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:bg-black transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-4"
                        >
                            CONFIRMER LA SÉLECTION <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- BOKONON VIEW ---
    if (user.role === 'bokonon' && !selectedConsultationId) {
      return (
        <div className="max-w-[1400px] mx-auto space-y-10 pb-20 animate-fadeIn">
          {/* Header Prestigieux Bokonon */}
          <div className="relative bg-[#2e1a0f] rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-12 overflow-hidden shadow-2xl border border-stone-800">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                
                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 md:gap-10">
                    <div className="relative">
                        <div className="w-24 h-24 md:w-40 md:h-40 rounded-full border-4 md:border-8 border-brand-50 overflow-hidden shadow-2xl">
                            <img src="https://i.pravatar.cc/150?u=amoussa" className="w-full h-full object-cover" alt="Bokonon" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 bg-brand-500 text-brand-900 w-8 h-8 md:w-12 md:h-12 rounded-full border-2 md:border-4 border-stone-900 flex items-center justify-center shadow-lg">
                            <Award size={14} className="md:w-5 md:h-5" fill="currentColor" />
                        </div>
                    </div>
                    
                    <div className="flex-grow text-center lg:text-left space-y-3 md:space-y-4">
                        <div className="space-y-1">
                            <h2 className="text-3xl md:text-5xl font-serif font-black text-white uppercase tracking-tighter">{user.name}</h2>
                            <p className="text-brand-400 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs">Maître du Fa — Temple de la Sagesse</p>
                        </div>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-2 md:gap-3">
                            {user.badges.map(badge => (
                                <span key={badge} className="px-3 py-1.5 md:px-4 md:py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest text-brand-200 flex items-center gap-1.5 md:gap-2">
                                    <Sparkles size={12} className="text-brand-500 md:w-3.5 md:h-3.5" /> {badge}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="bg-white/5 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-white/10 text-center min-w-full md:min-w-[180px] shadow-2xl">
                          <div className="space-y-1">
                              <span className="block text-3xl md:text-4xl font-serif font-black text-brand-500">22</span>
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Consultations</span>
                          </div>
                      </div>
                      <div className="bg-brand-500 p-6 md:p-8 rounded-[2rem] border border-brand-400 text-center min-w-full md:min-w-[180px] shadow-2xl">
                          <div className="space-y-1">
                              <span className="block text-3xl md:text-4xl font-serif font-black text-brand-900">4.9</span>
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-900/50">Note Maître</span>
                          </div>
                      </div>
                    </div>
                </div>
          </div>

          {/* Navigation Bokonon Tabs */}
          <div className="sticky top-20 z-40 py-2 -mx-4 px-4 bg-stone-50/80 backdrop-blur-md">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-start md:justify-center p-1.5 bg-stone-100/50 rounded-full border border-stone-200/40 overflow-x-auto no-scrollbar gap-1 md:gap-2 snap-x snap-mandatory shadow-sm">
                        {[
                          {id: 'maitre-overview', label: 'Maître', icon: LayoutDashboard},
                          {id: 'maitre-consults', label: 'Consultations', icon: Sparkles},
                          {id: 'maitre-academy', label: 'Académie', icon: GraduationCap},
                          {id: 'maitre-finances', label: 'Trésorerie', icon: DollarSign},
                        ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setBokononTab(tab.id as BokononTab)} 
                            className={`
                                flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3.5 md:py-4 rounded-full transition-all duration-300 whitespace-nowrap snap-center shrink-0
                                ${bokononTab === tab.id 
                                    ? 'bg-brand-900 text-white shadow-lg shadow-brand-900/20' 
                                    : 'text-stone-500 hover:text-brand-900 active:scale-95'
                                }
                            `}
                        >
                            <tab.icon size={14} className={`${bokononTab === tab.id ? 'text-brand-400' : 'text-stone-400'}`} />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{tab.label}</span>
                        </button>
                        ))}
                    </div>
                </div>
          </div>

          {/* Contenu Bokonon */}
          <div className="animate-slideUp space-y-10">
            {bokononTab === 'maitre-overview' && (
              <div className="space-y-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'En attente', value: '8', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                        { label: 'Inscriptions', value: '855', icon: UserPlus, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Revenu Mensuel', value: '450K F', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
                        { label: 'Avis récents', value: '+12', icon: Star, color: 'text-purple-600', bg: 'bg-purple-50' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-brand-50 flex items-center justify-between group hover:shadow-xl transition-all">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">{stat.label}</p>
                                <p className="text-2xl md:text-3xl font-serif font-black text-brand-900">{stat.value}</p>
                            </div>
                            <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl group-hover:scale-110 transition-transform shadow-inner`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8 bg-white p-8 md:p-12 rounded-[3rem] border border-brand-50 shadow-sm space-y-8">
                      <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-serif font-black text-brand-900 uppercase">Flux de Trésorerie</h3>
                        <span className="text-[10px] font-black uppercase tracking-widest text-stone-300">Derniers 6 mois</span>
                      </div>
                      <div className="h-80 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={REVENUE_TREND}>
                                  <defs>
                                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="#d1984b" stopOpacity={0.4}/>
                                          <stop offset="95%" stopColor="#d1984b" stopOpacity={0}/>
                                      </linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeights: 'bold'}} dy={10} />
                                  <YAxis hide />
                                  <Tooltip />
                                  <Area type="monotone" dataKey="val" stroke="#d1984b" strokeWidth={5} fillOpacity={1} fill="url(#colorRevenue)" />
                              </AreaChart>
                          </ResponsiveContainer>
                      </div>
                  </div>

                  <div className="lg:col-span-4 bg-[#2e1a0f] p-8 md:p-10 rounded-[3rem] text-white space-y-8 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl"></div>
                      <h3 className="text-xl font-serif font-black uppercase text-brand-400">Actions Rapides</h3>
                      <div className="space-y-4">
                          <button className="w-full flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-left group">
                              <div className="flex items-center gap-4">
                                <div className="p-3 bg-brand-500 text-brand-900 rounded-xl"><Plus size={20}/></div>
                                <span className="text-sm font-black uppercase tracking-widest">Créer un cours</span>
                              </div>
                              <ChevronRight size={18} className="text-brand-500 group-hover:translate-x-1 transition-transform" />
                          </button>
                          <button className="w-full flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-left group">
                              <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-500 text-white rounded-xl"><MessageSquare size={20}/></div>
                                <span className="text-sm font-black uppercase tracking-widest">Jet du Jour</span>
                              </div>
                              <ChevronRight size={18} className="text-brand-500 group-hover:translate-x-1 transition-transform" />
                          </button>
                          <button className="w-full flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-left group">
                              <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500 text-white rounded-xl"><Settings size={20}/></div>
                                <span className="text-sm font-black uppercase tracking-widest">Profil Maître</span>
                              </div>
                              <ChevronRight size={18} className="text-brand-500 group-hover:translate-x-1 transition-transform" />
                          </button>
                      </div>
                  </div>
                </div>
              </div>
            )}

            {bokononTab === 'maitre-consults' && (
              <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-brand-50 shadow-sm space-y-10">
                  <div className="flex justify-between items-center">
                      <h3 className="text-3xl font-serif font-black text-brand-900 uppercase">Consultations Reçues</h3>
                      <div className="flex gap-2">
                          <button className="px-5 py-2 bg-brand-50 text-brand-900 rounded-full text-[10px] font-black uppercase tracking-widest border border-brand-100">Toutes</button>
                          <button className="px-5 py-2 bg-amber-50 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100">Urgentes</button>
                      </div>
                  </div>

                  <div className="space-y-6">
                      {BOKONON_CONSULTATIONS.map(c => (
                        <div key={c.id} onClick={() => setSelectedConsultationId(c.id)} className="group cursor-pointer p-8 bg-stone-50 rounded-[2.5rem] border border-stone-100 hover:bg-white hover:shadow-2xl hover:border-brand-100 transition-all duration-500 flex flex-col md:flex-row justify-between gap-8">
                            <div className="space-y-4 flex-grow">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-600 shadow-inner font-black">{c.user.charAt(0)}</div>
                                    <div>
                                        <h4 className="font-serif font-black text-brand-900 text-xl">{c.user}</h4>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">{c.date} • ID: {c.id}</p>
                                    </div>
                                    <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                        c.status === 'Terminé' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse'
                                    }`}>
                                        {c.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="bg-brand-900 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">{c.motive}</span>
                                    <p className="text-stone-500 italic text-sm">"{c.description}"</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {c.status === 'Terminé' ? (
                                  <button className="px-8 py-4 bg-stone-100 text-stone-400 rounded-2xl font-black uppercase tracking-widest text-[10px] cursor-default">Rapport clos</button>
                                ) : (
                                  <button onClick={(e) => { e.stopPropagation(); setSelectedConsultationId(c.id); }} className="px-8 py-4 bg-brand-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-black transition-all flex items-center gap-3 group/btn">
                                    Effectuer le jet <Sparkles size={16} className="group-hover/btn:rotate-12 transition-transform" />
                                  </button>
                                )}
                                <button className="p-4 bg-white border border-stone-100 rounded-2xl text-stone-300 hover:text-brand-600 transition-colors shadow-sm"><MoreHorizontal size={20}/></button>
                            </div>
                        </div>
                      ))}
                  </div>
              </div>
            )}

            {bokononTab === 'maitre-academy' && (
              <div className="space-y-10">
                <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-brand-50 shadow-sm space-y-10">
                    <div className="flex justify-between items-center">
                        <h3 className="text-3xl font-serif font-black text-brand-900 uppercase">Mes Formations</h3>
                        <button className="bg-brand-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-black transition-all flex items-center gap-3">
                          <PlusCircle size={18}/> NOUVELLE FORMATION
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {BOKONON_COURSES_STATS.map(course => (
                          <div key={course.id} className="bg-stone-50 rounded-[2.5rem] p-8 border border-stone-100 space-y-6 group hover:bg-white hover:shadow-2xl transition-all">
                              <div className="flex justify-between items-start">
                                  <div className="p-4 bg-brand-900 text-white rounded-2xl shadow-lg"><BookOpen size={24}/></div>
                                  <div className="text-right">
                                      <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Total Revenus</p>
                                      <p className="text-xl font-serif font-black text-brand-600">{course.revenue}</p>
                                  </div>
                              </div>
                              <h4 className="text-xl font-serif font-black text-brand-900 leading-tight group-hover:text-brand-600 transition-colors">{course.title}</h4>
                              <div className="grid grid-cols-2 gap-4 border-t border-stone-200/50 pt-6">
                                  <div>
                                      <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Étudiants</p>
                                      <p className="font-black text-brand-900">{course.students}</p>
                                  </div>
                                  <div>
                                      <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Évaluation</p>
                                      <div className="flex items-center gap-1 font-black text-amber-500">
                                        <Star size={14} fill="currentColor"/> {course.rating}
                                      </div>
                                  </div>
                              </div>
                              <button className="w-full py-4 bg-white border-2 border-stone-100 rounded-2xl text-[9px] font-black uppercase tracking-widest text-stone-400 hover:border-brand-500 hover:text-brand-900 transition-all">Éditer le contenu</button>
                          </div>
                        ))}
                    </div>
                </div>
              </div>
            )}

            {bokononTab === 'maitre-finances' && (
              <div className="space-y-8">
                 <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-brand-50 shadow-sm space-y-10">
                    <div className="text-center space-y-2">
                        <h3 className="text-3xl font-serif font-black text-brand-900 uppercase">Bilan de la Trésorerie</h3>
                        <p className="text-stone-400 text-xs font-black uppercase tracking-[0.2em]">Votre contribution à l'équilibre du monde</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-brand-50 p-8 rounded-[2.5rem] text-center space-y-2 border border-brand-100 shadow-inner">
                            <span className="text-[9px] font-black uppercase tracking-widest text-brand-500">Solde Disponible</span>
                            <p className="text-4xl font-serif font-black text-brand-900">4.2M F</p>
                            <button className="text-[10px] font-black text-brand-600 uppercase tracking-widest pt-2 hover:underline">Virer sur mon compte</button>
                        </div>
                        <div className="bg-stone-50 p-8 rounded-[2.5rem] text-center space-y-2 border border-stone-100">
                            <span className="text-[9px] font-black uppercase tracking-widest text-stone-400">Total Consultations</span>
                            <p className="text-4xl font-serif font-black text-stone-800">1.8M F</p>
                        </div>
                        <div className="bg-stone-50 p-8 rounded-[2.5rem] text-center space-y-2 border border-stone-100">
                            <span className="text-[9px] font-black uppercase tracking-widest text-stone-400">Total Académie</span>
                            <p className="text-4xl font-serif font-black text-stone-800">5.4M F</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-stone-100">
                                <tr>
                                    <th className="py-5 px-6 text-[10px] font-black uppercase tracking-widest text-stone-400">Opération</th>
                                    <th className="py-5 px-6 text-[10px] font-black uppercase tracking-widest text-stone-400">Source</th>
                                    <th className="py-5 px-6 text-[10px] font-black uppercase tracking-widest text-stone-400">Date</th>
                                    <th className="py-5 px-6 text-[10px] font-black uppercase tracking-widest text-stone-400 text-right">Montant</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-50">
                                {[
                                  { op: 'Encaissement', src: 'Formation Fa', date: 'Aujourd\'hui', val: '+12.000 F' },
                                  { op: 'Encaissement', src: 'Consultation Travail', date: 'Aujourd\'hui', val: '+5.000 F' },
                                  { op: 'Retrait', src: 'Compte Bancaire', date: 'Hier', val: '-250.000 F' },
                                ].map((row, i) => (
                                  <tr key={i} className="hover:bg-stone-50 transition-colors">
                                      <td className="py-5 px-6 font-black text-sm text-stone-800">{row.op}</td>
                                      <td className="py-5 px-6 text-xs text-stone-400 font-bold uppercase tracking-widest">{row.src}</td>
                                      <td className="py-5 px-6 text-xs text-stone-400">{row.date}</td>
                                      <td className={`py-5 px-6 text-right font-black ${row.val.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>{row.val}</td>
                                  </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (user.role === 'admin') {
        return (
            <div className="space-y-8 animate-fadeIn">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-serif font-bold text-brand-900 uppercase tracking-tight">Espace Administrateur</h2>
                    <div className="px-4 py-2 bg-brand-100 text-brand-700 rounded-full text-xs font-black uppercase tracking-widest border border-brand-200">
                        Accès Superviseur
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Revenu Total', value: '1.2M F', icon: DollarSign, color: 'text-brand-600', bg: 'bg-brand-50' },
                        { label: 'Inscriptions', value: '458', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Cours Actifs', value: '22', icon: BookOpen, color: 'text-green-600', bg: 'bg-green-50' },
                        { label: 'Commandes', value: '89', icon: Package, color: 'text-amber-600', bg: 'bg-amber-50' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-brand-50 flex items-center gap-6 group hover:shadow-xl transition-all">
                            <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl group-hover:scale-110 transition-transform shadow-inner`}>
                                <stat.icon size={28} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">{stat.label}</p>
                                <p className="text-2xl font-serif font-black text-brand-900">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-brand-50">
                        <h3 className="text-xl font-serif font-bold text-brand-900 mb-8">Performance des Ventes</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[
                                    { name: 'Livres', v: 400 },
                                    { name: 'Accessoires', v: 300 },
                                    { name: 'Rituels', v: 500 },
                                ]}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                    <Bar dataKey="v" fill="#d1984b" radius={[10, 10, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (showRitualBooking && selectedConsultation) {
        return (
            <div className="max-w-4xl mx-auto space-y-8 animate-slideUp">
                <button 
                    onClick={() => setShowRitualBooking(false)} 
                    className="flex items-center gap-2 text-brand-600 font-bold hover:underline group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Retour au rapport
                </button>

                <div className="bg-white rounded-[3rem] shadow-2xl border border-brand-50 overflow-hidden">
                    <div className="bg-brand-900 p-10 text-white text-center space-y-4">
                        <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto border border-white/20">
                            <pre className="font-mono text-2xl font-black text-brand-400">{selectedConsultation.symbol}</pre>
                        </div>
                        <div>
                            <h2 className="text-3xl font-serif font-bold uppercase">Rituels & Sacrifices</h2>
                            <p className="text-brand-300 text-xs font-black uppercase tracking-widest mt-1">Pour le signe : {selectedConsultation.result}</p>
                        </div>
                    </div>

                    <div className="p-8 md:p-16">
                        {bookingSuccess ? (
                            <div className="text-center py-12 space-y-6 animate-fadeIn">
                                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto border-4 border-green-200 text-green-600">
                                    <Check size={48} strokeWidth={3} />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-2xl font-serif font-bold text-brand-900">Demande enregistrée</h3>
                                    <p className="text-stone-500 max-sm mx-auto">Un Bokonon vous contactera sous peu pour finaliser les détails de votre rituel.</p>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleBookRitual} className="space-y-10">
                                <div className="space-y-6">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
                                        <List size={18} className="text-brand-500" /> 1. Choisissez le type d'acte
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { id: 'r1', label: 'Rituel d\'apaisement', desc: 'Pour lever les blocages' },
                                            { id: 'r2', label: 'Sacrifice de remerciement', desc: 'Pour honorer les ancêtres' },
                                            { id: 'r3', label: 'Protection du foyer', desc: 'Bénédiction de la demeure' },
                                            { id: 'r4', label: 'Ouverture des chemins', desc: 'Pour les nouveaux projets' }
                                        ].map(rit => (
                                            <label key={rit.id} className="relative flex flex-col p-6 rounded-3xl border-2 border-stone-100 hover:border-brand-300 transition-all cursor-pointer bg-stone-50 group">
                                                <input type="radio" name="ritual_type" className="absolute top-4 right-4 accent-brand-600" required />
                                                <span className="font-bold text-brand-900">{rit.label}</span>
                                                <span className="text-[10px] text-stone-400 font-bold uppercase mt-1">{rit.desc}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
                                        <Calendar size={18} className="text-brand-500" /> 2. Détails du rendez-vous
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-stone-400 ml-4">Date souhaitée</label>
                                            <input required type="date" className="w-full p-5 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-stone-400 ml-4">Lieu de résidence / Région</label>
                                            <div className="relative">
                                                <MapPin size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300" />
                                                <input required type="text" placeholder="Ex: Cotonou, Calavi..." className="w-full pl-14 pr-5 py-5 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    className="w-full bg-brand-900 text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl flex items-center justify-center gap-4 hover:bg-black transition-all"
                                >
                                    VALIDER LE RENDEZ-VOUS <Send size={18} />
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (selectedConsultation) {
        return (
            <div className="max-w-4xl mx-auto space-y-8 animate-slideUp">
                <button 
                    onClick={() => { setSelectedConsultationId(null); setSelectedSignForRitual(null); }} 
                    className="flex items-center gap-2 text-brand-600 font-black uppercase text-[10px] tracking-[0.2em] hover:underline group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Retour au tableau de bord
                </button>

                <div className="bg-white rounded-[3rem] shadow-2xl border border-brand-50 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <ScrollText size={120} />
                    </div>
                    
                    <div className="bg-brand-900 p-8 md:p-12 text-white flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="space-y-2 text-center md:text-left">
                            <h2 className="text-3xl font-serif font-bold uppercase tracking-tight">Rapport de Consultation</h2>
                            <p className="text-brand-300 text-xs font-black uppercase tracking-widest">Référence : {selectedConsultation.id}</p>
                        </div>
                        <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border-2 ${selectedConsultation.status === 'Terminé' ? 'bg-green-500/20 border-green-500 text-green-300' : 'bg-amber-500/20 border-amber-500 text-amber-300 animate-pulse'}`}>
                            {selectedConsultation.status}
                        </div>
                    </div>

                    <div className="p-8 md:p-16 space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left border-b border-stone-100 pb-12">
                            <div className="space-y-1">
                                <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Initié / Demandeur</span>
                                <p className="font-bold text-brand-900">{selectedConsultation.userName || user.name}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Type de consultation</span>
                                <p className="font-bold text-brand-900">{selectedConsultation.type}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Bokonon Référent</span>
                                <p className="font-bold text-brand-900">{selectedConsultation.bokonon}</p>
                            </div>
                        </div>

                        {selectedConsultation.description && (
                            <section className="bg-stone-50 p-8 rounded-[2.5rem] border border-stone-100 space-y-4">
                                <h4 className="flex items-center gap-3 text-brand-900 font-serif font-bold text-xl uppercase tracking-tight">
                                    <MessageSquare className="text-brand-600" /> Détails de la requête
                                </h4>
                                <p className="text-stone-600 leading-relaxed italic">"{selectedConsultation.description}"</p>
                            </section>
                        )}

                        {selectedConsultation.status === 'Terminé' ? (
                            <div className="space-y-12 animate-fadeIn">
                                <div className="flex flex-col items-center gap-6">
                                    <div className="bg-brand-50 w-48 h-48 rounded-[3rem] flex items-center justify-center shadow-inner border border-brand-100">
                                        <pre className="font-mono text-5xl font-black text-brand-900 leading-none">{selectedConsultation.symbol}</pre>
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-4xl font-serif font-black text-brand-900 uppercase">{selectedConsultation.result}</h3>
                                        <p className="text-brand-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-1">Signe révélé par l'Agumaga</p>
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    <section className="bg-stone-50 p-8 rounded-[2.5rem] border border-stone-100 space-y-4">
                                        <h4 className="flex items-center gap-3 text-brand-900 font-serif font-bold text-xl">
                                            <Compass className="text-brand-600" /> Interprétation du Signe
                                        </h4>
                                        <p className="text-stone-600 leading-relaxed italic">"{selectedConsultation.interpretation}"</p>
                                    </section>

                                    <section className="bg-brand-50 p-8 rounded-[2.5rem] border border-brand-100 space-y-4">
                                        <h4 className="flex items-center gap-3 text-brand-900 font-serif font-bold text-xl">
                                            <UserCheck className="text-brand-600" /> Conseils du Sage
                                        </h4>
                                        <p className="text-stone-700 leading-relaxed font-medium">{selectedConsultation.advice}</p>
                                    </section>

                                    {/* SECTION PRESCRIPTION BOKONON */}
                                    <section className="bg-[#2e1a0f] p-8 md:p-12 rounded-[3rem] text-white space-y-10 shadow-2xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl"></div>
                                        <div className="relative z-10">
                                            <h4 className="flex items-center gap-3 text-brand-400 font-serif font-bold text-2xl uppercase tracking-tight mb-8">
                                                <ScrollText className="text-brand-500" /> Prescription Spirituelle
                                            </h4>
                                            
                                            {/* Sacrifices Prescrits */}
                                            <div className="space-y-6 mb-12">
                                                <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                                                    <Flame size={16} className="text-brand-500" />
                                                    <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-300">Sacrifices & Offrandes (Ébo)</h5>
                                                </div>
                                                <div className="space-y-4">
                                                    {[
                                                        "Offrande de 2 coqs blancs au carrefour à l'aube.",
                                                        "Libation de miel et d'eau pure devant le seuil de la maison.",
                                                        "Distribution de gâteaux de haricots (Akara) à sept enfants du voisinage."
                                                    ].map((s, i) => (
                                                        <div key={i} className="flex items-start gap-4 group">
                                                            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-400 shrink-0 mt-0.5 shadow-lg group-hover:bg-brand-500/20 transition-all">
                                                                <span className="font-serif font-black text-xs">{i + 1}</span>
                                                            </div>
                                                            <p className="text-brand-100 font-medium italic text-sm md:text-base leading-relaxed">"{s}"</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Produits recommandés par le sage */}
                                            {user.role !== 'bokonon' && (
                                                <div className="space-y-6">
                                                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                                        <div className="flex items-center gap-3">
                                                            <ShoppingBag size={16} className="text-brand-500" />
                                                            <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-300">Articles requis pour les rites</h5>
                                                        </div>
                                                        <button 
                                                            onClick={handleBuyAllRecommended}
                                                            className="bg-brand-500 text-brand-900 px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg flex items-center gap-2"
                                                        >
                                                            <Zap size={10} fill="currentColor" /> Tout commander
                                                        </button>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {(products.length > 0 ? products : MOCK_RECOMMENDED_PRODUCTS).slice(0, 2).map(p => (
                                                            <div 
                                                                key={p.id} 
                                                                className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4 group hover:bg-white/10 transition-all cursor-default"
                                                            >
                                                                <div className="w-16 h-16 rounded-xl overflow-hidden shadow-inner shrink-0">
                                                                    <img src={p.image} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all" alt="" />
                                                                </div>
                                                                <div className="flex-grow">
                                                                    <p className="text-sm font-bold text-white leading-tight">{p.name}</p>
                                                                    <p className="text-brand-400 font-black text-xs mt-1">{p.price.toLocaleString()} F</p>
                                                                </div>
                                                                <button 
                                                                    onClick={() => onAddToCart?.(p)}
                                                                    className="p-3 bg-brand-500 text-brand-900 rounded-xl hover:bg-white transition-all shadow-lg"
                                                                    title="Ajouter au panier"
                                                                >
                                                                    <ShoppingCart size={18} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </section>

                                    <div className="pt-8">
                                        <button 
                                            onClick={() => setShowRitualBooking(true)}
                                            className="w-full py-6 bg-brand-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-4 group"
                                        >
                                            Effectuer rituel ou sacrifice <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                                        </button>
                                        <p className="text-center text-[9px] font-bold text-stone-400 uppercase tracking-widest mt-4">Le respect de la prescription garantit l'efficacité du travail spirituel</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-12 animate-fadeIn">
                                {ritualValidated ? (
                                    <div className="text-center py-20 space-y-6 animate-slideUp">
                                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-xl text-green-600">
                                            <CheckCircle size={48} />
                                        </div>
                                        <div className="space-y-3">
                                            <h3 className="text-3xl font-serif font-black text-brand-900 uppercase tracking-tight">RAPPORT TRANSMIS</h3>
                                            <p className="text-stone-500 max-w-sm mx-auto italic font-medium">"Le jet sacré a été enregistré et notifié à l'initié. Que la sagesse l'accompagne."</p>
                                        </div>
                                    </div>
                                ) : user.role === 'bokonon' ? (
                                    <div className="space-y-12">
                                        <div className="text-center space-y-2">
                                            <h3 className="text-3xl font-serif font-black text-brand-900 uppercase">Validation Rituelle</h3>
                                            <p className="text-stone-400 text-sm font-black uppercase tracking-widest italic">Sélectionnez le signe révélé par votre chapelet au couvent</p>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {MEJI_SIGNS.map((sign) => (
                                                <button 
                                                    key={sign.name}
                                                    onClick={() => setSelectedSignForRitual(sign.name)}
                                                    className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 group ${
                                                        selectedSignForRitual === sign.name 
                                                            ? 'bg-brand-900 border-brand-900 text-white shadow-xl scale-105 z-10' 
                                                            : 'bg-stone-50 border-stone-100 hover:border-brand-300'
                                                    }`}
                                                >
                                                    <pre className={`font-mono text-xs md:text-sm font-black leading-none ${selectedSignForRitual === sign.name ? 'text-brand-300' : 'text-brand-900 opacity-60'}`}>{sign.symbol}</pre>
                                                    <span className={`text-[9px] font-black uppercase tracking-widest ${selectedSignForRitual === sign.name ? 'text-white' : 'text-stone-600'}`}>{sign.name}</span>
                                                </button>
                                            ))}
                                        </div>

                                        {selectedSignForRitual && (
                                            <div className="space-y-10 animate-slideUp">
                                                <div className="space-y-4">
                                                    <label className="flex items-center gap-3 text-brand-900 font-serif font-bold text-xl uppercase tracking-tight">
                                                        <ScrollText className="text-brand-600" /> Révélations Divines
                                                    </label>
                                                    <textarea 
                                                        value={ritualInterpretation}
                                                        onChange={(e) => setRitualInterpretation(e.target.value)}
                                                        placeholder="Saisissez ici les messages de l'oracle, les opportunités et les dangers révélés par le Fa..." 
                                                        className="w-full p-8 bg-stone-50 border-2 border-stone-100 rounded-[2.5rem] outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-medium text-lg min-h-[250px] shadow-inner"
                                                    ></textarea>
                                                </div>

                                                <div className="space-y-6">
                                                    <div className="flex justify-between items-center">
                                                        <h4 className="flex items-center gap-3 text-brand-900 font-serif font-bold text-xl uppercase tracking-tight">
                                                            <Tag className="text-brand-600" /> Produits & Rituels Préconisés
                                                        </h4>
                                                        <button 
                                                            onClick={() => setShowProductPicker(true)}
                                                            className="bg-brand-100 text-brand-900 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-500 hover:text-white transition-all shadow-sm flex items-center gap-2"
                                                        >
                                                            <PlusCircle size={16} /> RECOMMANDATIONS
                                                        </button>
                                                    </div>

                                                    {selectedProductsForReport.length > 0 ? (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {selectedProductsForReport.map(p => (
                                                                <div key={p.id} className="flex items-center justify-between p-4 bg-brand-50 rounded-2xl border border-brand-100">
                                                                    <div className="flex items-center gap-4">
                                                                        <img src={p.image} className="w-12 h-12 rounded-xl object-cover" alt="" />
                                                                        <span className="font-bold text-brand-900 text-sm">{p.name}</span>
                                                                    </div>
                                                                    <button onClick={() => toggleProductInReport(p)} className="text-red-400 hover:text-red-600"><Trash2 size={18}/></button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="p-8 border-2 border-dashed border-stone-200 rounded-[2rem] text-center">
                                                            <p className="text-stone-400 text-sm italic">Aucun produit recommandé pour le moment.</p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="pt-10 flex flex-col items-center gap-6">
                                                    <button 
                                                        disabled={!ritualInterpretation.trim() || isValidatingRitual}
                                                        onClick={handleValidateRitual}
                                                        className="bg-brand-900 text-white px-16 py-7 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl hover:bg-black transition-all flex items-center gap-4 disabled:opacity-30 disabled:hover:bg-brand-900 group"
                                                    >
                                                        {isValidatingRitual ? (
                                                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                                        ) : (
                                                            <>VALIDER LE JET SACRÉ <Sparkles size={20} className="group-hover:rotate-12 transition-transform" /></>
                                                        )}
                                                    </button>
                                                    <button 
                                                        onClick={() => onNavigate?.('store')}
                                                        className="text-[10px] font-black text-brand-500 uppercase tracking-widest hover:underline"
                                                    >
                                                        VOIR LA BOUTIQUE COMPLÈTE
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-12">
                                        <div className="flex flex-col items-center gap-6">
                                            <div className="bg-stone-50 w-48 h-48 rounded-[3rem] flex items-center justify-center shadow-inner border border-stone-200">
                                                <div className="text-center space-y-2">
                                                    <Clock size={32} className="text-amber-500 animate-spin mx-auto" />
                                                    <span className="block text-xs font-black uppercase tracking-[0.2em] text-stone-400">En attente</span>
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <h3 className="text-4xl font-serif font-black text-stone-300 uppercase">EN ATTENTE</h3>
                                                <p className="text-brand-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-1">Phase d'interrogation de l'Agumaga</p>
                                            </div>
                                        </div>

                                        <div className="text-center py-10 space-y-6">
                                            <div className="space-y-2">
                                                <h3 className="text-2xl font-serif font-bold text-brand-900">Consultation en cours...</h3>
                                                <p className="text-stone-500 max-sm mx-auto">Le Bokonon est actuellement en train d'interroger le Fa pour votre requête. Le résultat sera affiché ici dès qu'il sera disponible (sous 24h).</p>
                                            </div>
                                            <div className="inline-flex items-center gap-2 bg-brand-50 px-4 py-2 rounded-full text-[10px] font-black uppercase text-brand-600 tracking-widest">
                                                <Info size={14}/> Statut : Travail spirituel en cours
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        <div className="pt-8 border-t border-stone-100 text-center">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-300">Confidentialité garantie par le Couvent Connecté</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto space-y-10 pb-20 animate-fadeIn">
            <div className="relative bg-brand-900 rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-12 overflow-hidden shadow-2xl border border-brand-800">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-500/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
                
                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 md:gap-10">
                    <div className="relative">
                        <div className="w-24 h-24 md:w-40 md:h-40 rounded-full bg-brand-400 border-4 md:border-8 border-brand-800 flex items-center justify-center text-3xl md:text-5xl font-serif font-black text-brand-900 shadow-2xl">
                            {user.name.charAt(0)}
                        </div>
                        <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 bg-brand-500 text-brand-900 w-8 h-8 md:w-12 md:h-12 rounded-full border-2 md:border-4 border-brand-900 flex items-center justify-center shadow-lg">
                            <Zap size={14} className="md:w-5 md:h-5" fill="currentColor" />
                        </div>
                    </div>
                    
                    <div className="flex-grow text-center lg:text-left space-y-3 md:space-y-4">
                        <div className="space-y-1">
                            <h2 className="text-3xl md:text-5xl font-serif font-black text-white">{user.name}</h2>
                            <p className="text-brand-300 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs">Initié de Niveau {user.level} — Aspirant au Savoir</p>
                        </div>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-2 md:gap-3">
                            {user.badges.map(badge => (
                                <span key={badge} className="px-3 py-1.5 md:px-4 md:py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest text-brand-100 flex items-center gap-1.5 md:gap-2">
                                    <Award size={12} className="text-brand-400 md:w-3.5 md:h-3.5" /> {badge}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/10 text-center min-w-full md:min-w-[200px] shadow-2xl">
                        <div className="space-y-1 mb-3 md:mb-4">
                            <span className="block text-3xl md:text-4xl font-serif font-black text-brand-400">{user.xp}</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Points XP Totaux</span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden border border-white/5">
                            <div className="h-full bg-brand-500 shadow-[0_0_15px_rgba(209,152,75,0.5)] transition-all duration-1000" style={{ width: `${(user.xp / 1000) * 100}%` }}></div>
                        </div>
                        <p className="text-[8px] md:text-[9px] font-bold text-brand-300 mt-2 uppercase tracking-widest">Plus que {1000 - user.xp} XP pour le Niveau {user.level + 1}</p>
                    </div>
                </div>
            </div>

            <div className="sticky top-20 z-40 py-2 -mx-4 px-4 bg-stone-50/80 backdrop-blur-md">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center justify-start md:justify-center p-1.5 bg-stone-100/50 rounded-full border border-stone-200/40 overflow-x-auto no-scrollbar gap-1 md:gap-2 snap-x snap-mandatory shadow-sm">
                        {[
                        {id: 'overview', label: 'Résumé', icon: LayoutDashboard},
                        {id: 'courses', label: 'Formations', icon: BookOpen},
                        {id: 'consultations', label: 'Fa', icon: Sparkles},
                        {id: 'purchases', label: 'Achats', icon: CreditCard},
                        ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => handleTabClick(tab.id as DashTab)} 
                            className={`
                                flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3.5 md:py-4 rounded-full transition-all duration-300 whitespace-nowrap snap-center shrink-0
                                ${activeTab === tab.id 
                                    ? 'bg-brand-900 text-white shadow-lg shadow-brand-900/20' 
                                    : 'text-stone-500 hover:text-brand-900 active:scale-95'
                                }
                            `}
                        >
                            <tab.icon size={14} className={`${activeTab === tab.id ? 'text-brand-400' : 'text-stone-400'} transition-colors duration-300`} />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{tab.label}</span>
                        </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="animate-slideUp px-1 md:px-0">
                {activeTab === 'overview' && (
                    <div className="space-y-8 md:space-y-10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            {[
                                { label: 'Formations suivies', value: MOCK_ENROLLED_COURSES.length, icon: GraduationCap, color: 'text-brand-600', bg: 'bg-brand-50' },
                                { label: 'Quiz complétés', value: MOCK_QUIZ_DETAILED.filter(q => q.status === 'Terminé').length, icon: HelpCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
                                { label: 'Consultations Fa', value: MOCK_CONSULTATIONS.length, icon: Sparkles, color: 'text-purple-600', bg: 'bg-purple-50' },
                                { label: 'Total Achats', value: MOCK_ORDERS.length + MOCK_COURSE_PURCHASES.length, icon: ShoppingBag, color: 'text-amber-600', bg: 'bg-amber-50' },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white p-6 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-brand-50 flex items-center justify-between group hover:shadow-xl transition-all">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">{stat.label}</p>
                                        <p className="text-2xl md:text-3xl font-serif font-black text-brand-900">{stat.value}</p>
                                    </div>
                                    <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl group-hover:scale-110 transition-transform shadow-inner`}>
                                        <stat.icon size={24} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                            <div className="lg:col-span-8">
                                <div className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-sm border border-brand-50 space-y-6 md:space-y-8 h-full">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <h3 className="text-xl md:text-2xl font-serif font-bold text-brand-900">Activité Spirituelle</h3>
                                            <p className="text-stone-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">Gain d'expérience (4 dernières semaines)</p>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-2.5 py-1 rounded-full text-[10px] font-bold">
                                            <ArrowUpRight size={14} /> +12%
                                        </div>
                                    </div>
                                    <div className="h-56 md:h-80 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={PROGRESS_DATA}>
                                                <defs>
                                                    <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#d1984b" stopOpacity={0.3}/>
                                                        <stop offset="95%" stopColor="#d1984b" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeights: 'bold', fill: '#999' }} dy={10} />
                                                <YAxis hide />
                                                <Tooltip 
                                                    contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2)', padding: '15px' }}
                                                    labelStyle={{ fontWeight: 'black', textTransform: 'uppercase', fontSize: '10px', color: '#d1984b', marginBottom: '5px' }}
                                                />
                                                <Area type="monotone" dataKey="xp" stroke="#d1984b" strokeWidth={4} fillOpacity={1} fill="url(#colorXp)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-4">
                                <div className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-sm border border-brand-50 space-y-6 md:space-y-8 h-full">
                                    <h3 className="text-xl font-serif font-bold text-brand-900 text-center">Spécialisations</h3>
                                    <div className="h-56 md:h-64 flex justify-center items-center relative">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={SKILL_DISTRIBUTION}
                                                    innerRadius={60}
                                                    outerRadius={90}
                                                    paddingAngle={8}
                                                    dataKey="value"
                                                >
                                                    {SKILL_DISTRIBUTION.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none' }} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                            <span className="text-2xl md:text-3xl font-serif font-black text-brand-900">100%</span>
                                            <span className="text-[8px] font-black uppercase tracking-widest text-stone-400">Maîtrise</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        {SKILL_DISTRIBUTION.map((s, i) => (
                                            <div key={i} className="flex justify-between items-center text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                                                <div className="flex items-center gap-2.5 md:gap-3">
                                                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                                                    <span className="text-stone-500">{s.name}</span>
                                                </div>
                                                <span className="text-brand-900">{((s.value / 1000) * 100).toFixed(0)}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'courses' && (
                    <div className="space-y-10 animate-fadeIn">
                        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-sm border border-brand-50 space-y-6 md:space-y-8">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-2 md:px-4">
                                <h3 className="text-xl md:text-2xl font-serif font-bold text-brand-900 flex items-center gap-3">
                                    <BookOpen className="text-brand-300" /> Formations en cours
                                </h3>
                                <button onClick={() => onNavigate?.('learning')} className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-brand-600 hover:underline">Accéder au catalogue</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                {MOCK_ENROLLED_COURSES.map(course => (
                                    <div key={course.id} className="p-5 md:p-6 bg-stone-50 rounded-[2rem] md:rounded-[2.5rem] border border-stone-100 space-y-4 hover:bg-white hover:shadow-lg transition-all group">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <h4 className="font-serif font-bold text-brand-900 text-base md:text-lg group-hover:text-brand-600 transition-colors leading-tight">{course.title}</h4>
                                                <p className="text-[9px] md:text-[10px] font-bold text-stone-400 uppercase tracking-widest">Maître : {course.instructor}</p>
                                            </div>
                                            <span className={`px-2.5 py-0.5 md:px-3 md:py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest ${course.progress === 100 ? 'bg-green-100 text-green-700' : 'bg-brand-100 text-brand-700'}`}>
                                                {course.progress}%
                                            </span>
                                        </div>
                                        <div className="w-full h-1.5 md:h-2 bg-stone-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-brand-500 rounded-full transition-all duration-1000" style={{ width: `${course.progress}%` }}></div>
                                        </div>
                                        <div className="flex justify-between items-center text-[9px] md:text-[10px] font-bold text-stone-400 uppercase tracking-widest pt-1 md:pt-2">
                                            <span className="flex items-center gap-1.5 md:gap-2"><Clock size={12} /> {course.lastAccessed}</span>
                                            <button onClick={() => onNavigate?.('learning', course.id)} className="text-brand-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">Reprendre <ChevronRight size={12}/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'consultations' && (
                    <div className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-sm border border-brand-50 space-y-6 md:space-y-8 animate-fadeIn">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-2 md:px-4">
                            <h3 className="text-xl md:text-2xl font-serif font-bold text-brand-900 flex items-center gap-3">
                                <Sparkles className="text-brand-300" /> Historique des Consultations
                            </h3>
                            <button onClick={() => onNavigate?.('tofa')} className="w-full md:auto bg-brand-900 text-white px-6 py-3 rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-black transition-all">
                                NOUVELLE DEMANDE
                            </button>
                        </div>
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-stone-100">
                                        <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-stone-400">Type</th>
                                        <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-stone-400">Date</th>
                                        <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-stone-400">Signe révélé</th>
                                        <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-stone-400">Statut</th>
                                        <th className="py-4 px-4 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-50">
                                    {MOCK_CONSULTATIONS.map(c => (
                                        <tr key={c.id} onClick={() => setSelectedConsultationId(c.id)} className="group hover:bg-stone-50 transition-colors cursor-pointer">
                                            <td className="py-5 px-4 font-bold text-brand-900 text-sm">{c.type}</td>
                                            <td className="py-5 px-4 text-stone-500 text-sm">{c.date}</td>
                                            <td className="py-5 px-4">
                                                {c.result !== '-' ? (
                                                    <span className="bg-brand-100 text-brand-800 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{c.result}</span>
                                                ) : <span className="text-stone-300">—</span>}
                                            </td>
                                            <td className="py-5 px-4">
                                                <span className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${c.status === 'Terminé' ? 'text-green-600' : 'text-amber-500 animate-pulse'}`}>
                                                    {c.status === 'Terminé' ? <CheckCircle size={12}/> : <Clock size={12}/>}
                                                    {c.status}
                                                </span>
                                            </td>
                                            <td className="py-5 px-4 text-right">
                                                <button className="p-2 text-stone-300 hover:text-brand-600 transition-colors"><ChevronRight size={20}/></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'purchases' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 animate-fadeIn">
                        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-sm border border-brand-50 space-y-6 md:space-y-8 h-full">
                            <h3 className="text-xl md:text-2xl font-serif font-bold text-brand-900 flex items-center gap-3 px-2">
                                <ShoppingBag className="text-brand-500" /> Achats en boutique
                            </h3>
                            <div className="space-y-4">
                                {MOCK_ORDERS.map(order => (
                                    <div key={order.id} className="p-5 bg-stone-50 rounded-[2rem] border border-stone-100 group hover:shadow-md transition-all">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="space-y-0.5">
                                                <p className="text-[11px] font-black text-brand-900">{order.id}</p>
                                                <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest">{order.date}</p>
                                            </div>
                                            <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                                                order.status === 'Livré' ? 'bg-green-100 text-green-700' : 
                                                order.status === 'Expédié' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-end border-t border-stone-200/50 pt-3">
                                            <div className="flex items-center gap-2 text-stone-500">
                                                <Package size={14} />
                                                <span className="text-[10px] font-bold">{order.itemsCount} article(s)</span>
                                            </div>
                                            <p className="text-lg font-serif font-black text-brand-600">{order.total.toLocaleString()} F</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
