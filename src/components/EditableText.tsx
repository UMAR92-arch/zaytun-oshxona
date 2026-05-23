import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import { useSite } from '../context/SiteContext';

interface EditableTextProps {
  contentKey: keyof import('../context/SiteContext').SiteContent;
  className?: string;
  render?: (value: string) => React.ReactNode;
}

export const EditableText = ({ contentKey, className = '', render }: EditableTextProps) => {
  const { siteContent, setSiteContent, isEditMode } = useSite();
  const value = siteContent[contentKey];
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    setSiteContent(prev => ({ ...prev, [contentKey]: tempValue }));
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <input 
          autoFocus
          className="bg-black/50 border border-orange-500 rounded px-2 py-1 text-white outline-none w-full"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') setIsEditing(false);
          }}
        />
        <button onClick={handleSave} className="bg-green-500 text-white px-2 py-1 rounded text-xs">Saqlash</button>
        <button onClick={() => setIsEditing(false)} className="bg-red-500 text-white px-2 py-1 rounded text-xs">Bekor</button>
      </div>
    );
  }

  return (
    <div className={`relative group inline-block ${className}`}>
      {render ? render(value) : value}
      {isEditMode && (
        <button 
          onClick={() => {
            setTempValue(value);
            setIsEditing(true);
          }}
          className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-orange-500 p-1.5 rounded-full text-white shadow-lg z-50"
        >
          <Pencil className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};
