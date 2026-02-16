import React, { useState, useEffect, useRef } from 'react';
/* Added missing 'Baby' icon to the lucide-react imports to resolve the error on line 65 */
import { Baby, BookOpen, Video, Lock, Award, CheckCircle, Volume2, HelpCircle, ArrowRight, RefreshCw, Star, PlayCircle, GraduationCap, Clock, Monitor, Smartphone, Globe, User as UserIcon, ArrowLeft, Check, ChevronRight, MessageSquare, CornerDownRight, X, ChevronDown, List, Play, Pause, RotateCcw, RotateCw, Maximize, VolumeX, Volume1, Volume2 as Vol2Icon, Shield, Layers, Users, Wrench, ScrollText, ShoppingBag, Send, Sparkles, Zap, Calendar, Heart, Quote as QuoteIcon, CreditCard, ShieldCheck, Flame, Ghost, History as HistoryIcon, Languages, MapPin, Search, Landmark, Music, Eye, Download, Printer, ShieldCheck as VerifiedIcon, QrCode, Trophy, AlertCircle } from 'lucide-react';
import { Course, User, CourseReview, Lesson, CourseComment } from '../types';

// --- DATA MOCKS FOR QUIZ ---
interface Question {
    id: string;
    text: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

interface QuizCategory {
    id: string;
    title: string;
    icon: any;
    color: string;
    questions: Question[];
}

const QUIZ_DATA: QuizCategory[] = [
    {
        id: 'events',
        title: 'Évènements & Histoire',
        icon: Calendar,
        color: 'bg-amber-500',
        questions: [
            { id: 'e1', text: "À quelle date célèbre-t-on officiellement les Vodoun Days (Fête nationale du Vodoun) au Bénin ?", options: ["1er Août", "10 Janvier", "5 Mars", "22 Décembre"], correctAnswer: 1, explanation: "Le 10 janvier est la date historique décrétée pour célébrer la richesse spirituelle du Vodoun au Bénin." },
            { id: 'e2', text: "Dans quelle ville se déroule la cérémonie finale des Vodoun Days ?", options: ["Abomey", "Porto-Novo", "Ouidah", "Cotonou"], correctAnswer: 2, explanation: "Ouidah, cité historique et port de la mémoire, accueille les rituels majeurs au bord de l'océan." },
            { id: 'e3', text: "Quel festival célèbre la fraternité et la purification par l'eau à Grand-Popo ?", options: ["La Gaani", "Le Guelede", "Le Nonvitcha", "Le Té-zan"], correctAnswer: 2, explanation: "Nonvitcha signifie 'Les frères unis' et se célèbre chaque année à Grand-Popo à la Pentecôte." },
            { id: 'e4', text: "La fête de la Gaani est principalement rattachée à quel empire ?", options: ["Royaume de Danxomè", "Empire de Nikki (Bariba)", "Royaume de Hogbonou", "Peuple Adja"], correctAnswer: 1, explanation: "La Gaani est la fête identitaire majeure du peuple Baatonou et Boo de l'aire culturelle de Nikki." },
            { id: 'e5', text: "Que fête-t-on le 15 août à Savalou ?", options: ["La sortie des Egungun", "La fête de l'igname (Té-zan)", "La fin du ramadan", "Le pèlerinage de Dassa"], correctAnswer: 1, explanation: "Le 15 août marque la consommation rituelle de la nouvelle igname à Savalou." }
        ]
    },
    {
        id: 'fa-signs',
        title: 'Signes du Fa',
        icon: BookOpen,
        color: 'bg-brand-900',
        questions: [
            { id: 'f1', text: "Quel est le tout premier des 16 signes mères (Meji) du Fa ?", options: ["Yeku-Meji", "Gbe-Meji (Eji-Ogbe)", "Woli-Meji", "Fu-Meji"], correctAnswer: 1, explanation: "Gbe-Meji est le signe de la lumière originelle et le premier de la hiérarchie céleste." },
            { id: 'f2', text: "Que symbolise principalement le signe Yeku-Meji ?", options: ["Le Soleil", "L'Obscurité et les Ancêtres", "L'Eau", "Le Vent"], correctAnswer: 1, explanation: "Yeku-Meji représente la nuit, le repos nécessaire et le lien profond avec le monde des défunts." },
            { id: 'f3', text: "Combien y a-t-il de signes dérivés (Odu) au total dans le système complet du Fa ?", options: ["16", "240", "256", "365"], correctAnswer: 2, explanation: "Il y a 16 signes mères et 240 signes dérivés, soit un total de 256 configurations sacrées." },
            { id: 'f4', text: "Quel signe est associé à la justice, à la rigueur et à l'équilibre ?", options: ["Sa-Meji", "Winlin-Meji", "Lete-Meji", "Di-Meji"], correctAnswer: 0, explanation: "Sa-Meji incarne la loi de cause à effet et la justice immuable." },
            { id: 'f5', text: "Quel outil le Bokonon utilise-t-il principalement pour le jet de l'oracle ?", options: ["Un sabre", "L'Agumaga (chapelet)", "Une coupe d'eau", "Des cartes"], correctAnswer: 1, explanation: "L'Agumaga, composé de 8 demi-noix, est l'outil technique de révélation des signes." }
        ]
    },
    {
        id: 'vodouns',
        title: 'Vodouns & Masques',
        icon: Flame,
        color: 'bg-red-600',
        questions: [
            { id: 'v1', text: "Qui est le messager entre les hommes et les divinités, gardien des carrefours ?", options: ["Sakpata", "Heviosso", "Legba", "Mami Wata"], correctAnswer: 2, explanation: "Legba parle toutes les langues et détient la clé de toute communication spirituelle." },
            { id: 'v2', text: "Quel Vodoun est le maître de la terre et le guérisseur des épidémies ?", options: ["Dan", "Sakpata", "Ogoun", "Tohossou"], correctAnswer: 1, explanation: "Sakpata est la divinité de la terre (Ayinon), redoutée et respectée pour son pouvoir de guérison." },
            { id: 'v3', text: "Comment appelle-t-on les gardiens de la nuit, célèbres pour leurs masques de paille ?", options: ["Egungun", "Guelede", "Zangbeto", "Oro"], correctAnswer: 2, explanation: "Les Zangbeto sont la 'police traditionnelle' chargée de protéger la communauté durant la nuit." },
            { id: 'v4', text: "Quel masque rend hommage aux mères ancestrales et à la puissance féminine ?", options: ["Egungun", "Guelede", "Zangbeto", "Abikou"], correctAnswer: 1, explanation: "Le Guelede est un art rituel dédié à l'apaisement des mères et à l'harmonie sociale." },
            { id: 'v5', text: "Quelle divinité est symbolisée par la double hache et le tonnerre ?", options: ["Ogoun", "Heviosso", "Loko", "Nanan-Bouclou"], correctAnswer: 1, explanation: "Heviosso est le dieu du feu céleste, garant de la foudre et de la justice rapide." }
        ]
    },
    {
        id: 'names',
        title: 'Noms & Origines',
        /* Using the imported 'Baby' icon here */
        icon: Baby,
        color: 'bg-brand-500',
        questions: [
            { id: 'n1', text: "Que signifie le nom fon 'Houéfa' ?", options: ["Enfant du destin", "Maison de paix", "Don de Dieu", "Le premier fils"], correctAnswer: 1, explanation: "Houé-Fa signifie littéralement la demeure de la fraîcheur ou de la paix." },
            { id: 'n2', text: "Quel nom porte traditionnellement un garçon né après des jumeaux en milieu fon ?", options: ["Taiwo", "Dossou", "Kehinde", "Anani"], correctAnswer: 1, explanation: "Dossou (garçon) et Dossa (fille) sont les noms consacrés aux enfants nés après des jumeaux." },
            { id: 'n3', text: "En milieu Adja/Mina, quel prénom donne-t-on à un garçon né un vendredi ?", options: ["Kodjo", "Koffi", "Kossi", "Komlan"], correctAnswer: 1, explanation: "Le vendredi est associé au nom Koffi. Chaque jour de la semaine possède son nom correspondant." },
            { id: 'n4', text: "Que signifie le nom Yoruba 'Babatoundé' ?", options: ["Dieu est grand", "La joie est arrivée", "Le père est revenu", "L'enfant attendu"], correctAnswer: 2, explanation: "C'est un nom donné à un enfant né peu après le décès d'un grand-parent, symbolisant la renaissance de la lignée." },
            { id: 'n5', text: "Quel nom porte le premier fils dans la tradition Mina/Guin ?", options: ["Messan", "Anani", "Kangni", "Kanyi"], correctAnswer: 2, explanation: "Kangni est le nom du premier fils, Anani du second, et Messan du troisième." }
        ]
    },
    {
        id: 'geography',
        title: 'Villages & Dialectes',
        icon: MapPin,
        color: 'bg-green-600',
        questions: [
            { id: 'g1', text: "Quelle est la langue majoritairement parlée à Abomey et Bohicon ?", options: ["Goun", "Yoruba", "Fon", "Dendi"], correctAnswer: 2, explanation: "Le Fon est la langue de l'ancien Royaume de Danxomè, centrée sur Abomey." },
            { id: 'g2', text: "Porto-Novo, la capitale, est historiquement appelée Hogbonou mais aussi...", options: ["Xogbonou", "Adjatchè", "Dan-Toxpa", "Gléxwé"], correctAnswer: 1, explanation: "Adjatchè est le nom d'origine Yoruba de la cité, signifiant 'Le marché conquis'." },
            { id: 'g3', text: "Ouidah est connue pour ses racines Fon, mais quelle autre langue y est très présente ?", options: ["Dendi", "Mina/Xweda", "Yom", "Ditammari"], correctAnswer: 1, explanation: "Les peuples Xweda et Mina sont les fondateurs et habitants historiques de la zone côtière de Ouidah." },
            { id: 'g4', text: "Dans quelle région du Bénin parle-t-on majoritairement le Bariba (Baatonum) ?", options: ["Sud", "Centre", "Nord-Est (Borgou/Alibori)", "Nord-Ouest"], correctAnswer: 2, explanation: "Le Baatonum est la langue de l'Empire de Nikki, située dans le septentrion béninois." },
            { id: 'g5', text: "À quel village rattache-t-on principalement le dialecte Mahi ?", options: ["Savalou", "Sakété", "Sèmè", "Grand-Popo"], correctAnswer: 0, explanation: "Savalou est le cœur historique du pays Mahi." }
        ]
    },
    {
        id: 'botany',
        title: 'Botanique Sacrée',
        icon: ShieldCheck,
        color: 'bg-emerald-700',
        questions: [
            { id: 'b1', text: "Quelle plante est appelée 'Kessu kessu' et utilisée pour les bains de purification ?", options: ["Moringa", "Hysope africaine", "Verveine", "Basilic"], correctAnswer: 1, explanation: "L'hysope est la plante de purification spirituelle par excellence dans le culte Vodoun." },
            { id: 'b2', text: "Le 'Ahowé' (Petit Cola) est symbole de...", options: ["La richesse", "La longévité et l'amitié", "La guerre", "La naissance"], correctAnswer: 1, explanation: "Partager un Petit Cola est un acte de bienvenue et un souhait de longue vie." },
            { id: 'b3', text: "Quelle feuille est surnommée 'la plante aux mille vertus' (Patagonba) ?", options: ["Palmier", "Moringa", "Baobab", "Karité"], correctAnswer: 1, explanation: "Le Moringa est vénéré pour ses propriétés nutritives et médicinales exceptionnelles." },
            { id: 'b4', text: "Quelle noix est jetée par le Bokonon lors du jet du Fa ?", options: ["Noix de Coco", "Noix de Palme (Inkin)", "Noix de Cajou", "Noix de Cola"], correctAnswer: 1, explanation: "Les Inkins sont les noix de palme sacrées utilisées pour lire les signes du Fa." },
            { id: 'b5', text: "Pour attirer la faveur et purifier les paroles, on utilise souvent le...", options: ["Piment", "Clou de girofle (Atikun)", "Sel", "Gingembre"], correctAnswer: 1, explanation: "L'Atikun est utilisé pour 'adoucir' les vibrations et favoriser les échanges harmonieux." }
        ]
    }
];

// --- DATA MOCKS FOR ORIGINS ---
const ORIGINS_DATA: Record<string, {
    village: string;
    region: string;
    language: string;
    lat: number;
    lng: number;
    akoNative: string;
    akoFrench: string;
    masks: string[];
    fetishes: string[];
    ceremonies: string[];
    history: string;
}> = {
    'SOGLO': {
        village: 'Abomey (Agony)',
        region: 'Zou',
        language: 'Fon',
        lat: 7.1852,
        lng: 1.9912,
        akoNative: 'Soglo Ahoussouvi, axɔ́sú ví, Agon-lí kponon. Adan tɔ mɛ, fífá mɛ.',
        akoFrench: 'Ahoussouvi, fils de la lignée royale, héritier du trône d\'Agon-li. Brave et pacifique.',
        masks: ['Egungun', 'Guelede'],
        fetishes: ['Heviosso', 'Dan'],
        ceremonies: ['Célébration des Rois d\'Abomey', 'Vodoun Days'],
        history: 'La famille Soglo est intimement liée à la structure militaire et politique du Royaume de Dahomey. Leurs ancêtres étaient des stratèges respectés dans la région de Zou.'
    },
    'ZINSOU': {
        village: 'Ouidah',
        region: 'Atlantique',
        language: 'Fon / Mina',
        lat: 6.3631,
        lng: 2.0851,
        akoNative: 'Zinsou, xù mɛ ví, tɔmɛ ví. Xɔ̀nuví, doto mɛ bo mɔ fífá.',
        akoFrench: 'Zinsou, fils de l\'eau, fils des profondeurs. Héritier de la côte, gardien des secrets de l\'océan.',
        masks: ['Zangbeto'],
        fetishes: ['Mami Wata', 'Pythons'],
        ceremonies: ['Pèlerinage à la Porte du Non-Retour'],
        history: 'Famille emblématique de la cité historique de Ouidah, jouant un rôle clé dans les échanges culturels et spirituels entre le littoral et l\'intérieur des terres.'
    },
    'BIO TCHANE': {
        village: 'Djougou',
        region: 'Donga',
        language: 'Dendi / Yom',
        lat: 9.7085,
        lng: 1.6660,
        akoNative: 'Bio Tchane, kpɔn kùnnyì, Dendi ví. Gbingbi kpɔn kponon.',
        akoFrench: 'Bio Tchane, lion des savanes, fils du peuple Dendi. Grand lion conquérant.',
        masks: ['Masques de paille'],
        fetishes: ['Ancêtres guerriers'],
        ceremonies: ['La Gaani (Djougou)'],
        history: 'Une lignée de guerriers et de marchands nobles ayant structuré les routes commerciales du Nord-Bénin.'
    },
    'KOFFI': {
        village: 'Grand-Popo / Agoué',
        region: 'Mono',
        language: 'MINA / GOUN',
        lat: 6.2812,
        lng: 1.8286,
        akoNative: 'Hwla-vi kponon, tcha tcha tcha. É gbé dji, é gbé fofo. Vi dé dji bo non tché ho.',
        akoFrench: 'Noble fils Hwla, digne héritier. Il se tient debout et fier. Un enfant du destin qui ne recule jamais.',
        masks: ['ZANGBETO'],
        fetishes: ['MAMI WATA'],
        ceremonies: ['FESTIVAL NONVITCHA (PENTECÔTE)'],
        history: 'Le peuple Hwla est historiquement lié aux activités de pêche et de commerce lagunaire. Descendants des peuples venus de l\'actuel Ghana et Togo, ils ont fondé Grand-Popo comme un centre névralgique de la côte.'
    }
};

const CEREMONY_UI_MAP: Record<string, { id: string, image: string }> = {
    "Vodoun Days": { id: 'e1', image: 'https://images.unsplash.com/photo-1590739293166-791786523152?auto=format&fit=crop&q=80&w=400' },
    "Célébration des Rois d'Abomey": { id: 'e1', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400' },
    "Egungun": { id: 'e4', image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=400' },
    "Guelede": { id: 'e2', image: 'https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&q=80&w=400' },
    "FESTIVAL NONVITCHA (PENTECÔTE)": { id: 'e3', image: 'https://images.unsplash.com/photo-1560759226-14da22a643ef?auto=format&fit=crop&q=80&w=400' },
    "Pèlerinage à la Porte du Non-Retour": { id: 'e1', image: 'https://images.unsplash.com/photo-1590739293166-791786523152?auto=format&fit=crop&q=80&w=400' },
    "La Gaani (Djougou)": { id: 'e4', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=400' }
};

// --- Custom Video Player Component ---
const CustomVideoPlayer: React.FC<{ url: string, thumbnail: string }> = ({ url, thumbnail }) => {
    const videoRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const controlsTimeoutRef = useRef<number | null>(null);

    const togglePlay = () => {
        const video = videoRef.current?.querySelector('video');
        if (video) {
            if (isPlaying) video.pause();
            else video.play();
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = (e: any) => {
        const current = e.target.currentTime;
        const total = e.target.duration;
        setProgress((current / total) * 100);
    };

    const handleLoadedMetadata = (e: any) => {
        setDuration(e.target.duration);
    };

    const skip = (seconds: number) => {
        const video = videoRef.current?.querySelector('video');
        if (video) video.currentTime += seconds;
    };

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        const video = videoRef.current?.querySelector('video');
        if (video) {
            const newTime = (val / 100) * video.duration;
            video.currentTime = newTime;
            setProgress(val);
        }
    };

    const toggleMute = () => {
        const video = videoRef.current?.querySelector('video');
        if (video) {
            video.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const toggleFullscreen = () => {
        const video = videoRef.current?.querySelector('video');
        if (video) {
            if (video.requestFullscreen) video.requestFullscreen();
            else if ((video as any).webkitRequestFullscreen) (video as any).webkitRequestFullscreen();
        }
    };

    const formatTime = (time: number) => {
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) window.clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = window.setTimeout(() => {
            if (isPlaying) setShowControls(false);
        }, 3000);
    };

    const currentVolume = isMuted ? 0 : volume;

    return (
        <div 
            ref={videoRef}
            className="relative w-full h-full group bg-black cursor-pointer overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
        >
            <video 
                className="w-full h-full object-contain"
                src={url}
                poster={thumbnail}
                playsInline
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onClick={togglePlay}
            />

            {/* Overlay Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0'}`} />

            {/* Big Center Play Button */}
            {!isPlaying && (
                <div onClick={togglePlay} className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-brand-600/90 rounded-full flex items-center justify-center text-white shadow-2xl scale-110">
                        <Play size={40} fill="currentColor" />
                    </div>
                </div>
            )}

            {/* Custom Controls Bar */}
            <div className={`absolute bottom-0 left-0 right-0 p-4 md:p-6 space-y-4 transition-transform duration-300 ${showControls ? 'translate-y-0' : 'translate-y-full'}`}>
                {/* Progress Bar */}
                <div className="relative w-full group/progress">
                    <input 
                        type="range" 
                        min="0" max="100" step="0.1"
                        value={progress}
                        onChange={handleProgressChange}
                        className="w-full h-1.5 bg-white/30 rounded-full appearance-none cursor-pointer accent-brand-500 hover:h-2 transition-all"
                        style={{
                            background: `linear-gradient(to right, #d1984b ${progress}%, rgba(255,255,255,0.3) ${progress}%)`
                        }}
                    />
                </div>

                <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-4 md:gap-6">
                        <button onClick={togglePlay} className="hover:text-brand-400 transition-colors">
                            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                        </button>
                        <div className="flex items-center gap-2">
                            <button onClick={() => skip(-10)} className="hover:text-brand-400 transition-colors"><RotateCcw size={20} /></button>
                            <button onClick={() => skip(10)} className="hover:text-brand-400 transition-colors"><RotateCw size={20} /></button>
                        </div>
                        <div className="text-[10px] md:text-xs font-bold tracking-widest tabular-nums">
                            {formatTime(videoRef.current?.querySelector('video')?.currentTime || 0)} / {formatTime(duration)}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 group/vol">
                            <button onClick={toggleMute} className="hover:text-brand-400 transition-colors">
                                {isMuted || volume === 0 ? <VolumeX size={22} /> : volume < 0.5 ? <Volume1 size={22} /> : <Vol2Icon size={22} />}
                            </button>
                            <input 
                                type="range" min="0" max="1" step="0.05"
                                value={currentVolume}
                                onChange={(e) => {
                                    const val = parseFloat(e.target.value);
                                    setVolume(val);
                                    const video = videoRef.current?.querySelector('video');
                                    if (video) {
                                        video.volume = val;
                                        video.muted = val === 0;
                                        setIsMuted(val === 0);
                                    }
                                }}
                                className="w-0 group-hover/vol:w-20 transition-all h-1 bg-white/30 rounded-full appearance-none cursor-pointer accent-brand-400 overflow-hidden"
                                style={{
                                    background: `linear-gradient(to right, #d1984b ${currentVolume * 100}%, rgba(255,255,255,0.3) ${currentVolume * 100}%)`
                                }}
                            />
                        </div>
                        <button onClick={toggleFullscreen} className="hover:text-brand-400 transition-colors"><Maximize size={22} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- DATA MOCKS ---
const FA_SIGNS = [
  { 
    id: 1, 
    name: 'Gbe-Meji', 
    symbol: 'I I\nI I\nI I\nI I', 
    meaning: "Gbé Méji (Eji-Ogbe) est le prince des signes, le premier des seize Meji. Il incarne la Lumière originelle, le Soleil à son zénith et la clarté de l'esprit. C'est le signe de la vie, de la création, du bonheur sans tache et de l'harmonie universelle. Lorsqu'il apparaît, il annonce que toutes les voies sont ouvertes, que la vérité triomphe et que le succès est assuré par la persévérance et l'intégrité morale. Il est le souffle qui anime l'univers et le point de départ de toute manifestation physique.", 
    audioText: 'Gbé Méji. La voie de la clarté absolue.' 
  },
  { 
    id: 2, 
    name: 'Yeku-Meji', 
    symbol: 'II II\nII II\nII II\nII II', 
    meaning: "Yékou Méji (Oyeku-Meji) est le signe de l'Obscurité sacrée, de la Nuit et de la Fin de cycle. Il représente le mystère de la mort, mais aussi le repos nécessaire et la protection des Ancêtres. Contrairement aux apparences, il ne symbolise pas une fin tragique, mais plutôt une transformation, une délivrance d'un fardeau ou le passage vers un état supérieur. Il gouverne le monde souterrain et les racines. C'est un signe de prudence, invitant à honorer le passé pour mieux préparer le futur dans le silence et le recueillement.", 
    audioText: 'Yékou Méji. La transformation par le silence.' 
  },
  { 
    id: 3, 
    name: 'Woli-Meji', 
    symbol: 'II II\nI I\nI I\nII II', 
    meaning: "Woli Méji (Iwori-Meji) symbolise la Famille, le Foyer et la Protection communautaire. Il est lié à la tête, à l'intellect et à la clairvoyance. C'est le signe de l'analyse, de l'enquête et de la redécouverte de ce qui a été perdu. Il enseigne que la force réside dans les liens sociaux et la mémoire collective. Woli Méji incite à regarder en profondeur, au-delà des illusions, pour comprendre les véritables motivations des êtres. Il favorise la fertilité et la croissance harmonieuse au sein de la lignée.", 
    audioText: 'Woli Méji. L\'intelligence au service de la lignée.' 
  },
  { 
    id: 4, 
    name: 'Di-Meji', 
    symbol: 'I I\nII II\nII II\nI I', 
    meaning: "Di Méji (Odi-Meji) est le signe du Confinement sacré, de la Matrice et du Mystère de la fécondité. Il représente le ventre maternel, l'endroit où les choses se forment avant de naître. C'est un signe de protection occulte, mais aussi d'isolement créateur. Il gouverne le secrets bien gardés et les rituels de renaissance. Di Méji enseigne que pour renaître, il faut parfois se retirer du monde, s'entourer de barrières protectrices et attendre que le temps mûrisse l'œuvre commencée.", 
    audioText: 'Di Méji. La matrice des nouveaux départs.' 
  },
  { 
    id: 5, 
    name: 'Abla-Meji', 
    symbol: 'I I\nI I\nII II\nII II', 
    meaning: "Abla Méji (Irosun-Meji) symbolise le Sang, le Feu purificateur et l'éveil de la conscience. C'est le signe de la passion, de l'ambition noble mais aussi des défis qui forgent le caractère. Il représente les épreuves qui permettent de se laver de ses impuretés pour atteindre un état de grâce. Abla Méji est lié à la royauté et à l'honneur. Il avertit souvent contre la précipitation et l'orgueil, rappelant que la véritable noblesse vient du sacrifice de soi pour le bien d'autrui.", 
    audioText: 'Abla Méji. Le feu qui forge l\'esprit.' 
  },
  { 
    id: 6, 
    name: 'Akla-Meji', 
    symbol: 'II II\nII II\nI I\nI I', 
    meaning: "Akla Méji (Owanrin-Meji) est le signe du Changement rapide, de la Mutation et de la Mobilité. Il gouverne le imprevus, les nouvelles opportunités et les voyages. C'est un signe dynamique qui demande une grande adaptabilité. Il symbolise le mouvement incessant de la vie et le refus de la stagnation. Akla Méji enseigne que rien n'est permanent and que la sagesse consiste à savoir surfer on the vagues du destin sans s'y noyer. Il favorise les échanges commerciaux et les communications.", 
    audioText: 'Akla Méji. La dynamique du changement.' 
  },
  { 
    id: 7, 
    name: 'Guda-Meji', 
    symbol: 'I I\nII II\nII II\nII II', 
    meaning: "Gouda Méji (Obara-Meji) représente la Prospérité, la richesse matérielle et la reconnaissance sociale. C'est un signe de générosité, de fête et d'abondance. Cependant, il porte aussi un avertissement sur la vanité et les paroles inconsidérées. Il enseigne que la fortune est un prêt de la nature qui doit être partagé pour rester fertile. Gouda Méji est souvent associé à la pluie qui féconde la terre. Il demande à l'initié de garder les pieds sur terre tout en jouissant des fruits de son travail.", 
    audioText: 'Gouda Méji. L\'abondance et ses responsabilités.' 
  },
  { 
    id: 8, 
    name: 'Sa-Meji', 
    symbol: 'II II\nII II\nII II\nI I', 
    meaning: "Sa Méji (Okanran-Meji) symbolise la Justice, la Rigueur et la Loi de cause à effect. C'est le signe de l'équilibre parfait entre les forces opposées. Il représente le couperet qui sépare le vrai du faux. Sa Méji est souvent lié à la tempête et à l'éclair, forces brutales qui purifient l'atmosphère. Il demande une honnêteté absolue envers soi-même et les autres. Sous ce signe, aucune erreur ne reste impunie, mais aucun effort sincère n'est oublié. C'est le pilier de l'éthique dans le système du Fa.", 
    audioText: 'Sa Méji. La justice immuable du cosmos.' 
  },
  { 
    id: 9, 
    name: 'Lete-Meji', 
    symbol: 'I I\nI I\nI I\nII II', 
    meaning: "Lété Méji (Ogunda-Meji) est le signe du Forgeron, de l'Action et du Tranchant de l'esprit. Il gouverne le métal, la technologie et la capacité à vaincre les obstacles par la force de la volonté et l'ingéniosité. C'est le signe des pionniers, des bâtisseurs et des guerriers spirituels. Lété Méji enseigne que pour créer, il faut parfois détruire les anciennes formes inutiles. Il favorise les opérations chirurgicales, les travaux manuels et les décisions fermes qui mettent fin aux situations ambiguës.", 
    audioText: 'Lété Méji. Le fer et l\'esprit combatif.' 
  },
  { 
    id: 10, 
    name: 'Tula-Meji', 
    symbol: 'II II\nI I\nI I\nI I', 
    meaning: "Tula Méji (Osa-Meji) symbolise le Vent, la spiritualité éthérée et les forces invisibles de l'air. C'est le signe de la fuite, de la légèreté mais aussi de la puissance devasratrice des ouragans. Il représente les esprits ailés et les intuitions fulgurantes. Tula Méji enseigne que la pensée est plus rapide que la matière. Il incite à la flexibilité et à la recherche spirituelle profonde. C'est aussi le signe qui protège contre les sorcelleries nocturnes en apportant le souffle de la vie qui disperse les ombres.", 
    audioText: 'Tula Méji. Le souffle mystique de l\'air.' 
  },
  { 
    id: 11, 
    name: 'Trukpin-Meji', 
    symbol: 'II II\nI I\nII II\nII II', 
    meaning: "Trukpin Méji (Ika-Meji) représente la Concentration, la Retenue et le secret initiatique. Il symbolise le serpent qui se mord la queue, l'infini and la protection by the cercle fermé. C'est un signe de pouvoir intérieur immense qui ne doit être utilisé qu'avec une extrême sagesse. Il gouverne le incantations (Aze) et les forces magnétiques. Trukpin Méji enseigne que la véritable force ne se montre pas, elle se contient jusqu'au moment opportun. Il demande à l'initié de cultiver la maîtrise de ses paroles et de ses émotions.", 
    audioText: 'Trukpin Méji. Le pouvoir silencieux du secret.' 
  },
  { 
    id: 12, 
    name: 'Ka-Meji', 
    symbol: 'II II\nII II\nI I\nII II', 
    meaning: "Ka Méji (Oturupon-Meji) est le signe de la Terre nourricière, des fondations solides et de la stabilité matérielle. Il symbolise la persistance, le travail acharné et la résilience face à l'adversité. C'est le signe de l'agriculteur et du gardien du patrimoine. Ka Méji enseigne que rien de durable ne se construit sans de bonnes racines. Il favorise l'achat de terrains, les constructions et la santé physique à long terme. Il demande de la patience, car les fruits de ce signe mettent du temps à mûrir mais sont particulièrement savoureux.", 
    audioText: 'Ka Méji. La force tranquille de la Terre.' 
  },
  { 
    id: 13, 
    name: 'Ce-Meji', 
    symbol: 'I I\nII II\nI I\nI I', 
    meaning: "Cé Méji (Otura-Meji) symbolise la Paix, la Réconciliation et le Verbe éclairé. C'est le signe de la diplomatie, de la communication entre les mondes et de la sagesse tranquille. Il représente le médiateur qui apporte la lumière là où régnaient les ténèbres de la discorde. Cé Méji enseigne que la parole douce peut percer le cœur le plus dur. Il favorise l'apprentissage des langues, l'enseignement et les voyages vers des terres lointaines. Sous ce signe, les conflits s'apaisent et la coopération devient possible.", 
    audioText: 'Cé Méji. La parole qui unite les peuples.' 
  },
  { 
    id: 14, 
    name: 'Loso-Meji', 
    symbol: 'I I\nI I\nII II\nI I', 
    meaning: "Loso Méji (Irete-Meji) est le signe de la Guérison, de la purification par l'eau et de la connaissance médicinale. Il symbolise le flux de la vie, les rivières et les remèdes sacrés. C'est le signe des guérisseurs et des initiés aux mystères de la nature. Loso Méji enseigne que le corps et l'esprit sont liés. Il incite à la propreté rituelle et au respect des cycles de la nature. Il annonce souvent la fin d'une maladie ou d'une période de souffrance, apportant le rafraîchissement nécessaire après la traversée du désert.", 
    audioText: 'Loso Méji. L\'eau qui lave et guérit.' 
  },
  { 
    id: 15, 
    name: 'Winlin-Meji', 
    symbol: 'I I\nII II\nII II\nI I', 
    meaning: "Winlin Méji (Oshe-Meji) symbolise la Beauté, la sensualité, les arts et la joie de vivre. C'est le signe de l'élégance, de l'amour et de la créativité débordante. Il représente les festivités, la danse et tout ce qui rend la vie précieuse. Cependant, il avertit contre la futilité et le narcissisme. Winlin Méji enseigne que la beauté extérieure doit être le reflet d'une harmonie intérieure. Il favorise les carrières artistiques, les relations amoureuses et tout ce qui touche à l'esthétique et au raffinement de l'esprit.", 
    audioText: 'Winlin Méji. L\'éclat de la beauté sacrée.' 
  },
  { 
    id: 16, 
    name: 'Fu-Meji', 
    symbol: 'II II\nII II\nII II\nII II', 
    meaning: "Fou Méji (Ofun-Meji) est le seizième et dernier Meji, souvent considéré comme le plus puissant et le plus mystérieux. Il symbolise le Blanc pur, l'au-delà des formes, l'Espace infini et la sagesse suprême. C'est le signe de la vieillesse accomplie et du retour à l'Unité. Il contient en lui tous les autres signes et leur apporte une bénédiction finale. Fou Méji est lié à la clairvoyance pure et à la protection divine absolue. Il demande un respect total, car sa puissance peut être aussi créatrice que destructrice selon le cœur de celui qui l'invoque.", 
    audioText: 'Fou Méji. L\'Unité suprême de la création.' 
  },
];

const VODOUNS_DATA = [
  {
    id: 'v1',
    name: 'Legba',
    category: 'Vodoun',
    image: 'https://images.unsplash.com/photo-1590739293166-791786523152?auto=format&fit=crop&q=80&w=800',
    description: "Le gardien des carrefours et le messager entre les mondes. Rien ne se fait sans l'accord de Legba.",
    history: "Lègba est le benjamin des enfants de Mawu-Lissa. Il est le seul à parler toutes les langues et sert d'interprète entre les hommes et les divinités. Il est souvent représenté à l'entrée des maisons ou des villages pour les protéger.",
    dialect: "Fon, Yoruba (Esu), Goun",
    audioText: "Legba, le gardien des carrefours."
  },
  {
    id: 'v2',
    name: 'Zangbeto',
    category: 'Masque',
    image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=800',
    description: "Les gardiens de la nuit et la police traditionnelle chez les Ogu et les Fon.",
    history: "Le Zangbéto (chasseur de nuit) est un masque de paille spectaculaire. Il n'y a personne dessous, c'est l'esprit de la nuit qui l'anime. Son rôle est de surveiller la communauté, de chasser les voleurs et les mauvais esprits.",
    dialect: "Ogu, Fon",
    audioText: "Zangbeto, les gardiens de la nuit."
  },
  {
    id: 'v3',
    name: 'Egungun',
    category: 'Masque',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=800',
    description: "L'incarnation vivante des ancêtres qui reviennent visiter les vivants.",
    history: "Les Egungun portent des costumes de tissus précieux accumulés au fil des siècles. Ils parlent d'une voix gutturale et apportent la bénédiction de la lignée aux vivants. C'est un culte d'origine Yoruba très présent à Porto-Novo et Ouidah.",
    dialect: "Yoruba, Nago",
    audioText: "Egungun, le revenant des ancêtres."
  },
  {
    id: 'v4',
    name: 'Mami Wata',
    category: 'Vodoun',
    image: 'https://images.unsplash.com/photo-1560759226-14da22a643ef?auto=format&fit=crop&q=80&w=800',
    description: "Déesse des eaux, de la beauté et de la richesse spirituelle.",
    history: "Représentée souvent sous les traits d'une sirène ou d'une femme tenant des serpents, Mami Wata gouverne l'océan et les fleuves. Elle est invoquée for the sensualité, la guérison et le succès matériel.",
    dialect: "Mina, Fon, Goun, Global",
    audioText: "Mami Wata, reine des eaux."
  },
  {
    id: 'v5',
    name: 'Sakpata',
    category: 'Vodoun',
    image: 'https://images.unsplash.com/photo-1532012197367-6a974fb74a01?auto=format&fit=crop&q=80&w=800',
    description: "Divinité de la Terre, de la justice et de la guérison des épidémies.",
    history: "Aussi appelé 'Ayinon', Sakpata est le propriétaire de la terre. C'est une divinité crainte et respectée, liée à la variole autrefois, mais aujourd'hui invoquée for the fertilité des sols et la protection collective.",
    dialect: "Fon, Adja",
    audioText: "Sakpata, le maître de la terre."
  },
  {
    id: 'v6',
    name: 'Guelede',
    category: 'Masque',
    image: 'https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&q=80&w=800',
    description: "Hommage aux mères et à la puissance féminine.",
    history: "Le Guelede est un théâtre de rue rituel. Les masques en bois surmontés de scènes de la vie quotidienne servent à apaiser 'Nos Mères' ancestrales et à réguler la société par la satire et l'humour.",
    dialect: "Yoruba",
    audioText: "Guelede, hommage aux mères."
  },
  {
    id: 'v7',
    name: 'Heviosso',
    category: 'Vodoun',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
    description: "Dieu du tonnerre et de la foudre, garant de la justice divine.",
    history: "Il frappe ceux qui mentent ou volent. Heviosso est une divinité de feu et de force, symbolisée par la double hache. Il apporte la pluie bienfaitrice mais aussi la punition fulgurante.",
    dialect: "Fon, Yoruba (Sango)",
    audioText: "Heviosso, le tonnerre justicier."
  },
  {
    id: 'v8',
    name: 'Tohossou',
    category: 'Vodoun',
    image: 'https://images.unsplash.com/photo-1608481337062-4093bf3ed404?auto=format&fit=crop&q=80&w=800',
    description: "Roi des eaux et protecteur des naissances atypiques.",
    history: "Les Tohossou habitent les lakes et les rivières. Ils sont liés aux enfants nés avec des particularités physiques, considérés comme des messagers des profondeurs aquatiques.",
    dialect: "Fon",
    audioText: "Tohossou, le roi des lacs."
  },
  {
    id: 'v9',
    name: 'Oro',
    category: 'Masque',
    image: 'https://images.unsplash.com/photo-1596435680517-5e60d944e893?auto=format&fit=crop&q=80&w=800',
    description: "Société secrète masculine, esprit de la forêt et de la justice.",
    history: "Oro ne se voit pas, il s'entend par son cri strident (le rhombe). Il intervient lors des crises majeures de la communauté ou for the l'exécution des sentences traditionnelles.",
    dialect: "Yoruba",
    audioText: "Oro, le cri de la forêt."
  },
  {
    id: 'v10',
    name: 'Abikou',
    category: 'Esprit',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800',
    description: "Les enfants nés for the mourir et renaître sans cesse.",
    history: "Les Abikou font partie d'une confrérie d'esprits qui refusent de rester sur terre. Des rituels spécifiques sont pratiqués for the les attacher à la vie et rompre le cycle des décès prématurés dans une famille.",
    dialect: "Yoruba, Fon",
    audioText: "Abikou, l'enfant migrateur."
  }
];

// --- LANGUAGES DATA MOCKS (EXPENDED TO 30+ VIDEOS) ---
const GENERATE_CONVERSATIONS = (lang: string) => [
    { title: `Bienvenue en ${lang}`, desc: `Les salutations de base for the bien commencer en ${lang}.`, video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { title: 'Au Marché', desc: 'Apprendre à négocier et compter l\'argent.', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { title: 'La Famille', desc: 'Présenter ses proches et sa lignée ancestrale.', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { title: 'Le Restaurant', desc: 'Commander des plats traditionnels (Amiwo, Dakouin).', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { title: 'Se Déplacer', desc: 'Demander son chemin et prendre un Zémidjan.', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { title: 'Le Corps Humain', desc: 'Vocabulaire de base for the la santé et le bien-être.', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { title: 'La Nature', desc: 'Les noms des arbres, plantes et animaux sacrés.', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { title: 'Les Nombres', desc: 'Compter de 1 à 1000 sans difficulté.', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { title: 'Le Temps', desc: 'Heures, jours, mois et saisons au Bénin.', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { title: 'Les Couleurs', desc: 'Symbolisme et noms des teintes rituelles.', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { title: 'Chez le Bokonon', desc: 'Vocabulaire spécifique aux consultations du Fa.', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { title: 'La Maison', desc: 'Décrire son foyer et les objets du quotidien.', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { title: 'Les Vêtements', desc: 'Parler de mode traditionnelle et tissus.', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { title: 'Les Métiers', desc: 'Artisanat, commerce et agriculture.', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { title: 'Les Émotions', desc: 'Exprimer la joie, la paix et la gratitude.', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { title: 'Au Bureau', desc: 'Langage professionnel et échanges formels.', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { title: 'La Météo', desc: 'Parler de la pluie, du vent et de l\'harmattan.', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { title: 'Les Sports', desc: 'Jeux traditionnels et activités physiques.', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { title: 'La Musique', desc: 'Noms des instruments et chants rituels.', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { title: 'Les Voyages', desc: 'Raconter ses déplacements à travers le pays.', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { title: 'La Cuisine', desc: 'Verbes d\'action for the préparer un bon repas.', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { title: 'Les Fêtes', desc: 'Vocabulaire des célébrations et anniversaires.', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { title: 'Les Animaux', desc: 'Noms des animaux de la ferme et sauvages.', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { title: 'Le Shopping', desc: 'Aller plus loin que le simple marché local.', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { title: 'La Technologie', desc: 'Néologismes for the parler du digital.', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { title: 'Le Jardin', desc: 'Plantes médicinales et potager.', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { title: 'Les Contes', desc: 'Comprendre une histoire courte traditionnelle.', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { title: 'L\'Espace', desc: 'Étoiles, lune et cosmogonie spirituelle.', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { title: 'Le Respect', desc: 'Formules de politesse avancées (Honors).', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { title: 'Synthèse Finale', desc: 'Conversation réelle fluide et non dirigée.', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { title: 'Examen Oral', desc: 'Testez votre compréhension globale.', video: 'https://www.w3schools.com/html/mov_bbb.mp4' }
];

const LANGUAGES_DATA = [
    {
        id: 'fon',
        name: 'Fon',
        description: 'La langue la plus parlée au Sud du Bénin.',
        alphabet: [
            { char: 'A', phon: '[a]', audio: 'Ah' }, { char: 'B', phon: '[b]', audio: 'Be' }, { char: 'Ɖ', phon: '[ɖ]', audio: 'De retroflexe' },
            { char: 'E', phon: '[e]', audio: 'E ferme' }, { char: 'Ɛ', phon: '[ɛ]', audio: 'E ouvert' }, { char: 'Ɔ', phon: '[ɔ]', audio: 'O ouvert' }
        ],
        phrases: [
            { native: 'Awanu', french: 'Bonjour', type: 'salutation' },
            { native: 'Nago lo?', french: 'Comment vas-tu ?', type: 'social' },
            { native: 'Dagbe du', french: 'C\'est bon / Bien', type: 'social' }
        ],
        conversations: GENERATE_CONVERSATIONS('Fon')
    },
    {
        id: 'yoruba',
        name: 'Yoruba',
        description: 'Langue riche partagée avec le Nigéria.',
        alphabet: [
            { char: 'A', phon: '[a]', audio: 'Ah' }, { char: 'B', phon: '[b]', audio: 'Be' }, { char: 'Ẹ', phon: '[ɛ]', audio: 'E ouvert' },
            { char: 'Ọ', phon: '[ɔ]', audio: 'O ouvert' }, { char: 'Ṣ', phon: '[ʃ]', audio: 'She' }
        ],
        phrases: [
            { native: 'E nle o', french: 'Bonjour', type: 'salutation' },
            { native: 'Bao ni?', french: 'Ça va ?', type: 'social' }
        ],
        conversations: GENERATE_CONVERSATIONS('Yoruba')
    },
    { id: 'adja', name: 'Adja', description: 'Langue du sud-ouest du Bénin et du Togo.', conversations: GENERATE_CONVERSATIONS('Adja') },
    { id: 'goun', name: 'Goun', description: 'Langue de la région de Porto-Novo.', conversations: GENERATE_CONVERSATIONS('Goun') }
];

const MOCK_TRAINERS = {
    expert1: { name: 'Bokonon Amoussa', avatar: 'https://i.pravatar.cc/150?u=amoussa', bio: 'Maître du Fa depuis 30 ans, initié aux secrets de la forêt sacrée de Ouidah.' },
    expert2: { name: 'Dah Zannou', avatar: 'https://i.pravatar.cc/150?u=zannou', bio: 'Historien et gardien des traditions orales du Dahomey.' },
    expert3: { name: 'Mère Sika', avatar: 'https://i.pravatar.cc/150?u=sika', bio: 'Spécialiste des herbes médicinale et des rituels de protection féminins.' }
};

const REVIEWS_POOL: CourseReview[] = [
    { user: 'Jean-Marc K.', rating: 5, comment: 'Une clarté incroyable, enfin je comprends mes racines.', date: 'Il y a 2 jours' },
    { user: 'Sonia T.', rating: 4, comment: 'Très bien structuré, manque peut-être un peu de PDF.', date: 'Il y a 1 semaine' },
    { user: 'Gildas B.', rating: 5, comment: 'La vidéo est de super qualité. Merci Bokonon !', date: 'Il y a 3 jours' },
    { user: 'Koffi A.', rating: 5, comment: 'Le savoir ancestral à portée de clic. Bravo for the cette plateforme !', date: 'Il y a 4 jours' },
    { user: 'Afiwa S.', rating: 5, comment: 'Passionnant du début à la fin. Les explications sont limpides.', date: 'Il y a 6 jours' },
    { user: 'Yao K.', rating: 4, comment: 'J\'ai appris plus en 2h qu\'en 5 ans de recherches personnelles.', date: 'Il y a 10 jours' },
    { user: 'Zannou D.', rating: 5, comment: 'Un contenu authentique et profond. Fier de notre héritage.', date: 'Il y a 12 jours' },
    { user: 'Houéfa G.', rating: 5, comment: 'La plateforme est fluide et le contenu extrêmement riche.', date: 'Il y a 15 jours' },
    { user: 'Mawuna L.', rating: 4, comment: 'Indispensable for the tout Béninois de la diaspora.', date: 'Il y a 18 jours' },
    { user: 'Sènan V.', rating: 5, comment: 'Les explications sur les signes mères sont magistrales.', date: 'Il y a 20 jours' },
    { user: 'Bio N.', rating: 5, comment: 'Enfin une approche moderne et sérieuse de nos traditions.', date: 'Il y a 22 jours' },
    { user: 'Tchénon B.', rating: 4, comment: 'Merci for the cette transmission de qualité et cette rigueur.', date: 'Il y a 25 jours' },
    { user: 'Ayaba K.', rating: 5, comment: 'Très pédagogique, même for the les débutants complets.', date: 'Il y a 1 mois' },
    { user: 'Dossou P.', rating: 5, comment: 'Une expérience spirituelle unique à à travers mon écran.', date: 'Il y a 1 mois' },
    { user: 'Gbèto H.', rating: 4, comment: 'Les réponses du formateur aux commentaires sont très rapides.', date: 'Il y a 1 mois' },
    { user: 'Akouété E.', rating: 5, comment: 'Je recommande vivement ce temple du savoir à tous mes amis.', date: 'Il y a 1 mois' },
    { user: 'Falola J.', rating: 5, comment: 'Le système de quiz aide vraiment à mémoriser les signes.', date: 'Il y a 2 mois' },
    { user: 'Inès D.', rating: 5, comment: 'Chaque leçon est une révélation. Merci infiniment !', date: 'Il y a 1 mois' },
    { user: 'Codjo M.', rating: 4, comment: 'Une plateforme d\'excellence for the l\'initiation graduelle.', date: 'Il y a 2 mois' },
    { user: 'Bignon F.', rating: 5, comment: 'Fier de voir nos cultures valorisées avec autant de soin.', date: 'Il y a 2 mois' },
    { user: 'Modou T.', rating: 5, comment: 'L\'interface est sublime et le savoir est au rendez-vous.', date: 'Il y a 3 mois' }
];

const GENERATE_LESSONS = (prefix: string): Lesson[] => {
    return Array.from({ length: 22 }, (_, i) => ({
        id: `${prefix}-l${i + 1}`,
        title: `Leçon ${i + 1}: ${i === 0 ? 'Introduction sacrée' : i === 21 ? 'Conclusion et rites finaux' : 'Exploration des mystères du Du'}`,
        duration: `${Math.floor(Math.random() * 15) + 5}m`,
        thumbnail: `https://picsum.photos/800/450?random=${prefix}${i}`,
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        isCompleted: i < 2
    }));
};

const MOCK_COMMENTS: CourseComment[] = [
    {
        id: 'com1',
        user: 'Kodjo B.',
        avatar: 'https://i.pravatar.cc/150?u=kodjo',
        text: 'Est-ce que ce signe peut influencer les voyages ?',
        date: 'Il y a 1 heure',
        replies: [{ trainer: 'Bokonon Amoussa', text: 'Oui, Gbe-Meji favorise les déplacements vers le Nord.', date: 'Il y a 30 min' }]
    },
    {
        id: 'com2',
        user: 'Afiwa S.',
        avatar: 'https://i.pravatar.cc/150?u=afiwa',
        text: 'La qualité de l\'enseignement est incroyable. Merci for the la clarté.',
        date: 'Il y a 3 heures'
    }
];

const COURSES: Course[] = [
  { id: 'c1', title: 'Fondamentaux du Fa', type: 'video_free', level: 1, price: 0, completed: true, description: 'Comprendre l\'origine du Fa et son rôle dans la destinée humaine. Ce cours pose les bases métaphysiques du système de divination.', duration: '2h 15min', rating: 4.8, reviewCount: 156, isMostFollowed: true, trainer: MOCK_TRAINERS.expert1, benefits: ['Comprendre les 16 signes majeurs', 'Connaître les interdits alimentaires liés au Fa', 'Accès à la communauté des initiés'], videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', lessons: GENERATE_LESSONS('c1'), comments: MOCK_COMMENTS, reviews: REVIEWS_POOL, prerequisites: ["Aucun prérequis nécessaire", "Esprit ouvert"], requiredTools: [{id: '1', name: 'Le Grand Livre du Fa'}] },
  { id: 'c2', title: 'Les 16 Signes Mères', type: 'video_paid', level: 2, price: 5000, completed: false, description: 'Analyse ésotérique approfondie des 16 Du majeurs du système de divination. Chaque signe est décortiqué selon sa mythologie.', duration: '8h 45min', rating: 4.9, reviewCount: 89, isBestSeller: true, trainer: MOCK_TRAINERS.expert1, benefits: ['Maîtrise de la lecture symbolique', 'Certificat de fin d\'étude', 'Support PDF téléchargeable'], videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', lessons: GENERATE_LESSONS('c2'), comments: MOCK_COMMENTS, reviews: REVIEWS_POOL.slice(0, 15), prerequisites: ["Avoir terminé 'Fondamentaux du Fa'"], requiredTools: [{id: '1', name: 'Le Grand Livre du Fa'}, {id: '2', name: 'Chapelet de Divination'}] },
  { id: 'c3', title: 'Secrets des Plantes de Protection', type: 'video_paid', level: 2, price: 7500, completed: false, description: 'Identifiez et utilisez les herbes sacrées for the purifier votre environnement. Apprenez à reconnaître les feuilles "Aman".', duration: '4h 30min', rating: 4.7, reviewCount: 42, trainer: MOCK_TRAINERS.expert3, benefits: ['Identifiez 20 plantes sacrées', 'Apprenez les bains de purification', 'Accès à un herbier numérique'], videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', lessons: GENERATE_LESSONS('c3'), comments: MOCK_COMMENTS, reviews: REVIEWS_POOL.slice(5, 20), prerequisites: ["Amour de la nature"], requiredTools: [{id: '3', name: 'Kit Rituel Purific.'}] },
  { id: 'c4', title: 'Histoire des Rois d\'Abomey', type: 'video_free', level: 1, price: 0, completed: false, description: 'Un voyage historique au cœur de l\'empire du Dahomey et de ses lignées royales. Découvrez les hauts faits des souverains.', duration: '3h 15min', rating: 4.6, reviewCount: 210, trainer: MOCK_TRAINERS.expert2, benefits: ['Connaître la lignée des rois', 'Comprendre les emblèmes royaux', 'Archives historiques exclusives'], videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', lessons: GENERATE_LESSONS('c4'), comments: MOCK_COMMENTS, reviews: REVIEWS_POOL, prerequisites: ["Intérêt for the l'histoire africaine"] },
  { id: 'c5', title: 'L\'Art du Chapelet (Agumaga)', type: 'video_paid', level: 3, price: 12000, completed: false, description: 'Maîtrisez la manipulation technique du chapelet de divination. Ce cours technique s\'adresse à ceux qui souhaitent pratiquer.', duration: '10h 00min', rating: 5.0, reviewCount: 67, trainer: MOCK_TRAINERS.expert1, benefits: ['Techniques de lancer authentiques', 'Coaching personnalisé', 'Certification de praticien'], videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', lessons: GENERATE_LESSONS('c5'), comments: MOCK_COMMENTS, reviews: REVIEWS_POOL.slice(0, 10), prerequisites: ["Maîtrise des 16 Signes Mères"], requiredTools: [{id: '2', name: 'Chapelet de Divination'}] },
  { id: 'c6', title: 'Initiation aux Chants Vodoun', type: 'video_free', level: 1, price: 0, completed: false, description: 'Apprenez les chants sacrés (Gbo) for the invoquer les énergies de la nature. Une introduction mélodique à la spiritualité.', duration: '1h 45min', rating: 4.5, reviewCount: 120, trainer: MOCK_TRAINERS.expert3, benefits: ['Apprendre 5 chants majeurs', 'Comprendre le rythme du gong', 'Technique vocale rituelle'], videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', lessons: GENERATE_LESSONS('c6'), comments: MOCK_COMMENTS, reviews: REVIEWS_POOL },
  { id: 'c7', title: 'Symbolisme des Couleurs Sacrées', type: 'video_paid', level: 2, price: 4500, completed: false, description: 'Le blanc, le rouge, le noir... découvrez la signification profonde des couleurs dans les vêtements et autels rituels.', duration: '2h 30min', rating: 4.7, reviewCount: 56, trainer: MOCK_TRAINERS.expert2, benefits: ['Signification des perles', 'Choix des couleurs for the rituels', 'Psychologie des couleurs ancestrales'], videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', lessons: GENERATE_LESSONS('c7'), comments: MOCK_COMMENTS, reviews: REVIEWS_POOL },
  { id: 'c8', title: 'Géométrie Sacrée du Fa', type: 'video_paid', level: 3, price: 9000, completed: false, description: 'Une étude avancée des schémas mathématiques cachés derrière les signes. For the ceux qui aiment la logique et la mystique.', duration: '5h 15min', rating: 4.9, reviewCount: 34, trainer: MOCK_TRAINERS.expert1, benefits: ['Algorithmes du Fa', 'Tracé des signes complexes', 'Interprétation spatiale'], videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', lessons: GENERATE_LESSONS('c8'), comments: MOCK_COMMENTS, reviews: REVIEWS_POOL },
  { id: 'c9', title: 'Rituels de Prospérité Ancestrale', type: 'video_paid', level: 2, price: 15000, completed: false, description: 'Comment attirer l\'abondance en respectant les lois de la nature et les bénédictions des ancêtres.', duration: '4h 00min', rating: 4.8, reviewCount: 230, trainer: MOCK_TRAINERS.expert3, benefits: ['Offrandes de prospérité', 'Nettoyage des blocages financiers', 'Mantras de réussite'], videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', lessons: GENERATE_LESSONS('c9'), comments: MOCK_COMMENTS, reviews: REVIEWS_POOL },
  { id: 'c10', title: 'La Danse des Divinités (Egungun)', type: 'video_free', level: 1, price: 0, completed: false, description: 'Comprendre l\'ordre du revenant et la symbolique des masques dans la tradition Yoruba-Fon.', duration: '3h 45min', rating: 4.6, reviewCount: 88, trainer: MOCK_TRAINERS.expert2, benefits: ['Histoire des Egungun', 'Signification des costumes', 'Rôle social du culte'], videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', lessons: GENERATE_LESSONS('c10'), comments: MOCK_COMMENTS, reviews: REVIEWS_POOL },
  { id: 'c11', title: 'Fabrication d\'Encens Traditionnels', type: 'video_paid', level: 2, price: 6000, completed: false, description: 'Atelier pratique for the créer vos propres mélanges d\'encens for the la méditation et la purification.', duration: '2h 00min', rating: 4.7, reviewCount: 45, trainer: MOCK_TRAINERS.expert3, benefits: ['Recettes exclusives', 'Conservation des herbes', 'Utilisation du charbon sacré'], videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', lessons: GENERATE_LESSONS('c11'), comments: MOCK_COMMENTS, reviews: REVIEWS_POOL },
  { id: 'c12', title: 'Gastronomie Sacrée du Bénin', type: 'video_free', level: 1, price: 0, completed: false, description: 'Découvrez les plats rituels comme l\'Amiwo ou le Liha, et leur rôle dans les cérémonies vodoun.', duration: '2h 15min', rating: 4.5, reviewCount: 156, trainer: MOCK_TRAINERS.expert3, benefits: ['Recettes ancestrales', 'Signification des aliments', 'Éthique alimentaire sacrée'], videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', lessons: GENERATE_LESSONS('c12'), comments: MOCK_COMMENTS, reviews: REVIEWS_POOL },
  { id: 'c13', title: 'Histoire du Royaume de Porto-Novo', type: 'video_free', level: 1, price: 0, completed: false, description: 'L\'histoire de Hogbonou et de la dynastie des Toffa. Un complément indispensable à l\'histoire d\'Abomey.', duration: '3h 30min', rating: 4.4, reviewCount: 67, trainer: MOCK_TRAINERS.expert2, benefits: ['Origines du royaume', 'Traités avec l\'Occident', 'Patrimoine architectural'], videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', lessons: GENERATE_LESSONS('c13'), comments: MOCK_COMMENTS, reviews: REVIEWS_POOL },
  { id: 'c14', title: 'Les Divinités de l\'Eau (Mami Wata)', type: 'video_paid', level: 2, price: 11000, completed: false, description: 'Plongez dans les mystères du culte de l\'eau, de la sensualité et de la richesse spirituelle.', duration: '6h 00min', rating: 4.8, reviewCount: 92, trainer: MOCK_TRAINERS.expert3, benefits: ['Invocations aquatiques', 'Symbolique du serpent', 'Autels de l\'eau'], videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', lessons: GENERATE_LESSONS('c14'), comments: MOCK_COMMENTS, reviews: REVIEWS_POOL },
  { id: 'c15', title: 'Le Pouvoir des Mots (Aze)', type: 'video_paid', level: 3, price: 20000, completed: false, description: 'Apprenez à utiliser le verbe créateur et les incantations sacrées for the modifier votre réalité.', duration: '8h 00min', rating: 5.0, reviewCount: 28, trainer: MOCK_TRAINERS.expert1, benefits: ['Maîtrise de la parole de force', 'Protection par le verbe', 'Éveil de la conscience sonore'], videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', lessons: GENERATE_LESSONS('c15'), comments: MOCK_COMMENTS, reviews: REVIEWS_POOL },
  { id: 'c16', title: 'Astronomie Ancestrale et Fa', type: 'video_free', level: 2, price: 0, completed: false, description: 'Comment les anciens observaient les astres for the synchroniser les consultations du Fa avec les cycles lunaires.', duration: '2h 45min', rating: 4.7, reviewCount: 54, trainer: MOCK_TRAINERS.expert2, benefits: ['Calendrier lunaire Fon', 'Signes et constellations', 'Agriculture et marées'], videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', lessons: GENERATE_LESSONS('c16'), comments: MOCK_COMMENTS, reviews: REVIEWS_POOL },
  { id: 'c17', title: 'Guide des Forêts Sacrées', type: 'video_free', level: 1, price: 0, completed: false, description: 'Une visite guidée spirituelle des lieux les plus secrets du Sud-Bénin. Respect et écologie sacrée.', duration: '4h 15min', rating: 4.6, reviewCount: 110, trainer: MOCK_TRAINERS.expert2, benefits: ['Géographie spirituelle', 'Règles d\'accès', 'Biodiversité sacrée'], videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', lessons: GENERATE_LESSONS('c17'), comments: MOCK_COMMENTS, reviews: REVIEWS_POOL },
  { id: 'c18', title: 'Le Vêtement Rituel', type: 'video_paid', level: 2, price: 5500, completed: false, description: 'L\'importance du Bazin et du Pagne dans les cérémonies. Comment se draper avec dignité et protection.', duration: '1h 30min', rating: 4.5, reviewCount: 39, trainer: MOCK_TRAINERS.expert3, benefits: ['Techniques de nouage', 'Entretien des tenues', 'Coutumes vestimentaires'], videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', lessons: GENERATE_LESSONS('c18'), comments: MOCK_COMMENTS, reviews: REVIEWS_POOL },
  { id: 'c19', title: 'Méditation au son du Gong', type: 'video_free', level: 1, price: 0, completed: true, description: 'Séances de relaxation guidée utilisant les fréquences vibratoires des instruments traditionnels.', duration: '1h 00min', rating: 4.9, reviewCount: 180, trainer: MOCK_TRAINERS.expert3, benefits: ['Réduction du stress', 'Harmonisation des chakras', 'Sommeil réparateur'], videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', lessons: GENERATE_LESSONS('c19'), comments: MOCK_COMMENTS, reviews: REVIEWS_POOL },
  { id: 'c20', title: 'Gestion des Conflits par le Fa', type: 'video_paid', level: 2, price: 12500, completed: false, description: 'Utiliser la sagesse des signes for the résoudre les disputes familiales et communautaires.', duration: '5h 45min', rating: 4.8, reviewCount: 63, trainer: MOCK_TRAINERS.expert1, benefits: ['Médiation traditionnelle', 'Justice équitable', 'Réconciliation'], videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', lessons: GENERATE_LESSONS('c20'), comments: MOCK_COMMENTS, reviews: REVIEWS_POOL },
  { id: 'c21', title: 'Protection des Enfants', type: 'video_paid', level: 1, price: 8000, completed: false, description: 'Rites de naissance et amulettes de protection for the assurer une croissance harmonieuse aux plus jeunes.', duration: '3h 00min', rating: 4.7, reviewCount: 77, trainer: MOCK_TRAINERS.expert3, benefits: ['Baptême traditionnel', 'Remèdes naturels', 'Surveillance spirituelle'], videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', lessons: GENERATE_LESSONS('c21'), comments: MOCK_COMMENTS, reviews: REVIEWS_POOL },
  { id: 'c22', title: 'Architecture des Temples', type: 'video_free', level: 2, price: 0, completed: false, description: 'Étude des plans et de l\'orientation des couvents Vodoun. Espace, temps et sacré.', duration: '4h 45min', rating: 4.6, reviewCount: 41, trainer: MOCK_TRAINERS.expert2, benefits: ['Construction vernaculaire', 'Symbolisme des murs', 'Orientation solaire'], videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', lessons: GENERATE_LESSONS('c22'), comments: MOCK_COMMENTS, reviews: REVIEWS_POOL },
];

interface LearningProps {
    user: User;
    onToggleDetail?: (isDetail: boolean) => void;
    initialCourseId?: string;
    onNavigate: (page: 'home' | 'store' | 'learning' | 'dashboard' | 'contact' | 'faq' | 'about' | 'cart' | 'auth' | 'news', id?: string) => void;
}

export const Learning: React.FC<LearningProps> = ({ user, onToggleDetail, initialCourseId, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'languages' | 'origins' | 'fa-alphabet' | 'vodouns' | 'quiz' | 'certificate'>('courses');
  const [selectedSign, setSelectedSign] = useState(FA_SIGNS[0]);
  const [selectedVodoun, setSelectedVodoun] = useState(VODOUNS_DATA[0]);
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES_DATA[0]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(initialCourseId || null);
  const [isPlayingCourse, setIsPlayingCourse] = useState(false);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [mobileCommentsOpen, setMobileCommentsOpen] = useState(false);
  const [selectedCertCourse, setSelectedCertCourse] = useState<Course | null>(null);

  // States for Quiz Space
  const [currentQuizCategory, setCurrentQuizCategory] = useState<QuizCategory | null>(null);
  const [quizStep, setQuizStep] = useState<'selection' | 'game' | 'results'>('selection');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  // States for Origins search
  const [searchLastName, setSearchLastName] = useState('');
  const [originResult, setOriginResult] = useState<typeof ORIGINS_DATA[string] | null>(null);
  const [isSearchingOrigin, setIsSearchingOrigin] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLeafletLoaded, setIsLeafletLoaded] = useState(false);
  const originMapRef = useRef<any>(null);

  // Refs for tab auto-centering
  const scrollRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const faSignRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});
  const vodounRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const langRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  // Rotating comment state for mobile preview
  const [activeCommentPreviewIndex, setActiveCommentPreviewIndex] = useState(0);

  // Load Leaflet for Origins Map
  useEffect(() => {
    if (activeTab === 'origins') {
      if ((window as any).L) {
        setIsLeafletLoaded(true);
        return;
      }
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => setIsLeafletLoaded(true);
      document.body.appendChild(script);
    }
  }, [activeTab]);

  // Initialize Origin Map
  useEffect(() => {
    if (originResult && isLeafletLoaded && activeTab === 'origins') {
        const timer = setTimeout(() => {
            const container = document.getElementById('origin-map');
            if (container) {
                const L = (window as any).L;
                if (originMapRef.current) {
                    originMapRef.current.remove();
                }
                originMapRef.current = L.map('origin-map', { zoomControl: false, scrollWheelZoom: false }).setView([originResult.lat, originResult.lng], 12);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; OpenStreetMap'
                }).addTo(originMapRef.current);
                
                L.circleMarker([originResult.lat, originResult.lng], {
                    radius: 10,
                    fillColor: "#6b4028",
                    color: "#d1984b",
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.8
                }).addTo(originMapRef.current);
            }
        }, 300);
        return () => clearTimeout(timer);
    }
  }, [originResult, isLeafletLoaded, activeTab]);

  useEffect(() => {
    if (initialCourseId) setSelectedCourseId(initialCourseId);
  }, [initialCourseId]);

  const selectedCourse = COURSES.find(c => c.id === selectedCourseId) || null;
  const currentLesson = selectedCourse?.lessons?.[currentLessonIndex] || selectedCourse?.lessons?.[0];

  useEffect(() => {
    if (onToggleDetail) {
        onToggleDetail(!!selectedCourseId || isPlayingCourse || activeTab !== 'courses' || !!selectedCertCourse || quizStep !== 'selection');
    }
  }, [selectedCourseId, isPlayingCourse, activeTab, onToggleDetail, selectedCertCourse, quizStep]);

  // Logic for rotating mobile comment preview
  useEffect(() => {
    if (selectedCourse?.comments && selectedCourse.comments.length > 1) {
        const interval = setInterval(() => {
            setActiveCommentPreviewIndex(prev => (prev + 1) % (selectedCourse.comments?.length || 1));
        }, 15000); 
        return () => clearInterval(interval);
    }
  }, [selectedCourse?.id, selectedCourse?.comments?.length]);

  const playPronunciation = (text: string) => {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(true);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fr-FR';
        utterance.onend = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
    }
  };

  const handleTabClick = (tabId: any) => {
    setActiveTab(tabId);
    setSelectedCourseId(null);
    setSelectedCertCourse(null);
    setQuizStep('selection');
    // Smooth scroll current tab to center
    scrollRefs.current[tabId]?.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
    });
  };

  const handleFaSignClick = (sign: typeof FA_SIGNS[0]) => {
      setSelectedSign(sign);
      faSignRefs.current[sign.id]?.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
      });
  };

  const handleVodounClick = (vodoun: typeof VODOUNS_DATA[0]) => {
      setSelectedVodoun(vodoun);
      vodounRefs.current[vodoun.id]?.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
      });
  };

  const handleLangClick = (lang: typeof LANGUAGES_DATA[0]) => {
      setSelectedLanguage(lang);
      langRefs.current[lang.id]?.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
      });
  };

  const handleCourseClick = (id: string) => {
      setSelectedCourseId(id);
      setIsPlayingCourse(false); 
      setIsPreviewing(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startPlayingCourse = () => {
      setIsPlayingCourse(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOriginSearch = (e: React.FormEvent) => {
      e.preventDefault();
      if (!searchLastName.trim()) return;
      
      setIsSearchingOrigin(true);
      setHasSearched(false);
      
      setTimeout(() => {
          const upperName = searchLastName.toUpperCase().trim();
          const result = ORIGINS_DATA[upperName] || null;
          setOriginResult(result);
          setIsSearchingOrigin(false);
          setHasSearched(true);
      }, 1500);
  };

  // --- QUIZ LOGIC ---
  const startQuiz = (category: QuizCategory) => {
    setCurrentQuizCategory(category);
    setCurrentQuestionIdx(0);
    setScore(0);
    setSelectedOption(null);
    setHasAnswered(false);
    setQuizStep('game');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnswer = (optionIdx: number) => {
    if (hasAnswered) return;
    setSelectedOption(optionIdx);
    setHasAnswered(true);
    if (optionIdx === currentQuizCategory?.questions[currentQuestionIdx].correctAnswer) {
        setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (!currentQuizCategory) return;
    if (currentQuestionIdx < currentQuizCategory.questions.length - 1) {
        setCurrentQuestionIdx(prev => prev + 1);
        setSelectedOption(null);
        setHasAnswered(false);
    } else {
        setQuizStep('results');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderQuiz = () => {
    if (quizStep === 'selection') {
        return (
            <div className="space-y-12 animate-fadeIn">
                <div className="text-center max-w-2xl mx-auto space-y-4">
                    <h3 className="text-3xl md:text-5xl font-serif font-black text-brand-900 uppercase">Défis de la Sagesse</h3>
                    <p className="text-stone-500 italic">"La connaissance ne vaut que si elle est mise à l'épreuve. Choisissez votre domaine de maîtrise."</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {QUIZ_DATA.map(cat => (
                        <div 
                            key={cat.id} 
                            onClick={() => startQuiz(cat)}
                            className="bg-white p-8 rounded-[3rem] border border-brand-50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group flex flex-col items-center text-center space-y-6"
                        >
                            <div className={`${cat.color} w-20 h-20 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform`}>
                                <cat.icon size={32} />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-xl font-serif font-bold text-brand-900 uppercase tracking-tight">{cat.title}</h4>
                                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{cat.questions.length} Épreuves Sacrées</p>
                            </div>
                            <button className="px-8 py-3 bg-brand-50 text-brand-800 rounded-full text-[10px] font-black uppercase tracking-widest group-hover:bg-brand-900 group-hover:text-white transition-all">
                                Commencer le défi
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (quizStep === 'game' && currentQuizCategory) {
        const question = currentQuizCategory.questions[currentQuestionIdx];
        const progress = ((currentQuestionIdx + 1) / currentQuizCategory.questions.length) * 100;

        return (
            <div className="max-w-3xl mx-auto space-y-8 animate-slideUp">
                <div className="flex justify-between items-center px-4">
                    <button onClick={() => setQuizStep('selection')} className="flex items-center gap-2 text-stone-400 hover:text-brand-900 font-bold transition-colors">
                        <X size={20} /> Quitter
                    </button>
                    <div className="text-center">
                        <p className="text-[10px] font-black uppercase text-brand-500 tracking-widest">{currentQuizCategory.title}</p>
                        <p className="text-xs font-bold text-stone-400">Épreuve {currentQuestionIdx + 1} / {currentQuizCategory.questions.length}</p>
                    </div>
                    <div className="w-20"></div>
                </div>

                <div className="bg-white rounded-[3rem] shadow-2xl border border-brand-50 overflow-hidden relative">
                    <div className="h-2 bg-stone-100 w-full overflow-hidden">
                        <div className="h-full bg-brand-600 transition-all duration-700" style={{ width: `${progress}%` }}></div>
                    </div>

                    <div className="p-10 md:p-16 space-y-10">
                        <div className="text-center space-y-6">
                            <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto text-brand-600 shadow-inner">
                                <HelpCircle size={32} />
                            </div>
                            <h4 className="text-2xl md:text-3xl font-serif font-black text-brand-900 leading-tight">
                                {question.text}
                            </h4>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {question.options.map((opt, idx) => {
                                let style = "bg-stone-50 border-stone-100 hover:border-brand-300 hover:bg-white";
                                if (hasAnswered) {
                                    if (idx === question.correctAnswer) style = "bg-green-50 border-green-500 text-green-700 ring-4 ring-green-500/10";
                                    else if (idx === selectedOption) style = "bg-red-50 border-red-500 text-red-700 ring-4 ring-red-500/10 opacity-60";
                                    else style = "bg-stone-50 border-stone-100 opacity-40";
                                }

                                return (
                                    <button 
                                        key={idx}
                                        onClick={() => handleAnswer(idx)}
                                        disabled={hasAnswered}
                                        className={`p-6 rounded-2xl border-2 transition-all text-left font-bold relative group ${style}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black transition-colors ${hasAnswered && idx === question.correctAnswer ? 'bg-green-500 text-white' : 'bg-white border border-stone-200 text-stone-400 group-hover:text-brand-900'}`}>
                                                {String.fromCharCode(65 + idx)}
                                            </span>
                                            <span className="text-base md:text-lg">{opt}</span>
                                        </div>
                                        {hasAnswered && idx === question.correctAnswer && <CheckCircle className="absolute right-6 top-1/2 -translate-y-1/2 text-green-600" />}
                                        {hasAnswered && idx === selectedOption && idx !== question.correctAnswer && <AlertCircle className="absolute right-6 top-1/2 -translate-y-1/2 text-red-600" />}
                                    </button>
                                );
                            })}
                        </div>

                        {hasAnswered && (
                            <div className="bg-brand-50 p-8 rounded-[2rem] border border-brand-100 space-y-4 animate-fadeIn">
                                <div className="flex items-center gap-3">
                                    <Sparkles className="text-brand-600" size={20} />
                                    <span className="font-serif font-black text-brand-900 uppercase text-xs tracking-widest">Le Savoir des Sages</span>
                                </div>
                                <p className="text-stone-700 leading-relaxed italic">
                                    {question.explanation}
                                </p>
                                <button 
                                    onClick={nextQuestion}
                                    className="w-full mt-4 bg-brand-900 text-white py-5 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3"
                                >
                                    {currentQuestionIdx === currentQuizCategory.questions.length - 1 ? "VOIR MON BILAN" : "QUESTION SUIVANTE"} <ChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (quizStep === 'results' && currentQuizCategory) {
        const percentage = (score / currentQuizCategory.questions.length) * 100;
        return (
            <div className="max-w-2xl mx-auto space-y-10 animate-slideUp">
                <div className="bg-white rounded-[3.5rem] shadow-2xl border border-brand-50 overflow-hidden text-center relative">
                    <div className={`${percentage >= 80 ? 'bg-green-600' : percentage >= 50 ? 'bg-amber-500' : 'bg-brand-900'} p-16 text-white relative overflow-hidden`}>
                        <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                            <Trophy size={250} />
                        </div>
                        <div className="relative z-10 space-y-4">
                            <span className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">Résultats de l'Épreuve</span>
                            <h3 className="text-4xl md:text-6xl font-serif font-black uppercase tracking-tight">BILAN SACRÉ</h3>
                            <div className="pt-4">
                                <div className="w-32 h-32 bg-white/10 rounded-full border-4 border-white/30 flex items-center justify-center mx-auto backdrop-blur-xl">
                                    <span className="text-4xl font-serif font-black">{score}/{currentQuizCategory.questions.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-10 md:p-16 space-y-8">
                        <div className="space-y-4">
                            <h4 className="text-2xl font-serif font-bold text-brand-900">
                                {percentage === 100 ? "Maîtrise Absolue !" : percentage >= 80 ? "Grand Initié !" : percentage >= 50 ? "Aspirant Sérieux" : "Le chemin est encore long"}
                            </h4>
                            <p className="text-stone-500 leading-relaxed italic max-w-sm mx-auto">
                                {percentage === 100 
                                    ? "Les ancêtres vous ont révélé leurs secrets. Votre esprit est pur et votre connaissance est sans faille." 
                                    : percentage >= 50 
                                    ? "Vous possédez les bases essentielles, mais la sagesse demande encore un peu de recueillement et d'étude." 
                                    : "Ne vous découragez pas. Chaque erreur est un pas vers la vérité. Replongez dans le Temple du Savoir."}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => setQuizStep('selection')}
                                className="flex-1 py-5 bg-stone-50 text-stone-500 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-stone-100 hover:text-brand-900 transition-all"
                            >
                                Autres disciplines
                            </button>
                            <button 
                                onClick={() => startQuiz(currentQuizCategory)}
                                className="flex-1 py-5 bg-brand-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2"
                            >
                                <RefreshCw size={14} /> Recommencer
                            </button>
                        </div>

                        <div className="pt-8 border-t border-stone-100">
                             <button onClick={() => onNavigate('learning')} className="text-brand-600 font-black uppercase tracking-widest text-[10px] hover:underline flex items-center gap-2 mx-auto">
                                <BookOpen size={16} /> Approfondir mes connaissances
                             </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return null;
  };

  const renderOrigins = () => (
      <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn">
          <div className="bg-white p-10 md:p-16 rounded-[3.5rem] shadow-2xl border border-brand-50 relative overflow-hidden flex flex-col items-center">
              <div className="absolute top-0 left-0 w-full h-3 bg-brand-600"></div>
              
              <div className="text-center space-y-4 mb-12">
                  <div className="inline-flex items-center justify-center p-4 bg-brand-50 rounded-full mb-2">
                      <MapPin className="text-brand-600" size={40} />
                  </div>
                  <h3 className="text-3xl md:text-5xl font-serif font-black text-brand-900 uppercase">Retrouvez vos Racines</h3>
                  <p className="text-stone-500 text-lg max-w-xl mx-auto italic">Entrez votre nom de famille for the découvrir l'histoire de votre lignée au Bénin.</p>
              </div>

              <form onSubmit={handleOriginSearch} className="w-full max-w-2xl px-2 md:px-0">
                  <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center relative group">
                      <div className="relative flex-grow">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-brand-600 transition-colors" size={24} />
                        <input 
                            type="text" 
                            placeholder="VOTRE NOM DE FAMILLE..." 
                            value={searchLastName}
                            onChange={(e) => setSearchLastName(e.target.value)}
                            className="w-full pl-16 pr-6 py-5 md:py-6 bg-stone-50 border-2 border-stone-100 rounded-2xl md:rounded-[2.5rem] outline-none focus:ring-8 focus:ring-brand-500/5 focus:border-brand-500 focus:bg-white transition-all text-base md:text-lg font-black uppercase tracking-widest shadow-inner"
                        />
                      </div>
                      <button 
                          type="submit" 
                          disabled={isSearchingOrigin || !searchLastName.trim()}
                          className="bg-brand-900 text-white px-10 py-5 md:py-6 rounded-2xl md:rounded-full font-black uppercase tracking-widest text-[11px] shadow-xl hover:bg-black transition-all disabled:opacity-30 active:scale-95 flex items-center justify-center min-w-[160px]"
                      >
                          {isSearchingOrigin ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : "RECHERCHER"}
                      </button>
                  </div>
                  <div className="mt-4 flex justify-center gap-3">
                      <span className="text-[9px] font-bold text-stone-300 uppercase tracking-widest">Exemples :</span>
                      {['SOGLO', 'ZINSOU', 'BIO TCHANE'].map(name => (
                          <button key={name} type="button" onClick={() => { setSearchLastName(name); }} className="text-[9px] font-black text-brand-400 uppercase tracking-widest hover:text-brand-600 transition-colors underline">{name}</button>
                      ))}
                  </div>
              </form>

              {hasSearched && !isSearchingOrigin && (
                  <div className="w-full mt-16 animate-slideUp">
                      {originResult ? (
                          <div className="space-y-6">
                              {/* 0. Hero Identity Card */}
                              <div className="bg-[#6b4028] p-12 md:p-20 rounded-[3.5rem] md:rounded-[4rem] text-center text-white space-y-8 shadow-2xl relative overflow-hidden animate-fadeIn mb-8">
                                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-500/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
                                  
                                  <div className="space-y-2 relative z-10">
                                      <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-brand-300/80">LIGNÉE IDENTIFIÉE</span>
                                      <h4 className="text-5xl md:text-8xl font-serif font-black uppercase tracking-tight drop-shadow-lg">{searchLastName.toUpperCase()}</h4>
                                  </div>
                                  
                                  <div className="w-32 h-0.5 bg-white/10 mx-auto rounded-full relative z-10"></div>
                                  
                                  <div className="flex flex-wrap justify-center gap-3 md:gap-4 relative z-10">
                                      <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-full flex items-center gap-2.5 backdrop-blur-md shadow-lg transition-transform hover:scale-105">
                                          <MapPin size={16} className="text-brand-400" />
                                          <span className="text-[9px] md:text-[11px] font-black uppercase tracking-widest">{originResult.village.toUpperCase()}</span>
                                      </div>
                                      <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-full flex items-center gap-2.5 backdrop-blur-md shadow-lg transition-transform hover:scale-105">
                                          <Globe size={16} className="text-brand-400" />
                                          <span className="text-[9px] md:text-[11px] font-black uppercase tracking-widest">{originResult.language.toUpperCase()}</span>
                                      </div>
                                  </div>
                              </div>

                              {/* 1. Village & Panégyrique */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {/* Section Village d'Origine avec Carte */}
                                  <div className="bg-[#fdfbf6] p-8 rounded-[2.5rem] border border-[#f0e6cb]/30 shadow-sm space-y-4 flex flex-col">
                                      <div className="flex items-center gap-3">
                                          <MapPin className="text-[#a26131]" size={20} />
                                          <h5 className="font-serif font-black text-[#6b4028] uppercase text-xs tracking-widest">VILLAGE D'ORIGINE</h5>
                                      </div>
                                      <div className="space-y-1">
                                          <p className="text-2xl font-serif font-black text-stone-700">{originResult.village}</p>
                                          <div className="flex items-center gap-2 text-[#a26131]/60 text-[10px] font-black uppercase tracking-widest pb-4">
                                              <Globe size={14} /> 
                                              <span>DIALECTE : {originResult.language}</span>
                                          </div>
                                      </div>
                                      {/* ZONE DE LA CARTE */}
                                      <div className="mt-auto h-48 md:h-64 bg-stone-100 rounded-[2rem] overflow-hidden border border-[#f0e6cb]/50 shadow-inner relative group">
                                          <div id="origin-map" className="w-full h-full z-0"></div>
                                          {!isLeafletLoaded && (
                                              <div className="absolute inset-0 flex items-center justify-center bg-stone-50">
                                                  <RefreshCw className="animate-spin text-brand-300" size={24} />
                                              </div>
                                          )}
                                          <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur px-3 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest text-brand-900 border border-brand-50 shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                              Position sacrée : {originResult.region}, Bénin
                                          </div>
                                      </div>
                                  </div>

                                  {/* Section Panégyrique (Ako) */}
                                  <div className="bg-[#fdfbf6] p-8 rounded-[2.5rem] border border-[#f0e6cb]/30 shadow-sm space-y-4 relative group/ako flex flex-col">
                                      <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-3">
                                              <MessageSquare className="text-[#a26131]" size={20} />
                                              <h5 className="font-serif font-black text-[#6b4028] uppercase text-xs tracking-widest">PANÉGYRIQUE (AKO)</h5>
                                          </div>
                                          <button 
                                              onClick={() => playPronunciation(originResult.akoNative)}
                                              className="p-2.5 bg-[#f0e6cb]/40 text-[#a26131] rounded-full hover:bg-brand-600 hover:text-white transition-all shadow-sm active:scale-90"
                                              title="Écouter le panégyrique"
                                          >
                                              <Volume2 size={16} />
                                          </button>
                                      </div>
                                      <div className="space-y-4 flex-grow">
                                          <p className="text-[#6b4028] font-serif font-bold italic text-lg leading-relaxed">
                                              "{originResult.akoNative}"
                                          </p>
                                          <div className="w-12 h-0.5 bg-[#f0e6cb]"></div>
                                          <p className="text-stone-500 italic text-sm leading-relaxed">
                                              <span className="font-black text-[9px] uppercase tracking-widest text-[#a26131]/50 block mb-1">Traduction :</span>
                                              {originResult.akoFrench}
                                          </p>
                                      </div>
                                  </div>
                              </div>

                              {/* 2. Fétiches & Masques */}
                              <div className="bg-[#fdfbf6] p-8 rounded-[2.5rem] border border-[#f0e6cb]/30 shadow-sm space-y-4">
                                  <div className="flex items-center gap-3">
                                      <Ghost className="text-[#a26131]" size={20} />
                                      <h5 className="font-serif font-black text-[#6b4028] uppercase text-xs tracking-widest">FÉTICHES & MASQUES</h5>
                                  </div>
                                  <p className="text-sm font-black text-stone-600 uppercase tracking-widest">
                                      {[...originResult.fetishes, ...originResult.masks].join(', ')}
                                  </p>
                              </div>

                              {/* 3. Cérémonies & Evènements */}
                              <div className="bg-[#fdfbf6] p-8 rounded-[2.5rem] border border-[#f0e6cb]/30 shadow-sm space-y-6">
                                  <div className="flex items-center gap-3">
                                      <Calendar className="text-[#a26131]" size={20} />
                                      <h5 className="font-serif font-black text-[#6b4028] uppercase text-xs tracking-widest">CÉRÉMONIES & ÉVÈNEMENTS</h5>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                      {originResult.ceremonies.map((ceremonyName, cIdx) => {
                                          const uiData = CEREMONY_UI_MAP[ceremonyName] || { id: 'e1', image: 'https://images.unsplash.com/photo-1590739293166-791786523152?auto=format&fit=crop&q=80&w=400' };
                                          return (
                                              <div key={cIdx} className="bg-white p-3 rounded-3xl border border-stone-100 flex items-center gap-4 group hover:shadow-md transition-all">
                                                  <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-inner">
                                                      <img src={uiData.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={ceremonyName} />
                                                  </div>
                                                  <div className="flex-grow min-w-0">
                                                      <p className="text-[10px] font-black text-brand-500 uppercase tracking-widest mb-1 truncate">{ceremonyName}</p>
                                                      <button 
                                                          onClick={() => onNavigate('events', uiData.id)}
                                                          className="flex items-center gap-1.5 text-stone-900 font-bold text-[9px] uppercase tracking-widest hover:text-brand-600 transition-colors"
                                                      >
                                                          Explorer l'évènement <ChevronRight size={12} className="text-brand-400" />
                                                      </button>
                                                  </div>
                                              </div>
                                          );
                                      })}
                                  </div>
                              </div>

                              {/* 4. Histoire du Village */}
                              <div className="bg-[#fdfbf6] p-10 rounded-[3rem] border-2 border-dashed border-[#f0e6cb] shadow-inner space-y-6">
                                  <div className="flex items-center gap-3">
                                      <HistoryIcon className="text-[#a26131]" size={20} />
                                      <h5 className="font-serif font-black text-[#6b4028] uppercase text-xs tracking-widest">HISTOIRE DU VILLAGE</h5>
                                  </div>
                                  <p className="text-stone-600 leading-[1.8] italic text-base md:text-lg">
                                      {originResult.history}
                                  </p>
                              </div>

                              {/* Action Footer */}
                              <div className="pt-10 text-center border-t border-stone-100 space-y-6">
                                  <p className="text-stone-400 text-sm italic">Vous souhaitez approfondir la connaissance de votre lignée ?</p>
                                  <button onClick={() => onNavigate('dashboard')} className="bg-brand-900 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-black transition-all flex items-center gap-4 mx-auto">
                                      CONSULTER UN SAGE POUR MA LIGNÉE <Sparkles size={18} />
                                  </button>
                              </div>
                          </div>
                      ) : (
                          <div className="bg-stone-50 rounded-[3rem] p-12 text-center space-y-6 border-2 border-dashed border-stone-200">
                              <HelpCircle size={48} className="text-stone-300 mx-auto" />
                              <div className="space-y-2">
                                  <h4 className="text-xl font-serif font-black text-brand-900 uppercase tracking-tight">Archives célestes silencieuses</h4>
                                  <p className="text-stone-500 max-sm mx-auto">Nous n'avons pas encore numérisé l'histoire du nom <strong>{searchLastName}</strong>. Notre temple s'élargit chaque jour.</p>
                              </div>
                              <button onClick={() => setSearchLastName('')} className="text-brand-600 font-black uppercase tracking-widest text-[10px] hover:underline">Essayer un autre nom</button>
                          </div>
                      )}
                  </div>
              )}
          </div>
      </div>
  );

  const renderComments = () => (
    <div className="space-y-8 h-full flex flex-col">
        <div className="flex gap-4 p-2">
            <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center shrink-0 font-bold text-brand-600 shadow-inner">{user.name.charAt(0)}</div>
            <div className="flex-grow space-y-3">
                <textarea placeholder="Partagez vos réflexions..." className="w-full p-4 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500 h-24 text-sm"></textarea>
                <button className="bg-brand-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:bg-black transition-all">Envoyer</button>
            </div>
        </div>

        <div className="space-y-8 overflow-y-auto pr-2">
            {selectedCourse?.comments?.map(comment => (
                <div key={comment.id} className="space-y-4">
                    <div className="flex gap-4">
                        <img src={comment.avatar} className="w-10 h-10 rounded-full shadow-md border-2 border-white" alt="" />
                        <div className="bg-stone-50 p-5 rounded-[2rem] rounded-tl-none border border-stone-100 flex-grow relative shadow-sm">
                            <div className="flex justify-between items-center mb-1">
                                <p className="text-xs font-bold text-brand-900">{comment.user}</p>
                                <p className="text-[10px] text-stone-400">{comment.date}</p>
                            </div>
                            <p className="text-sm text-stone-600 leading-relaxed">{comment.text}</p>
                        </div>
                    </div>
                    {comment.replies?.map((reply, rid) => (
                        <div key={rid} className="flex gap-4 pl-12">
                            <CornerDownRight className="text-brand-300 mt-2 shrink-0" size={20} />
                            <div className="bg-brand-50 p-5 rounded-[2rem] rounded-tl-none border border-stone-100 flex-grow relative shadow-inner">
                                <div className="flex justify-between items-center mb-1">
                                    <div className="flex items-center gap-2">
                                        <img src={selectedCourse?.trainer.avatar} className="w-6 h-6 rounded-full" alt="" />
                                        <p className="text-xs font-bold text-brand-700">{reply.trainer} <span className="text-[8px] bg-brand-200 px-1.5 py-0.5 rounded ml-1">Formateur</span></p>
                                    </div>
                                    <p className="text-[10px] text-stone-400">{reply.date}</p>
                                </div>
                                <p className="text-sm text-stone-700 leading-relaxed italic">{reply.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    </div>
  );

  // --- LANGUAGES VIEW ---
  const renderLanguages = () => (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-fadeIn">
        {/* Sidebar Langues */}
        <div className="lg:col-span-1 space-y-4">
            <div className="flex flex-row lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto no-scrollbar lg:tradition-scrollbar pb-4 lg:pb-0 snap-x">
                {LANGUAGES_DATA.map(lang => (
                    <button 
                        key={lang.id} 
                        ref={el => langRefs.current[lang.id] = el}
                        onClick={() => handleLangClick(lang)}
                        className={`shrink-0 w-48 lg:w-full snap-center p-6 rounded-[2rem] border transition-all text-left flex flex-col gap-2 ${selectedLanguage.id === lang.id ? 'bg-brand-900 text-white border-brand-900 shadow-xl' : 'bg-white border-brand-50 text-brand-900 hover:border-brand-200'}`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-black uppercase tracking-widest">{lang.name}</span>
                            <Globe size={14} className={selectedLanguage.id === lang.id ? 'text-brand-400' : 'text-brand-600'} />
                        </div>
                        <p className={`text-[10px] font-medium leading-tight ${selectedLanguage.id === lang.id ? 'text-brand-100' : 'text-stone-400'}`}>{lang.description}</p>
                    </button>
                ))}
            </div>

            {/* Desktop Offers Sidebar - Only on Desktop */}
            <div className="hidden lg:block space-y-4 pt-6 border-t border-brand-100">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 px-2">Accompagnement Guides</h4>
                
                {/* Premium Desktop */}
                <div className="bg-gradient-to-br from-brand-800 to-brand-950 p-6 rounded-[2.5rem] text-white space-y-6 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                    <div className="space-y-1 relative z-10">
                        <span className="bg-brand-500 text-brand-900 px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest">Premium</span>
                        <h5 className="text-lg font-serif font-bold">Guide en Ligne</h5>
                        <ul className="space-y-1.5 mt-3">
                            <li className="flex items-center gap-2 text-[9px] font-medium text-brand-200"><CheckCircle size={10} /> Pack Gratuit inclus</li>
                            <li className="flex items-center gap-2 text-[9px] font-medium text-brand-200"><CheckCircle size={10} /> Guide humain à distance</li>
                            <li className="flex items-center gap-2 text-[9px] font-medium text-brand-200"><CheckCircle size={10} /> Rythme personnalisé</li>
                        </ul>
                    </div>
                    <button className="w-full py-3 bg-brand-500 text-brand-900 rounded-xl font-black uppercase tracking-widest text-[9px] shadow-lg hover:bg-white transition-all">S'inscrire</button>
                </div>
                
                {/* Gold Desktop */}
                <div className="bg-gradient-to-br from-amber-500 to-brand-700 p-6 rounded-[2.5rem] text-white space-y-6 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                    <div className="space-y-1 relative z-10">
                        <span className="bg-white text-brand-900 px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest">Gold</span>
                        <h5 className="text-lg font-serif font-bold">Immersion Totale</h5>
                        <ul className="space-y-1.5 mt-3">
                            <li className="flex items-center gap-2 text-[9px] font-medium text-white/80"><CheckCircle size={10} /> Pack Premium inclus</li>
                            <li className="flex items-center gap-2 text-[9px] font-medium text-white/80"><CheckCircle size={10} /> Présentiel au Bénin</li>
                            <li className="flex items-center gap-2 text-[9px] font-medium text-white/80"><CheckCircle size={10} /> Immersion intensive</li>
                        </ul>
                    </div>
                    <button className="w-full py-3 bg-white text-brand-900 rounded-xl font-black uppercase tracking-widest text-[9px] shadow-lg hover:bg-stone-50 transition-all">S'inscrire</button>
                </div>
            </div>
        </div>

        {/* Zone de Contenu Langues */}
        <div className="lg:col-span-3 space-y-10">
            <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-2xl border border-brand-50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-brand-600"></div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                    <h3 className="text-3xl md:text-5xl font-serif font-black text-brand-900 leading-tight">Dialecte {selectedLanguage.name}</h3>
                    <div className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100 shadow-inner shrink-0">
                        <Sparkles size={14}/> Accès Gratuit
                    </div>
                </div>

                {/* Section Alphabet */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-2 border-b border-stone-100">
                        <div className="w-2 h-6 bg-brand-500 rounded-full"></div>
                        <h4 className="font-serif font-bold text-xl md:text-2xl text-brand-800">L'Alphabet</h4>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                        {selectedLanguage.alphabet?.map((letter, i) => (
                            <button 
                                key={i} 
                                onClick={() => playPronunciation(letter.audio)}
                                className="p-6 bg-stone-50 rounded-[2rem] border border-stone-100 flex flex-col items-center gap-2 group hover:bg-brand-900 hover:text-white transition-all shadow-sm"
                            >
                                <span className="text-3xl font-black">{letter.char}</span>
                                <span className="text-[10px] font-bold uppercase text-brand-500 group-hover:text-brand-300">{letter.phon}</span>
                                <Volume2 size={16} className="text-stone-300 group-hover:text-white" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Section Phrases */}
                <div className="space-y-6 mt-16">
                    <div className="flex items-center gap-3 pb-2 border-b border-stone-100">
                        <div className="w-2 h-6 bg-brand-500 rounded-full"></div>
                        <h4 className="font-serif font-bold text-xl md:text-2xl text-brand-800">Phrases Clés</h4>
                    </div>
                    <div className="space-y-3">
                        {selectedLanguage.phrases?.map((phrase, i) => (
                            <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-stone-50 rounded-[2rem] border border-stone-100 gap-4 group hover:shadow-lg transition-all">
                                <div className="space-y-1">
                                    <p className="text-xl font-black text-brand-900">{phrase.native}</p>
                                    <p className="text-sm text-stone-500 italic">"{phrase.french}"</p>
                                </div>
                                <button onClick={() => playPronunciation(phrase.native)} className="p-3 bg-white text-brand-600 rounded-full border border-stone-100 shadow-sm hover:scale-110 transition-transform self-end sm:self-center"><Volume2 size={20}/></button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section Conversations (Vidéos) */}
                <div className="space-y-6 mt-16">
                    <div className="flex items-center gap-3 pb-2 border-b border-stone-100">
                        <div className="w-2 h-6 bg-brand-500 rounded-full"></div>
                        <h4 className="font-serif font-bold text-xl md:text-2xl text-brand-800">Vidéos & Conversations ({selectedLanguage.conversations?.length})</h4>
                    </div>
                    <div className="flex flex-row md:grid md:grid-cols-2 gap-6 overflow-x-auto no-scrollbar md:overflow-visible pb-8 md:pb-0 snap-x snap-mandatory">
                        {selectedLanguage.conversations?.map((conv, i) => (
                            <div key={i} className="shrink-0 w-[65vw] md:w-auto bg-stone-50 rounded-[2.5rem] border border-stone-100 overflow-hidden group shadow-sm snap-center">
                                <div className="aspect-video relative overflow-hidden bg-black">
                                    <PlayCircle className="absolute inset-0 m-auto text-white w-12 h-12 opacity-50 group-hover:opacity-100 transition-opacity cursor-pointer" />
                                </div>
                                <div className="p-6 space-y-2">
                                    <h5 className="font-serif font-bold text-brand-900 text-lg line-clamp-1">{conv.title}</h5>
                                    <p className="text-xs text-stone-500 leading-relaxed font-medium line-clamp-2">{conv.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* OFFRES MOBILES */}
            <div className="lg:hidden space-y-8 pb-12">
                <div className="px-4">
                    <h4 className="text-[12px] font-black uppercase tracking-[0.25em] text-brand-900 border-b-2 border-brand-200 pb-2 inline-block">Offres d'Accompagnement</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
                    {/* Carte Gratuit Mobile */}
                    <div className="bg-white p-8 rounded-[3rem] border border-stone-100 shadow-xl space-y-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">Inclus</span>
                                <h5 className="text-2xl font-serif font-black text-brand-900">Pack Autonome</h5>
                            </div>
                            <Sparkles className="text-green-500" />
                        </div>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-xs font-medium text-stone-600"><Check size={14} className="text-green-500" /> Alphabets avec audio</li>
                            <li className="flex items-center gap-3 text-xs font-medium text-stone-600"><Check size={14} className="text-green-500" /> Bibliothèque de phrases</li>
                            <li className="flex items-center gap-3 text-xs font-medium text-stone-600"><Check size={14} className="text-green-500" /> Vidéos de conversations</li>
                        </ul>
                        <button className="w-full py-4 bg-stone-100 text-stone-400 rounded-2xl font-black uppercase tracking-widest text-[11px] cursor-default">Actif par défaut</button>
                    </div>

                    {/* Carte Premium Mobile */}
                    <div className="bg-brand-900 p-8 rounded-[3rem] text-white space-y-6 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                        <div className="flex justify-between items-start relative z-10">
                            <div className="space-y-1">
                                <span className="bg-brand-500 text-brand-900 px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest">Populaire</span>
                                <h5 className="text-2xl font-serif font-black">Pack Premium</h5>
                            </div>
                            <Zap className="text-brand-500" />
                        </div>
                        <ul className="space-y-3 relative z-10">
                            <li className="flex items-center gap-3 text-xs font-medium text-brand-100"><Check size={14} className="text-brand-400" /> Tout du pack Gratuit</li>
                            <li className="flex items-center gap-3 text-xs font-medium text-brand-100"><Check size={14} className="text-brand-400" /> Apprentissage en ligne</li>
                            <li className="flex items-center gap-3 text-xs font-medium text-brand-100"><Check size={14} className="text-brand-400" /> Guide humain dédié</li>
                            <li className="flex items-center gap-3 text-xs font-medium text-brand-100"><Check size={14} className="text-brand-400" /> Rythme sur mesure</li>
                        </ul>
                        <button className="w-full py-4 bg-brand-5 text-brand-900 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl relative z-10">S'inscrire en ligne</button>
                    </div>

                    {/* Carte Gold Mobile */}
                    <div className="bg-gradient-to-br from-amber-500 to-brand-700 p-8 rounded-[3rem] text-white space-y-6 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                        <div className="flex justify-between items-start relative z-10">
                            <div className="space-y-1">
                                <span className="bg-white text-brand-900 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">Elite</span>
                                <h5 className="text-2xl font-serif font-black">Pack Gold</h5>
                            </div>
                            <Award className="text-white" />
                        </div>
                        <ul className="space-y-3 relative z-10">
                            <li className="flex items-center gap-3 text-xs font-medium text-white/90"><Check size={14} className="text-amber-200" /> Tout du pack Premium</li>
                            <li className="flex items-center gap-3 text-xs font-medium text-white/90"><Check size={14} className="text-amber-200" /> Présentiel au Bénin</li>
                            <li className="flex items-center gap-3 text-xs font-medium text-white/90"><Check size={14} className="text-amber-200" /> Immersion intensive</li>
                            <li className="flex items-center gap-3 text-xs font-medium text-white/90"><Check size={14} className="text-amber-200" /> Sorties culturelles incluses</li>
                        </ul>
                        <button className="w-full py-4 bg-white text-brand-900 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl relative z-10">Réserver mon immersion</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );

  // --- COURSE DETAILS VIEW ---
  const renderCourseDetails = (course: Course) => {
    const curriculumMarkup = (
        <div className="space-y-6">
            <h3 className="text-xl font-serif font-bold text-brand-900 px-4">Contenu du cours</h3>
            <div className="bg-white rounded-[2rem] shadow-sm border border-brand-50 overflow-hidden divide-y divide-stone-50">
                {course.lessons?.slice(0, 10).map((lesson, idx) => (
                    <div key={idx} className="p-4 flex items-center gap-4 group">
                        <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-xs font-bold text-stone-400 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                            {idx + 1}
                        </div>
                        <div className="flex-grow">
                            <p className="text-sm font-bold text-stone-800 line-clamp-1">{lesson.title}</p>
                            <p className="text-[10px] text-stone-400 font-medium">{lesson.duration}</p>
                        </div>
                        <PlayCircle size={18} className="text-stone-200 group-hover:text-brand-500 transition-colors" />
                    </div>
                ))}
                {course.lessons && course.lessons.length > 10 && (
                    <div className="p-4 text-center bg-stone-50/50">
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">+ {course.lessons.length - 10} modules supplémentaires</p>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="max-w-[1200px] mx-auto space-y-12 pb-20 animate-fadeIn">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row gap-10 items-start">
                <div className="flex-grow space-y-6">
                    <button onClick={() => setSelectedCourseId(null)} className="flex items-center gap-2 text-brand-600 font-bold hover:underline group">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Retour au catalogue
                    </button>
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="bg-brand-100 text-brand-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-brand-200">Niveau {course.level}</span>
                            {course.price > 0 && course.isBestSeller && <span className="bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-amber-200">Meilleure vente</span>}
                            {course.isMostFollowed && <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-200">Formation la plus suivie</span>}
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-brand-900 leading-tight">{course.title}</h1>
                        <div className="flex items-center gap-4">
                            <div className="flex text-yellow-500">
                                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill={i < Math.floor(course.rating) ? "currentColor" : "none"} className={i < Math.floor(course.rating) ? "" : "text-stone-200"} />)}
                            </div>
                            <span className="text-stone-400 font-bold text-sm">({course.reviewCount} avis certifiés)</span>
                        </div>
                    </div>
                    <p className="text-stone-600 text-xl leading-relaxed italic">"{course.description}"</p>
                    <div className="flex flex-wrap gap-8 pt-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-brand-50 rounded-lg text-brand-600"><Clock size={20} /></div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-stone-400">Durée totale</p>
                                <p className="font-bold text-brand-900">{course.duration}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-brand-50 rounded-lg text-brand-600"><Layers size={20} /></div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-stone-400">Leçons</p>
                                <p className="font-bold text-brand-900">{course.lessons?.length} modules</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-brand-50 rounded-lg text-brand-600"><Users size={20} /></div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-stone-400">Apprenants</p>
                                <p className="font-bold text-brand-900">Plus de 500</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Action Card */}
                <div className="w-full lg:w-[400px] shrink-0 sticky top-24">
                    <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-brand-50 space-y-6">
                        <div className="aspect-video bg-stone-100 rounded-3xl overflow-hidden relative group">
                            {isPreviewing ? (
                                <CustomVideoPlayer url={course.videoUrl || ''} thumbnail={course.lessons?.[0]?.thumbnail || ''} />
                            ) : (
                                <>
                                    <img src={course.lessons?.[0]?.thumbnail} className="w-full h-full object-cover opacity-80" alt="Aperçu" />
                                    <div className="absolute inset-0 flex items-center justify-center cursor-pointer" onClick={() => setIsPreviewing(true)}>
                                        <div className="w-16 h-16 bg-brand-600/90 backdrop-blur rounded-full flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform">
                                            <Play size={24} fill="currentColor" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 left-0 right-0 text-center text-white text-xs font-bold uppercase tracking-widest drop-shadow-md">Aperçu gratuit</div>
                                </>
                            )}
                        </div>
                        <div className="space-y-1">
                            {course.price === 0 ? (
                                <p className="text-4xl font-serif font-bold text-green-600">Gratuit</p>
                            ) : (
                                <p className="text-4xl font-serif font-bold text-brand-900">{course.price.toLocaleString()} FCFA</p>
                            )}
                            <p className="text-stone-400 text-[10px] font-bold uppercase tracking-wider">Accès illimité à vie • Certificat inclus</p>
                        </div>
                        <button onClick={startPlayingCourse} className="w-full py-5 bg-brand-600 text-white rounded-2xl font-bold shadow-xl hover:bg-brand-700 transition-all flex items-center justify-center gap-3 text-lg group">
                            {course.completed ? 'Poursuivre la formation' : (course.price === 0 ? 'Commencer maintenant' : 'S\'inscrire à la formation')}
                            <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <div className="space-y-4 pt-6 border-t border-stone-100">
                            <p className="text-xs font-bold text-stone-500 uppercase tracking-widest">Ce cours comprend :</p>
                            <div className="grid grid-cols-1 gap-3">
                                <div className="flex items-center gap-3 text-stone-600 text-sm">
                                    <Monitor size={16} className="text-brand-500" /> Accès sur mobile et TV
                                </div>
                                <div className="flex items-center gap-3 text-stone-600 text-sm">
                                    <Award size={16} className="text-brand-500" /> Certificat d'achèvement
                                </div>
                                <div className="flex items-center gap-3 text-stone-600 text-sm">
                                    <Shield size={16} className="text-brand-500" /> Contenu certifié authentique
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Tabs / Info sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-12">
                    {/* Benefits */}
                    <section className="bg-white p-10 md:p-12 rounded-[3rem] shadow-sm border border-brand-50 space-y-6">
                        <h3 className="text-2xl font-serif font-bold text-brand-900 flex items-center gap-3">
                            <CheckCircle className="text-brand-500" /> Ce que vous allez apprendre
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {course.benefits?.map((benefit, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-100">
                                    <Check size={18} className="text-green-600 mt-0.5 shrink-0" />
                                    <span className="text-stone-700 text-sm leading-relaxed">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Outils et prérequis Section */}
                    <section className="bg-white p-10 md:p-12 rounded-[3rem] shadow-sm border border-brand-50 space-y-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <h3 className="text-2xl font-serif font-bold text-brand-900 flex items-center gap-3">
                                <Wrench className="text-brand-500" /> Outils et prérequis
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Prerequisites List */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
                                    <ScrollText size={16} /> Prérequis
                                </h4>
                                <ul className="space-y-3">
                                    {course.prerequisites && course.prerequisites.length > 0 ? (
                                        course.prerequisites.map((pre, idx) => (
                                            <li key={idx} className="flex items-center gap-3 text-stone-600 text-sm italic">
                                                <div className="w-1.5 h-1.5 rounded-full bg-brand-400"></div>
                                                {pre}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-stone-400 text-sm italic">Aucun prérequis spécifique requis.</li>
                                    )}
                                </ul>
                            </div>

                            {/* Required Tools Buttons */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
                                    <ShoppingBag size={16} /> Outils nécessaires
                                </h4>
                                <div className="flex flex-col gap-3">
                                    {course.requiredTools && course.requiredTools.length > 0 ? (
                                        course.requiredTools.map((tool) => (
                                            <button 
                                                key={tool.id}
                                                onClick={() => onNavigate('store', tool.id)}
                                                className="w-full flex items-center justify-between p-4 bg-brand-5 rounded-2xl border border-brand-100 hover:bg-brand-100 hover:shadow-md transition-all group"
                                            >
                                                <span className="font-bold text-brand-800 text-sm">{tool.name}</span>
                                                <span className="text-[10px] font-black uppercase text-brand-600 flex items-center gap-1 group-hover:underline">
                                                    Voir boutique <ChevronRight size={14} />
                                                </span>
                                            </button>
                                        ))
                                    ) : (
                                        <p className="text-stone-400 text-sm italic">Aucun outil spécifique n'est requis for the ce cours.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Curriculum Mobile Placeholder */}
                    <div className="block lg:hidden">
                        {curriculumMarkup}
                    </div>

                    {/* Trainer Bio */}
                    <section className="bg-brand-900 text-white p-10 md:p-12 rounded-[3rem] shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                        <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                            <img src={course.trainer.avatar} className="w-32 h-32 rounded-full border-4 border-brand-500 shadow-2xl shrink-0" alt={course.trainer.name} />
                            <div className="space-y-4 text-center md:text-left">
                                <div>
                                    <h3 className="text-2xl font-serif font-bold">{course.trainer.name}</h3>
                                    <p className="text-brand-400 font-bold uppercase tracking-widest text-[10px]">Maître Formateur Certifié</p>
                                </div>
                                <p className="text-brand-100 leading-relaxed italic">"{course.trainer.bio}"</p>
                            </div>
                        </div>
                    </section>

                    {/* Reviews Section */}
                    <section className="space-y-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-serif font-bold text-brand-900 flex items-center gap-3">
                                <MessageSquare className="text-brand-500" /> Avis de la Communauté
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {course.reviews?.map((review, idx) => (
                                <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-brand-50 shadow-sm space-y-4 flex flex-col">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center font-bold text-brand-700 text-xs">
                                                {review.user.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-brand-900 text-sm">{review.user}</p>
                                                <p className="text-[10px] text-stone-400 font-bold">{review.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex text-yellow-500">
                                            {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-stone-200"} />)}
                                        </div>
                                    </div>
                                    <p className="text-stone-600 text-sm leading-relaxed flex-grow italic">"{review.comment}"</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Curriculum Summary - Desktop Only */}
                <div className="hidden lg:block">
                    {curriculumMarkup}
                </div>
            </div>
        </div>
    );
  };

  // --- FULL COURSE PLAYER VIEW ---
  if (isPlayingCourse && selectedCourse) {
      return (
          <div className="max-w-[1600px] mx-auto min-h-screen animate-fadeIn pb-20 px-0 md:px-4">
              <div className="flex flex-col lg:flex-row gap-8">
                  
                  {/* MAIN PLAYER AREA */}
                  <div className="flex-grow space-y-4 lg:space-y-8 order-1 lg:order-2">
                      <div className="flex items-center gap-4 mb-4 px-4 lg:px-0">
                        <button onClick={() => setIsPlayingCourse(false)} className="bg-white p-2 rounded-full shadow-sm hover:shadow-md text-brand-600 transition-all">
                            <ArrowLeft size={20} />
                        </button>
                        <div className="min-w-0">
                            <h2 className="text-xl md:text-2xl font-serif font-bold text-brand-900 truncate">{selectedCourse.title}</h2>
                            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest truncate">{currentLesson?.title}</p>
                        </div>
                      </div>

                      {/* CUSTOM VIDEO PLAYER */}
                      <div className="bg-black lg:rounded-[3rem] overflow-hidden shadow-2xl aspect-video border-y md:border-8 border-white/50 relative">
                          <CustomVideoPlayer url={currentLesson?.videoUrl || ''} thumbnail={currentLesson?.thumbnail || ''} />
                      </div>

                      {/* Desktop Notes/Info */}
                      <div className="hidden lg:block bg-white p-10 md:p-12 rounded-[3rem] shadow-xl border border-brand-50">
                          <div className="flex justify-between items-start mb-6">
                              <h3 className="text-3xl font-serif font-bold text-brand-900">Notes de la leçon</h3>
                              <div className="flex items-center gap-2 px-4 py-2 bg-brand-50 rounded-full border border-brand-100">
                                  <div className="w-10 h-10 rounded-full border-2 border-brand-300 p-0.5">
                                      <img src={selectedCourse.trainer.avatar} className="w-full h-full rounded-full object-cover" alt="" />
                                  </div>
                                  <div className="text-[10px]">
                                      <p className="font-bold text-brand-900 leading-tight">Formateur</p>
                                      <p className="text-stone-400 leading-tight">{selectedCourse.trainer.name}</p>
                                  </div>
                              </div>
                          </div>
                          <p className="text-stone-600 text-lg leading-relaxed">{selectedCourse.description}</p>
                      </div>

                      {/* Mobile Comments Trigger */}
                      <div className="block lg:hidden px-4">
                          <button 
                              onClick={() => setMobileCommentsOpen(true)}
                              className="w-full bg-white p-5 rounded-3xl border border-brand-50 shadow-sm text-left space-y-3 hover:bg-stone-50 transition-colors"
                          >
                              <div className="flex justify-between items-center">
                                  <h4 className="font-bold text-brand-900 text-sm flex items-center gap-2">
                                      Commentaires <span className="text-xs font-normal text-stone-400">{selectedCourse.comments?.length || 0}</span>
                                  </h4>
                                  <ChevronDown size={18} className="text-stone-300" />
                              </div>
                              {selectedCourse.comments && selectedCourse.comments.length > 0 ? (
                                  <div className="flex gap-3 items-center bg-stone-50 p-2 rounded-xl transition-all duration-700 animate-[fadeIn_0.5s]">
                                      <img 
                                          src={selectedCourse.comments[activeCommentPreviewIndex]?.avatar || selectedCourse.comments[0].avatar} 
                                          className="w-6 h-6 rounded-full shadow-sm" 
                                          alt="" 
                                      />
                                      <p className="text-xs text-stone-600 line-clamp-1 italic">
                                          "{selectedCourse.comments[activeCommentPreviewIndex]?.text || selectedCourse.comments[0].text}"
                                      </p>
                                  </div>
                              ) : (
                                  <p className="text-xs text-stone-400 italic">Soyez le premier à commenter...</p>
                              )}
                          </button>
                      </div>

                      {/* Desktop Comments Section */}
                      <div className="hidden lg:block space-y-6">
                          <h3 className="text-2xl font-serif font-bold text-brand-900 flex items-center gap-3 px-4">
                              <MessageSquare className="text-brand-500" /> Espace Discussion ({selectedCourse.comments?.length || 0})
                          </h3>
                          <div className="bg-white p-8 rounded-[3rem] border border-brand-50 shadow-sm mx-4">
                              {renderComments()}
                          </div>
                      </div>
                  </div>

                  {/* SIDEBAR: PLAYLIST */}
                  <div className="lg:w-80 xl:w-96 shrink-0 order-2 lg:order-1 px-4 lg:px-0">
                      <div className="bg-white lg:rounded-[2rem] rounded-[2.5rem] shadow-xl border border-brand-50 flex flex-col h-fit lg:sticky lg:top-24 lg:max-h-[85vh] mb-12">
                          <div className="p-6 border-b border-brand-50 bg-stone-50/50 lg:rounded-t-[2rem] rounded-t-[2.5rem] flex items-center justify-between">
                              <div>
                                  <h4 className="font-serif font-bold text-brand-900 text-sm md:text-base">Programme du cours</h4>
                                  <p className="text-[9px] text-stone-400 uppercase font-bold tracking-widest">{selectedCourse.lessons?.length} Leçons</p>
                              </div>
                              <div className="p-2 bg-brand-100 text-brand-600 rounded-lg"><List size={18} /></div>
                          </div>
                          <div className="flex-grow overflow-y-auto no-scrollbar p-3 md:p-4 space-y-2 lg:max-h-none max-h-[450px]">
                              {selectedCourse.lessons?.map((lesson, idx) => (
                                  <button 
                                      key={lesson.id} 
                                      onClick={() => {
                                          setCurrentLessonIndex(idx);
                                          window.scrollTo({ top: 0, behavior: 'smooth' });
                                      }}
                                      className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left group relative ${currentLessonIndex === idx ? 'bg-brand-900 text-white shadow-xl' : 'hover:bg-brand-50'}`}
                                  >
                                      <div className="relative shrink-0">
                                          <img src={lesson.thumbnail} className="w-20 h-12 object-cover rounded-xl shadow-sm" alt="" />
                                          <div className={`absolute inset-0 flex items-center justify-center transition-opacity rounded-xl ${currentLessonIndex === idx ? 'bg-brand-600/30' : 'bg-black/0 group-hover:bg-black/20'}`}>
                                              {currentLessonIndex === idx ? <div className="w-2 h-2 bg-brand-400 rounded-full animate-ping" /> : <Play size={14} className="text-white opacity-0 group-hover:opacity-100" fill="currentColor" />}
                                          </div>
                                          {lesson.isCompleted && (
                                              <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1 border-2 border-white shadow-sm">
                                                  <Check size={8} strokeWidth={4} />
                                              </div>
                                          )}
                                      </div>
                                      <div className="min-w-0 flex-grow">
                                          <p className={`text-[10px] md:text-[11px] font-bold truncate leading-tight ${currentLessonIndex === idx ? 'text-white' : 'text-stone-800'}`}>{lesson.title}</p>
                                          <div className="flex items-center gap-2 mt-1">
                                              <Clock size={10} className="opacity-50" />
                                              <p className={`text-[9px] font-medium opacity-60 ${currentLessonIndex === idx ? 'text-white' : 'text-stone-400'}`}>{lesson.duration}</p>
                                          </div>
                                      </div>
                                  </button>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>

              {/* MOBILE COMMENTS MODAL */}
              {mobileCommentsOpen && (
                  <div className="fixed inset-0 z-[100] flex flex-col md:hidden animate-fadeIn">
                      <div className="absolute inset-0 bg-brand-900/60 backdrop-blur-md" onClick={() => setMobileCommentsOpen(false)}></div>
                      <div className="mt-auto bg-white rounded-t-[3rem] h-[85vh] relative z-10 flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.3)] animate-slideUp overflow-hidden">
                          <div className="w-12 h-1.5 bg-stone-200 rounded-full mx-auto mt-4 mb-2"></div>
                          <div className="p-6 border-b border-brand-50 flex justify-between items-center shrink-0">
                              <h3 className="text-xl font-serif font-bold text-brand-900">Discussion ({selectedCourse.comments?.length || 0})</h3>
                              <button onClick={() => setMobileCommentsOpen(false)} className="p-3 bg-stone-50 rounded-full text-stone-400 hover:text-brand-600 transition-colors"><X size={20} /></button>
                          </div>
                          <div className="flex-grow p-6 overflow-y-auto no-scrollbar">
                              {renderComments()}
                          </div>
                      </div>
                  </div>
              )}
          </div>
      );
  }

  // --- DETAILS PAGE VIEW (MIDDLE STEP) ---
  if (selectedCourse && !isPlayingCourse) {
      return renderCourseDetails(selectedCourse);
  }

  // --- CATALOG VIEW ---
  return (
    <div className="space-y-10 pb-20">
      
        <div className="text-center space-y-4 animate-fadeIn">
            <div className="inline-flex items-center justify-center p-4 bg-brand-100 rounded-full mb-2">
                <GraduationCap className="text-brand-600" size={32} />
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-brand-900 tracking-tight">Temple du Savoir</h1>
            <div className="h-1 w-24 bg-brand-400 mx-auto rounded-full"></div>
            <p className="text-stone-500 text-lg max-w-xl mx-auto italic">"Celui qui cherche à comprendre les lois de la nature finit par trouver la clarté intérieure."</p>
        </div>

        {/* TAB BAR DESIGN - UPDATED TO PREVENT CLIPPING */}
        <div className="sticky top-20 z-40 py-3 -mx-4 px-4 bg-stone-50/80 backdrop-blur-md">
            <div className="max-w-[95vw] md:max-w-7xl mx-auto overflow-hidden">
                <div className="flex items-center justify-start xl:justify-center p-2 bg-stone-100/50 rounded-full border border-stone-200/40 overflow-x-auto no-scrollbar gap-1 md:gap-2 snap-x snap-mandatory px-4">
                    {[
                    {id: 'courses', label: 'Formations', icon: PlayCircle},
                    {id: 'languages', label: 'Langues', icon: Languages},
                    {id: 'origins', label: 'Origines', icon: MapPin},
                    {id: 'fa-alphabet', label: 'Signes du Fa', icon: BookOpen},
                    {id: 'vodouns', label: 'Vodouns', icon: Flame},
                    {id: 'quiz', label: 'Espace Quiz', icon: HelpCircle},
                    {id: 'certificate', label: 'Graduation', icon: Award},
                    ].map(tab => (
                    <button 
                        key={tab.id}
                        ref={el => scrollRefs.current[tab.id] = el}
                        onClick={() => handleTabClick(tab.id as any)} 
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

      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slideUp">
            {COURSES.map(course => (
                <div 
                    key={course.id} 
                    onClick={() => handleCourseClick(course.id)} 
                    className="bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 p-8 border border-brand-50 flex flex-col group cursor-pointer relative overflow-hidden animate-fadeIn z-20 pointer-events-auto"
                >
                    {course.price > 0 && course.isBestSeller && (
                        <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden pointer-events-none z-30">
                            <div className="absolute top-8 -right-14 w-52 bg-brand-400 text-brand-900 py-2 text-[7px] font-black uppercase tracking-[0.25em] rotate-45 shadow-lg border-y border-brand-500/30 text-center">
                                Meilleure vente
                            </div>
                        </div>
                    )}
                    {course.isMostFollowed && (
                        <div className="absolute top-0 left-0 w-32 h-32 overflow-hidden pointer-events-none z-30">
                            <div className="absolute top-8 -left-14 w-52 bg-blue-500 text-white py-2 text-[7px] font-black uppercase tracking-[0.25em] -rotate-45 shadow-lg border-y border-blue-400/30 text-center">
                                La plus suivie
                            </div>
                        </div>
                    )}
                    <div className="flex justify-between items-start mb-6">
                        <div className={`p-4 rounded-2xl transition-colors ${course.isMostFollowed ? 'ml-10' : ''} ${course.completed ? 'bg-green-50 text-green-600 shadow-inner' : 'bg-brand-50 text-brand-600 group-hover:bg-brand-100 group-hover:shadow-lg'}`}>
                            {course.type.includes('video') ? <Video size={24} /> : <BookOpen size={24} />}
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border transition-all ${course.price > 0 && course.isBestSeller ? 'mr-14' : ''} ${course.price === 0 ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                            {course.price === 0 ? 'Offert' : `${course.price.toLocaleString()} F`}
                        </span>
                    </div>
                    <div className="space-y-1 mb-4">
                        <h4 className="font-serif font-bold text-xl text-brand-900 leading-tight group-hover:text-brand-600 transition-colors">{course.title}</h4>
                        <div className="flex items-center gap-1.5">
                            <div className="flex text-yellow-500">
                                {[...Array(5)].map((_, i) => <Star key={i} size={10} fill={i < Math.floor(course.rating) ? "currentColor" : "none"} className={i < Math.floor(course.rating) ? "" : "text-stone-200"} />)}
                            </div>
                            <span className="text-[9px] font-bold text-stone-400">({course.reviewCount})</span>
                        </div>
                    </div>
                    <p className="text-stone-500 text-sm mb-8 leading-relaxed flex-grow line-clamp-3 italic">"{course.description}"</p>
                    
                    <div className="mt-auto space-y-4">
                        <div className="flex items-center justify-between text-xs font-bold text-stone-400 border-t border-stone-50 pt-4">
                            <span className="flex items-center gap-1.5"><Clock size={14} className="text-stone-300" /> {course.duration}</span>
                            <span className="flex items-center gap-1.5"><UserIcon size={14} className="text-stone-300" /> {course.trainer.name}</span>
                        </div>
                        <div className="pt-2">
                             <button className="w-full flex items-center justify-center gap-2 py-3 bg-brand-50 text-brand-700 rounded-xl text-xs font-bold uppercase tracking-widest group-hover:bg-brand-600 group-hover:text-white transition-all shadow-sm">
                                {course.completed ? 'Poursuivre' : 'Voir le cours'} <ChevronRight size={14} />
                             </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      )}

      {activeTab === 'languages' && renderLanguages()}
      
      {activeTab === 'origins' && renderOrigins()}

      {activeTab === 'fa-alphabet' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
            <div className="lg:col-span-1 flex flex-row lg:grid lg:grid-cols-2 gap-4 overflow-x-auto lg:overflow-y-auto no-scrollbar lg:tradition-scrollbar snap-x snap-mandatory lg:snap-none pt-4 pb-4 px-4 lg:px-0 lg:pr-3 lg:border-r border-brand-100">
                {FA_SIGNS.map(sign => (
                    <button 
                        key={sign.id} 
                        ref={el => faSignRefs.current[sign.id] = el}
                        onClick={() => handleFaSignClick(sign)} 
                        className={`shrink-0 w-32 md:w-40 lg:w-auto snap-center p-4 md:p-6 border rounded-2xl transition-all text-center flex flex-col items-center gap-2 md:gap-3 ${selectedSign.id === sign.id ? 'bg-brand-600 text-white border-brand-600 shadow-xl scale-105' : 'bg-white border-brand-50 text-brand-900 hover:bg-brand-50'}`}
                    >
                        <div className="font-mono text-[10px] md:text-xs font-bold opacity-80 whitespace-pre leading-none">{sign.symbol}</div>
                        <div className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">{sign.name}</div>
                    </button>
                ))}
            </div>
            <div className="lg:col-span-2 bg-white p-8 md:p-16 rounded-[3rem] shadow-2xl border border-brand-50 relative overflow-hidden flex flex-col">
                <div className="absolute top-0 left-0 w-full h-3 bg-brand-600"></div>
                <div className="flex justify-between items-center mb-8 md:mb-10">
                    <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-50">Signe Majeur (Meji)</span>
                        <h3 className="text-3xl md:text-5xl font-serif font-bold text-brand-900">{selectedSign.name}</h3>
                    </div>
                    <button onClick={() => playPronunciation(selectedSign.audioText)} className="p-4 bg-brand-50 text-brand-600 rounded-full hover:bg-brand-100 transition-colors shadow-inner shrink-0"><Volume2 size={24} /></button>
                </div>
                <div className="bg-stone-50 p-8 md:p-12 rounded-[2rem] mb-10 flex justify-center items-center shadow-inner border border-stone-100">
                    <pre className="font-mono text-5xl md:text-8xl leading-tight text-brand-900 font-bold select-none">{selectedSign.symbol}</pre>
                </div>
                <div className="space-y-6 flex-grow overflow-y-auto no-scrollbar pb-10">
                    <div className="flex items-center gap-3 pb-2 border-b border-stone-100">
                         <Star size={24} className="text-brand-500 fill-brand-500"/>
                         <h4 className="font-serif font-bold text-xl md:text-2xl text-brand-800">Sagesse & Symbolisme</h4>
                    </div>
                    <p className="text-stone-600 text-base md:text-lg leading-[1.8] italic whitespace-pre-line">
                        {selectedSign.meaning}
                    </p>

                    {/* SECTION FORMATIONS RECOMMANDÉES - NOUVEL AJOUT */}
                    <div className="mt-12 space-y-6 animate-fadeIn">
                        <div className="flex items-center gap-3 border-b border-brand-100 pb-2">
                             <GraduationCap size={18} className="text-brand-600" />
                             <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-900">Apprendre davantage sur le {selectedSign.name}</h5>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {COURSES.filter(c => c.id === 'c1' || c.id === 'c2').map(course => (
                                <div 
                                    key={course.id}
                                    onClick={() => handleCourseClick(course.id)}
                                    className="p-5 bg-stone-50 rounded-3xl border border-stone-100 flex items-center gap-5 hover:bg-white hover:shadow-xl hover:border-brand-200 transition-all cursor-pointer group relative overflow-hidden"
                                >
                                    <div className="w-12 h-12 bg-brand-900 text-brand-400 rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-500 z-10">
                                        {course.type.includes('video') ? <Video size={20} /> : <BookOpen size={20} />}
                                    </div>
                                    <div className="min-w-0 flex-grow z-10">
                                        <p className="text-[10px] md:text-[12px] font-black text-brand-900 uppercase truncate tracking-tight mb-0.5">{course.title}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[8px] font-bold text-brand-500 uppercase tracking-widest">Cursus Maître</span>
                                            <ChevronRight size={12} className="text-stone-300 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-100/30 rounded-full translate-x-12 -translate-y-12 blur-2xl group-hover:bg-brand-500/10 transition-colors"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-auto pt-6 border-t border-brand-50">
                     <p className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.3em] text-center">Initié au Temple du Savoir</p>
                </div>
            </div>
        </div>
      )}

      {activeTab === 'vodouns' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
            <div className="lg:col-span-1 flex flex-row lg:grid lg:grid-cols-2 gap-4 overflow-x-auto lg:overflow-y-auto no-scrollbar lg:tradition-scrollbar snap-x snap-mandatory lg:snap-none pt-4 pb-4 px-4 lg:px-0 lg:pr-3 lg:border-r border-brand-100">
                {VODOUNS_DATA.map(vodoun => (
                    <button 
                        key={vodoun.id} 
                        ref={el => vodounRefs.current[vodoun.id] = el}
                        onClick={() => handleVodounClick(vodoun)} 
                        className={`shrink-0 w-32 md:w-40 lg:w-auto snap-center p-0 border rounded-[2rem] overflow-hidden transition-all text-center flex flex-col group ${selectedVodoun.id === vodoun.id ? 'bg-brand-900 border-brand-900 text-white shadow-xl scale-105 z-10' : 'bg-white border-brand-50 text-brand-900 hover:border-brand-200'}`}
                    >
                        <div className="h-24 md:h-32 overflow-hidden">
                            <img src={vodoun.image} alt={vodoun.name} className={`w-full h-full object-cover transition-transform duration-700 ${selectedVodoun.id === vodoun.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                        </div>
                        <div className="p-3 md:p-4">
                            <div className="text-[8px] md:text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">{vodoun.category}</div>
                            <div className="text-xs md:sm font-black uppercase tracking-wider">{vodoun.name}</div>
                        </div>
                    </button>
                ))}
            </div>
            <div className="lg:col-span-2 bg-white p-8 md:p-16 rounded-[3rem] shadow-2xl border border-brand-50 relative overflow-hidden flex flex-col">
                <div className="absolute top-0 left-0 w-full h-3 bg-brand-600"></div>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-50">{selectedVodoun.category} du Bénin</span>
                        <h3 className="text-3xl md:text-5xl font-serif font-black text-brand-900">{selectedVodoun.name}</h3>
                    </div>
                    <div className="flex gap-4">
                        <div className="px-4 py-2 bg-brand-50 border border-brand-100 rounded-full flex items-center gap-2">
                            <Globe size={14} className="text-brand-500" />
                            <span className="text-[10px] font-bold text-brand-900 uppercase">{selectedVodoun.dialect}</span>
                        </div>
                        <button onClick={() => playPronunciation(selectedVodoun.audioText)} className="p-4 bg-brand-50 text-brand-600 rounded-full hover:bg-brand-100 transition-colors shadow-inner shrink-0"><Volume2 size={24} /></button>
                    </div>
                </div>

                <div className="relative aspect-video md:aspect-[21/9] rounded-[2.5rem] overflow-hidden shadow-xl mb-10 group">
                    <img src={selectedVodoun.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[4s]" alt={selectedVodoun.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent flex items-end p-8">
                        <p className="text-white text-lg md:text-xl font-serif font-bold italic">"{selectedVodoun.description}"</p>
                    </div>
                </div>

                <div className="space-y-10 flex-grow overflow-y-auto no-scrollbar">
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 pb-2 border-b border-stone-100">
                             <HistoryIcon size={24} className="text-brand-50"/>
                             <h4 className="font-serif font-bold text-xl md:text-2xl text-brand-800 uppercase tracking-tight">Histoire & Origines</h4>
                        </div>
                        <p className="text-stone-600 text-base md:text-lg leading-[1.8] font-light">
                            {selectedVodoun.history}
                        </p>
                    </section>
                </div>

                <div className="mt-8 pt-6 border-t border-brand-50 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-stone-400">
                     <span>Héritage Traditionnel</span>
                     <span className="text-brand-600">Temple du Vodoun</span>
                </div>
            </div>
        </div>
      )}

      {activeTab === 'quiz' && renderQuiz()}

      {activeTab === 'certificate' && (
        <div className="space-y-12 animate-slideUp">
            {selectedCertCourse ? (
                <div className="animate-fadeIn space-y-8">
                    <button 
                        onClick={() => setSelectedCertCourse(null)} 
                        className="flex items-center gap-2 text-brand-600 font-bold hover:underline group mb-6"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Retour à la liste des graduations
                    </button>
                    
                    <div className="w-full max-w-5xl mx-auto bg-[#fdfaf5] rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.2)] overflow-hidden">
                        {/* Barre d'action supérieure */}
                        <div className="p-6 border-b border-brand-100 flex justify-between items-center bg-[#fdfaf5]/90 backdrop-blur-sm z-20">
                            <div className="flex items-center gap-3">
                                <Award className="text-brand-600" />
                                <span className="font-black text-brand-900 uppercase text-xs tracking-widest">Attestation d'Authenticité</span>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => window.print()} className="p-3 bg-white text-stone-600 rounded-full hover:bg-brand-50 hover:text-brand-900 transition-all border border-stone-200 shadow-sm"><Printer size={20}/></button>
                                <button className="p-3 bg-brand-900 text-white rounded-full hover:bg-black transition-all shadow-lg"><Download size={20}/></button>
                            </div>
                        </div>

                        {/* CORPS DU CERTIFICAT */}
                        <div className="p-10 md:p-20 relative">
                            {/* Cadre décoratif interne */}
                            <div className="absolute inset-6 md:inset-10 border-[1px] border-brand-300 pointer-events-none opacity-50"></div>
                            <div className="absolute inset-8 md:inset-14 border-[3px] border-brand-400 pointer-events-none rounded-sm"></div>

                            {/* Contenu principal */}
                            <div className="relative z-10 text-center space-y-12">
                                <div className="space-y-4">
                                    <div className="w-16 h-16 bg-brand-900 rounded-xl flex items-center justify-center mx-auto text-brand-400 mb-6 shadow-xl">
                                        <GraduationCap size={32} />
                                    </div>
                                    <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-brand-500">Fa & Vodoun Connect — Temple du Savoir</p>
                                    <h2 className="text-3xl md:text-6xl font-serif font-black text-brand-900 uppercase tracking-tighter">Certificat de Graduation</h2>
                                </div>

                                <div className="space-y-8">
                                    <p className="text-stone-500 font-serif italic text-lg md:text-xl">Le présent document atteste que l'aspirant</p>
                                    <div className="space-y-2">
                                        <h3 className="text-4xl md:text-6xl font-serif font-black text-brand-800 uppercase underline decoration-brand-200 underline-offset-8">{user.name}</h3>
                                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] pt-4">a été reconnu(e) digne de la connaissance du niveau {selectedCertCourse.level}</p>
                                    </div>
                                    <div className="py-8 px-6 bg-brand-50/50 border border-brand-100 rounded-3xl max-w-2xl mx-auto shadow-inner">
                                        <p className="text-stone-600 font-serif text-lg md:text-2xl font-bold italic leading-relaxed">
                                            "Pour avoir accompli avec succès le cycle d'initiation aux : <span className="text-brand-900 font-black not-italic underline decoration-brand-500 uppercase tracking-tight">{selectedCertCourse.title}</span>"
                                        </p>
                                    </div>
                                </div>

                                {/* Zone des Sceaux et Signatures */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-end pt-12">
                                    {/* Code QR de vérification */}
                                    <div className="flex flex-col items-center space-y-3">
                                        <div className="p-3 bg-white border-2 border-stone-100 rounded-2xl shadow-sm">
                                            <QrCode size={80} className="text-stone-800" />
                                        </div>
                                        <span className="text-[8px] font-black text-stone-300 uppercase tracking-widest">ID: {selectedCertCourse.id}-INIT-{Date.now().toString().slice(-6)}</span>
                                    </div>

                                    {/* Cachet du Temple (Stamp) */}
                                    <div className="relative flex flex-col items-center">
                                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-[1.5px] border-brand-600 border-dashed flex items-center justify-center relative transform -rotate-12 opacity-80">
                                            <div className="absolute inset-2 rounded-full border-[3px] border-brand-700/60 flex items-center justify-center text-center">
                                                <div className="px-3">
                                                    <p className="text-[7px] md:text-[8px] font-black text-brand-800 uppercase tracking-tighter leading-none mb-1">SECRETARIAT GENERAL</p>
                                                    <div className="h-px w-8 bg-brand-800 mx-auto my-1"></div>
                                                    <p className="text-[10px] md:text-xs font-black text-brand-900 uppercase leading-none">TEMPLE DU SAVOIR</p>
                                                    <p className="text-[6px] font-bold text-brand-600 uppercase tracking-widest mt-1">CERTIFIÉ AUTHENTIQUE</p>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-[8px] font-black text-stone-400 uppercase tracking-[0.2em] mt-6">Sceau Officiel</p>
                                    </div>

                                    {/* Signature du Formateur */}
                                    <div className="flex flex-col items-center space-y-4">
                                        <div className="relative">
                                            <p className="text-2xl md:text-4xl font-serif text-brand-900 italic font-black opacity-90 pb-2 px-6 border-b-2 border-stone-200">
                                                {selectedCertCourse.trainer.name.split(' ').pop()}
                                            </p>
                                            <div className="absolute -top-4 -right-4 w-12 h-12 text-brand-500 opacity-20"><Zap size={48} fill="currentColor" /></div>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] font-black text-brand-900 uppercase tracking-widest">{selectedCertCourse.trainer.name}</p>
                                            <p className="text-[8px] font-bold text-stone-400 uppercase tracking-widest">Maître Formateur</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-10">
                                    <p className="text-[9px] font-black text-stone-300 uppercase tracking-[0.4em]">Fait au Temple Connecté le {new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {COURSES.filter(c => c.completed).map(course => (
                            <div 
                                key={course.id}
                                onClick={() => { setSelectedCertCourse(course); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                className="bg-white p-8 rounded-[2.5rem] border-2 border-brand-100 shadow-xl flex flex-col items-center text-center space-y-6 cursor-pointer group hover:scale-[1.05] transition-all relative overflow-hidden"
                            >
                                <div className="absolute -top-4 -right-4 w-24 h-24 bg-brand-500/10 rounded-full blur-xl group-hover:bg-brand-500/20 transition-all"></div>
                                <div className="w-20 h-20 bg-brand-900 text-brand-400 rounded-3xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform">
                                    <VerifiedIcon size={40} />
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-600">Graduation Obtenue</span>
                                    <h4 className="text-xl md:text-2xl font-serif font-black text-brand-900 leading-tight">{course.title}</h4>
                                </div>
                                <p className="text-stone-500 text-xs italic">Complété avec succès par {user.name}</p>
                                <button className="w-full py-4 bg-brand-50 text-brand-900 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-brand-100 group-hover:bg-brand-900 group-hover:text-white transition-all shadow-sm flex items-center justify-center gap-2">
                                    VOIR MON CERTIFICAT <Eye size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {COURSES.filter(c => c.completed).length === 0 && (
                        <div className="max-w-2xl mx-auto py-20 text-center space-y-6 bg-white rounded-[3rem] border-2 border-dashed border-stone-200">
                            <Award size={64} className="text-stone-200 mx-auto" />
                            <div className="space-y-2">
                                <h3 className="text-2xl font-serif font-black text-brand-900 uppercase">Aucun Certificat encore</h3>
                                <p className="text-stone-400 italic">Terminez votre première formation for the débloquer votre certificat de graduation sacré.</p>
                            </div>
                            <button onClick={() => setActiveTab('courses')} className="bg-brand-900 text-white px-8 py-3 rounded-xl font-bold">Voir les formations</button>
                        </div>
                    )}
                </>
            )}
        </div>
      )}
    </div>
  );
};