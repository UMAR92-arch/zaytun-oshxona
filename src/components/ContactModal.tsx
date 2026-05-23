import React from 'react';
import { motion } from 'framer-motion';
import { X, Phone, Send, Youtube, Instagram } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { EditableText } from './EditableText';

export const ContactModal = ({ onClose }: { onClose: () => void }) => {
  const { isEditMode, siteContent } = useSite();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md glassmorphism bg-[#111]/80 rounded-[2rem] overflow-hidden p-8 border-orange-500/20 text-center"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-orange-500 rounded-full text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-white text-glow">Biz bilan aloqa</h2>
        <p className="text-gray-400 text-sm mb-8">
          Bizning ijtimoiy tarmoqlarimizga obuna bo'ling yoki telefon orqali bog'laning.
        </p>

        <div className="flex flex-col gap-4">
          <ContactLink 
            icon={<Phone className="w-5 h-5" />} 
            contentKey="contactPhone" 
            color="bg-green-600/20 text-green-500" 
            link={isEditMode ? undefined : `tel:${siteContent.contactPhone.replace(/\s+/g, '')}`}
            isEditMode={isEditMode}
          />
          <ContactLink 
            icon={<Send className="w-5 h-5" />} 
            contentKey="contactTelegram" 
            color="bg-blue-600/20 text-blue-500" 
            link={isEditMode ? undefined : siteContent.contactTelegram}
            isEditMode={isEditMode}
          />
          <ContactLink 
            icon={<Instagram className="w-5 h-5" />} 
            contentKey="contactInstagram" 
            color="bg-pink-600/20 text-pink-500" 
            link={isEditMode ? undefined : siteContent.contactInstagram}
            isEditMode={isEditMode}
          />
          <ContactLink 
            icon={<Youtube className="w-5 h-5" />} 
            contentKey="contactYoutube" 
            color="bg-red-600/20 text-red-500" 
            link={isEditMode ? undefined : siteContent.contactYoutube}
            isEditMode={isEditMode}
          />
        </div>
      </motion.div>
    </div>
  );
};

const ContactLink = ({ icon, contentKey, color, link, isEditMode }: any) => {
  const Wrapper = link ? 'a' : 'div';
  const props = link ? { href: link, target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <Wrapper {...props} className={`flex items-center p-3 rounded-xl border border-white/5 transition-all hover:bg-white/5 ${link ? 'cursor-pointer hover:border-orange-500/50' : ''}`}>
      <div className={`p-3 rounded-lg mr-4 ${color}`}>
        {icon}
      </div>
      <div className="flex-1 text-left flex flex-col">
        {isEditMode ? (
          <EditableText 
            contentKey={contentKey} 
            className="font-semibold text-white block w-full text-sm break-all"
          />
        ) : (
          <span className="font-semibold text-white text-sm break-all">
            {link || "Tahrirlanmagan"}
          </span>
        )}
      </div>
    </Wrapper>
  );
};
