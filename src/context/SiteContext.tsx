import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { foods as initialFoods, Food } from '../data';
import { db } from '../firebase';
import { collection, doc, getDocs, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

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
  contactPhone: "+998 99 517 29 95",
  contactTelegram: "https://t.me/AbroribnAbdulloh",
  contactInstagram: "https://instagram.com/zaytunfood",
  contactYoutube: "https://youtube.com/@zaytunfood",
};

export const SiteProvider = ({ children }: { children: ReactNode }) => {
  const [foods, setFoodsState] = useState<Food[]>(initialFoods);
  const [siteContent, setSiteContentState] = useState<SiteContent>(defaultContent);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentView, setCurrentView] = useState<'main' | 'admin'>('main');
  const [isDarkMode, setIsDarkModeState] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    // localStorage dan kichik sozlamalarni yuklash
    const localMode = localStorage.getItem('isDarkMode');
    if (localMode !== null) setIsDarkModeState(localMode === 'true');

    const localFavs = localStorage.getItem('favorites');
    if (localFavs) {
      try { setFavorites(JSON.parse(localFavs)); } catch(e) {}
    }

    // Firebase Firestore dan real-time ma'lumot olish
    // Content (telegram, instagram, telefon, matn...)
    const unsubContent = onSnapshot(doc(db, 'content', 'main'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        let needsUpdate = false;
        const updatedData = { ...data };

        if (data.contactTelegram === "https://t.me/shoxa_admin" || !data.contactTelegram) {
          updatedData.contactTelegram = "https://t.me/AbroribnAbdulloh";
          needsUpdate = true;
        }
        if (data.contactInstagram === "https://instagram.com/shoxa_restaurant" || !data.contactInstagram) {
          updatedData.contactInstagram = "https://instagram.com/zaytunfood";
          needsUpdate = true;
        }
        if (data.contactYoutube === "https://youtube.com/@shoxa_restaurant" || !data.contactYoutube) {
          updatedData.contactYoutube = "https://youtube.com/@zaytunfood";
          needsUpdate = true;
        }
        if (data.contactPhone === "+998 90 123 45 67" || !data.contactPhone) {
          updatedData.contactPhone = "+998 99 517 29 95";
          needsUpdate = true;
        }

        if (needsUpdate) {
          setDoc(doc(db, 'content', 'main'), updatedData).catch(console.error);
        }

        setSiteContentState({ ...defaultContent, ...updatedData } as SiteContent);
      } else {
        setDoc(doc(db, 'content', 'main'), defaultContent).catch(console.error);
      }
    }, (err) => {
      console.error('Content yuklashda xato:', err);
    });

    // Foods (mahsulotlar)
    const unsubFoods = onSnapshot(collection(db, 'foods'), (snap) => {
      if (!snap.empty) {
        const loadedFoods = snap.docs.map(d => d.data() as Food);
        setFoodsState(loadedFoods.sort((a, b) => a.id - b.id));
      }
    }, (err) => {
      console.error('Foods yuklashda xato:', err);
    });

    // Komponent o'chirilganda tinglovchilarni to'xtatish
    return () => {
      unsubContent();
      unsubFoods();
    };
  }, []);

  const setSiteContent = (content: SiteContent | ((prev: SiteContent) => SiteContent)) => {
    setSiteContentState(prev => {
      const newContent = typeof content === 'function' ? content(prev) : content;
      // Firebase ga saqlash
      setDoc(doc(db, 'content', 'main'), newContent).catch(console.error);
      return newContent;
    });
  };

  const addFood = (food: Food) => {
    setFoodsState(prev => {
      const newFoods = [food, ...prev];
      setDoc(doc(db, 'foods', food.id.toString()), food).catch(console.error);
      return newFoods;
    });
  };

  const updateFood = (food: Food) => {
    setFoodsState(prev => {
      const newFoods = prev.map(f => f.id === food.id ? food : f);
      setDoc(doc(db, 'foods', food.id.toString()), food).catch(console.error);
      return newFoods;
    });
  };

  const removeFood = (id: number) => {
    setFoodsState(prev => {
      const newFoods = prev.filter(f => f.id !== id);
      deleteDoc(doc(db, 'foods', id.toString())).catch(console.error);
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
