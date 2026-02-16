import React, { useState } from 'react';
import { 
  Sparkles, ShieldCheck, Zap, Heart, Info, Quote as QuoteIcon, 
  ArrowLeft, Calendar, Compass, Star, List, HelpCircle, 
  Clock, User as UserIcon, MessageSquare, Send, Check, 
  CreditCard, CheckCircle, ChevronRight, ShieldCheck as ShieldCheckIcon,
  ZapOff, Zap as ZapIcon, Award, Baby, Briefcase, Users, Activity, Plane, MoreHorizontal,
  PartyPopper, Infinity
} from 'lucide-react';
import { User } from '../types';

interface TofaProps {
    onBack: () => void;
    user: User;
    onNavigate: (page: any, id?: string) => void;
}

export const Tofa: React.FC<TofaProps> = ({ onBack, user, onNavigate }) => {
    const [activeTab, setActiveTab] = useState<'consultation' | 'tofa'>('consultation');
    
    // Consultation states
    const [consultReason, setConsultReason] = useState<string>('travail');
    const [consultOffer, setConsultOffer] = useState<'single' | 'pack'>('single');
    const [isSubmittingConsult, setIsSubmittingConsult] = useState(false);
    const [consultStep, setConsultStep] = useState<'form' | 'payment' | 'final'>('form');

    // Tofa Data
    const tofaData = {
        year: "2026",
        sign: "Cé-Mèji",
        alias: "Otura-Meji",
        status: "Favorable",
        symbol: "I I\nII II\nI I\nI I",
        revelation: "L'année 2026 est placée sous le signe de la Paix, de la Communication et du Verbe Éclairé. Cé-Mèji annonce une période de réconciliation nationale et de succès par le dialogue.",
        interpretation: "Cé-Mèji est le signe de l'intellect supérieur et de la diplomatie. Pour l'année à venir, le Fa indique que la force ne résoudra rien, mais que la parole juste et douce ouvrira toutes les portes. C'est une année propice aux études, aux voyages diplomatiques et à la consolidation des liens familiaux.",
        recommendations: [
            "Privilégier la médiation dans les conflits fonciers.",
            "Honorer les divinités de l'air et de la parole (Elegba).",
            "Éviter les paroles colériques ou blessantes les mercredis.",
            "Porter du blanc lors des cérémonies importantes pour attirer la pureté."
        ],
        sacrifices: "Des offrandes de miel, de colombo et de tissus blancs sont recommandées pour maintenir la clarté de la vision collective."
    };

    const handleConsultSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmittingConsult(true);
        setTimeout(() => {
            setIsSubmittingConsult(false);
            setConsultStep('payment');
        }, 1500);
    };

    const handleFinalizePayment = () => {
        setIsSubmittingConsult(true);
        setTimeout(() => {
            setIsSubmittingConsult(false);
            setConsultStep('final');
        }, 2000);
    };

    const renderConsultation = () => (
        <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn">
            {consultStep !== 'form' && (
                <button 
                    onClick={() => setConsultStep('form')} 
                    className="flex items-center gap-2 text-brand-600 font-bold hover:underline group mb-4"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Retour à la requête
                </button>
            )}

            <div className="bg-white rounded-[3rem] shadow-2xl border border-brand-50 p-8 md:p-16 space-y-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                
                <div className="text-center space-y-4 relative z-10">
                    <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mx-auto shadow-inner mb-4">
                        <Sparkles className="text-brand-600" size={40} />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-serif font-black text-brand-900 uppercase">Consultation du Fa</h2>
                    <p className="text-stone-500 text-lg max-w-xl mx-auto italic">"Ouvrez les portes de votre destinée avec l'aide des Bokonons certifiés de notre temple."</p>
                </div>

                {consultStep === 'final' ? (
                    <div className="text-center py-12 space-y-6 animate-slideUp">
                        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto border-4 border-green-200 text-green-600">
                            <Check size={48} strokeWidth={3} />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-2xl font-serif font-bold text-brand-900">Demande validée</h3>
                            <p className="text-stone-500 max-sm mx-auto">Votre requête a été transmise. Un jet sacré sera effectué pour vous sous 24H.</p>
                        </div>
                        <div className="flex flex-col gap-4 max-w-xs mx-auto pt-4">
                            <button 
                                onClick={() => onNavigate('dashboard', 'cons2')} 
                                className="bg-brand-50 text-brand-700 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] border-2 border-brand-100"
                            >
                                Statut de la consultation
                            </button>
                            <button 
                                onClick={() => setConsultStep('form')} 
                                className="bg-brand-900 text-white px-10 py-4 rounded-2xl font-bold shadow-xl uppercase tracking-widest text-[11px]"
                            >
                                Nouvelle demande
                            </button>
                        </div>
                    </div>
                ) : consultStep === 'payment' ? (
                    <div className="space-y-10 animate-fadeIn relative z-10">
                        <div className="bg-stone-50 p-6 md:p-10 rounded-[2.5rem] border border-stone-200 text-center space-y-4">
                            <h3 className="text-xl md:text-2xl font-serif font-bold text-brand-900">Requête transmise</h3>
                            <p className="text-stone-600 text-sm max-w-md mx-auto">Veuillez choisir votre offre pour valider le travail des sages.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div 
                                onClick={() => setConsultOffer('single')}
                                className={`p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all ${consultOffer === 'single' ? 'bg-brand-50 border-brand-500 shadow-xl' : 'bg-stone-50 border-stone-100'}`}
                            >
                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-500 mb-2">Paiement Unique</p>
                                <h4 className="text-2xl font-serif font-black text-brand-900">Une consultation</h4>
                                <p className="text-3xl font-serif font-black text-brand-600 my-4">5.000 FCFA</p>
                            </div>
                            <div 
                                onClick={() => setConsultOffer('pack')}
                                className={`p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all relative ${consultOffer === 'pack' ? 'bg-brand-50 border-brand-500 shadow-xl' : 'bg-stone-50 border-stone-100'}`}
                            >
                                <div className="absolute top-0 right-0 bg-brand-500 text-brand-900 px-4 py-1.5 rounded-bl-[1.5rem] text-[8px] font-black uppercase tracking-widest">Conseillé</div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-500 mb-2">Abonnement Mensuel</p>
                                <h4 className="text-2xl font-serif font-black text-brand-900">Pack Sagesse</h4>
                                <p className="text-3xl font-serif font-black text-brand-600 my-4">15.000 FCFA</p>
                            </div>
                        </div>

                        <button 
                            onClick={handleFinalizePayment}
                            disabled={isSubmittingConsult}
                            className="w-full bg-brand-900 text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl flex items-center justify-center gap-4"
                        >
                            {isSubmittingConsult ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <>FINALISER ET PAYER <CreditCard size={18} /></>}
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleConsultSubmit} className="space-y-12 relative z-10">
                        <div className="space-y-6">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-stone-400 flex items-center gap-2">
                                <UserIcon size={18} className="text-brand-500" /> 1. Informations personnelles
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input required type="text" placeholder="Prénoms et Nom" defaultValue={user.name} className="w-full p-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none" />
                                <input required type="date" defaultValue={user.birthDate} className="w-full p-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-stone-400 flex items-center gap-2">
                                <Compass size={18} className="text-brand-500" /> 2. Motif de votre consultation
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {[
                                    { id: 'mon_signe', label: 'MON SIGNE DE FA (KPOLI)', icon: Sparkles },
                                    { id: 'naissance', label: 'Naissance', icon: Baby },
                                    { id: 'travail', label: 'Travail', icon: Briefcase },
                                    { id: 'famille', label: 'Famille', icon: Users },
                                    { id: 'amour', label: 'Amour', icon: Heart },
                                    { id: 'amitie', label: 'Amitié', icon: UserIcon },
                                    { id: 'sante', label: 'Santé', icon: Activity },
                                    { id: 'protection', label: 'Protection', icon: ShieldCheckIcon },
                                    { id: 'voyage', label: 'Voyage', icon: Plane },
                                    { id: 'nouvel_an', label: 'Nouvel An', icon: PartyPopper },
                                    { id: 'mariage', label: 'Mariage', icon: Infinity },
                                    { id: 'autres', label: 'Autres', icon: MoreHorizontal }
                                ].map(motif => (
                                    <button 
                                        key={motif.id}
                                        type="button"
                                        onClick={() => setConsultReason(motif.id)}
                                        className={`flex flex-col items-center justify-center p-5 rounded-[1.8rem] border-2 transition-all gap-2 ${consultReason === motif.id ? 'bg-brand-900 border-brand-900 text-white shadow-lg' : 'bg-stone-50 border-stone-100 text-stone-500 hover:border-brand-200'}`}
                                    >
                                        <motif.icon size={20} />
                                        <span className="text-[9px] font-black uppercase tracking-widest">{motif.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6 animate-slideUp">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-stone-400 flex items-center gap-2">
                                <MessageSquare size={18} className="text-brand-500" /> 3. Votre situation
                            </h3>
                            <textarea placeholder="Expliquez brièvement votre question..." className="w-full p-6 bg-stone-50 border border-stone-100 rounded-3xl outline-none min-h-[150px]"></textarea>
                        </div>

                        <button 
                            disabled={isSubmittingConsult}
                            type="submit" 
                            className="w-full bg-brand-900 text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl flex items-center justify-center gap-4"
                        >
                            {isSubmittingConsult ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <>INTERROGER LES ANCÊTRES <Send size={18} /></>}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );

    const renderTofa = () => (
        <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn">
            <div className="bg-white rounded-[3.5rem] shadow-2xl border border-brand-50 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                
                <div className="bg-brand-900 p-10 md:p-16 text-center text-white space-y-6 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                        <pre className="text-[15rem] font-mono leading-none">{tofaData.symbol}</pre>
                    </div>
                    <div className="relative z-10 space-y-4">
                        <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-[0.3em]">
                            <Calendar size={14} /> Grande Consultation Annuelle
                        </div>
                        <h1 className="text-4xl md:text-7xl font-serif font-black uppercase tracking-tighter">TOFA {tofaData.year}</h1>
                        <p className="text-brand-300 text-lg md:text-xl font-serif italic">"La parole qui unit les mondes"</p>
                    </div>
                </div>

                <div className="p-8 md:p-16 space-y-16">
                    <div className="flex flex-col items-center gap-8 border-b border-stone-100 pb-12">
                        <div className="bg-stone-50 w-56 h-56 rounded-[3.5rem] flex items-center justify-center shadow-inner border border-stone-100 relative group">
                            <div className="absolute inset-0 bg-brand-500/5 rounded-full blur-2xl animate-pulse"></div>
                            <pre className="font-mono text-7xl font-black text-brand-900 leading-none relative z-10 select-none">{tofaData.symbol}</pre>
                        </div>
                        <div className="text-center space-y-2">
                            <h2 className="text-5xl md:text-6xl font-serif font-black text-brand-900 uppercase">{tofaData.sign}</h2>
                            <p className="text-brand-500 font-bold uppercase tracking-[0.4em] text-xs">Signe Directeur de l'Année ({tofaData.alias})</p>
                            <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest border border-green-100 mt-4 shadow-sm">
                                <Star size={14} fill="currentColor" /> Tendance : {tofaData.status}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                        <div className="space-y-8">
                            <section className="space-y-4">
                                <h3 className="flex items-center gap-3 text-brand-900 font-serif font-bold text-2xl uppercase tracking-tight">
                                    <Sparkles className="text-brand-500" /> Révélation du Fa
                                </h3>
                                <p className="text-stone-600 leading-relaxed text-lg font-light italic">
                                    "{tofaData.revelation}"
                                </p>
                            </section>

                            <section className="bg-stone-50 p-8 rounded-[2.5rem] border border-stone-100 space-y-4">
                                <h3 className="flex items-center gap-3 text-brand-900 font-serif font-bold text-xl uppercase tracking-tight">
                                    <Compass className="text-brand-600" /> Guidance & Destinée
                                </h3>
                                <p className="text-stone-700 leading-relaxed">
                                    {tofaData.interpretation}
                                </p>
                            </section>
                        </div>

                        <div className="space-y-8">
                            <section className="bg-brand-50 p-8 rounded-[2.5rem] border border-brand-100 space-y-6">
                                <h3 className="flex items-center gap-3 text-brand-900 font-serif font-bold text-xl uppercase tracking-tight">
                                    <ShieldCheck className="text-brand-600" /> Prescriptions
                                </h3>
                                <ul className="space-y-4">
                                    {tofaData.recommendations.map((rec, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <div className="w-5 h-5 rounded-full bg-brand-200 flex items-center justify-center text-brand-700 shrink-0 mt-0.5">
                                                <ZapIcon size={10} fill="currentColor" />
                                            </div>
                                            <p className="text-sm font-medium text-stone-700">{rec}</p>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section className="p-8 rounded-[2.5rem] border-2 border-dashed border-stone-200 space-y-4 text-center">
                                <h3 className="text-stone-400 font-black uppercase tracking-[0.2em] text-[10px]">Apaisement des Énergies</h3>
                                <p className="text-stone-500 italic text-sm leading-relaxed">
                                    {tofaData.sacrifices}
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-12 pb-20 pt-4 md:pt-8">
            {/* Tab System */}
            <div className="max-w-4xl mx-auto">
                <div className="flex bg-stone-100 p-1.5 rounded-[2rem] border border-stone-200 mb-12">
                    <button 
                        onClick={() => setActiveTab('consultation')}
                        className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.8rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'consultation' ? 'bg-brand-900 text-white shadow-xl' : 'text-stone-500 hover:text-brand-900'}`}
                    >
                        <Sparkles size={16} /> Consultation
                    </button>
                    <button 
                        onClick={() => setActiveTab('tofa')}
                        className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.8rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'tofa' ? 'bg-brand-900 text-white shadow-xl' : 'text-stone-500 hover:text-brand-900'}`}
                    >
                        <Calendar size={16} /> Tofa {tofaData.year}
                    </button>
                </div>
            </div>

            {activeTab === 'consultation' ? renderConsultation() : renderTofa()}
        </div>
    );
};