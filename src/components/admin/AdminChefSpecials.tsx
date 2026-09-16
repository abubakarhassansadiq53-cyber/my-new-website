import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { chefSpecialTypes, type ChefSpecial } from '@/data/menu';
import { Plus, Pencil, Trash2, Star, X, AlertCircle, Calendar } from 'lucide-react';

export default function AdminChefSpecials() {
  const [items, setItems] = useState<ChefSpecial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ChefSpecial | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ChefSpecial | null>(null);

  const fetchItems = useCallback(async () => {
    const { data } = await supabase.from('chef_specials').select('*').order('special_type', { ascending: true }).order('sort_order', { ascending: true });
    setItems((data as ChefSpecial[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const toggleTodaysMeal = async (item: ChefSpecial) => {
    if (item.is_todays_meal) {
      setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, is_todays_meal: false } : i));
      await supabase.from('chef_specials').update({ is_todays_meal: false }).eq('id', item.id);
    } else {
      // Unset all others of same type, set this one
      setItems((prev) => prev.map((i) => {
        if (i.special_type === item.special_type) return { ...i, is_todays_meal: i.id === item.id };
        return i;
      }));
      await supabase.from('chef_specials').update({ is_todays_meal: false }).eq('special_type', item.special_type);
      await supabase.from('chef_specials').update({ is_todays_meal: true }).eq('id', item.id);
    }
  };

  const toggleAvailable = async (item: ChefSpecial) => {
    const newValue = !item.available;
    setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, available: newValue } : i));
    await supabase.from('chef_specials').update({ available: newValue }).eq('id', item.id);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await supabase.from('chef_specials').delete().eq('id', deleteTarget.id);
    setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-white">Chef Specials</h1>
        <button
          onClick={() => { setEditingItem(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-[#D89A27] hover:bg-[#D89A27]/90 text-black font-label text-xs font-semibold tracking-wider px-4 py-2.5 rounded-lg transition-all"
        >
          <Plus className="w-4 h-4" /> Add Special
        </button>
      </div>

      <p className="text-white/40 text-sm mb-6">Manage your Chef Special items. Toggle "Today's Meal" to feature an item on the homepage.</p>

      {chefSpecialTypes.map((type) => {
        const typeItems = items.filter((i) => i.special_type === type.key);
        return (
          <div key={type.key} className="mb-8">
            <h2 className="font-heading text-lg font-semibold text-[#D89A27] mb-4">{type.label}</h2>
            {loading ? (
              <p className="text-white/40 text-sm">Loading...</p>
            ) : typeItems.length === 0 ? (
              <p className="text-white/30 text-sm italic">No items yet. Click "Add Special" to create one.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-label tracking-wider text-white/40 border-b border-white/10">
                      <th className="pb-3 pr-4">Name</th>
                      <th className="pb-3 pr-4">Price</th>
                      <th className="pb-3 pr-4 hidden md:table-cell">Description</th>
                      <th className="pb-3 pr-4 text-center">Avail.</th>
                      <th className="pb-3 pr-4 text-center">Today's Meal</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {typeItems.map((item) => (
                      <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="py-3 pr-4">
                          <span className="text-white text-sm font-medium">{item.name}</span>
                        </td>
                        <td className="py-3 pr-4">
                          <span className="text-[#D89A27] text-sm font-semibold">€{item.price.toFixed(2)}</span>
                        </td>
                        <td className="py-3 pr-4 hidden md:table-cell">
                          <span className="text-white/50 text-sm">{item.description ?? '—'}</span>
                        </td>
                        <td className="py-3 pr-4 text-center">
                          <button onClick={() => toggleAvailable(item)} className="hover:scale-110 transition-transform">
                            {item.available ? <Star className="w-4 h-4 text-green-400 mx-auto" /> : <Star className="w-4 h-4 text-white/20 mx-auto" />}
                          </button>
                        </td>
                        <td className="py-3 pr-4 text-center">
                          <button onClick={() => toggleTodaysMeal(item)} className="hover:scale-110 transition-transform">
                            <Calendar className={`w-4 h-4 mx-auto ${item.is_todays_meal ? 'text-[#D89A27] fill-[#D89A27]' : 'text-white/20'}`} />
                          </button>
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => { setEditingItem(item); setShowForm(true); }} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                              <Pencil className="w-4 h-4 text-white/60" />
                            </button>
                            <button onClick={() => setDeleteTarget(item)} className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4 text-red-400/60" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}

      {showForm && (
        <ChefSpecialForm
          item={editingItem}
          onClose={() => { setShowForm(false); setEditingItem(null); }}
          onSaved={() => { setShowForm(false); setEditingItem(null); fetchItems(); }}
        />
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4" onClick={() => setDeleteTarget(null)}>
          <div className="bg-[#1a1818] rounded-2xl p-6 max-w-sm w-full border border-white/10" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="font-heading text-lg font-bold text-white">Delete Special?</h3>
            </div>
            <p className="text-white/60 text-sm mb-6">Are you sure you want to delete "{deleteTarget.name}"? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 bg-white/5 hover:bg-white/10 text-white text-sm py-2.5 rounded-lg transition-colors">Cancel</button>
              <button onClick={handleDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChefSpecialForm({ item, onClose, onSaved }: { item: ChefSpecial | null; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(item?.name ?? '');
  const [specialType, setSpecialType] = useState<string>(item?.special_type ?? 'special_edition');
  const [price, setPrice] = useState(item?.price !== undefined ? String(item.price) : '');
  const [description, setDescription] = useState(item?.description ?? '');
  const [imageUrl, setImageUrl] = useState(item?.image_url ?? '');
  const [available, setAvailable] = useState(item?.available ?? true);
  const [isTodaysMeal, setIsTodaysMeal] = useState(item?.is_todays_meal ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    if (isTodaysMeal) {
      await supabase.from('chef_specials').update({ is_todays_meal: false }).eq('special_type', specialType);
    }

    const payload = {
      name,
      special_type: specialType,
      price: parseFloat(price),
      description: description || null,
      image_url: imageUrl || null,
      available,
      is_todays_meal: isTodaysMeal,
    };

    const { error: saveError } = item
      ? await supabase.from('chef_specials').update(payload).eq('id', item.id)
      : await supabase.from('chef_specials').insert(payload);

    if (saveError) {
      setError(saveError.message);
      setSaving(false);
      return;
    }
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4 py-8 overflow-y-auto" onClick={onClose}>
      <div className="bg-[#1a1818] rounded-2xl p-6 sm:p-8 max-w-lg w-full my-auto max-h-[90vh] overflow-y-auto border border-white/10" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading text-xl font-bold text-white">{item ? 'Edit Special' : 'Add New Special'}</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4"><p className="text-red-400 text-sm">{error}</p></div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-label tracking-wider text-white/50 mb-2">Dish Name *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="admin-input" placeholder="e.g. Special Edition Jollof" />
          </div>

          <div>
            <label className="block text-xs font-label tracking-wider text-white/50 mb-2">Special Type *</label>
            <select value={specialType} onChange={(e) => setSpecialType(e.target.value)} className="admin-input">
              {chefSpecialTypes.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-label tracking-wider text-white/50 mb-2">Price in € *</label>
            <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required className="admin-input" placeholder="14.00" />
          </div>

          <div>
            <label className="block text-xs font-label tracking-wider text-white/50 mb-2">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="admin-input resize-none" placeholder="Short description of the dish" />
          </div>

          <div>
            <label className="block text-xs font-label tracking-wider text-white/50 mb-2">Image URL (optional)</label>
            <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="admin-input" placeholder="https://..." />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => setAvailable(!available)} className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-label tracking-wider text-white/50">Available</span>
              <div className={`w-12 h-6 rounded-full transition-colors relative ${available ? 'bg-[#D89A27]' : 'bg-white/10'}`}>
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${available ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </div>
            </button>
            <button type="button" onClick={() => setIsTodaysMeal(!isTodaysMeal)} className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-label tracking-wider text-white/50">Today's Meal</span>
              <div className={`w-12 h-6 rounded-full transition-colors relative ${isTodaysMeal ? 'bg-[#D89A27]' : 'bg-white/10'}`}>
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${isTodaysMeal ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </div>
            </button>
          </div>

          <button type="submit" disabled={saving}
            className="w-full bg-[#D89A27] hover:bg-[#D89A27]/90 text-black font-label text-sm font-semibold tracking-wider py-3.5 rounded-lg transition-all disabled:opacity-60">
            {saving ? 'Saving...' : 'Save Special'}
          </button>
        </form>
      </div>
    </div>
  );
}
