
import React, { useState, useEffect } from 'react';
import { Globe, MapPin, Share2, Search, ArrowRight, ArrowLeft, Clock, Newspaper, Bookmark, Printer, Coffee, Maximize2, Quote as QuoteIcon, Sparkles } from 'lucide-react';

interface WorldArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  extraImages?: string[];
  location: string;
  region: 'Afrique' | 'Asie' | 'Amériques' | 'Europe' | 'Global';
  date: string;
  author: string;
  tags: string[];
}

const MOCK_WORLD_NEWS: WorldArticle[] = [
  {
    id: 'wn1',
    title: "Renaissance des Temples d'Angkor : Découverte d'Inscriptions inédites",
    excerpt: "Des archéologues ont mis au jour des textes sacrés gravés sur des stèles oubliées, révélant de nouveaux mantras de guérison.",
    content: "Le Cambodge célèbre une avancée majeure dans la compréhension de son patrimoine spirituel. Près de la cité sacrée d'Angkor Wat, une équipe pluridisciplinaire a identifié une structure souterraine abritant des stèles du XIIe siècle. Ces découvertes ne sont pas seulement archéologiques mais profondément spirituelles.\n\nLe professeur Linh Tran, qui dirige les fouilles, affirme que ces textes 'parlent au cœur de l'humanité moderne'. Les premières traductions suggèrent que le temple n'était pas seulement un lieu de culte mais une véritable université de l'âme, où la science du Fa trouvait des échos lointains mais familiers.\n\nLes autorités cambodgiennes prévoient d'ouvrir une section spéciale au musée national pour exposer ces trésors, tout en préservant le caractère sacré du site originel. Les pèlerins affluent déjà, espérant capter une ontce de cette sagesse retrouvée sous la mousse et les racines des banians géants.",
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=1200",
    extraImages: [
        "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1608481337062-4093bf3ed404?auto=format&fit=crop&q=80&w=800"
    ],
    location: "Siam Reap, Cambodge",
    region: "Asie",
    date: "Il y a 2h",
    author: "Pr. Linh Tran",
    tags: ["Bouddhisme", "Archéologie", "Sagesse"]
  },
  {
    id: 'wn2',
    title: "Le Rite du Soleil en Amazonie : Une Tradition Sauvée",
    excerpt: "Les tribus locales s'unissent pour préserver les cérémonies du solstice d'été contre l'urbanisation croissante.",
    content: "Au cœur de la forêt amazonienne, les gardiens de la terre se sont réunis pour célébrer le Soleil. Ce rite ancestral, menacé par l'avancée des routes, a retrouvé une nouvelle vigueur grâce à une coopération inédite entre jeunes et anciens.",
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=800",
    location: "Manaus, Brésil",
    region: "Amériques",
    date: "Il y a 5h",
    author: "Elena Santos",
    tags: ["Nature", "Soleil", "Indigène"]
  },
  {
    id: 'wn3',
    title: "Mystères du Nil : Des Statues retrouvées près de Louxor",
    excerpt: "Une expédition conjointe a découvert trois nouvelles statues monumentales lors d'une baisse inhabituelle des eaux du Nil.",
    content: "L'Égypte continue de révéler ses secrets les plus profonds. Ces statues, représentant des gardiens spirituels, jettent une lumière nouvelle sur les rites de purification aquatiques des pharaons.",
    image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&q=80&w=800",
    location: "Louxor, Égypte",
    region: "Afrique",
    date: "Aujourd'hui",
    author: "Dr. Ahmed Zahi",
    tags: ["Égypte", "Nil", "Patrimoine"]
  },
  {
    id: 'wn4',
    title: "L'Art de la Méditation Nordique : Paix dans les Fjords",
    excerpt: "De nouveaux centres de retraite spirituelle ouvrent en Norvège, alliant silence glacial et chaleur intérieure.",
    content: "Face à l'agitation mondiale, le Nord propose une alternative radicale. La méditation dans le froid extrême devient un outil de transformation mentale prisé par les voyageurs en quête de sens.",
    image: "https://images.unsplash.com/photo-1518911710364-17ec553bde5d?auto=format&fit=crop&q=80&w=800",
    location: "Bergen, Norvège",
    region: "Europe",
    date: "Hier",
    author: "Ingrid Nilsen",
    tags: ["Méditation", "Fjord", "Nordique"]
  },
  {
    id: 'wn5',
    title: "Symposium Global sur les Sagesses Traditionnelles",
    excerpt: "Les représentants de 50 nations se réunissent pour discuter de l'avenir des cultes ancestraux à l'ère du numérique.",
    content: "Le débat porte sur la manière de numériser les savoirs sans en perdre la substance sacrée. Une charte mondiale est en cours de rédaction.",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800",
    location: "Genève, Suisse",
    region: "Global",
    date: "Il y a 3 jours",
    author: "Jean-Pierre Marc",
    tags: ["Conférence", "Futur", "Global"]
  },
  {
    id: 'wn6',
    title: "Célébrations à Ouidah : Le Retour des Diaspora",
    excerpt: "Des milliers de descendants de la diaspora reviennent sur la terre de leurs ancêtres pour le festival Vodoun.",
    content: "Un moment de reconnexion intense marqué par des libations à la Porte du Non-Retour et des retrouvailles familiales émouvantes.",
    image: "https://images.unsplash.com/photo-1590739293166-791786523152?auto=format&fit=crop&q=80&w=800",
    location: "Ouidah, Bénin",
    region: "Afrique",
    date: "Il y a 6h",
    author: "Koffi Mensah",
    tags: ["Vodoun", "Bénin", "Retrouvailles"]
  },
  {
    id: 'wn7',
    title: "La Route de la Soie Spirituelle : Voyage au Tibet",
    excerpt: "Un reportage exclusif sur les monastères perchés qui conservent des manuscrits sur l'harmonie des éléments.",
    content: "À plus de 4000 mètres d'altitude, la sagesse du Tibet continue de vibrer malgré les pressions du monde extérieur.",
    image: "https://images.unsplash.com/photo-1512418490979-92798ccc13a0?auto=format&fit=crop&q=80&w=800",
    location: "Lhassa, Tibet",
    region: "Asie",
    date: "Hier",
    author: "Tenzin Gyatso",
    tags: ["Tibet", "Monastère", "Éléments"]
  },
  {
    id: 'wn8',
    title: "Traditions des Andes : Le Secret de la Pachamama",
    excerpt: "Les agriculteurs péruviens redécouvrent les offrandes à la terre pour contrer le changement climatique.",
    content: "La science moderne valide les pratiques ancestrales de respect des cycles lunaires pour la fertilité des sols.",
    image: "https://images.unsplash.com/photo-1531278566303-3aa327b46c71?auto=format&fit=crop&q=80&w=800",
    location: "Cusco, Pérou",
    region: "Amériques",
    date: "Il y a 2 jours",
    author: "Maria Gutierrez",
    tags: ["Pachamama", "Climat", "Andes"]
  },
  {
    id: 'wn9',
    title: "Patrimoine de l'UNESCO : Les Masques Guelede honorés",
    excerpt: "Une nouvelle exposition itinérante à travers l'Europe met en lumière la richesse du patrimoine immatériel béninois.",
    content: "Les masques Guelede ne sont pas que des objets d'art, ils sont les vecteurs d'une justice sociale par la satire.",
    image: "https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&q=80&w=800",
    location: "Paris, France",
    region: "Europe",
    date: "Aujourd'hui",
    author: "Lucie Durand",
    tags: ["Exposition", "Culture", "UNESCO"]
  },
  {
    id: 'wn10',
    title: "Forêts Sacrées de Kyoto : Méditation sous les Cerisiers",
    excerpt: "Le Japon lance un programme de protection des bois entourant les sanctuaires Shinto millénaires.",
    content: "Le 'Shinrin-yoku' ou bain de forêt, est ici pratiqué comme un rite spirituel d'une grande précision.",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800",
    location: "Kyoto, Japon",
    region: "Asie",
    date: "Il y a 12h",
    author: "Hiroshi Sato",
    tags: ["Kyoto", "Nature", "Shinto"]
  },
  {
    id: 'wn11',
    title: "L'Afrique Connectée : Applications pour le Fa",
    excerpt: "Une startup nigériane développe une IA capable d'aider à la mémorisation des 256 signes du Fa.",
    content: "La technologie se met au service de l'initiation, permettant aux jeunes urbains de garder un lien avec leurs racines.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    location: "Lagos, Nigéria",
    region: "Afrique",
    date: "Hier",
    author: "Oluwaseun Adeyemi",
    tags: ["Tech", "IA", "Initiation"]
  },
  {
    id: 'wn12',
    title: "Rites du Feu en Australie : Sagesse des Aborigènes",
    excerpt: "Les anciens partagent leurs techniques de gestion des sols par le feu, basées sur des chants sacrés.",
    content: "Une collaboration historique entre pompiers modernes et gardiens aborigènes pour prévenir les incendies.",
    image: "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&q=80&w=800",
    location: "Alice Springs, Australie",
    region: "Global",
    date: "Il y a 4 jours",
    author: "Bill Wanyuma",
    tags: ["Feu", "Australie", "Aborigène"]
  },
  {
    id: 'wn13',
    title: "Architecture Sacrée : La Mosquée de Djenné restaurée",
    excerpt: "Les habitants se réunissent pour le crépissage annuel de ce monument historique en terre crue.",
    content: "Un événement communautaire unique qui allie fête, ferveur et préservation du patrimoine mondial.",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
    location: "Djenné, Mali",
    region: "Afrique",
    date: "Il y a 1 semaine",
    author: "Moussa Traoré",
    tags: ["Architecture", "Mali", "Communauté"]
  },
  {
    id: 'wn14',
    title: "Mysticisme dans les Carpates : Le retour des Loups",
    excerpt: "Les bergers roumains réactivent des rituels de protection anciens face au retour de la faune sauvage.",
    content: "Un mélange fascinant de foi populaire et d'écologie pratique dans les montagnes d'Europe de l'Est.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
    location: "Brasov, Roumanie",
    region: "Europe",
    date: "Il y a 2 jours",
    author: "Radu Popescu",
    tags: ["Montagne", "Europe", "Loup"]
  },
  {
    id: 'wn15',
    title: "Le Carnaval de Rio : Au-delà des Paillettes",
    excerpt: "Les écoles de samba célèbrent les racines africaines et les Orixás dans leurs défilés cette année.",
    content: "Le carnaval redevient un espace de résistance culturelle et de célébration religieuse profonde.",
    image: "https://images.unsplash.com/photo-1560759226-14da22a643ef?auto=format&fit=crop&q=80&w=800",
    location: "Rio de Janeiro, Brésil",
    region: "Amériques",
    date: "Hier",
    author: "Fabio Silva",
    tags: ["Carnaval", "Orixás", "Brésil"]
  },
  {
    id: 'wn16',
    title: "Sagesse Maori : Le fleuve Whanganui doté d'une âme",
    excerpt: "Une loi historique reconnaît le fleuve comme une personne morale vivante, inspirée des traditions Maoris.",
    content: "Le monde entier observe ce modèle de protection environnementale basé sur la spiritualité autochtone.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800",
    location: "Whanganui, Nouvelle-Zélande",
    region: "Global",
    date: "Il y a 3 jours",
    author: "Aroha Williams",
    tags: ["Maori", "Environnement", "Droit"]
  },
  {
    id: 'wn17',
    title: "Tofu Sacré au Mont Koya : Cuisine de Temple",
    excerpt: "La gastronomie Shojin Ryori des moines bouddhistes attire les gourmets en quête de pureté.",
    content: "Chaque geste en cuisine est une prière, chaque saveur un reflet de l'impermanence des choses.",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=800",
    location: "Mont Koya, Japon",
    region: "Asie",
    date: "Il y a 5 jours",
    author: "Yuki Tanaka",
    tags: ["Cuisine", "Bouddhisme", "Japon"]
  },
  {
    id: 'wn18',
    title: "Renaissance Celtique en Bretagne : Menhirs et Solstices",
    excerpt: "De nouveaux rituels s'organisent autour de Carnac pour célébrer le lien entre terre et étoiles.",
    content: "Les druides modernes cherchent à recréer une harmonie avec le cosmos sur les lieux chargés d'histoire.",
    image: "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&q=80&w=800",
    location: "Carnac, France",
    region: "Europe",
    date: "Aujourd'hui",
    author: "Yann Le Goff",
    tags: ["Bretagne", "Celtique", "Menhir"]
  },
  {
    id: 'wn19',
    title: "Le Mystère des Dogons : Astronomie et Falaise",
    excerpt: "Une étude réévalue les connaissances stellaires des Dogons sur le système de Sirius.",
    content: "La falaise de Bandiagara reste un lieu de transmission orale d'une précision déconcertante.",
    image: "https://images.unsplash.com/photo-1523805081326-7846d14f8154?auto=format&fit=crop&q=80&w=800",
    location: "Pays Dogon, Mali",
    region: "Afrique",
    date: "Il y a 10 jours",
    author: "Ibrahim Keïta",
    tags: ["Dogon", "Astronomie", "Afrique"]
  },
  {
    id: 'wn20',
    title: "Chamanisme en Sibérie : Chants du Tambour",
    excerpt: "Une rencontre internationale de chamans se tient pour prier pour la paix dans le monde.",
    content: "Dans les steppes glacées, le son du tambour résonne pour appeler les esprits de la terre et du ciel.",
    image: "https://images.unsplash.com/photo-1542332213-31f87348057f?auto=format&fit=crop&q=80&w=800",
    location: "Lac Baïkal, Russie",
    region: "Europe",
    date: "Aujourd'hui",
    author: "Dimitri Sokolov",
    tags: ["Chamanisme", "Paix", "Sibérie"]
  },
  {
    id: 'wn21',
    title: "La Danse de l'Ours : Rites d'Hiver au Canada",
    excerpt: "Les Premières Nations réactivent des danses sacrées pour honorer l'esprit protecteur de l'ours.",
    content: "Une célébration de la force et de l'hibernation créatrice au cœur des neiges éternelles.",
    image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=800",
    location: "Yukon, Canada",
    region: "Amériques",
    date: "Hier",
    author: "Sarah Bear",
    tags: ["Canada", "Ours", "Danse"]
  }
];

interface WorldNewsProps {
  onToggleDetail?: (isDetail: boolean) => void;
  initialArticleId?: string;
}

export const WorldNews: React.FC<WorldNewsProps> = ({ onToggleDetail, initialArticleId }) => {
  const [activeRegion, setActiveRegion] = useState<string>('Tout');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(initialArticleId || null);

  useEffect(() => {
    if (initialArticleId) setSelectedArticleId(initialArticleId);
  }, [initialArticleId]);

  const regions = ['Tout', 'Afrique', 'Asie', 'Amériques', 'Europe', 'Global'];

  const filteredNews = MOCK_WORLD_NEWS.filter(article => {
    const matchRegion = activeRegion === 'Tout' || article.region === activeRegion;
    const matchSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        article.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchRegion && matchSearch;
  });

  const selectedArticle = MOCK_WORLD_NEWS.find(a => a.id === selectedArticleId);

  useEffect(() => {
    if (onToggleDetail) {
      onToggleDetail(!!selectedArticleId);
    }
  }, [selectedArticleId, onToggleDetail]);

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-[#f4f1ea] -mt-12 -mx-4 pb-20 px-4 md:px-0 animate-fadeIn">
        <div className="max-w-6xl mx-auto py-8 md:py-12 space-y-6 md:space-y-8">
          <div className="flex justify-between items-center border-b-2 border-stone-900 pb-4 mx-4 md:mx-0">
            <button onClick={() => { setSelectedArticleId(null); window.scrollTo({top: 0}); }} className="flex items-center gap-2 text-stone-900 font-bold hover:scale-105 transition-transform text-xs md:text-sm">
              <ArrowRight className="rotate-180" size={18} /> RETOUR AU FIL
            </button>
            <div className="flex gap-2 md:gap-4">
                <button className="p-1.5 md:p-2 hover:bg-stone-200 rounded-full transition-colors"><Printer size={18}/></button>
                <button className="p-1.5 md:p-2 hover:bg-stone-200 rounded-full transition-colors"><Share2 size={18}/></button>
                <button className="p-1.5 md:p-2 hover:bg-stone-200 rounded-full transition-colors"><Bookmark size={18}/></button>
            </div>
          </div>

          <header className="text-center space-y-4 border-b-4 border-double border-stone-900 pb-8 px-4 md:px-0">
              <div className="flex justify-between items-center border-b border-stone-300 pb-2 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-stone-500">
                  <span>No. 1248 — {selectedArticle.region} Edition</span>
                  <span className="text-stone-900 text-[10px] md:text-sm font-black hidden sm:inline">LA GAZETTE DU FA & VODOUN</span>
                  <span>{new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <h1 className="text-3xl md:text-6xl lg:text-7xl font-serif font-black text-stone-900 leading-[1.1] uppercase tracking-tighter drop-shadow-sm break-words">{selectedArticle.title}</h1>
              <div className="flex justify-center items-center flex-wrap gap-2 md:gap-4 text-[9px] md:text-xs font-bold uppercase tracking-[0.2em] pt-2">
                  <span className="bg-stone-900 text-white px-3 py-1">ÉDITION SPÉCIALE</span>
                  <span className="text-stone-400 hidden sm:inline">|</span>
                  <span className="text-brand-700 italic">Par {selectedArticle.author}</span>
              </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-12 pt-4 md:pt-8">
            <aside className="lg:col-span-1 space-y-12 border-r border-stone-300 pr-8 hidden lg:block">
                <section className="space-y-4">
                    <h3 className="font-black uppercase tracking-widest text-stone-900 border-b-2 border-stone-900 pb-2 flex items-center gap-2"><MapPin size={16}/> En Direct</h3>
                    <div className="bg-stone-200 p-4 border border-stone-300"><p className="text-xs italic leading-relaxed text-stone-700">"Les vibrations détectées ce matin à {selectedArticle.location} indiquent une résurgence majeure."</p></div>
                </section>
                <div className="flex items-center gap-3 text-stone-400"><Coffee size={24} /><span className="text-[9px] font-black uppercase tracking-widest">Temps de lecture: 8 min</span></div>
            </aside>
            <article className="lg:col-span-3 space-y-8 md:space-y-10 px-4 md:px-0">
                <div className="relative group overflow-hidden border-4 md:border-8 border-white shadow-xl rotate-1">
                    <img src={selectedArticle.image} className="w-full grayscale-[0.3] hover:grayscale-0 transition-all duration-700 aspect-[16/10] object-cover" alt={selectedArticle.title} />
                </div>
                <div className="bg-stone-100 p-6 md:p-12 border-y-2 border-stone-900 flex gap-4 md:gap-6 items-start">
                    <QuoteIcon size={32} className="text-stone-300 shrink-0 hidden sm:block" />
                    <p className="text-xl md:text-3xl font-serif font-black text-stone-900 leading-tight">{selectedArticle.excerpt}</p>
                </div>
                <div className="columns-1 md:columns-2 gap-8 md:gap-12 text-stone-800 font-serif text-base md:text-lg leading-[1.8] space-y-6">
                    <p className="first-letter:text-6xl md:first-letter:text-7xl first-letter:font-black first-letter:mr-2 first-letter:float-left first-letter:text-stone-900">{selectedArticle.content.split('\n\n')[0]}</p>
                    {selectedArticle.content.split('\n\n').slice(1).map((para, i) => (<p key={i} className="indent-6 md:indent-8">{para}</p>))}
                </div>
            </article>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 animate-fadeIn px-4 md:px-0">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-4 bg-brand-100 rounded-full mb-2"><Newspaper className="text-brand-600" size={32} /></div>
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-brand-900 tracking-tight uppercase">La Gazette du Fa</h1>
        <p className="text-stone-500 text-lg max-w-xl mx-auto italic">Actualités spirituelles, culturelles et découvertes mondiales.</p>
      </div>

      <div className="max-w-6xl mx-auto space-y-12">
        <div className="bg-white p-6 rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-brand-50 flex flex-col md:flex-row gap-6 md:sticky md:top-24 z-30 transform hover:-translate-y-1 transition-transform">
          <div className="relative flex-grow">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300" size={22} />
            <input type="text" placeholder="Rechercher une actualité..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-16 pr-6 py-5 bg-stone-50 rounded-[1.5rem] outline-none text-lg font-medium" />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
            {regions.map(reg => (
              <button key={reg} onClick={() => setActiveRegion(reg)} className={`px-8 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all ${activeRegion === reg ? 'bg-brand-900 text-white shadow-2xl' : 'bg-stone-50 text-stone-500 hover:bg-brand-50'}`}>{reg}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {filteredNews.length === 0 ? (
            <div className="col-span-full py-32 text-center space-y-6 bg-white rounded-[4rem] border-4 border-dashed border-stone-100">
               <Globe className="text-stone-200 mx-auto" size={80} />
               <p className="text-stone-400 font-serif text-2xl italic">"Aucune actualité trouvée dans cette région."</p>
               <button onClick={() => {setActiveRegion('Tout'); setSearchTerm('');}} className="text-brand-600 font-black uppercase tracking-widest text-xs hover:underline">Réinitialiser les filtres</button>
            </div>
          ) : (
            filteredNews.map((article, idx) => (
              <div key={article.id} onClick={() => { setSelectedArticleId(article.id); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="bg-white rounded-[3.5rem] shadow-xl hover:shadow-2xl transition-all duration-700 border border-brand-50 overflow-hidden group flex flex-col cursor-pointer">
                <div className="relative overflow-hidden aspect-[16/10]">
                    <img src={article.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[4s]" alt={article.title} />
                    <div className="absolute top-6 left-6"><span className="bg-brand-900/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">{article.region}</span></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent flex items-end p-8 opacity-0 group-hover:opacity-100 transition-opacity"><span className="bg-white text-brand-900 px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-3">LIRE L'ÉDITION <ArrowRight size={16}/></span></div>
                </div>
                <div className="p-10 space-y-6 flex-grow flex flex-col">
                    <div className="flex items-center gap-4 text-stone-400"><div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center font-black text-brand-600 shadow-inner">{article.author.charAt(0)}</div><div className="flex flex-col"><span className="text-xs font-black uppercase text-brand-900 leading-none">{article.author}</span><span className="text-[10px] font-bold text-stone-400 uppercase mt-1">{article.date} • {article.location}</span></div></div>
                    <h3 className="text-2xl font-serif font-black text-brand-900 group-hover:text-brand-600 transition-colors uppercase">{article.title}</h3>
                    <p className="text-stone-500 italic line-clamp-3 font-medium flex-grow">"{article.excerpt}"</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
