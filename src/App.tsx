import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ArrowRight, ChevronLeft, Lock, Clock, ShoppingBasket, Phone, MapPin, Search, Moon, Sun } from 'lucide-react';
import { Food } from './data';
import { useSite } from './context/SiteContext';
import { EditableText } from './components/EditableText';
import { AdminPanel } from './components/AdminPanel';
import { ContactModal } from './components/ContactModal';
import { LandingSections } from './components/LandingSections';
import Lenis from 'lenis';
import gsap from 'gsap';

// Logo from public images
const logoImg = '/images/2d27dbea-8d35-4e1f-84a1-d4027ac8a38e.png';

// Particle explosion hook & component
const VEGGIES = ['🍄', '🧅', '🧄', '🥬', '🌶️', '🍅', '🌿', '🥗', '🥦'];

interface Particle {
  id: string;
  x: number;
  y: number;
  veg: string;
  angle: number;
  velocity: number;
  rotation: number;
  scale: number;
}

const ParticleSystem = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Trigger if click is on a button or link or has pointer cursor
      const isClickable = target.closest('button') || target.closest('a') || window.getComputedStyle(target).cursor === 'pointer';
      
      if (isClickable) {
        const { clientX, clientY } = e;
        const newParticles: Particle[] = Array.from({ length: 8 }).map(() => ({
          id: Math.random().toString(),
          x: clientX,
          y: clientY,
          veg: VEGGIES[Math.floor(Math.random() * VEGGIES.length)],
          angle: Math.random() * Math.PI * 2,
          velocity: 50 + Math.random() * 100,
          rotation: Math.random() * 360,
          scale: 0.5 + Math.random() * 1
        }));

        setParticles(prev => [...prev, ...newParticles]);

        setTimeout(() => {
          setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
        }, 1000);
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence>
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ 
              x: p.x, 
              y: p.y, 
              opacity: 1, 
              scale: 0,
              rotate: 0 
            }}
            animate={{ 
              x: p.x + Math.cos(p.angle) * p.velocity, 
              y: p.y + Math.sin(p.angle) * p.velocity + 50, // slight gravity
              opacity: 0,
              scale: p.scale,
              rotate: p.rotation + 180
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute text-2xl drop-shadow-lg"
            style={{ x: '-50%', y: '-50%' }}
          >
            {p.veg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const App = () => {
  const { currentView, setCurrentView, isEditMode, setIsEditMode, isDarkMode, setIsDarkMode, favorites } = useSite();
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [showFullMenu, setShowFullMenu] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  if (currentView === 'admin') {
    return <AdminPanel />;
  }

  const handleMapClick = () => {
    const lat = 41.3271; // Predefined coordinates, could be moved to context
    const lng = 69.2818;
    // Try to open intent for maps if on mobile, else web
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  const themeClasses = isDarkMode 
    ? "bg-[#111] text-white" 
    : "bg-[#f8f5f0] text-[#1a1a1a]";

  return (
    <div className={`relative min-h-screen overflow-x-hidden font-sans selection:bg-orange-500 selection:text-white transition-colors duration-1000 ${themeClasses}`}>
      <ParticleSystem />

      {isEditMode && (
        <div className="fixed top-4 right-4 z-[100] flex gap-4">
          <div className="bg-blue-600 px-4 py-2 rounded-lg font-bold text-white shadow-lg animate-pulse">
            TAHRIRLASH REJIMI
          </div>
          <button 
            onClick={() => { setIsEditMode(false); setCurrentView('admin'); }}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-bold text-white shadow-lg transition-colors"
          >
            Chiqish
          </button>
        </div>
      )}
      
      <AnimatePresence mode="wait">
        {!showFullMenu ? (
          <motion.div 
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.8 }}
            className="relative z-10 min-h-screen flex flex-col"
          >
            {/* Background Texture & Glow */}
            <div 
              className={`absolute inset-0 pointer-events-none bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${isDarkMode ? 'opacity-40' : 'opacity-10'}`}
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&q=80&w=2000')" }}
            />
            <div className={`absolute inset-0 pointer-events-none backdrop-blur-md transition-colors duration-1000 ${isDarkMode ? 'bg-black/70' : 'bg-white/80'}`} />
            
            {/* Dynamic lights based on theme */}
            <div className={`absolute top-1/2 right-1/4 w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none -translate-y-1/2 transition-colors duration-1000 ${isDarkMode ? 'bg-orange-600/20' : 'bg-orange-400/30'}`} />
            <div className={`absolute top-1/2 right-1/3 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none -translate-y-1/2 transition-colors duration-1000 ${isDarkMode ? 'bg-yellow-500/10' : 'bg-yellow-400/20'}`} />

            {/* HEADER */}
            <header className="relative z-20 flex items-center justify-between px-6 py-6 md:px-12 max-w-[1400px] mx-auto w-full">
              {/* Logo */}
              <div className="flex items-center gap-4 cursor-pointer" onClick={() => setShowFullMenu(false)}>
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 transition-colors duration-500 ${isDarkMode ? 'border-orange-500 bg-white shadow-[0_0_20px_rgba(249,115,22,0.4)]' : 'border-[#1a1a1a] shadow-xl'}`}>
                  <img src={logoImg} alt="Zaytun" className="w-full h-full object-cover" />
                </div>
                <span className={`font-black text-2xl md:text-3xl tracking-widest uppercase transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-[#1a1a1a]'}`} style={isDarkMode ? { textShadow: "0 0 15px rgba(255,165,0,0.5)" } : {}}>
                  Zaytun
                </span>
              </div>

              {/* Navigation */}
              <nav className="hidden lg:flex items-center gap-8 text-sm font-bold uppercase tracking-wider">
                <button onClick={() => { setShowFavorites(false); setShowFullMenu(true); }} className={`transition-colors relative group ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`}>
                  Menyu
                  <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full"></span>
                </button>
                <button onClick={handleMapClick} className={`transition-colors relative group flex items-center gap-2 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`}>
                  Bizning Joylashuvimiz
                  <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full"></span>
                </button>
                <button onClick={() => setShowContactModal(true)} className={`transition-colors relative group ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`}>
                  Kontaktlar
                  <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full"></span>
                </button>
                {favorites.length > 0 && (
                  <motion.button 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => { setShowFavorites(true); setShowFullMenu(true); }} 
                    className="flex items-center gap-2 text-orange-500 hover:text-orange-400 transition-colors relative group"
                  >
                    <Star className="w-4 h-4 fill-current" /> Yoqtirganlarim
                  </motion.button>
                )}
              </nav>

              {/* Right side info */}
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`p-3 rounded-full backdrop-blur-md transition-all ${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-black/5 hover:bg-black/10 text-black'}`}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isDarkMode ? 'dark' : 'light'}
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </motion.div>
                  </AnimatePresence>
                </button>
                
                <div className="hidden md:flex items-center gap-3 cursor-pointer group" onClick={() => setShowFullMenu(true)}>
                  <div className={`p-3 rounded-full transition-colors ${isDarkMode ? 'bg-white/5 group-hover:bg-orange-500/20' : 'bg-black/5 group-hover:bg-orange-500/10'}`}>
                    <ShoppingBasket className={`w-5 h-5 transition-colors ${isDarkMode ? 'text-gray-300 group-hover:text-orange-500' : 'text-gray-700 group-hover:text-orange-600'}`} />
                  </div>
                </div>
              </div>
            </header>

            {/* HERO SECTION */}
            <main className="relative z-10 flex-1 flex items-center max-w-[1400px] mx-auto w-full px-4 md:px-12 py-6 md:py-12">
              <div className="grid grid-cols-2 gap-4 md:gap-12 lg:gap-20 items-center w-full">
                
                {/* Left Content */}
                <div className="flex flex-col items-start gap-6 md:gap-8 relative z-20">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-2 text-[10px] sm:text-xs md:text-sm font-bold tracking-wider uppercase px-3 py-1.5 md:px-4 md:py-2 rounded-full backdrop-blur-md border ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-white/50 border-black/10 text-gray-700 shadow-sm'}`}
                  >
                    <Clock className="w-3 h-3 md:w-4 md:h-4 text-orange-500" />
                    <EditableText contentKey="heroTopText" />
                  </motion.div>
                  
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl sm:text-4xl md:text-7xl lg:text-[5.5rem] font-black leading-tight tracking-tight drop-shadow-2xl pr-4"
                  >
                    <EditableText contentKey="heroTitle" />
                  </motion.h1>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`text-xs sm:text-sm md:text-xl max-w-lg leading-relaxed font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                  >
                    <EditableText contentKey="heroSubtitle" />
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col md:flex-row md:flex-wrap gap-3 md:gap-6 mt-2 text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider"
                  >
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.6)]" />
                      <EditableText contentKey="heroFeature1" />
                    </div>
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.6)]" />
                      <EditableText contentKey="heroFeature2" />
                    </div>
                  </motion.div>

                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      if (!(e.target as HTMLElement).closest('.lucide-pencil')) {
                        setShowFullMenu(true);
                      }
                    }}
                    className={`mt-4 md:mt-4 px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 rounded-xl md:rounded-2xl font-black text-xs sm:text-sm md:text-lg shadow-[0_20px_40px_rgba(249,115,22,0.3)] hover:shadow-[0_25px_50px_rgba(249,115,22,0.5)] transition-all uppercase tracking-widest flex items-center gap-2 md:gap-4 ${isDarkMode ? 'bg-white text-black' : 'bg-[#1a1a1a] text-white'}`}
                  >
                    <EditableText contentKey="mainButton" />
                    <ArrowRight className="w-4 h-4 md:w-6 md:h-6" />
                  </motion.button>
                </div>

                {/* Right Content - Osh Image */}
                <div className="relative flex justify-end items-center mt-0">
                  <motion.div 
                    className="relative z-20"
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <img 
                      src="/osh-hero.jpg" 
                      alt="Osh" 
                      className={`w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] md:w-[550px] md:h-[550px] object-cover rounded-full ${isDarkMode ? 'shadow-[0_20px_40px_rgba(0,0,0,0.8)] md:shadow-[0_40px_80px_rgba(0,0,0,0.8)] border-[6px] md:border-8 border-white/5' : 'shadow-[0_20px_40px_rgba(0,0,0,0.3)] md:shadow-[0_40px_80px_rgba(0,0,0,0.3)] border-[6px] md:border-8 border-white'}`}
                    />
                  </motion.div>
                </div>

              </div>
            </main>

            {/* NEW LANDING SECTIONS */}
            <LandingSections onSelectFood={(food) => {
              setSelectedFood(food);
              setShowFullMenu(true);
            }} />

            {/* Admin trigger (subtle) */}
            <button 
              onClick={() => setCurrentView('admin')}
              className={`fixed bottom-6 right-6 z-30 p-4 rounded-full backdrop-blur-xl opacity-20 hover:opacity-100 transition-all ${isDarkMode ? 'bg-white/5 text-white' : 'bg-black/5 text-black'}`}
            >
              <Lock className="w-5 h-5" />
            </button>
          </motion.div>
        ) : (
          <FullMenuPage 
            key="full-menu" 
            onClose={() => { setShowFullMenu(false); setShowFavorites(false); }} 
            onSelectFood={setSelectedFood} 
            showFavoritesOnly={showFavorites}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedFood && (
          <FoodModal 
            food={selectedFood} 
            onClose={() => setSelectedFood(null)} 
            onContact={() => {
              setSelectedFood(null);
              setShowContactModal(true);
            }} 
            onSelectFood={setSelectedFood}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showContactModal && (
          <ContactModal onClose={() => setShowContactModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

// ... (FullMenuPage and MenuCard remain exactly the same, I will leave them out of this replacement if possible, wait, I need to make sure I don't delete them. I must target only FoodModal and the App return call.)

// Full Menu Page Component
const FullMenuPage = ({ onClose, onSelectFood, showFavoritesOnly }: { onClose: () => void, onSelectFood: (f: Food) => void, showFavoritesOnly: boolean }) => {
  const { foods, isDarkMode, favorites, toggleFavorite } = useSite();
  const [searchQuery, setSearchQuery] = useState('');

  // Fuzzy search logic
  const filteredFoods = foods.filter(food => {
    if (showFavoritesOnly && !favorites.includes(food.id)) return false;
    if (!searchQuery) return true;
    
    const s = searchQuery.toLowerCase().replace(/[^a-z0-9]/g, '');
    const n = food.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const d = food.description.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Simple robust matching
    let i = 0, j = 0;
    while(i < n.length && j < s.length) {
      if(n[i] === s[j]) j++;
      i++;
    }
    if (j === s.length) return true;
    return d.includes(searchQuery.toLowerCase());
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className={`relative min-h-screen w-full z-40 ${isDarkMode ? 'bg-[#111]' : 'bg-[#f0ece1]'}`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8">
          <button 
            onClick={onClose}
            className={`flex items-center gap-3 font-bold uppercase tracking-wider transition-colors group ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}
          >
            <div className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-white/5 group-hover:bg-white/10' : 'bg-black/5 group-hover:bg-black/10'}`}>
              <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            </div>
            Orqaga
          </button>

          {/* Search Bar */}
          <div className={`relative flex items-center w-full md:w-96 rounded-full overflow-hidden border transition-all ${isDarkMode ? 'bg-white/5 border-white/10 focus-within:border-orange-500 focus-within:bg-white/10' : 'bg-white border-black/10 focus-within:border-orange-500 focus-within:shadow-lg'}`}>
            <div className="pl-6 text-orange-500"><Search className="w-5 h-5" /></div>
            <input 
              type="text"
              placeholder="Taom izlash (masalan: osh, qozon)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none py-4 px-4 outline-none font-medium"
            />
          </div>
        </div>

        <h2 className={`text-5xl md:text-7xl font-black mb-4 w-fit ${isDarkMode ? 'text-white drop-shadow-[0_0_20px_rgba(255,165,0,0.3)]' : 'text-[#1a1a1a]'}`}>
          {showFavoritesOnly ? "Yoqtirganlarim" : <EditableText contentKey="fullMenuTitle" />}
        </h2>
        {!showFavoritesOnly && (
          <div className={`mb-16 max-w-2xl text-lg font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <EditableText contentKey="fullMenuSubtitle" />
          </div>
        )}

        {filteredFoods.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`py-32 text-center flex flex-col items-center justify-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
          >
            <div className="text-6xl mb-6">🍽️</div>
            <h3 className="text-2xl font-bold mb-2">Hech narsa topilmadi</h3>
            <p>Boshqa so'z bilan qidirib ko'ring yoki yoqtirganlaringiz yo'q.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 pb-32">
            {filteredFoods.map((food, idx) => (
              <MenuCard 
                key={food.id} 
                food={food} 
                idx={idx} 
                onSelect={() => onSelectFood(food)} 
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const MenuCard = ({ food, idx, onSelect }: { food: Food, idx: number, onSelect: () => void }) => {
  const { isDarkMode, favorites, toggleFavorite } = useSite();
  const isFav = favorites.includes(food.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(idx * 0.05, 0.5), type: "spring", stiffness: 50 }}
      className={`group relative rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-500 ${isDarkMode ? 'bg-[#1a1a1a] border border-white/5 hover:border-orange-500/40 hover:shadow-[0_20px_40px_rgba(255,165,0,0.1)]' : 'bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_rgba(255,165,0,0.15)] border border-transparent hover:border-orange-200'}`}
    >
      {/* Favorite Star Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(food.id);
        }}
        className={`absolute top-6 right-6 z-20 p-3 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-90 ${isFav ? 'bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.6)]' : 'bg-white/20 text-white/70 hover:bg-white/40'}`}
      >
        <Star className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
      </button>

      <div onClick={onSelect} className="w-full h-full">
        <div className="relative h-72 overflow-hidden">
          <img 
            src={food.image} 
            alt={food.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none">
            <h3 className="text-3xl font-black text-white tracking-wide">{food.name}</h3>
          </div>
        </div>
        <div className="p-8">
          <p className={`text-sm line-clamp-2 mb-6 leading-relaxed font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{food.description}</p>
          <div className="flex items-center justify-between border-t pt-6 transition-colors border-dashed border-gray-500/30">
            <span className={`px-4 py-2 rounded-full font-black tracking-widest ${isDarkMode ? 'bg-white/10 text-white' : 'bg-[#1a1a1a] text-white'}`}>
              {food.price}
            </span>
            <span className="text-orange-500 font-bold group-hover:translate-x-2 transition-transform flex items-center gap-2 uppercase tracking-widest text-sm">
              Batafsil <ArrowRight className="w-5 h-5" />
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Food Modal Component
const FoodModal = ({ food, onClose, onContact, onSelectFood }: { food: Food, onClose: () => void, onContact: () => void, onSelectFood: (f: Food) => void }) => {
  const { isDarkMode, foods } = useSite();
  // Get 3 other foods
  const otherFoods = foods.filter(f => f.id !== food.id).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      {/* Background overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-md cursor-pointer"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className={`relative w-full max-w-[1000px] h-auto min-h-[75vh] max-h-[95vh] rounded-[2rem] md:rounded-[3rem] flex flex-col shadow-[0_50px_100px_rgba(0,0,0,0.6)] ${isDarkMode ? 'bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-3xl border border-white/10 text-white' : 'bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-3xl border border-white/50 text-[#1a1a1a]'}`}
      >
        {/* Top Header */}
        <div className="flex justify-between items-center p-6 md:p-8 pb-0 shrink-0">
           <div className="font-black text-xl md:text-2xl text-orange-500 tracking-widest uppercase">
             ZAYTUN
           </div>
           <button 
             onClick={onClose}
             className={`z-[60] p-2 md:p-3 rounded-full transition-all shadow-sm ${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-black/5 hover:bg-black/10 text-black'}`}
           >
             <X className="w-5 h-5 md:w-6 md:h-6" />
           </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col md:flex-row relative z-10 px-6 md:px-12 pt-4 pb-4 min-h-0 md:min-h-[400px] lg:min-h-[480px]">
          
          {/* Left Text */}
          <div className="w-full md:w-[55%] flex flex-col justify-center relative z-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight mb-4">
              Mazzali <span className="text-orange-500">{food.name}</span> sizni kutmoqda
            </h2>
            <p className={`text-sm md:text-base leading-relaxed mb-6 md:mb-8 max-w-md font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {food.description}
            </p>
            <div className="flex items-center gap-4">
               <motion.button 
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 onClick={onContact}
                 className={`px-6 py-3 md:px-8 md:py-3.5 rounded-full font-bold flex items-center gap-2 transition-colors shadow-lg uppercase tracking-wider text-xs md:text-sm ${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20' : 'bg-white/50 hover:bg-white/80 text-black border border-black/10'}`}
               >
                 Buyurtma <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
               </motion.button>
               <div className="text-xl md:text-2xl font-black">{food.price}</div>
            </div>
          </div>

          {/* Right Image */}
          <div className="hidden md:flex w-[45%] relative items-center justify-center pointer-events-none">
            <motion.div 
              className="absolute right-[-20px] lg:right-[-40px] w-[350px] h-[350px] lg:w-[450px] lg:h-[450px] z-20 pointer-events-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
            >
              <img 
                src={food.image} 
                alt={food.name} 
                className={`w-full h-full object-cover rounded-full shadow-[0_30px_60px_rgba(0,0,0,0.4)] ${isDarkMode ? 'border-[6px] border-white/5' : 'border-[6px] border-white/50'}`}
              />
            </motion.div>
          </div>
          
          {/* Mobile Image */}
          <div className="md:hidden w-full flex justify-center mt-8 relative z-20">
             <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
              className="w-48 h-48"
            >
              <img 
                src={food.image} 
                alt={food.name} 
                className={`w-full h-full object-cover rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.5)] border-[4px] ${isDarkMode ? 'border-white/10' : 'border-white/50'}`}
              />
            </motion.div>
          </div>
        </div>

        {/* Bottom Carousel / Other Foods */}
        <div className="shrink-0 w-full relative z-30 flex items-end justify-center pb-6 md:pb-8 px-4 mt-auto">
          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 px-4 snap-x no-scrollbar w-full justify-start md:justify-center items-end h-auto">
            {otherFoods.map((item, idx) => (
              <motion.div 
                key={item.id}
                onClick={() => onSelectFood(item)}
                whileHover={{ y: -5 }}
                className={`min-w-[130px] md:min-w-[160px] snap-center cursor-pointer relative mt-12 rounded-2xl p-4 flex flex-col items-center text-center transition-all shadow-xl ${idx === 1 ? (isDarkMode ? 'bg-white/15 border border-white/30 mb-2' : 'bg-white/60 border border-white/80 mb-2') : (isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-white/30 border border-white/40')}`}
              >
                {/* Pop out image */}
                <div className="absolute -top-10 w-20 h-20 rounded-full shadow-md border-4 border-transparent overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="mt-8 w-full">
                  <h4 className="font-bold text-xs md:text-sm line-clamp-1 mb-1">{item.name}</h4>
                  <p className={`text-[10px] md:text-xs font-medium mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.price}</p>
                  <button className={`p-2 rounded-full mx-auto flex items-center justify-center transition-colors ${isDarkMode ? 'bg-black/30 hover:bg-orange-500 text-white' : 'bg-white/50 hover:bg-orange-500 hover:text-white text-black'}`}>
                    <ShoppingBasket className="w-3 h-3 md:w-4 md:h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default App;
