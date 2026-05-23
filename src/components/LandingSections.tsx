import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useSite } from '../context/SiteContext';
import { 
  ChefHat, 
  ShieldCheck, 
  Star, 
  MapPin, 
  Phone, 
  Instagram, 
  Youtube, 
  Send, 
  Award, 
  Users, 
  Utensils, 
  Sparkles, 
  Clock, 
  ChevronRight 
} from 'lucide-react';

const logoImg = '/images/2d27dbea-8d35-4e1f-84a1-d4027ac8a38e.png';

// 1. Interactive Hover Word
const InteractiveWord = ({ children }: { children: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.span
      className="relative inline-block cursor-pointer font-extrabold text-orange-500 whitespace-nowrap px-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={isHovered ? { scale: 1.08, color: '#fbbf24' } : { scale: 1, color: '#f97316' }}
      transition={{ type: "spring", stiffness: 350, damping: 12 }}
      style={{ textShadow: isHovered ? "0 0 15px rgba(251, 191, 36, 0.8)" : "none" }}
    >
      {children}
      {/* Golden glowing underline */}
      <motion.span
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-amber-400 to-yellow-500 w-full"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        style={{ originX: 0 }}
        transition={{ duration: 0.3 }}
      />
      {/* Particle sparkles */}
      {isHovered && (
        <>
          <motion.span
            className="absolute -top-3 -left-3 text-[10px] pointer-events-none select-none"
            animate={{ y: [-5, -15], x: [-5, -10], opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            ✨
          </motion.span>
          <motion.span
            className="absolute -bottom-3 -right-3 text-[10px] pointer-events-none select-none"
            animate={{ y: [5, 15], x: [5, 10], opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: 0.15 }}
          >
            ✨
          </motion.span>
        </>
      )}
    </motion.span>
  );
};

// 2. 3D Mouse Tilt Glass Card
const TiltCard = ({ children, isDarkMode }: { children: React.ReactNode, isDarkMode: boolean }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, shadowX: 0, shadowY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    // Max tilt 8 degrees for elegant look
    const rX = -(mouseY / (height / 2)) * 8;
    const rY = (mouseX / (width / 2)) * 8;
    
    setTilt({
      rotateX: rX,
      rotateY: rY,
      shadowX: -rY * 1.5,
      shadowY: -rX * 1.5
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, shadowX: 0, shadowY: 0 });
  };

  return (
    <div className="perspective-1000 w-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
        style={{ transformStyle: "preserve-3d" }}
        className={`relative p-8 md:p-12 w-full rounded-[2.5rem] backdrop-blur-2xl border transition-all duration-300 ${
          isDarkMode 
            ? 'bg-black/30 border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.8)] shadow-orange-950/10' 
            : 'bg-white/40 border-white/60 shadow-[0_20px_50px_rgba(249,115,22,0.1)] border-orange-500/10'
        } ${isHovered ? 'animate-border-glow' : ''}`}
      >
        {/* Shine overlay */}
        {isHovered && (
          <div 
            className="absolute inset-0 rounded-[2.5rem] pointer-events-none opacity-30 mix-blend-overlay bg-gradient-to-br from-white/20 via-transparent to-black/20"
            style={{
              transform: `translate3d(${tilt.rotateY * 1.2}px, ${-tilt.rotateX * 1.2}px, 0px)`
            }}
          />
        )}
        <div style={{ transform: "translateZ(25px)" }} className="relative z-10">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

// 3. Stats Counter component
const StatCard = ({ value, label, icon: Icon, isDarkMode }: { value: string, label: string, icon: any, isDarkMode: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [count, setCount] = useState(0);

  const numericVal = parseInt(value.replace(/[^0-9]/g, '')) || 0;
  const suffix = value.replace(/[0-9]/g, '');

  useEffect(() => {
    if (isInView && numericVal > 0) {
      let start = 0;
      const duration = 1500;
      const increment = Math.ceil(numericVal / (duration / 16));
      const timer = setInterval(() => {
        start += increment;
        if (start >= numericVal) {
          setCount(numericVal);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, numericVal]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 35 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
      transition={{ duration: 0.6 }}
      className={`flex flex-col items-center justify-center p-5 rounded-3xl backdrop-blur-xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(249,115,22,0.15)] ${
        isDarkMode 
          ? 'bg-white/5 border-white/10 text-white' 
          : 'bg-white/50 border-white/80 text-gray-800'
      }`}
    >
      <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500/20 to-yellow-500/10 text-orange-500 mb-3 shadow-[0_0_15px_rgba(249,115,22,0.15)]">
        <Icon className="w-6 h-6 animate-pulse" />
      </div>
      <div className="text-2xl md:text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
        {count > 0 ? `${count}${suffix}` : value}
      </div>
      <div className="text-[10px] md:text-xs font-semibold mt-1 tracking-wider uppercase opacity-75 text-center">
        {label}
      </div>
    </motion.div>
  );
};

// 4. Background Low Opacity Brand Words
const BackgroundText = ({ words }: { words: string[] }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {words.map((word, idx) => {
        const top = 10 + idx * 18;
        const left = 5 + (idx % 2 === 0 ? 5 : 55);
        const dir = idx % 2 === 0 ? 1 : -1;
        
        return (
          <motion.div
            key={idx}
            className="absolute text-5xl md:text-8xl font-black tracking-[0.25em] text-orange-500/[0.02] uppercase font-sans"
            style={{
              top: `${top}%`,
              left: `${left}%`,
            }}
            animate={{
              x: [0, 25 * dir, 0],
              y: [0, 10 * dir, 0],
              opacity: [0.015, 0.03, 0.015]
            }}
            transition={{
              duration: 12 + idx * 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {word}
          </motion.div>
        );
      })}
    </div>
  );
};

// 5. Ambient Spice & Light Rays
const BackgroundParticles = () => {
  const particles = [
    { size: 4, top: '15%', left: '10%', delay: 0 },
    { size: 6, top: '30%', left: '80%', delay: 1.2 },
    { size: 3, top: '50%', left: '25%', delay: 0.8 },
    { size: 8, top: '70%', left: '70%', delay: 2.1 },
    { size: 5, top: '85%', left: '15%', delay: 0.5 },
    { size: 4, top: '95%', left: '60%', delay: 1.7 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/10"
          style={{
            width: p.size,
            height: p.size,
            top: p.top,
            left: p.left,
            filter: 'blur(1px)'
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, 20, 0],
            opacity: [0.15, 0.6, 0.15],
            scale: [1, 1.4, 1]
          }}
          transition={{
            duration: 9 + i * 2,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// 6. Interactive 3D Food Showcase Image Slideshow
const TiltImage = ({ 
  items, 
  isDarkMode 
}: { 
  items: Array<{ image: string; name: string }>; 
  isDarkMode: boolean; 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, x: 0, y: 0 });
  const [currentIndex, setCurrentIndex] = useState(0);

  const validItems = items && items.length > 0 
    ? items.filter(item => item.image && item.image.trim() !== '')
    : [];

  const defaultItems = [
    { image: '/images/cinematic_plov_luxury.png', name: 'Premium Palov' },
    { image: "/images/ko'zasho'rva.jpg", name: "Ko'za Sho'rva" },
    { image: '/osh-hero.jpg', name: 'Zaytun Maxsus' }
  ];

  const activeItems = validItems.length > 0 ? validItems : defaultItems;

  const activeItemsLength = activeItems.length;

  useEffect(() => {
    if (activeItemsLength <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeItemsLength);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeItemsLength]);

  const currentItem = activeItems[currentIndex];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    const rX = -(mouseY / (height / 2)) * 12;
    const rY = (mouseX / (width / 2)) * 12;

    setTilt({
      rotateX: rX,
      rotateY: rY,
      x: rY * 0.6,
      y: -rX * 0.6
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, x: 0, y: 0 });
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex justify-center items-center p-6 md:p-10 perspective-1000 z-10 w-full"
    >
      <div className="absolute w-[260px] h-[260px] md:w-[420px] md:h-[420px] bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-full blur-[80px] pointer-events-none animate-pulse" />
      
      <motion.div
        animate={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
          x: tilt.x,
          y: tilt.y,
        }}
        transition={{ type: "spring", stiffness: 120, damping: 22 }}
        className="relative z-10"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className={`relative w-[220px] h-[220px] md:w-[400px] md:h-[400px] rounded-full animate-float-slow select-none ${
          isDarkMode 
            ? 'shadow-[0_40px_80px_rgba(0,0,0,0.8)] border-[6px] md:border-[8px] border-white/5 bg-white/5' 
            : 'shadow-[0_30px_60px_rgba(249,115,22,0.2)] border-[6px] md:border-[8px] border-white bg-white/50'
        }`}>
          
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <AnimatePresence mode="popLayout">
              <motion.img 
                key={currentIndex}
                src={currentItem.image} 
                alt={currentItem.name} 
                initial={{ opacity: 0, scale: currentItem.name.toLowerCase().includes('somsa') ? 1.15 : 0.9, rotate: -3 }}
                animate={{ opacity: 1, scale: currentItem.name.toLowerCase().includes('somsa') ? 1.35 : 1, rotate: 0 }}
                exit={{ opacity: 0, scale: currentItem.name.toLowerCase().includes('somsa') ? 1.45 : 1.1, rotate: 3 }}
                transition={{ duration: 2.0, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/osh-hero.jpg';
                }}
              />
            </AnimatePresence>
            
            <div 
              className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/10 via-transparent to-transparent mix-blend-overlay"
              style={{ transform: "translateZ(15px)" }}
            />
          </div>

          {/* Dynamic Food Name Badge outside overflow-hidden */}
          <div className="absolute -bottom-3 md:bottom-6 left-1/2 -translate-x-1/2 z-20 w-max max-w-[95%]" style={{ transform: "translateZ(25px)" }}>
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentIndex}
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="px-5 py-2 md:px-6 md:py-2.5 rounded-full bg-black/80 backdrop-blur-xl border border-orange-500/30 text-white text-[11px] md:text-sm font-black uppercase tracking-widest shadow-[0_10px_20px_rgba(0,0,0,0.5)] flex items-center justify-center whitespace-nowrap"
              >
                <span className="text-orange-500 mr-2 text-base md:text-lg leading-none">•</span>
                <span className="truncate">{currentItem.name}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const AboutSection = () => {
  const { isDarkMode, foods } = useSite();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section 
      ref={containerRef}
      className="relative py-24 md:py-36 px-6 flex justify-center overflow-hidden w-full bg-gradient-to-b from-transparent via-orange-500/[0.02] to-transparent"
    >
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-orange-500/5 to-yellow-500/5 blur-[120px] rounded-full pointer-events-none z-0" />
      <BackgroundText words={["TRADITION", "PREMIUM", "TASTE", "LUXURY", "MEHMONDO‘STLIK"]} />
      <BackgroundParticles />
      {/* Ambient smoke blur */}
      <div className="absolute inset-0 bg-transparent animate-smoke pointer-events-none opacity-20 z-0 bg-radial-gradient" style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)' }} />

      <div className="max-w-[1400px] mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Side: Text and Glass Card */}
        <motion.div 
          initial={{ opacity: 0, x: -60 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 flex flex-col items-start w-full"
        >
          {/* Section Subtitle */}
          <div className="flex items-center gap-2 mb-4 px-4 py-2 rounded-full border border-orange-500/20 bg-orange-500/5 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-orange-500 animate-spin" style={{ animationDuration: '4s' }} />
            <span className="text-[10px] md:text-xs font-black tracking-widest text-orange-500 uppercase">
              Mukammallik sari sayohat
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-wider uppercase">
            <span className="text-glow">BIZ </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-500 drop-shadow-[0_0_30px_rgba(249,115,22,0.4)]">HAQIMIZDA</span>
          </h2>

          {/* Glass Card Description */}
          <TiltCard isDarkMode={isDarkMode}>
            <p className="text-sm md:text-lg lg:text-xl leading-[1.8] md:leading-[2.2] font-normal tracking-wide text-justify text-opacity-95">
              Biz uchun restoran shunchaki ovqatlanish joyi emas, u — <InteractiveWord>san'at</InteractiveWord> va <InteractiveWord>mehmondo'stlik</InteractiveWord> maskani. Har bir taom eng yuqori <InteractiveWord>sifat</InteractiveWord>li mahsulotlardan, tabiat in'om etgan sof ne'matlardan tayyorlanadi. Bizning professional oshpazlar jamoamiz <InteractiveWord>an'anaviy</InteractiveWord> ta'm va zamonaviy xizmat ko'rsatishni mukammal darajada uyg'unlashtiradi. Sizning har bir tashrifingiz — biz uchun ulkan sharaf va unutilmas xotiraga aylanishi shart.
            </p>
          </TiltCard>

          {/* Stats Rows */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 w-full">
            <StatCard value="15+" label="Yillik Tajriba" icon={Award} isDarkMode={isDarkMode} />
            <StatCard value="10K+" label="Mamnun Mijoz" icon={Users} isDarkMode={isDarkMode} />
            <StatCard value="50+" label="Premium Taom" icon={Utensils} isDarkMode={isDarkMode} />
            <StatCard value="100%" label="Sifatli Mahsulot" icon={ShieldCheck} isDarkMode={isDarkMode} />
          </div>
        </motion.div>

        {/* Right Side: Image Showcase */}
        <motion.div 
          initial={{ opacity: 0, x: 60 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex justify-center w-full"
        >
          <TiltImage 
            items={foods} 
            isDarkMode={isDarkMode} 
          />
        </motion.div>

      </div>
    </section>
  );
};

export const LandingSections = ({ onSelectFood }: { onSelectFood?: (food: any) => void }) => {
  return (
    <>
      <AboutSection />
      <ShowcaseSection onSelectFood={onSelectFood} />
      <TimelineSection />
      <WhyUsSection />
      <Footer />
    </>
  );
};

const ShowcaseSection = ({ onSelectFood }: { onSelectFood?: (food: any) => void }) => {
  const { isDarkMode, foods } = useSite();
  const marqueeFoods = [...foods, ...foods, ...foods, ...foods];

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 drop-shadow-[0_0_20px_rgba(234,179,8,0.5)]">
          MENYU
        </h2>
      </motion.div>

      <div className="relative w-full flex overflow-hidden group py-10 -my-10">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="flex gap-8 px-4 group-hover:[animation-play-state:paused] w-max"
        >
          {marqueeFoods.map((item, idx) => (
            <div 
              key={idx}
              onClick={() => onSelectFood?.(item)}
              className={`group/card cursor-pointer w-[260px] md:w-[320px] shrink-0 p-6 rounded-3xl backdrop-blur-md border transition-all duration-500 hover:scale-105 hover:-translate-y-4 shadow-xl ${isDarkMode ? 'bg-white/5 border-white/10 hover:shadow-[0_20px_40px_rgba(249,115,22,0.15)]' : 'bg-white/50 border-white/80 hover:shadow-[0_20px_40px_rgba(249,115,22,0.2)]'}`}
            >
              <div className="relative w-full h-48 md:h-56 mb-6 rounded-full overflow-hidden border-4 border-orange-500/20 group-hover/card:border-orange-500/50 transition-colors shadow-inner flex items-center justify-center bg-black/5">
                <img src={item.image} alt={item.name} className={`w-full h-full object-cover ${item.name.toLowerCase().includes('somsa') ? 'scale-[1.35]' : 'scale-105'} group-hover/card:scale-[1.15] transition-transform duration-700`} />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-center mb-2">{item.name}</h3>
              <p className="text-orange-500 font-bold text-center text-lg">{item.price}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const TimelineSection = () => {
  const { isDarkMode } = useSite();
  const steps = [
    { num: "01", title: "Eng Sifatli Mahsulotlar", desc: "Har tong eng sara va toza mahsulotlar yetkazib kelinadi. Har bir masalliq alohida tekshiruvdan o'tadi.", icon: <ShieldCheck className="w-8 h-8 text-orange-500" /> },
    { num: "02", title: "Professional Oshpazlar", desc: "Ko'p yillik tajribaga ega ustalar taomlarni o'ziga xos mehr bilan tayyorlashadi.", icon: <ChefHat className="w-8 h-8 text-orange-500" /> },
    { num: "03", title: "Yuqori Darajadagi Xizmat", desc: "Har bir mijozga oliy darajada va tezkor xizmat ko'rsatiladi. Sizning qulayligingiz bizning bosh maqsadimiz.", icon: <Star className="w-8 h-8 text-orange-500" /> }
  ];

  return (
    <section className="relative py-24 md:py-32 px-6 flex flex-col items-center">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-4xl md:text-6xl font-black mb-24 text-center tracking-tight drop-shadow-lg"
      >
        Bizning Ish <span className="text-orange-500 drop-shadow-[0_0_20px_rgba(249,115,22,0.5)]">Faoliyatimiz</span>
      </motion.h2>

      <div className="relative max-w-5xl w-full flex flex-col gap-16 md:gap-24">
        {/* Vertical Line */}
        <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-orange-500/50 to-transparent blur-[1px]" />

        {steps.map((step, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: idx * 0.2, duration: 0.8 }}
            className={`flex flex-col md:flex-row items-center justify-between w-full relative z-10 ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''} pl-12 md:pl-0`}
          >
            <div className={`w-full md:w-5/12 flex ${idx % 2 === 1 ? 'justify-start' : 'justify-end'} mb-8 md:mb-0`}>
              <div className={`p-8 rounded-3xl backdrop-blur-xl border transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(249,115,22,0.2)] ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/80'}`}>
                <div className="flex items-center gap-4 mb-4">
                  {step.icon}
                  <h3 className="text-xl md:text-2xl font-bold">{step.title}</h3>
                </div>
                <p className={`font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{step.desc}</p>
              </div>
            </div>

            {/* Center Node */}
            <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full bg-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.6)] flex items-center justify-center font-black text-xl md:text-2xl text-white border-4 border-[#111]">
              {step.num}
            </div>

            <div className="hidden md:block w-5/12" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const WhyUsSection = () => {
  const { isDarkMode, foods } = useSite();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const badges = [
    { text: "100% Halol", icon: ShieldCheck },
    { text: "Tezkor Yetkazish", icon: Clock },
    { text: "Premium Xizmat", icon: Star },
    { text: "Sarxil Masalliqlar", icon: Sparkles }
  ];

  return (
    <section 
      ref={containerRef}
      className="relative py-24 md:py-36 px-6 flex justify-center overflow-hidden w-full bg-gradient-to-b from-transparent via-orange-500/[0.01] to-transparent"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-yellow-500/5 to-orange-500/5 blur-[120px] rounded-full pointer-events-none z-0" />
      <BackgroundText words={["AUTHENTIC", "FAMILY", "FRESH", "PASSION", "ZAYTUN"]} />
      <BackgroundParticles />
      <div className="absolute inset-0 bg-transparent animate-smoke pointer-events-none opacity-20 z-0 bg-radial-gradient" style={{ background: 'radial-gradient(circle, rgba(234,179,8,0.05) 0%, transparent 70%)' }} />

      <div className="max-w-[1400px] mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Side: Cinematic Showcase Image */}
        <motion.div 
          initial={{ opacity: 0, x: -60 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 order-2 lg:order-1 flex justify-center w-full"
        >
          <TiltImage 
            items={foods && foods.length > 0 ? [...foods].reverse() : []} 
            isDarkMode={isDarkMode} 
          />
        </motion.div>

        {/* Right Side: Text details */}
        <motion.div 
          initial={{ opacity: 0, x: 60 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 order-1 lg:order-2 flex flex-col items-start w-full"
        >
          <div className="flex items-center gap-2 mb-4 px-4 py-2 rounded-full border border-orange-500/20 bg-orange-500/5 backdrop-blur-md">
            <ChefHat className="w-4 h-4 text-orange-500 animate-bounce" />
            <span className="text-[10px] md:text-xs font-black tracking-widest text-orange-500 uppercase">
              Nega aynan bizning oila?
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-wider uppercase">
            <span className="text-glow">NIMA UCHUN </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-500 drop-shadow-[0_0_30px_rgba(249,115,22,0.4)]">BIZ?</span>
          </h2>

          <TiltCard isDarkMode={isDarkMode}>
            <p className="text-sm md:text-lg lg:text-xl leading-[1.8] md:leading-[2.2] font-normal tracking-wide text-justify text-opacity-95">
              Biz uchun taomning shunchaki chiroyli ko'rinishi yetarli emas. Eng muhimi — uning beqiyos <InteractiveWord>lazzat</InteractiveWord>i va mijozlarimizning <InteractiveWord>samimiy</InteractiveWord> tabassumi. Har bir mijoz biz uchun aziz mehmon, har bir qozon ovqat esa ustaning chinakam asari hisoblanadi. Biz <InteractiveWord>halollik</InteractiveWord>, ishonch va yuqori <InteractiveWord>sifat</InteractiveWord> tarafdorimiz.
            </p>
          </TiltCard>

          {/* Badges capsule row */}
          <div className="grid grid-cols-2 gap-4 mt-8 w-full">
            {badges.map((badge, idx) => {
              const Icon = badge.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.03 }}
                  className={`flex items-center gap-3 p-4 rounded-2xl border backdrop-blur-md transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-white/5 border-white/10 hover:border-orange-500/30' 
                      : 'bg-white/60 border-white/80 hover:border-orange-500/40 shadow-sm'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500 shadow-inner">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs md:text-sm font-bold tracking-wide uppercase opacity-90">
                    {badge.text}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

const Footer = () => {
  const { isDarkMode, siteContent } = useSite();
  
  const handleMapClick = () => {
    window.open('https://maps.google.com/?q=41.311081,69.240562', '_blank');
  };

  const currentYear = new Date().getFullYear();

  // Social handles from siteContent
  const instagramUrl = siteContent.contactInstagram || '#';
  const youtubeUrl = siteContent.contactYoutube || '#';
  const telegramUrl = siteContent.contactTelegram || '#';
  const phoneNumber = siteContent.contactPhone || "+998 90 123 45 67";

  return (
    <footer className={`relative pt-12 pb-6 md:pt-20 md:pb-10 px-4 md:px-6 overflow-hidden border-t ${
      isDarkMode 
        ? 'border-white/10 bg-[#050505]' 
        : 'border-black/5 bg-[#fdfaf2]'
    }`}>
      {/* Background Glows */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-80 bg-orange-500/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-yellow-500/5 blur-[100px] pointer-events-none z-0" />
      
      {/* Background branding text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-0 opacity-15">
        <motion.div
          animate={{
            y: [-10, 10, -10],
            rotate: [-1, 1, -1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="text-8xl md:text-[12rem] font-black tracking-[0.3em] text-orange-500/[0.03] uppercase text-center blur-[2px]"
        >
          ZAYTUN
        </motion.div>
        <motion.div
          animate={{
            y: [10, -10, 10],
            rotate: [1, -1, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="text-5xl md:text-[6rem] font-bold tracking-[0.4em] text-orange-500/[0.02] uppercase text-center -mt-8"
        >
          RESTAURANT
        </motion.div>
      </div>

      {/* Floating particles */}
      <BackgroundParticles />

      <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col gap-8 md:gap-16">
        
        {/* Main Smart Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-10 lg:gap-12 w-full items-center md:items-start text-center md:text-left">
          
          {/* Column 1: Brand */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3 lg:col-span-4 w-full">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full overflow-hidden border-2 transition-all ${
                isDarkMode 
                  ? 'border-orange-500 bg-white/5 shadow-[0_0_20px_rgba(249,115,22,0.3)]' 
                  : 'border-orange-500 bg-white shadow-md'
              }`}>
                <img src={logoImg} alt="Zaytun Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-black text-xl md:text-2xl tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                Zaytun
              </span>
            </div>
            <p className={`text-[11px] md:text-sm font-medium leading-relaxed max-w-[260px] md:max-w-[300px] mt-2 md:mt-1 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              An’anaviy ta’m va zamonaviy xizmat uyg‘unligi. Har bir luqmada haqiqiy sharqona mehmondo‘stlik.
            </p>
          </div>

          {/* Column 2: Social Media links */}
          <div className="flex flex-col items-center md:items-start gap-3 lg:col-span-3 w-full mt-2 md:mt-0">
            <h4 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-orange-500 hidden md:block">
              Ijtimoiy tarmoqlar
            </h4>
            <div className="flex flex-row md:flex-col gap-4 md:gap-3 justify-center md:justify-start w-full">
              
              {/* Instagram */}
              <a 
                href={instagramUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 group text-xs md:text-sm font-bold tracking-widest uppercase transition-all duration-300 relative py-1.5 md:w-auto"
              >
                <div className="p-2.5 md:p-2 rounded-xl md:rounded-lg bg-pink-500/10 text-pink-500 group-hover:bg-pink-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all duration-300 md:group-hover:rotate-12 border border-pink-500/20 md:border-transparent backdrop-blur-md">
                  <Instagram className="w-4 h-4 md:w-4 md:h-4" />
                </div>
                <span className="hidden md:inline group-hover:text-pink-500 transition-colors">
                  Instagram
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-500 transition-all duration-300 group-hover:w-full" />
                </span>
              </a>

              {/* YouTube */}
              <a 
                href={youtubeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 group text-xs md:text-sm font-bold tracking-widest uppercase transition-all duration-300 relative py-1.5 md:w-auto"
              >
                <div className="p-2.5 md:p-2 rounded-xl md:rounded-lg bg-red-500/10 text-red-500 group-hover:bg-red-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all duration-300 md:group-hover:rotate-12 border border-red-500/20 md:border-transparent backdrop-blur-md">
                  <Youtube className="w-4 h-4 md:w-4 md:h-4" />
                </div>
                <span className="hidden md:inline group-hover:text-red-500 transition-colors">
                  YouTube
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full" />
                </span>
              </a>

              {/* Telegram */}
              <a 
                href={telegramUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 group text-xs md:text-sm font-bold tracking-widest uppercase transition-all duration-300 relative py-1.5 md:w-auto"
              >
                <div className="p-2.5 md:p-2 rounded-xl md:rounded-lg bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300 md:group-hover:rotate-12 border border-blue-500/20 md:border-transparent backdrop-blur-md">
                  <Send className="w-4 h-4 md:w-4 md:h-4" />
                </div>
                <span className="hidden md:inline group-hover:text-blue-500 transition-colors">
                  Telegram
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full" />
                </span>
              </a>

            </div>
          </div>

          {/* Contact & Location */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 md:gap-4 w-full justify-center md:justify-start lg:justify-end items-center sm:items-stretch mt-4 md:mt-0">
            
            {/* Contact Card */}
            <a 
              href={`tel:${phoneNumber.replace(/\s+/g, '')}`}
              className={`flex items-center justify-center sm:justify-start gap-3 md:gap-4 p-3 md:p-5 rounded-2xl md:rounded-3xl backdrop-blur-xl border transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] w-full max-w-[280px] sm:max-w-[240px] md:max-w-[260px] lg:max-w-none group ${
                isDarkMode 
                  ? 'bg-white/5 border-white/10 hover:border-orange-500/40 hover:bg-white/10 shadow-[0_5px_15px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_30px_rgba(249,115,22,0.15)]' 
                  : 'bg-white/60 border-white/80 hover:border-orange-500/50 shadow-[0_5px_15px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_30px_rgba(249,115,22,0.2)]'
              }`}
            >
              <div className="p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-gradient-to-br from-orange-500/20 to-yellow-500/10 text-orange-500 shadow-inner group-hover:scale-110 transition-transform flex-shrink-0">
                <Phone className="w-4 h-4 md:w-5 md:h-5 animate-pulse" style={{ animationDuration: '3s' }} />
              </div>
              <div className="flex flex-col items-start overflow-hidden text-left">
                <p className="text-[9px] md:text-[10px] tracking-widest uppercase opacity-60 font-bold mb-0.5 whitespace-nowrap">24/7 Aloqa</p>
                <h5 className="text-[11px] md:text-sm font-black whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">{phoneNumber}</h5>
              </div>
            </a>

            {/* Location Card */}
            <button 
              onClick={handleMapClick}
              className={`flex items-center justify-center sm:justify-start gap-3 md:gap-4 p-3 md:p-5 rounded-2xl md:rounded-3xl backdrop-blur-xl border transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] w-full max-w-[280px] sm:max-w-[240px] md:max-w-[260px] lg:max-w-none group text-left ${
                isDarkMode 
                  ? 'bg-white/5 border-white/10 hover:border-orange-500/40 hover:bg-white/10 shadow-[0_5px_15px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_30px_rgba(249,115,22,0.15)]' 
                  : 'bg-white/60 border-white/80 hover:border-orange-500/50 shadow-[0_5px_15px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_30px_rgba(249,115,22,0.2)]'
              }`}
            >
              <div className="p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-gradient-to-br from-orange-500/20 to-yellow-500/10 text-orange-500 shadow-inner group-hover:scale-110 transition-transform flex-shrink-0">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 animate-bounce" style={{ animationDuration: '3s' }} />
              </div>
              <div className="flex flex-col items-start overflow-hidden text-left">
                <p className="text-[9px] md:text-[10px] tracking-widest uppercase opacity-60 font-bold mb-0.5 whitespace-nowrap">Manzilimiz</p>
                <h5 className="text-[11px] md:text-sm font-bold leading-tight mb-0.5 md:mb-1 truncate w-full">Yunusobod tumani</h5>
                <span className="text-[9px] md:text-[10px] font-black uppercase text-orange-500 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Xarita <ChevronRight className="w-3 h-3 md:w-3.5 md:h-3.5" />
                </span>
              </div>
            </button>
          </div>

        </div>

        {/* Separator and copyright */}
        <div className="flex flex-col items-center gap-6 md:gap-8 border-t border-orange-500/10 pt-6 md:pt-10 mt-2 md:mt-0">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/30 to-transparent blur-[0.5px]" />
          <p className={`text-[9px] md:text-xs font-bold tracking-widest uppercase opacity-50 text-center ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            &copy; {currentYear} ZAYTUN RESTAURANT. BARCHA HUQUQLAR HIMOYA QILINGAN.
          </p>
        </div>

      </div>
    </footer>
  );
};

