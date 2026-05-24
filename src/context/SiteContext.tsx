import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { foods as initialFoods, Food } from '../data';
import { getDb } from '../firebase';
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';

export interface SiteContent {
  logoText: string;
  heroTopText: string;
  heroTitle: string;
  heroSubtitle: string;
  heroFeature1: string;
  heroFeature2: string;
  mainButton: string;
  fullMenuTitle: string;
  fullMenuSubtitle: string;
  contactPhone: string;
  contactTelegram: string;
  contactInstagram: string;
  contactYoutube: string;
}

interface SiteContextType {
  foods: Food[];
  setFoods: (foods: Food[] | ((prev: Food[]) => Food[])) => void;
  siteContent: SiteContent;
  setSiteContent: (content: SiteContent | ((prev: SiteContent) => SiteContent)) => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (val: boolean) => void;
  isEditMode: boolean;
  setIsEditMode: (val: boolean) => void;
  currentView: 'main' | 'admin';
  setCurrentView: (val: 'main' | 'admin') => void;
  addFood: (food: Food) => void;
  updateFood: (food: Food) => void;
  removeFood: (id: number) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  favorites: number[];
  toggleFavorite: (id: number) => void;
}

const SiteContext = createContext<SiteContextType | null>(null);

const defaultContent: SiteContent = {
  logoText: 'ZAYTUN',
  heroTopText: '30 daqiqada yetkazib beramiz',
  heroTitle: 'Yangi va mazali salatlar',
  heroSubtitle: "Yevropadagi №1 restoranning bosh oshpazi mualliflik retsepti asosida tayyorlangan",
  heroFeature1: "Har doim yangi masalliqlar",
  heroFeature2: "O'ziga xos ta'm",
  mainButton: "BUYURTMA QILISH",
  fullMenuTitle: "Barcha Taomlar",
  fullMenuSubtitle: "Bizning maxsus oshpazlarimiz tomonidan eng sara masalliqlardan tayyorlangan premium taomlar to'plami.",
  contactPhone: "+998 90 123 45 67",
  contactTelegram: "https://t.me/shoxa_admin",
  contactInstagram: "https://instagram.com/shoxa_restaurant",
  contactYoutube: "https://youtube.com/@shoxa_restaurant",
};

export const SiteProvider = ({ children }: { children: ReactNode }) => {
  const [foods, setFoodsState] = useState<Food[]>(initialFoods);
  const [siteContent, setSiteContentState] = useState<SiteContent>(defaultContent);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentView, setCurrentView] = useState<'main' | 'admin'>('main');
  
  // New features states
  const [isDarkMode, setIsDarkModeState] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    // Load local features
    const localMode = localStorage.getItem('isDarkMode');
    if (localMode !== null) setIsDarkModeState(localMode === 'true');
    const localFavs = localStorage.getItem('favorites');
    if (localFavs) setFavorites(JSON.parse(localFavs));

    const loadData = async () => {
      const db = getDb();
      if (db) {
        try {
          const contentSnap = await getDocs(collection(db, 'content'));
          if (!contentSnap.empty) {
            setSiteContentState({ ...defaultContent, ...contentSnap.docs[0].data() } as SiteContent);
          }
          const foodsSnap = await getDocs(collection(db, 'foods'));
          if (!foodsSnap.empty) {
            const loadedFoods = foodsSnap.docs.map(d => d.data() as Food);
            setFoodsState(loadedFoods.sort((a,b) => a.id - b.id));
          }
        } catch (e) {
          console.error("Firebase load error:", e);
          const localContent = localStorage.getItem('siteContent_v2');
          if (localContent) setSiteContentState({ ...defaultContent, ...JSON.parse(localContent) });
          const localFoods = localStorage.getItem('foods_v3');
          if (localFoods) setFoodsState(JSON.parse(localFoods));
        }
      } else {
        const localContent = localStorage.getItem('siteContent_v2');
        if (localContent) setSiteContentState({ ...defaultContent, ...JSON.parse(localContent) });
        const localFoods = localStorage.getItem('foods_v3');
        if (localFoods) setFoodsState(JSON.parse(localFoods));
      }
    };
    loadData();
  }, []);

  const setSiteContent = (content: SiteContent | ((prev: SiteContent) => SiteContent)) => {
    setSiteContentState(prev => {
      const newContent = typeof content === 'function' ? content(prev) : content;
      
      const db = getDb();
      if (db) {
        setDoc(doc(db, 'content', 'main'), newContent).catch(console.error);
      }
      localStorage.setItem('siteContent_v2', JSON.stringify(newContent));
      
      return newContent;
    });
  };

  const addFood = (food: Food) => {
    setFoodsState(prev => {
      const newFoods = [food, ...prev];
      const db = getDb();
      if (db) setDoc(doc(db, 'foods', food.id.toString()), food).catch(console.error);
      localStorage.setItem('foods_v3', JSON.stringify(newFoods));
      return newFoods;
    });
  };

  const updateFood = (food: Food) => {
    setFoodsState(prev => {
      const newFoods = prev.map(f => f.id === food.id ? food : f);
      const db = getDb();
      if (db) setDoc(doc(db, 'foods', food.id.toString()), food).catch(console.error);
      localStorage.setItem('foods_v3', JSON.stringify(newFoods));
      return newFoods;
    });
  };

  const removeFood = (id: number) => {
    setFoodsState(prev => {
      const newFoods = prev.filter(f => f.id !== id);
      const db = getDb();
      if (db) deleteDoc(doc(db, 'foods', id.toString())).catch(console.error);
      localStorage.setItem('foods_v3', JSON.stringify(newFoods));
      return newFoods;
    });
  };

  const setIsDarkMode = (val: boolean) => {
    setIsDarkModeState(val);
    localStorage.setItem('isDarkMode', String(val));
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const isFav = prev.includes(id);
      const newFavs = isFav ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem('favorites', JSON.stringify(newFavs));
      return newFavs;
    });
  };

  return (
    <SiteContext.Provider value={{
      foods, setFoods: setFoodsState,
      siteContent, setSiteContent,
      isAdminLoggedIn, setIsAdminLoggedIn,
      isEditMode, setIsEditMode,
      currentView, setCurrentView,
      addFood, updateFood, removeFood,
      isDarkMode, setIsDarkMode,
      favorites, toggleFavorite
    }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) throw new Error("useSite must be used within SiteProvider");
  return context;
};
