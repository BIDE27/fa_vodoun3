
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  MapPin, CalendarDays, History, ArrowRight, Star, Ticket, ArrowLeft, 
  Clock, PlayCircle, Eye, Check, Users, ChevronRight, Info, BookOpen, ScrollText, X, Search, Filter, Calendar as CalendarIcon, SlidersHorizontal
} from 'lucide-react';
import { TraditionalEvent } from './Agenda';

// Nouvelle interface pour les éléments de la galerie
interface GalleryItem {
    url: string;
    title: string;
    description: string;
}

// Extension de l'interface pour inclure la géolocalisation et la nouvelle structure de galerie
interface ExtendedEvent extends Omit<TraditionalEvent, 'gallery'> {
  lat: number;
  lng: number;
  gallery?: GalleryItem[];
}

const today = new Date();
const currentYear = today.getFullYear();

// Fonction utilitaire pour générer une galerie de 20 photos
const generateGallery = (eventId: string): GalleryItem[] => {
    const titles = [
        "L'Aurore Sacrée du Matin sur les Terres Ancestrales", "La Grande Procession Royale d'Abomey au Crépuscule", "Le Chant Mystique des Ancêtres dans la Forêt Sacrée", "Offrande de Paix Universelle au Bord de l'Océan", 
        "Danse Rituelle des Masques Zangbéto pour la Protection", "Cercle de Purification Sacré des Initiés du Couvent", "Le Souffle Ancestral du Fa révélé par les Grands Bokonons", "Gardiens du Temple Sacré veillant sur les Traditions",
        "Rituels Sacrés de l'Eau Vive lors du Festival Nonvitcha", "Le Verbe de Force Créatrice prononcé par les Sages", "Lumière Intérieure de l'Initié durant la Nuit Spirituelle", "Héritage Vivant des Sages du Plateau d'Abomey",
        "Communion Spirituelle Divine entre les Mondes Invisibles", "La Marche des Initiés du Fa vers le Temple Central", "Sagesse Silencieuse des Anciens Gardiens du Savoir", "Éveil des Sens Spirituels au Son du Gong Sacré",
        "Vibration Ancestrale du Terroir et Racines Profondes", "Le Lien Sacré entre les Mondes Terrestre et Céleste", "Porte du Destin et Chance révélées par l'Oracle", "Harmonie Universelle Sacrée pour la Prospérité"
    ];
    
    return Array.from({ length: 20 }, (_, i) => ({
        url: `https://picsum.photos/seed/${eventId}-${i}/800/800`,
        title: titles[i] || `Instant Sacré ${i + 1}`,
        description: i % 2 === 0 
            ? "Une capture authentique de la ferveur et de la dévotion lors de ce moment clé, témoignant de l'héritage vivant." 
            : "Les détails méticieux des parures et des objets sacrés révélant leur puissance symbolique unique."
    }));
};

const MOCK_EVENTS: ExtendedEvent[] = [
    { 
      id: 'e1', 
      title: "Vodoun Days - Ouidah", 
      lat: 6.3631, lng: 2.0851,
      date: new Date(currentYear, 0, 10), 
      location: "Ouidah, Bénin", 
      image: "https://images.unsplash.com/photo-1590739293166-791786523152?auto=format&fit=crop&q=80&w=1200", 
      gallery: generateGallery('e1'),
      type: "Célébration",
      description: "Le grand rassemblement annuel de la spiritualité Vodoun au bord de l'océan.",
      fullContent: "Chaque 10 janvier, Ouidah devient le nombril du monde spirituel africain. Cette date n'est pas choisie au hasard : elle marque la reconnaissance officielle du Vodoun comme religion à part entière au Bénin. C'est un moment de réconciliation entre les fils et filles de la diaspora et la terre ancestrale.",
      guidePrice: 15000,
      schedule: [
        { time: "07:00", activity: "Libations d'ouverture au Temple des Pythons" },
        { time: "09:30", activity: "Grande Procession Royale à travers la ville historique" },
        { time: "11:00", activity: "Cérémonie de bénédiction à la Porte du Non-Retour" },
        { time: "14:00", activity: "Démonstrations des couvents (Zangbeto, Egungun)" },
        { time: "18:00", activity: "Concerts de chants sacrés et rituels nocturnes" }
      ]
    },
    { 
      id: 'e2', 
      title: "Festival Guelede", 
      lat: 7.3614, lng: 2.6028,
      date: new Date(currentYear, 2, 15), 
      location: "Kétou, Bénin", 
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=1200", 
      gallery: generateGallery('e2'),
      type: "Masques",
      description: "Hommage aux mères ancestrales et à la puissance créatrice féminine.",
      fullContent: "Inscrit au patrimoine mondial de l'UNESCO, le Guelede est une œuvre d'art totale mêlant masques sculptés, théâtre satirique et chants rituels. Il sert de justice sociale à travers l'humour, tout en honorant 'Nos Mères' (Iyanla), dépositrices du pouvoir de vie et de mort.",
      guidePrice: 12000,
      schedule: [
        { time: "16:00", activity: "Rassemblement des conteurs sur la place publique" },
        { time: "20:00", activity: "Sortie du masque Efe (nuit de la parole)" },
        { time: "15:00 (J+1)", activity: "Grande parade diurne des masques Guelede" }
      ]
    },
    { 
      id: 'e3', 
      title: "Fête de l'Eau", 
      lat: 6.2812, lng: 1.8286,
      date: new Date(currentYear, 11, 22), 
      location: "Grand-Popo, Bénin", 
      image: "https://images.unsplash.com/photo-1560759226-14da22a643ef?auto=format&fit=crop&q=80&w=1200", 
      gallery: generateGallery('e3'),
      type: "Spirituel",
      description: "Purification collective et offrandes aux divinités aquatiques.",
      fullContent: "À l'embouchure où le fleuve Mono rencontre l'Océan, le rite 'Nonvitcha' célèbre la fraternité. C'est ici que l'on invoque Mami Wata et les forces des eaux pour nettoyer les impuretés de l'année écoulée et demander la fertilité pour la saison à venir.",
      guidePrice: 8000,
      schedule: [
        { time: "06:00", activity: "Prière de l'Aurore face à l'Océan" },
        { time: "09:00", activity: "Traversée rituelle en pirogues sacrées" },
        { time: "13:00", activity: "Partage du repas traditionnel sur le sable" }
      ]
    },
    { 
      id: 'e4', 
      title: "Procession Egungun", 
      lat: 6.4969, lng: 2.6289,
      date: new Date(currentYear, 10, 5), 
      location: "Porto-Novo, Bénin", 
      image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=1200", 
      gallery: generateGallery('e4'),
      type: "Tradition",
      description: "Rencontre mystique avec les revenants des ancêtres royaux.",
      fullContent: "Les Egungun ne sont pas de simples masques ; ils sont l'incarnation vivante des ancêtres qui reviennent visiter les vivants. Leur vêtement est composé de centaines de morceaux de tissus précieux accumulés au fil des générations, symbolisant la richesse de la lignée.",
      guidePrice: 20000,
      schedule: [
        { time: "11:00", activity: "Apparition au palais royal de Hogbonou" },
        { time: "14:30", activity: "Procession à travers les quartiers anciens" },
        { time: "17:00", activity: "Démonstrations de force mystique sur la place" }
      ]
    },
    {
      id: 'e5',
      title: "La Fête de la Gaani",
      lat: 9.9324, lng: 3.2081,
      date: new Date(currentYear + 1, 9, 12),
      location: "Nikki, Bénin",
      image: "https://images.unsplash.com/photo-1518911710364-17ec553bde5d?auto=format&fit=crop&q=80&w=1200",
      gallery: generateGallery('e5'),
      type: "Célébration",
      description: "Festival identitaire et culturel des peuples de l'ère Bariba et Boo.",
      fullContent: "La Gaani est le moment où le Sinaboko (Empereur de Nikki) reçoit l'allégeance de ses chefs et du peuple. C'est une célébration de la bravoure, de l'art équestre et de la dignité royale. Les cavaliers s'affrontent dans des fantasias spectaculaires devant le palais.",
      guidePrice: 10000,
      schedule: [
        { time: "08:00", activity: "Parcours rituel des sept sites sacrés" },
        { time: "14:00", activity: "Grande parade équestre de l'Empereur" },
        { time: "16:00", activity: "Danses traditionnelles et chants des griots" }
      ]
    },
    {
      id: 'e6',
      title: "Fête de l'Igname (Té-zan)",
      lat: 7.9221, lng: 1.9765,
      date: new Date(currentYear + 1, 7, 15),
      location: "Savalou, Bénin",
      image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=1200",
      gallery: generateGallery('e6'),
      type: "Tradition",
      description: "Célébration des premières récoltes d'ignames dans le pays Mahi.",
      fullContent: "Le 15 août, Savalou devient le centre de la gastronomie traditionnelle. Personne ne doit consommer l'igname nouvelle avant que les offrandes ne soient faites aux divinités et aux ancêtres pour les remercier de la fertilité de la terre.",
      guidePrice: 5000,
      schedule: [
        { time: "09:00", activity: "Rituel de présentation des prémices au Roi" },
        { time: "12:00", activity: "Dégustation collective du pilé d'igname" },
        { time: "15:00", activity: "Animations folkloriques Zinli et Agbotchébou" }
      ]
    },
    {
        id: 'e7',
        title: "Sortie des Zangbéto",
        lat: 6.3985, lng: 2.4512,
        date: new Date(currentYear + 1, 3, 20),
        location: "Porto-Novo (Agonlin)",
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=1200",
        gallery: generateGallery('e7'),
        type: "Masques",
        description: "Démonstrations mystiques des gardiens de la nuit.",
        fullContent: "Les Zangbéto, flics de la nuit, sortent en plein jour pour montrer leur puissance protectrice. Leurs chapeaux de paille s'animent de manière inexplicable, réalisant des tours de magie qui défient la logique moderne.",
        guidePrice: 7000,
        schedule: [
          { time: "14:00", activity: "Entrée mystique sur la place publique" },
          { time: "16:00", activity: "Démonstrations de métamorphose sous la paille" }
        ]
    },
    {
        id: 'e8',
        title: "Cérémonie du Fa Tite",
        lat: 7.1852, lng: 1.9912,
        date: new Date(currentYear + 1, 5, 5),
        location: "Abomey, Bénin",
        image: "https://images.unsplash.com/photo-1523626797181-8c5ae80d40c2?auto=format&fit=crop&q=80&w=1200",
        gallery: generateGallery('e8'),
        type: "Spirituel",
        description: "Grande initiation publique aux secrets du Fa.",
        fullContent: "Une fois par an, les grands Bokonons d'Abomey se réunissent pour une consultation collective sur le sort de la cité. C'est l'occasion pour les curieux d'observer la rigueur et la précision de la géomancie ancestrale.",
        guidePrice: 12000
    },
    {
        id: 'e9',
        title: "Festival des Masques de Paille",
        lat: 9.7085, lng: 1.6660,
        date: new Date(currentYear + 1, 1, 10),
        location: "Djougou, Bénin",
        image: "https://images.unsplash.com/photo-1552728089-57bdde30fc3e?auto=format&fit=crop&q=80&w=1200",
        gallery: generateGallery('e9'),
        type: "Masques",
        description: "Rassemblement des sociétés secrètes du Nord-Bénin.",
        fullContent: "Moins connus que les masques du sud, les masques de paille de la région de la Donga possèdent une esthétique unique et des danses acrobatiques saisissantes, liées aux rites de passage des jeunes guerriers.",
        guidePrice: 8500
    },
    {
        id: 'e10',
        title: "Hommage au Roi Béhanzin",
        lat: 7.1852, lng: 1.9912,
        date: new Date(currentYear + 1, 11, 10),
        location: "Abomey, Palais Royaux",
        image: "https://images.unsplash.com/photo-1534431871927-1049964e525f?auto=format&fit=crop&q=80&w=1200",
        gallery: generateGallery('e10'),
        type: "Célébration",
        description: "Commémoration de la résistance du lion d'Abomey.",
        fullContent: "Une journée dédiée à la mémoire du Roi Béhanzin. Chants épiques, récits de batailles et rituels de lignée se succèdent dans l'enceinte historique des palais classés au patrimoine mondial.",
        guidePrice: 9000
    },
    {
        id: 'e11',
        title: "Rituel du Grand Serpent",
        lat: 6.3631, lng: 2.0851,
        date: new Date(currentYear + 1, 8, 22),
        location: "Temple des Pythons, Ouidah",
        image: "https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&q=80&w=1200",
        gallery: generateGallery('e11'),
        type: "Spirituel",
        description: "Bénédiction annuelle par la divinité Dangbé.",
        fullContent: "Dangbé, le python sacré, est le protecteur de Ouidah. Ce rituel secret, dont une partie est accessible aux fidèles, vise à assurer la paix et la prospérité des foyers de la cité côtière.",
        guidePrice: 6000
    },
    {
        id: 'e12',
        title: "Festival de la Canne à Sucre",
        lat: 6.3650, lng: 2.4150,
        date: new Date(currentYear + 1, 6, 3),
        location: "Sèmè-Kpodji, Bénin",
        image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80&w=1200",
        gallery: generateGallery('e12'),
        type: "Célébration",
        description: "Fête agricole et culturelle de la vallée de l'Ouémé.",
        fullContent: "Entre traditions lacustres et agriculture maraîchère, ce festival célèbre la douceur de vivre et les échanges commerciaux ancestraux le long du fleuve Ouémé.",
        guidePrice: 4000
    },
    {
        id: 'e13',
        title: "Danse Zinli Royale",
        lat: 7.1667, lng: 2.0667,
        date: new Date(currentYear + 1, 4, 18),
        location: "Bohicon, Bénin",
        image: "https://images.unsplash.com/photo-1628102431525-4672624231b2?auto=format&fit=crop&q=80&w=1200",
        gallery: generateGallery('e13'),
        type: "Tradition",
        description: "Concours des meilleurs groupes de Zinli de la région.",
        fullContent: "Le Zinli était la danse préférée du Roi Glèlè. Ce festival réunit les plus grands maîtres tambours pour des joutes musicales où le rythme dicte la parole des ancêtres.",
        guidePrice: 5500
    },
    {
        id: 'e14',
        title: "Pèlerinage de Dassa",
        lat: 7.7500, lng: 2.1833,
        date: new Date(currentYear + 1, 7, 24),
        location: "Dassa-Zoumé, Collines",
        image: "https://images.unsplash.com/photo-1596438459194-f275f413d6ff?auto=format&fit=crop&q=80&w=1200",
        gallery: generateGallery('e14'),
        type: "Spirituel",
        description: "Syncrétisme et ferveur sur les collines sacrées.",
        fullContent: "Dassa est célèbre pour ses 41 collines. Ce rassemblement est un carrefour où se croisent dévotions traditionnelles Idatcha et pèlerinages religieux, dans un respect mutuel exemplaire.",
        guidePrice: 7500
    },
    {
        id: 'e15',
        title: "La Gaani de Nikki-Zogbodomey",
        lat: 7.0833, lng: 2.1000,
        date: new Date(currentYear + 1, 9, 28),
        location: "Zogbodomey, Bénin",
        image: "https://images.unsplash.com/photo-1625940629601-8f2570086b06?auto=format&fit=crop&q=80&w=1200",
        gallery: generateGallery('e15'),
        type: "Célébration",
        description: "Extension méridionale de la culture équestre.",
        fullContent: "Les populations originaires du Nord installées au Sud célèbrent leur attachement aux racines à travers une mini-Gaani riche en couleurs et en émotions.",
        guidePrice: 6500
    },
    {
        id: 'e16',
        title: "Festival de Porto-Novo",
        lat: 6.4969, lng: 2.6289,
        date: new Date(currentYear + 1, 0, 5),
        location: "Porto-Novo, Capitale",
        image: "https://images.unsplash.com/photo-1589367920969-ab8e05090ca0?auto=format&fit=crop&q=80&w=1200",
        gallery: generateGallery('e16'),
        type: "Célébration",
        description: "L'art et la culture de Hogbonou à l'honneur.",
        fullContent: "Une semaine de festivités mettant en avant les masques Egungun, les danses Goun et l'architecture coloniale et afro-brésilienne unique de la capitale.",
        guidePrice: 11000
    },
    {
        id: 'e17',
        title: "Sortie des Oro",
        lat: 6.7333, lng: 2.6667,
        date: new Date(currentYear + 1, 8, 12),
        location: "Sakété, Bénin",
        image: "https://images.unsplash.com/photo-1605274280925-9dd1ba746654?auto=format&fit=crop&q=80&w=1200",
        gallery: generateGallery('e17'),
        type: "Masques",
        description: "Rituel secret de la forêt et de la justice.",
        fullContent: "Le Oro est une divinité invisible dont on n'entend que le cri strident. Ce festival est un moment de régulation sociale et de purification des espaces publics dans la tradition Yoruba-Nago.",
        guidePrice: 15000
    },
    {
        id: 'e18',
        title: "Célébration de Heviosso",
        lat: 6.6667, lng: 2.2167,
        date: new Date(currentYear + 1, 4, 10),
        location: "Allada, Bénin",
        image: "https://images.unsplash.com/photo-1543236208-1647a6946654?auto=format&fit=crop&q=80&w=1200",
        gallery: generateGallery('e18'),
        type: "Spirituel",
        description: "Invoquer la justice par la foudre.",
        fullContent: "À Allada, berceau du Dahomey, le culte de Heviosso (Sango) est pratiqué avec une ferveur particulière. Les adeptes, vêtus de rouge et de blanc, dansent pour apaiser la colère céleste.",
        guidePrice: 13000
    },
    {
        id: 'e19',
        title: "Marché des Ancêtres",
        lat: 6.4000, lng: 1.8833,
        date: new Date(currentYear + 1, 2, 8),
        location: "Comè, Bénin",
        image: "https://images.unsplash.com/photo-1544253303-34e83712e09e?auto=format&fit=crop&q=80&w=1200",
        gallery: generateGallery('e19'),
        type: "Tradition",
        description: "Échange symbolique de produits rituels.",
        fullContent: "Un événement rare où les anciens se réunissent pour échanger des objets chargés d'histoire et des connaissances sur les plantes médicinales de la lagune Ahémé.",
        guidePrice: 4500
    },
    {
        id: 'e20',
        title: "Fête de la Fraternité",
        lat: 6.2833, lng: 1.8167,
        date: new Date(currentYear + 1, 5, 20),
        location: "Grand-Popo, Plage",
        image: "https://images.unsplash.com/photo-1599307767316-776533bb941c?auto=format&fit=crop&q=80&w=1200",
        gallery: generateGallery('e20'),
        type: "Célébration",
        description: "Union des peuples de la côte (Hwla, Xweda).",
        fullContent: "Musique, jeux traditionnels sur le sable et dégustation du Dakouin géant pour célébrer les liens indéfectibles entre les communautés de la côte.",
        guidePrice: 3500
    },
    {
        id: 'e21',
        title: "Festival Atacora",
        lat: 10.3000, lng: 1.3667,
        date: new Date(currentYear + 1, 10, 15),
        location: "Natitingou, Bénin",
        image: "https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&q=80&w=1200",
        gallery: generateGallery('e21'),
        type: "Tradition",
        description: "Découverte des habitats Tata Somba et rites Betammaribé.",
        fullContent: "Plongez au cœur des montagnes pour découvrir l'architecture défensive unique des Tata et les cérémonies d'initiation des jeunes du Nord-Ouest.",
        guidePrice: 18000
    },
    {
        id: 'e22',
        title: "Rituels de la Cité",
        lat: 6.3500, lng: 2.1000,
        date: new Date(currentYear + 1, 1, 28),
        location: "Ouidah, Quartiers Anciens",
        image: "https://images.unsplash.com/photo-1596944210908-27810358a74a?auto=format&fit=crop&q=80&w=1200",
        gallery: generateGallery('e22'),
        type: "Spirituel",
        description: "Nettoyage énergétique des rues historiques.",
        fullContent: "Une cérémonie nocturne où les prêtres parcourent la ville pour éloigner les ondes négatives et attirer la paix sur la cité historique.",
        guidePrice: 9500
    },
    {
        id: 'e23',
        title: "Danse de la Pluie",
        lat: 11.8667, lng: 3.3833,
        date: new Date(currentYear + 1, 3, 5),
        location: "Malanville, Bénin",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=1200",
        gallery: generateGallery('e23'),
        type: "Tradition",
        description: "Invocations pour la saison agricole au bord du Niger.",
        fullContent: "Les populations Dendi célèbrent le fleuve Niger et invoquent les esprits du ciel pour une saison des pluies abondante et une crue fertile.",
        guidePrice: 7000
    },
    {
        id: 'e24',
        title: "Célébration Mami Wata",
        lat: 6.3650, lng: 2.4500,
        date: new Date(currentYear + 1, 10, 1),
        location: "Cotonou, Plage",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200",
        gallery: generateGallery('e24'),
        type: "Spirituel",
        description: "Beauté, richesse et mystère des eaux.",
        fullContent: "Les prêtresses vêtues de blanc et de bijoux somptueux offrent des parfums et des fleurs à la reine des eaux, dans une ambiance de chants envoûtants au son de l'océan.",
        guidePrice: 12000
    },
    {
        id: 'e25',
        title: "Hommage aux Reines Mères",
        lat: 7.1852, lng: 1.9912,
        date: new Date(currentYear + 1, 2, 8),
        location: "Abomey, Palais Royaux",
        image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=1200",
        gallery: generateGallery('e25'),
        type: "Tradition",
        description: "Célébration de la lignée matriarcale du Dahomey.",
        fullContent: "Une journée dédiée aux femmes puissantes qui ont conseillé les rois. Récits de l'histoire des Amazones et rituels d'honneur à la force féminine.",
        guidePrice: 8000
    }
];

interface EventsProps {
  onNavigate: (page: any, id?: string) => void;
  onToggleDetail?: (isDetail: boolean) => void;
  initialEventId?: string;
}

export const Events: React.FC<EventsProps> = ({ onNavigate, onToggleDetail, initialEventId }) => {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(initialEventId || null);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'booking' | 'success'>('idle');
  const [isLeafletLoaded, setIsLeafletLoaded] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<GalleryItem | null>(null);
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('TOUS LES VILLAGES');
  const [filterDate, setFilterDate] = useState('');
  
  // États pour le scroll et l'affichage mobile
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const lastScrollY = useRef(0);
  const mapRef = useRef<any>(null);

  // Détection du scroll pour masquer/afficher la barre
  useEffect(() => {
    const handleScroll = () => {
      if (isMobileFilterOpen) return; // Ne pas masquer si le menu est ouvert
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsFilterVisible(false);
      } else {
        setIsFilterVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileFilterOpen]);

  // Extraction unique des villages (première partie de la location)
  const villages = useMemo(() => {
    const list = MOCK_EVENTS.map(e => e.location.split(',')[0].split('(')[0].trim());
    return ['TOUS LES VILLAGES', ...Array.from(new Set(list)).sort()];
  }, []);

  // Logique de filtrage
  const filteredEvents = useMemo(() => {
    return MOCK_EVENTS.filter(event => {
      const matchSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.type.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchVillage = selectedVillage === 'TOUS LES VILLAGES' || event.location.includes(selectedVillage);
      
      let matchDate = true;
      if (filterDate) {
        const fDate = new Date(filterDate);
        fDate.setHours(0,0,0,0);
        const eDate = new Date(event.date);
        eDate.setHours(0,0,0,0);
        matchDate = eDate.getTime() === fDate.getTime();
      }

      return matchSearch && matchVillage && matchDate;
    }).sort((a,b) => b.date.getTime() - a.date.getTime());
  }, [searchTerm, selectedVillage, filterDate]);

  // Chargement dynamique de Leaflet
  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (initialEventId) setSelectedEventId(initialEventId);
  }, [initialEventId]);

  const isPast = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return d < t;
  };

  const selectedEvent = MOCK_EVENTS.find(e => e.id === selectedEventId);

  useEffect(() => {
    if (onToggleDetail) onToggleDetail(!!selectedEventId);
  }, [selectedEventId, onToggleDetail]);

  // Initialisation de la carte quand un évènement est sélectionné
  useEffect(() => {
    if (selectedEventId && isLeafletLoaded) {
      const event = MOCK_EVENTS.find(e => e.id === selectedEventId);
      if (event && event.lat && event.lng) {
        const timer = setTimeout(() => {
          const container = document.getElementById('event-map');
          if (container) {
            const L = (window as any).L;
            if (mapRef.current) {
              mapRef.current.remove();
            }
            mapRef.current = L.map('event-map', { zoomControl: false, scrollWheelZoom: false }).setView([event.lat, event.lng], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; OpenStreetMap'
            }).addTo(mapRef.current);
            
            L.circleMarker([event.lat, event.lng], {
              radius: 12,
              fillColor: "#6b4028",
              color: "#d1984b",
              weight: 3,
              opacity: 1,
              fillOpacity: 0.9
            }).addTo(mapRef.current).bindPopup(`<b>${event.title}</b>`).openPopup();
          }
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [selectedEventId, isLeafletLoaded]);

  if (selectedEvent) {
    const eventPast = isPast(selectedEvent.date);
    return (
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-12 animate-fadeIn pb-20 px-0 md:px-0">
        <div className="px-4 md:px-0">
            <button 
                onClick={() => setSelectedEventId(null)} 
                className="flex items-center gap-2 text-brand-600 font-black uppercase text-[10px] tracking-[0.2em] hover:underline group"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Retour à la liste
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
            
            {/* Colonne Principale: Contenu */}
            <div className="lg:col-span-8 space-y-8 md:space-y-12">
                
                {/* Hero Section du détail - Optimisée Mobile */}
                <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl border border-brand-50 overflow-hidden mx-4 md:mx-0">
                    <div className="relative h-64 md:h-[500px]">
                        <img src={selectedEvent.image} className="w-full h-full object-cover" alt={selectedEvent.title} />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-900 via-brand-900/20 to-transparent"></div>
                        <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 text-white space-y-2 md:space-y-4">
                            <div className="flex flex-wrap gap-2">
                                <span className="bg-brand-500 text-brand-900 px-3 py-1 md:px-5 md:py-2 rounded-full text-[8px] md:text-[11px] font-black uppercase tracking-widest shadow-xl">
                                    {selectedEvent.type}
                                </span>
                                {eventPast && <span className="bg-white/20 backdrop-blur text-white px-3 py-1 md:px-5 md:py-2 rounded-full text-[8px] md:text-[11px] font-black uppercase tracking-widest border border-white/30 flex items-center gap-1.5"><History size={12}/> PASSÉ</span>}
                            </div>
                            <h2 className="text-2xl md:text-7xl font-serif font-black leading-tight uppercase tracking-tight">{selectedEvent.title}</h2>
                            <div className="flex flex-wrap items-center gap-3 md:gap-6 text-brand-100 text-[10px] md:text-sm font-bold uppercase tracking-widest">
                                <span className="flex items-center gap-1.5"><MapPin size={14} className="text-brand-400 md:w-5 md:h-5"/> {selectedEvent.location}</span>
                                <span className="flex items-center gap-1.5"><Clock size={14} className="text-brand-400 md:w-5 md:h-5"/> {eventPast ? 'Clôturé' : 'À venir'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-16 space-y-10 md:space-y-16">
                        
                        {/* Récit Historique / Histoire */}
                        <section className="space-y-6 md:space-y-8">
                            <div className="flex items-center gap-3 md:gap-4">
                                <div className="w-2 md:w-3 h-6 md:h-10 bg-brand-500 rounded-full"></div>
                                <h3 className="text-xl md:text-3xl font-serif font-black text-brand-900 uppercase">Récit des Anciens</h3>
                            </div>
                            <div className="prose prose-stone max-none">
                                <p className="text-stone-600 text-base md:text-2xl leading-relaxed italic border-l-4 md:border-l-8 border-brand-100 pl-4 md:pl-8 font-serif font-bold mb-6 md:mb-8">
                                    "{selectedEvent.description}"
                                </p>
                                <p className="text-stone-800 text-sm md:text-lg leading-[1.8] font-light">
                                    {selectedEvent.fullContent}
                                </p>
                            </div>
                        </section>

                        {/* Carte Interactive - Optimisée Mobile */}
                        <section className="space-y-6 md:space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 md:gap-4">
                                    <MapPin className="text-brand-600 w-6 h-6 md:w-8 md:h-8" size={32} />
                                    <h3 className="text-xl md:text-3xl font-serif font-black text-brand-900 uppercase">Géographie Sacrée</h3>
                                </div>
                                <span className="text-[8px] md:text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] hidden sm:block">Emplacement Exact</span>
                            </div>
                            <div className="bg-stone-50 rounded-[2rem] md:rounded-[3rem] p-2 md:p-4 border border-stone-200 shadow-inner overflow-hidden">
                                <div className="bg-white rounded-[1.8rem] md:rounded-[2.5rem] border border-brand-100 shadow-sm overflow-hidden h-56 md:h-96 relative group">
                                    <div id="event-map" className="w-full h-full z-0"></div>
                                    {!isLeafletLoaded && (
                                        <div className="absolute inset-0 bg-stone-100 flex items-center justify-center">
                                            <div className="w-8 h-8 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-white/90 backdrop-blur px-3 py-1.5 md:px-4 md:py-2 rounded-xl md:rounded-2xl shadow-xl z-10 border border-brand-100 flex items-center gap-2 md:gap-3">
                                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-brand-500 rounded-full animate-pulse"></div>
                                        <span className="text-[8px] md:text-xs font-black text-brand-900 uppercase tracking-widest">{selectedEvent.location}</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Programme Officiel / Horaires - Optimisé Mobile */}
                        {selectedEvent.schedule && (
                            <section className="bg-stone-50 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 space-y-6 md:space-y-8 border border-stone-100 shadow-sm">
                                <div className="flex items-center gap-3 md:gap-4">
                                    <Clock className="text-brand-600 w-6 h-6 md:w-8 md:h-8" size={32} />
                                    <h3 className="text-xl md:text-3xl font-serif font-black text-brand-900 uppercase">Programme</h3>
                                </div>
                                <div className="space-y-4 md:space-y-6">
                                    {selectedEvent.schedule.map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-4 md:gap-6 group">
                                            <div className="shrink-0 w-16 md:w-24 text-brand-600 font-black text-sm md:text-lg pt-0.5">{item.time}</div>
                                            <div className="flex-grow pb-4 md:pb-6 border-b border-stone-200 group-last:border-0">
                                                <p className="text-stone-900 font-bold text-sm md:text-lg leading-tight">{item.activity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>

            {/* Barre Latérale: Actions & Infos Rapides - Optimisée Mobile */}
            <div className="lg:col-span-4 space-y-6 md:space-y-8 px-4 md:px-0">
                
                {/* Carte de réservation / participation */}
                <div className="lg:sticky lg:top-40 bg-white rounded-[2.5rem] md:rounded-[3.5rem] border-2 md:border-4 border-brand-50 shadow-2xl p-6 md:p-10 space-y-8 md:space-y-10 flex flex-col">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-brand-50 rounded-xl md:rounded-2xl flex items-center justify-center text-brand-600 shadow-inner shrink-0">
                            {eventPast ? <History size={24} className="md:w-8 md:h-8" /> : <Ticket size={24} className="md:w-8 md:h-8" />}
                        </div>
                        <div>
                            <h4 className="font-serif font-black text-xl md:text-2xl text-brand-900">
                                {eventPast ? "Revisiter" : "Participer"}
                            </h4>
                            <p className="text-[8px] md:text-[10px] text-stone-400 font-black uppercase tracking-widest">
                                Immersion Privilégiée
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-stone-50 p-6 md:p-8 rounded-[1.8rem] md:rounded-[2.5rem] text-center border border-stone-100">
                            <span className="text-[8px] md:text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-1">Contribution / Accès</span>
                            <div className="flex items-baseline justify-center gap-1.5 md:gap-2">
                                <span className="text-3xl md:text-5xl font-serif font-black text-brand-900">{selectedEvent.guidePrice.toLocaleString()}</span>
                                <span className="text-xs md:text-sm font-bold text-brand-600 uppercase">FCFA</span>
                            </div>
                        </div>

                        <ul className="space-y-3 md:space-y-4 px-1">
                            {["Accès prioritaire", "Guide expert dédié", "Documentation sacrée", "Rafraîchissements locaux"].map((item, i) => (
                                <li key={i} className="flex items-center gap-2.5 md:gap-3 text-[9px] md:text-xs font-bold text-stone-600 uppercase tracking-wide">
                                    <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                                        <Check size={10} className="md:w-3 md:h-3" strokeWidth={4} />
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <button 
                            onClick={() => { setBookingStatus('booking'); setTimeout(() => setBookingStatus('success'), 1500); }} 
                            className="w-full bg-brand-900 text-white py-5 md:py-6 rounded-xl md:rounded-2xl font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-[9px] md:text-[11px] shadow-2xl hover:bg-black transition-all group flex items-center justify-center gap-2 md:gap-3"
                        >
                            {bookingStatus === 'booking' ? (
                                <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : bookingStatus === 'success' ? (
                                <>INSCRIPTION VALIDÉE <Check size={16} /></>
                            ) : (
                                <>REJOINDRE L'EXPÉRIENCE <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </div>
                </div>

                {/* Infos supplémentaires */}
                <div className="bg-brand-50 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-stone-100 space-y-4 md:space-y-6">
                    <h5 className="font-serif font-black text-brand-900 flex items-center gap-2 uppercase text-[11px] md:text-sm">
                        <Info size={16} className="text-brand-50 md:w-[18px] md:h-[18px]" /> Notes Utiles
                    </h5>
                    <div className="space-y-3 md:space-y-4">
                        <div className="p-3 md:p-4 bg-white rounded-xl md:rounded-2xl border border-brand-100 shadow-sm flex gap-3 md:gap-4">
                            <Users className="text-brand-400 shrink-0 w-4 h-4 md:w-5 md:h-5" size={20} />
                            <p className="text-[9px] md:text-[11px] text-stone-600 font-medium leading-relaxed uppercase tracking-wider">Tenue respectueuse recommandée (blanc).</p>
                        </div>
                        <div className="p-3 md:p-4 bg-white rounded-xl md:rounded-2xl border border-brand-100 shadow-sm flex gap-3 md:gap-4">
                            <BookOpen className="text-brand-400 shrink-0 w-4 h-4 md:w-5 md:h-5" size={20} />
                            <p className="text-[9px] md:text-[11px] text-stone-600 font-medium leading-relaxed uppercase tracking-wider">Interdiction de filmer les rituels secrets.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* GALERIE ÉLARGIE - EXTRAITE POUR EXPLOITER TOUTE LA LARGEUR DE L'INTERFACE */}
        {selectedEvent.gallery && (
            <section className="mt-16 md:mt-24 space-y-8 md:space-y-12">
                <div className="flex items-center gap-3 md:gap-4 px-4 md:px-0">
                    <div className="w-2 md:w-3 h-8 md:h-12 bg-brand-900 rounded-full"></div>
                    <h3 className="text-2xl md:text-4xl font-serif font-black text-brand-900 uppercase tracking-tight">GALERIE DE L'ÉVÈNEMENT</h3>
                </div>
                
                {/* Conteneur : Scroll horizontal optimisé sur mobile (75vw pour voir le suivant nettement), Grille aérée sur desktop */}
                <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-6 pb-12 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-10 md:overflow-visible">
                    {selectedEvent.gallery.map((item, idx) => (
                        <div 
                            key={idx} 
                            className="shrink-0 w-[75vw] md:w-full snap-center bg-white rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl border border-stone-100 flex flex-col group hover:shadow-brand-900/10 transition-all duration-700 hover:-translate-y-2"
                        >
                            <div className="relative aspect-[16/11] overflow-hidden cursor-pointer" onClick={() => setSelectedGalleryImage(item)}>
                                <img 
                                    src={item.url} 
                                    className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-110" 
                                    alt={item.title} 
                                />
                                <div className="absolute inset-0 bg-brand-900/0 group-hover:bg-brand-900/20 transition-all duration-500 flex items-center justify-center">
                                    <div className="bg-white/90 backdrop-blur-md p-4 rounded-full scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 shadow-2xl">
                                        <Eye className="text-brand-900 w-6 h-6" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 md:p-10 space-y-4 flex-grow bg-white flex flex-col">
                                <div className="flex items-start gap-3">
                                    <div className="w-1 h-6 bg-brand-500 rounded-full mt-1 shrink-0"></div>
                                    <h4 className="font-serif font-black text-brand-900 text-xl md:text-2xl uppercase tracking-tight leading-tight">
                                        {item.title}
                                    </h4>
                                </div>
                                <p className="text-stone-500 text-sm md:text-base italic leading-relaxed flex-grow">"{item.description}"</p>
                                <div className="pt-4 border-t border-stone-50 flex justify-end">
                                    <span className="text-[10px] font-black text-brand-300 uppercase tracking-widest">Capture Sacrée</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        )}

        {/* Modal d'aperçu d'image de la galerie */}
        {selectedGalleryImage && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 animate-fadeIn">
                <div className="absolute inset-0 bg-brand-900/80 backdrop-blur-md" onClick={() => setSelectedGalleryImage(null)}></div>
                <div className="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden relative z-10 animate-slideUp flex flex-col max-h-[90dvh]">
                    <div className="relative flex-grow overflow-hidden min-h-0 bg-black flex items-center justify-center">
                        <img src={selectedGalleryImage.url} className="max-w-full max-h-full object-contain" alt={selectedGalleryImage.title} />
                        <button 
                            onClick={() => setSelectedGalleryImage(null)}
                            className="absolute top-6 right-6 p-4 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white hover:text-brand-900 transition-all shadow-xl z-20"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <div className="p-8 md:p-12 bg-white shrink-0 space-y-4 border-t border-stone-100">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-8 bg-brand-600 rounded-full"></div>
                            <h3 className="text-2xl md:text-4xl font-serif font-black text-brand-900 uppercase tracking-tight">{selectedGalleryImage.title}</h3>
                        </div>
                        <p className="text-stone-500 text-base md:text-xl italic leading-relaxed">"{selectedGalleryImage.description}"</p>
                    </div>
                </div>
            </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-10 md:space-y-12 pb-20 animate-fadeIn relative">
      {/* 1. Header du catalogue */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 md:p-4 bg-brand-100 rounded-full mb-2">
            <Ticket className="text-brand-600 w-6 h-6 md:w-8 md:h-8" size={32} />
        </div>
        <h1 className="text-3xl md:text-6xl font-serif font-bold text-brand-900 tracking-tight uppercase">Évènements Traditionnels</h1>
        <p className="text-stone-500 text-base md:text-lg max-w-xl mx-auto italic px-4">"Célébrez la vie à travers les rites qui marquent le temps."</p>
      </div>

      {/* 2. Système de Filtres - Version Responsive avec Hide on Scroll */}
      <section className={`max-w-6xl mx-auto px-4 md:px-0 sticky top-16 md:top-24 z-[50] transition-all duration-500 ${isFilterVisible ? 'translate-y-0 opacity-100' : '-translate-y-24 md:-translate-y-32 opacity-0 pointer-events-none'}`}>
          {/* MOBILE TRIGGER */}
          <div className="lg:hidden">
              <button 
                onClick={() => setIsMobileFilterOpen(true)}
                className="w-full bg-white/95 backdrop-blur-xl p-4 md:p-5 rounded-[2rem] shadow-2xl border border-brand-50 flex items-center justify-between text-left group active:scale-95 transition-all"
              >
                  <div className="flex items-center gap-4">
                      <div className="p-3 bg-brand-50 text-brand-600 rounded-xl group-hover:bg-brand-900 group-hover:text-white transition-colors">
                          <Search size={20} />
                      </div>
                      <div>
                          <p className="text-xs font-black text-brand-900 uppercase tracking-widest">Rechercher</p>
                          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Filtrez les évènements</p>
                      </div>
                  </div>
                  <div className="p-3 text-stone-300">
                      <SlidersHorizontal size={20} />
                  </div>
              </button>
          </div>

          {/* DESKTOP FILTERS (Visible uniquement sur desktop) */}
          <div className="hidden lg:flex bg-white/95 backdrop-blur-xl p-6 md:p-8 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl border border-brand-50 flex-col lg:flex-row gap-6 items-stretch lg:items-center">
              {/* Mots-clés */}
              <div className="flex-grow relative group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-brand-600 transition-colors" size={20} />
                  <input 
                      type="text" 
                      placeholder="Mots clés (Ex: Vodoun, Masque...)" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-14 pr-6 py-4 bg-stone-50 rounded-2xl md:rounded-[2rem] outline-none focus:ring-4 focus:ring-brand-500/5 focus:border-brand-500 transition-all font-medium border border-stone-100"
                  />
              </div>

              {/* Village Natal */}
              <div className="lg:w-64 relative group">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-brand-600 transition-colors" size={20} />
                  <select 
                      value={selectedVillage}
                      onChange={(e) => setSelectedVillage(e.target.value)}
                      className="w-full pl-14 pr-10 py-4 bg-stone-50 rounded-2xl md:rounded-[2rem] outline-none focus:ring-4 focus:ring-brand-500/5 focus:border-brand-500 transition-all font-medium border border-stone-100 appearance-none cursor-pointer"
                  >
                      {villages.map(v => (
                          <option key={v} value={v}>{v}</option>
                      ))}
                  </select>
                  <ChevronRight size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-stone-300 pointer-events-none rotate-90" />
              </div>

              {/* Date */}
              <div className="lg:w-56 relative group">
                  <CalendarIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-brand-600 transition-colors" size={20} />
                  <input 
                      type="date" 
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                      className="w-full pl-14 pr-6 py-4 bg-stone-50 rounded-2xl md:rounded-[2rem] outline-none focus:ring-4 focus:ring-brand-500/5 focus:border-brand-500 transition-all font-medium border border-stone-100 cursor-pointer"
                  />
              </div>

              {/* Reset (Visible si filtre actif) */}
              {(searchTerm || selectedVillage !== 'TOUS LES VILLAGES' || filterDate) && (
                  <button 
                      onClick={() => { setSearchTerm(''); setSelectedVillage('TOUS LES VILLAGES'); setFilterDate(''); }}
                      className="p-4 bg-brand-50 text-brand-600 rounded-2xl hover:bg-brand-100 transition-all shadow-sm"
                      title="Réinitialiser les filtres"
                  >
                      <X size={20} />
                  </button>
              )}
          </div>
      </section>

      {/* MOBILE FILTER MODAL / OVERLAY */}
      {isMobileFilterOpen && (
          <div className="fixed inset-0 z-[110] lg:hidden flex flex-col items-center justify-center p-6 animate-fadeIn">
              <div className="absolute inset-0 bg-brand-900/60 backdrop-blur-md" onClick={() => setIsMobileFilterOpen(false)}></div>
              
              <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl p-8 md:p-10 relative z-10 animate-slideUp space-y-4">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="font-serif font-black text-brand-900 uppercase text-lg tracking-tight">Filtrer les Évènements</h3>
                      <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-stone-100 text-stone-400 rounded-full hover:bg-brand-50 transition-colors">
                          <X size={20} />
                      </button>
                  </div>
                  
                  {/* Stacked Filter Layout matching screenshot request */}
                  <div className="space-y-4">
                    <div className="relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                        <input 
                            type="text" 
                            placeholder="Mots clés..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-5 bg-stone-50 rounded-[1.5rem] outline-none border border-stone-100 focus:border-brand-500 transition-all font-bold text-xs uppercase tracking-widest text-brand-900 shadow-inner"
                        />
                    </div>

                    <div className="relative group">
                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                        <select 
                            value={selectedVillage}
                            onChange={(e) => setSelectedVillage(e.target.value)}
                            className="w-full pl-14 pr-10 py-5 bg-stone-50 rounded-[1.5rem] outline-none border border-stone-100 focus:border-brand-500 transition-all font-bold text-xs uppercase tracking-widest text-brand-900 appearance-none cursor-pointer shadow-inner"
                        >
                            {villages.map(v => (
                                <option key={v} value={v}>{v}</option>
                            ))}
                        </select>
                        <ChevronRight size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-stone-300 pointer-events-none rotate-90" />
                    </div>

                    <div className="relative group">
                        <CalendarIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                        <input 
                            type="date" 
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="w-full pl-14 pr-6 py-5 bg-stone-50 rounded-[1.5rem] outline-none border border-stone-100 focus:border-brand-500 transition-all font-bold text-xs uppercase tracking-widest text-brand-900 shadow-inner"
                        />
                    </div>
                  </div>

                  <div className="pt-6 flex gap-3">
                      <button 
                          onClick={() => { setSearchTerm(''); setSelectedVillage('TOUS LES VILLAGES'); setFilterDate(''); }}
                          className="flex-1 py-4 bg-stone-100 text-stone-400 rounded-2xl font-black uppercase tracking-widest text-[10px]"
                      >
                          Effacer
                      </button>
                      <button 
                          onClick={() => setIsMobileFilterOpen(false)}
                          className="flex-1 py-4 bg-brand-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl"
                      >
                          Appliquer
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* 3. Liste des Évènements (Cartes) */}
      <section className="max-w-6xl mx-auto px-4 md:px-0">
        <div className="mb-4 px-6 flex justify-between items-center">
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                {filteredEvents.length} évènement{filteredEvents.length > 1 ? 's' : ''} trouvé{filteredEvents.length > 1 ? 's' : ''}
            </p>
        </div>
        {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
            {filteredEvents.map((event) => {
                const eventPast = isPast(event.date);
                return (
                <div 
                    key={event.id} 
                    onClick={() => setSelectedEventId(event.id)} 
                    className="bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-2xl border border-brand-50 overflow-hidden group hover:scale-[1.02] transition-all cursor-pointer relative flex flex-col h-full animate-slideUp"
                >
                    <div className="relative h-56 md:h-72 overflow-hidden">
                    <img src={event.image} className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" alt={event.title} />
                    <div className="absolute top-4 left-4 md:top-6 md:left-6 flex gap-2">
                        <span className="bg-brand-900 text-white px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest">{event.type}</span>
                        {eventPast && <span className="bg-stone-800/80 backdrop-blur text-white px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><History size={12}/> PASSÉ</span>}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 text-white space-y-1 md:space-y-2">
                        <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest text-brand-400"><MapPin size={14} className="md:w-4 md:h-4"/> {event.location}</div>
                        <h3 className="text-xl md:text-2xl font-serif font-black leading-tight uppercase tracking-tight">{event.title}</h3>
                    </div>
                    </div>
                    <div className="p-6 md:p-8 space-y-4 md:space-y-6 flex-grow flex flex-col justify-between">
                    <div className="space-y-3 md:space-y-4">
                        <div className="flex items-center justify-between text-brand-600 font-black uppercase tracking-widest text-[10px] md:text-[11px] border-b border-stone-50 pb-3 md:pb-4">
                        <div className="flex items-center gap-1.5 md:gap-2"><CalendarDays size={16} className="md:w-[18px] md:h-[18px]"/> {event.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                        </div>
                        <p className="text-stone-500 text-xs md:text-sm italic line-clamp-2">"{event.description}"</p>
                    </div>
                    <button className={`w-full py-4 md:py-5 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] group transition-all flex items-center justify-center gap-2 mt-2 md:mt-4 ${eventPast ? 'bg-stone-100 text-stone-600 hover:bg-brand-900 hover:text-white' : 'bg-brand-900 text-white'}`}>
                        {eventPast ? (
                            <>VOIR L'ÉDITION <History size={14} className="group-hover:rotate-[-45deg] transition-transform"/></>
                        ) : (
                            <>VOIR LE PROGRAMME <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/></>
                        )}
                    </button>
                    </div>
                </div>
                );
            })}
            </div>
        ) : (
            <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-stone-100 space-y-6 animate-fadeIn">
                <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto text-stone-200 shadow-inner">
                    <Filter size={40} />
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-serif font-black text-brand-900 uppercase">Aucun évènement trouvé</h3>
                    <p className="text-stone-400 text-sm max-w-sm mx-auto italic">Ajustez vos filtres pour découvrir d'autres moments sacrés dans nos villages.</p>
                </div>
                <button 
                    onClick={() => { setSearchTerm(''); setSelectedVillage('TOUS LES VILLAGES'); setFilterDate(''); }}
                    className="px-8 py-3 bg-brand-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:bg-black transition-all"
                >
                    VOIR TOUT LE CALENDRIER
                </button>
            </div>
        )}
      </section>
    </div>
  );
};
