
import React, { useEffect } from 'react';
import { 
  Sparkles, Ticket, Newspaper, Tag, GraduationCap, 
  ChevronRight, ArrowLeft, Trash2, CheckCircle2, Clock, 
  Bell, AlertCircle, Zap
} from 'lucide-react';

interface NotificationItem {
  id: string;
  type: 'consultation' | 'event' | 'news' | 'promo' | 'course';
  title: string;
  description: string;
  date: string;
  link: string;
  linkId?: string;
  isRead: boolean;
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    type: 'consultation',
    title: 'Consultation Terminée',
    description: 'Votre signe Gbe-Meji a été révélé par l\'Agumaga. Découvrez votre rapport détaillé.',
    date: 'Il y a 10 min',
    link: 'dashboard',
    linkId: 'cons1',
    isRead: false
  },
  {
    id: '2',
    type: 'event',
    title: 'Vodoun Days arrive !',
    description: 'Plus que 5 jours avant le grand rassemblement de Ouidah. Préparez vos offrandes.',
    date: 'Il y a 2h',
    link: 'events',
    linkId: 'e1',
    isRead: false
  },
  {
    id: '3',
    type: 'promo',
    title: 'Offre Sacrée : -15%',
    description: 'Profitez d\'une réduction exceptionnelle sur tous les accessoires rituels ce weekend.',
    date: 'Hier',
    link: 'store',
    isRead: false
  },
  {
    id: '4',
    type: 'course',
    title: 'Nouvelle formation publiée',
    description: 'Bokonon Amoussa vient de mettre en ligne : "L\'Art du Chapelet (Agumaga)".',
    date: 'Hier',
    link: 'learning',
    linkId: 'c5',
    isRead: true
  },
  {
    id: '5',
    type: 'news',
    title: 'Découverte Majeure',
    description: 'Nouveaux manuscrits révélés à Abomey. Une variante du signe Gbe-Meji identifiée.',
    date: 'Il y a 2 jours',
    link: 'news',
    linkId: 'n2',
    isRead: true
  }
];

interface NotificationsProps {
  onNavigate: (page: any, id?: string) => void;
  onClearUnread: () => void;
}

export const Notifications: React.FC<NotificationsProps> = ({ onNavigate, onClearUnread }) => {
  
  useEffect(() => {
    onClearUnread();
  }, [onClearUnread]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'consultation': return <Sparkles className="text-purple-500" />;
      case 'event': return <Ticket className="text-amber-500" />;
      case 'news': return <Newspaper className="text-blue-500" />;
      case 'promo': return <Tag className="text-red-500" />;
      case 'course': return <GraduationCap className="text-green-500" />;
      default: return <Bell className="text-stone-400" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'consultation': return 'Consultation';
      case 'event': return 'Évènement';
      case 'news': return 'Actualité';
      case 'promo': return 'Promotion';
      case 'course': return 'Formation';
      default: return 'Notification';
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12 animate-fadeIn pb-20">
      <div className="flex items-center justify-between border-b border-stone-200 pb-8">
        <div className="flex items-center gap-4">
          <div className="bg-brand-900 text-white p-4 rounded-3xl shadow-xl">
            <Bell size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-black text-brand-900 uppercase tracking-tight">Mises à jour</h1>
            <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">Votre flux spirituel</p>
          </div>
        </div>
        <button className="p-3 bg-stone-100 text-stone-400 rounded-full hover:text-brand-600 transition-all hover:bg-brand-50">
          <Trash2 size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {MOCK_NOTIFICATIONS.map((notif) => (
          <div 
            key={notif.id}
            onClick={() => onNavigate(notif.link as any, notif.linkId)}
            className={`
              relative p-6 md:p-8 rounded-[2.5rem] border transition-all cursor-pointer group flex gap-6 items-start
              ${notif.isRead 
                ? 'bg-white border-brand-50 shadow-sm opacity-80' 
                : 'bg-white border-brand-100 shadow-xl scale-[1.01]'
              }
              hover:bg-brand-50 hover:border-brand-200
            `}
          >
            {!notif.isRead && (
              <div className="absolute top-8 right-8 w-3 h-3 bg-brand-500 rounded-full shadow-[0_0_10px_rgba(209,152,75,0.5)]"></div>
            )}
            
            <div className={`p-4 rounded-2xl shrink-0 shadow-inner ${
              notif.type === 'consultation' ? 'bg-purple-50' : 
              notif.type === 'event' ? 'bg-amber-50' : 
              notif.type === 'news' ? 'bg-blue-50' : 
              notif.type === 'promo' ? 'bg-red-50' : 'bg-green-50'
            }`}>
              {getIcon(notif.type)}
            </div>

            <div className="flex-grow space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-500">{getTypeLabel(notif.type)}</span>
                <span className="text-[10px] text-stone-300 font-bold flex items-center gap-1"><Clock size={12}/> {notif.date}</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-brand-900 leading-tight">{notif.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed italic line-clamp-2">"{notif.description}"</p>
            </div>

            <div className="self-center text-stone-300 group-hover:text-brand-600 transition-colors group-hover:translate-x-1">
              <ChevronRight size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-brand-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-40 h-40 bg-brand-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10 text-center md:text-left">
          <div className="p-4 bg-white/10 rounded-3xl border border-white/10">
            <Zap size={32} className="text-brand-400" />
          </div>
          <div className="space-y-2 flex-grow">
            <h4 className="text-xl font-serif font-bold">Rester Synchronisé</h4>
            <p className="text-brand-200 text-sm italic">Activez les notifications push pour ne manquer aucun message des ancêtres ou opportunités du temple.</p>
          </div>
          <button className="bg-brand-500 text-brand-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white transition-all shadow-xl">Activer</button>
        </div>
      </div>
    </div>
  );
};
