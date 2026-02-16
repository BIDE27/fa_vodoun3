
import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, CreditCard, Filter, X, ArrowUp, Star, Check, Eye, Search, ShoppingBag, ChevronLeft, ChevronRight, ArrowLeft, MessageSquare, Zap } from 'lucide-react';
import { Product, CartItem, User } from '../types';

const MOCK_PRODUCTS: Product[] = [
  { 
    id: '1', 
    name: 'Le Grand Livre du Fa', 
    price: 15000, 
    originalPrice: 18500,
    category: 'livre', 
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
    images: [
        'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Guide complet pour les initiés et les curieux de la géomancie.',
    fullDescription: 'Cet ouvrage de référence explore les 16 signes mères et les 240 signes dérivés. Écrit par des sages reconnus, il détaille les rituels, les interdits et les sagesses associés à chaque Du. Indispensable pour toute personne souhaitant approfondir sa connexion avec le divin.'
  },
  { 
    id: '2', 
    name: 'Chapelet de Divination', 
    nameFon: 'Agumaga',
    price: 5000, 
    originalPrice: 6500,
    category: 'accessoire', 
    image: 'https://images.unsplash.com/photo-1605274280925-9dd1ba746654?auto=format&fit=crop&q=80&w=800',
    description: 'Outil traditionnel authentique en noix de palme.',
    fullDescription: 'Le chapelet de divination (Agumaga) est l\'outil principal du Bokonon. Fabriqué à la main selon les rites ancestraux, chaque pièce est unique.'
  },
  { 
    id: 'a1', 
    name: 'Caméléon vivant', 
    nameFon: 'Agamon gbèdégbè',
    price: 12000, 
    category: 'animal', 
    image: 'https://images.unsplash.com/photo-1523626797181-8c5ae80d40c2?auto=format&fit=crop&q=80&w=800',
    description: 'Animal sacré utilisé pour les rituels de transformation et d\'adaptation.'
  },
  { 
    id: 'a2', 
    name: 'Tête de Caméléon', 
    nameFon: 'Agamon ta',
    price: 4500, 
    category: 'animal', 
    image: 'https://images.unsplash.com/photo-1523626797181-8c5ae80d40c2?auto=format&fit=crop&q=80&w=800',
    description: 'Composant essentiel pour de nombreuses préparations médicinales traditionnelles.'
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
    description: 'Utilisée pour les parures rituelles et les talismans de clarté.'
  },
  { 
    id: 'a5', 
    name: 'Bouc de sacrifice', 
    nameFon: 'Gbôbo',
    price: 35000, 
    category: 'animal', 
    image: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&q=80&w=800',
    description: 'Pour les rituels majeurs de purification et de remerciement.'
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
    description: 'Herbe de purification par excellence pour les bains rituels.'
  },
  { 
    id: 'v2', 
    name: 'Feuille de Moringa', 
    nameFon: 'Patagonba',
    price: 2000, 
    category: 'vegetal', 
    image: 'https://images.unsplash.com/photo-1596438459194-f275f413d6ff?auto=format&fit=crop&q=80&w=800',
    description: 'Plante aux mille vertus, utilisée pour la force physique et spirituelle.'
  },
  { 
    id: 'v3', 
    name: 'Petit Cola', 
    nameFon: 'Ahowé',
    price: 500, 
    category: 'vegetal', 
    image: 'https://images.unsplash.com/photo-1625940629601-8f2570086b06?auto=format&fit=crop&q=80&w=800',
    description: 'Symbole de longévité et composant de nombreuses offrandes.'
  },
  { 
    id: 'acc1', 
    name: 'Pagne Blanc', 
    nameFon: 'Avô wiwi',
    price: 8500, 
    category: 'accessoire', 
    image: 'https://images.unsplash.com/photo-1589367920969-ab8e05090ca0?auto=format&fit=crop&q=80&w=800',
    description: 'Tissu de pureté requis pour les cérémonies de paix.'
  },
  { 
    id: 'acc2', 
    name: 'Cauris sacrés', 
    nameFon: 'Akoué',
    price: 3000, 
    category: 'accessoire', 
    image: 'https://images.unsplash.com/photo-1605274280925-9dd1ba746654?auto=format&fit=crop&q=80&w=800',
    description: 'Ancienne monnaie, aujourd\'hui utilisée pour la parure et le sacrifice.'
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
    description: 'Perles de taille ou de poignet chargées énergétiquement.'
  }
];

interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

const MOCK_REVIEWS: Record<string, Review[]> = {
    '1': [
        { id: 'r1', user: 'Koffi A.', rating: 5, comment: 'Une bible pour comprendre notre culture.', date: 'Il y a 3 jours', avatar: 'https://i.pravatar.cc/150?u=koffi' }
    ]
};

interface StoreProps {
  user: User;
  cart: CartItem[];
  addToCart: (p: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  isLoggedIn: boolean;
  triggerAuth: () => void;
  onToggleDetail?: (isDetail: boolean) => void;
  initialProductId?: string;
}

export const Store: React.FC<StoreProps> = ({ user, cart, addToCart, removeFromCart, updateQuantity, clearCart, isLoggedIn, triggerAuth, onToggleDetail, initialProductId }) => {
  const [category, setCategory] = useState<'all' | 'livre' | 'accessoire' | 'rituel' | 'animal' | 'vegetal'>('all');
  const [isCheckout, setIsCheckout] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(initialProductId || null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState<string | null>(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    if (initialProductId) setSelectedProductId(initialProductId);
  }, [initialProductId]);

  const selectedProduct = MOCK_PRODUCTS.find(p => p.id === selectedProductId);

  useEffect(() => {
    if (onToggleDetail) {
        onToggleDetail(!!selectedProductId || isCheckout);
    }
  }, [selectedProductId, isCheckout, onToggleDetail]);

  useEffect(() => {
    const handleScroll = () => {
        setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentImgIndex(0);
  }, [selectedProductId]);

  const filteredProducts = MOCK_PRODUCTS.filter(p => {
    const matchCat = category === 'all' || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (p.nameFon && p.nameFon.toLowerCase().includes(searchTerm.toLowerCase())) ||
                        p.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleAddToCartWithAnim = (product: Product) => {
      addToCart(product);
      setAddedAnimation(product.id);
      setTimeout(() => setAddedAnimation(null), 1000);
  };

  const handleBuyNow = (product: Product) => {
    if (!isLoggedIn) {
        triggerAuth();
        return;
    }
    addToCart(product);
    setIsCheckout(true);
  };

  const handleCheckoutRequest = () => {
    if (!isLoggedIn) {
        triggerAuth();
    } else {
        setIsCheckout(true);
    }
  };

  if (isCheckout) {
    return (
      <div className="p-8 max-w-2xl mx-auto bg-white rounded-[3rem] shadow-2xl border border-brand-50 animate-[slideUp_0.4s_ease-out]">
        <h2 className="text-3xl font-serif font-bold mb-8 text-brand-900">Finaliser ma commande</h2>
        <div className="space-y-4 mb-8">
            {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-stone-50 p-4 rounded-2xl">
                    <span className="text-stone-600 font-medium">{item.name} x {item.quantity}</span>
                    <span className="font-bold text-brand-900">{(item.price * item.quantity).toLocaleString()} FCFA</span>
                </div>
            ))}
            <div className="p-6 bg-brand-900 text-white rounded-2xl flex justify-between items-center">
                <span className="text-lg opacity-80 uppercase tracking-widest font-bold">Total</span>
                <span className="text-3xl font-serif font-bold">{total.toLocaleString()} FCFA</span>
            </div>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); alert('Commande validée !'); clearCart(); setIsCheckout(false); }} className="space-y-4">
            <input required type="text" placeholder="Nom complet" defaultValue={isLoggedIn ? user.name : ""} className="w-full p-5 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500" />
            <input required type="email" placeholder="Email" defaultValue={isLoggedIn ? user.email : ""} className="w-full p-5 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500" />
            <button type="submit" className="w-full bg-brand-600 text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:bg-brand-700 transition-all flex items-center justify-center gap-3">
                <CreditCard size={24} /> Payer maintenant
            </button>
            <button type="button" onClick={() => setIsCheckout(false)} className="w-full text-stone-400 font-bold hover:text-brand-600 transition-colors">Annuler</button>
        </form>
      </div>
    );
  }

  if (selectedProduct) {
    const productImages = [selectedProduct.image, ...(selectedProduct.images || [])];
    const similarProducts = MOCK_PRODUCTS.filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id).slice(0, 3);
    const productReviews = MOCK_REVIEWS[selectedProduct.id] || [];
    const avgRating = productReviews.length > 0 ? (productReviews.reduce((a, b) => a + b.rating, 0) / productReviews.length).toFixed(1) : "Nouveau";

    return (
      <div className="space-y-16 animate-[fadeIn_0.5s_ease-out]">
        <button onClick={() => setSelectedProductId(null)} className="flex items-center gap-2 text-brand-600 font-bold hover:underline group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Retour au catalogue
        </button>

        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
            <div className="lg:w-1/2 space-y-6">
                <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl bg-stone-100 border border-brand-50">
                    <img 
                        src={productImages[currentImgIndex]} 
                        alt={selectedProduct.name} 
                        className="w-full h-full object-cover animate-[fadeIn_0.3s]" 
                    />
                </div>
            </div>

            <div className="lg:w-1/2 space-y-8 flex flex-col">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="bg-brand-50 text-brand-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-brand-100">{selectedProduct.category}</span>
                      {selectedProduct.nameFon && <span className="bg-brand-900 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">{selectedProduct.nameFon}</span>}
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-serif font-bold text-brand-900 leading-tight">{selectedProduct.name}</h1>
                    <div className="flex items-center gap-4">
                        <div className="flex text-yellow-500">
                            {[...Array(5)].map((_, i) => <Star key={i} size={20} fill={i < Math.floor(Number(avgRating) || 0) ? "currentColor" : "none"} className={i < Math.floor(Number(avgRating) || 0) ? "" : "text-stone-200"} />)}
                        </div>
                    </div>
                </div>

                <div className="flex items-baseline gap-4">
                    <p className="text-4xl font-serif font-bold text-brand-600">{selectedProduct.price.toLocaleString()} FCFA</p>
                </div>

                <div className="prose prose-stone">
                    <p className="text-stone-600 text-lg leading-relaxed">{selectedProduct.fullDescription || selectedProduct.description}</p>
                </div>

                <div className="pt-8 border-t border-stone-100 space-y-4">
                    <button 
                        onClick={() => handleBuyNow(selectedProduct)}
                        className="w-full bg-brand-600 text-white py-5 rounded-2xl font-bold text-lg shadow-2xl hover:bg-brand-700 transition-all flex items-center justify-center gap-4"
                    >
                        <Zap size={24} fill="currentColor" /> Acheter maintenant
                    </button>
                    <button 
                        onClick={() => handleAddToCartWithAnim(selectedProduct)}
                        className={`w-full py-5 rounded-2xl font-bold text-lg shadow-2xl transition-all flex items-center justify-center gap-4 ${addedAnimation === selectedProduct.id ? 'bg-green-600 text-white' : 'bg-brand-900 text-white hover:bg-black'}`}
                    >
                        {addedAnimation === selectedProduct.id ? <Check size={24}/> : <ShoppingCart size={24} />}
                        {addedAnimation === selectedProduct.id ? 'Ajouté !' : 'Ajouter au panier'}
                    </button>
                </div>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-12">
      <div className="text-center space-y-4 animate-[fadeIn_0.8s_ease-out]">
        <div className="inline-flex items-center justify-center p-3 bg-brand-100 rounded-full mb-2"><ShoppingBag className="text-brand-600" size={32} /></div>
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-brand-900">Boutique Sacrée</h1>
        <div className="h-1 w-24 bg-brand-400 mx-auto rounded-full"></div>
        <p className="text-stone-500 text-lg max-w-xl mx-auto italic">"Chaque objet, végétal ou animal sacré porte en lui une vibration unique pour harmoniser votre chemin."</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 bg-white p-6 rounded-[2.5rem] shadow-sm border border-brand-50 overflow-hidden">
        <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
            <input 
                type="text" 
                placeholder="Rechercher (Français ou Fon)..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-stone-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500"
            />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
            {['all', 'livre', 'accessoire', 'rituel', 'animal', 'vegetal'].map((cat) => (
                <button
                    key={cat}
                    onClick={() => setCategory(cat as any)}
                    className={`px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${category === cat ? 'bg-brand-900 text-white shadow-xl' : 'bg-stone-50 text-stone-600 hover:bg-brand-50'}`}
                >
                    {cat === 'all' ? 'Tout' : cat === 'animal' ? 'Animaux' : cat === 'vegetal' ? 'Végétaux' : cat}
                </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map(product => {
          const reviews = MOCK_REVIEWS[product.id] || [];
          const avg = reviews.length > 0 ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1) : null;

          return (
            <div key={product.id} className="bg-white rounded-[2.5rem] shadow-sm overflow-hidden hover:shadow-2xl transition-all duration-500 border border-brand-50 flex flex-col group animate-[fadeIn_0.4s_ease-out]">
                <div className="relative cursor-pointer aspect-square overflow-hidden" onClick={() => setSelectedProductId(product.id)}>
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                    <div className="absolute inset-0 bg-brand-900/10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-white/90 backdrop-blur-md text-brand-900 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl flex items-center gap-2 transform translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-all">
                            <Eye size={16}/> Détails
                        </span>
                    </div>
                    {product.nameFon && (
                      <div className="absolute top-4 left-4 bg-brand-900 text-white px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl opacity-90 group-hover:scale-110 transition-transform">
                        {product.nameFon}
                      </div>
                    )}
                </div>
                <div className="p-8 space-y-4 flex flex-col flex-grow">
                <div className="space-y-1">
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-brand-500 mb-1 block">{product.category}</span>
                    <h3 className="font-serif font-bold text-xl text-brand-900 leading-tight group-hover:text-brand-600 transition-colors">{product.name}</h3>
                </div>
                <p className="text-stone-500 text-sm line-clamp-2 italic font-medium">"{product.description}"</p>
                <div className="flex justify-between items-center pt-6 border-t border-stone-50 mt-auto">
                    <div className="flex flex-col">
                        <span className="font-black text-xl text-brand-900 font-serif">{product.price.toLocaleString()} F</span>
                    </div>
                    <button 
                    onClick={() => handleAddToCartWithAnim(product)}
                    className={`p-4 rounded-2xl shadow-lg transition-all ${addedAnimation === product.id ? 'bg-green-600 text-white' : 'bg-brand-600 text-white hover:bg-brand-700'}`}
                    >
                    {addedAnimation === product.id ? <Check size={20} /> : <ShoppingCart size={20} />}
                    </button>
                </div>
                </div>
            </div>
          );
        })}
      </div>

      {showScrollTop && (
          <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="fixed bottom-24 left-8 z-40 bg-brand-900 text-white p-4 rounded-full shadow-2xl hover:bg-black transition-all"><ArrowUp size={24} /></button>
      )}

      {cart.length > 0 && (
          <button onClick={handleCheckoutRequest} className="fixed bottom-12 right-1/2 translate-x-1/2 z-[50] bg-brand-500 text-brand-900 px-10 py-5 rounded-full font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl flex items-center gap-4 hover:scale-105 transition-all md:translate-x-0 md:right-32">
              <ShoppingCart size={24} /> Commander ({total.toLocaleString()} F)
          </button>
      )}
    </div>
  );
};