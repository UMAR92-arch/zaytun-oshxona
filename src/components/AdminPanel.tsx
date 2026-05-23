import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { Food } from '../data';
import { Plus, Edit2, Trash2, ArrowLeft, LogOut, Layout } from 'lucide-react';

export const AdminPanel = () => {
  const { foods, isAdminLoggedIn, setIsAdminLoggedIn, setCurrentView, setIsEditMode, addFood, updateFood, removeFood } = useSite();
  const [password, setPassword] = useState('');
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'oshxona') {
      setIsAdminLoggedIn(true);
    } else {
      alert("Noto'g'ri parol!");
    }
  };

  const handleSaveFood = (food: Food) => {
    if (isAdding) {
      addFood({ ...food, id: Date.now() });
      setIsAdding(false);
    } else {
      updateFood(food);
      setEditingFood(null);
    }
  };

  const handleDelete = (id: number) => {
    if(window.confirm("Rostdan ham o'chirmoqchimisiz?")) {
      removeFood(id);
    }
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">
        <form onSubmit={handleLogin} className="glassmorphism p-8 rounded-2xl w-96 flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-center text-orange-500 mb-4">Admin Panelga kirish</h2>
          <input 
            type="password" 
            placeholder="Parolni kiriting..." 
            className="bg-black/50 border border-white/20 p-3 rounded-lg text-white outline-none focus:border-orange-500 transition-colors"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="bg-orange-600 hover:bg-orange-700 p-3 rounded-lg font-bold transition-colors">
            Kirish
          </button>
          <button type="button" onClick={() => setCurrentView('main')} className="text-sm text-gray-400 hover:text-white mt-2">
            Asosiy saytga qaytish
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-orange-500 flex items-center gap-2">
            Admin Panel
          </h1>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => {
                setIsEditMode(true);
                setCurrentView('main');
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-bold transition-colors"
            >
              <Layout className="w-4 h-4" />
              Saytni tahrirlash
            </button>
            <button 
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-bold transition-colors"
            >
              <Plus className="w-4 h-4" />
              Yangi mahsulot
            </button>
            <button 
              onClick={() => { setIsAdminLoggedIn(false); setCurrentView('main'); }}
              className="flex items-center gap-2 bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg font-bold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Chiqish
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {foods.map(food => (
            <div key={food.id} className="glassmorphism rounded-xl overflow-hidden group relative">
              <img src={food.image} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-lg">{food.name}</h3>
                <p className="text-orange-400 font-semibold">{food.price}</p>
              </div>
              
              <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => setEditingFood(food)}
                  className="p-2 bg-blue-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(food.id)}
                  className="p-2 bg-red-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {(editingFood || isAdding) && (
        <FoodEditorModal 
          food={editingFood || { id: 0, name: '', description: '', ingredients: '', price: '', image: '', rating: 5.0 }} 
          onClose={() => { setEditingFood(null); setIsAdding(false); }} 
          onSave={handleSaveFood} 
          isNew={isAdding}
        />
      )}

    </div>
  );
};


const FoodEditorModal = ({ food, onClose, onSave, isNew }: { food: Food, onClose: () => void, onSave: (f: Food) => void, isNew: boolean }) => {
  const [formData, setFormData] = useState(food);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#111] border border-orange-500/30 p-6 rounded-2xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">{isNew ? "Yangi mahsulot qo'shish" : "Mahsulotni tahrirlash"}</h2>
        
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-400">Rasm URL (Internetdagi havola)</label>
            <input 
              value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})}
              className="w-full bg-black/50 border border-white/10 p-2 rounded mt-1"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400">Nomi</label>
            <input 
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-black/50 border border-white/10 p-2 rounded mt-1"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400">Narxi (masalan: 35 000 UZS)</label>
            <input 
              value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
              className="w-full bg-black/50 border border-white/10 p-2 rounded mt-1"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400">Ta'rifi</label>
            <textarea 
              value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full bg-black/50 border border-white/10 p-2 rounded mt-1 h-20"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400">Tarkibi</label>
            <textarea 
              value={formData.ingredients} onChange={e => setFormData({...formData, ingredients: e.target.value})}
              className="w-full bg-black/50 border border-white/10 p-2 rounded mt-1 h-16"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">Bekor qilish</button>
          <button onClick={() => onSave(formData)} className="px-4 py-2 bg-orange-600 rounded hover:bg-orange-500 font-bold">Saqlash</button>
        </div>
      </div>
    </div>
  );
};
