import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { menuCategories, type MenuItem, type AddOn } from '@/data/menu';
import { Plus, Search, Pencil, Trash2, Star, Eye, EyeOff, X, Upload, AlertCircle } from 'lucide-react';

const ALL_SIZES = ['Small', 'Medium', 'Large'];

export default function AdminMenu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MenuItem | null>(null);

  const fetchItems = useCallback(async () => {
    const { data } = await supabase.from('menu_items').select('*').order('sort_order', { ascending: true });
    setItems((data as MenuItem[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const filtered = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const toggleField = async (item: MenuItem, field: 'available' | 'featured') => {
    const newValue = !item[field];
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, [field]: newValue } : i)));
    await supabase.from('menu_items').update({ [field]: newValue }).eq('id', item.id);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await supabase.from('menu_items').delete().eq('id', deleteTarget.id);
    setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-white">Menu Management</h1>
        <button
          onClick={() => { setEditingItem(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-[#D89A27] hover:bg-[#D89A27]/90 text-black font-label text-xs font-semibold tracking-wider px-4 py-2.5 rounded-lg transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Dish
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dishes..."
            className="w-full bg-[#1a1818] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white text-sm focus:border-[#D89A27] focus:outline-none"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-[#1a1818] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:border-[#D89A27] focus:outline-none"
        >
          <option value="all">All Categories</option>
          {menuCategories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-white/40 text-center py-12">Loading dishes...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-label tracking-wider text-white/40 border-b border-white/10">
                <th className="pb-3 pr-4">Photo</th>
                <th className="pb-3 pr-4">Name</th>
                <th className="pb-3 pr-4 hidden md:table-cell">Category</th>
                <th className="pb-3 pr-4 hidden lg:table-cell">Sizes</th>
                <th className="pb-3 pr-4">Price</th>
                <th className="pb-3 pr-4 text-center">Avail.</th>
                <th className="pb-3 pr-4 text-center">Feat.</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="py-3 pr-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white/20 text-[8px]">N/A</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-white text-sm font-medium">{item.name}</span>
                    {item.moq_required && <span className="ml-2 text-[9px] bg-[#B9472E]/20 text-[#B9472E] px-1.5 py-0.5 rounded-full">MOQ</span>}
                  </td>
                  <td className="py-3 pr-4 hidden md:table-cell"><span className="text-white/60 text-sm">{item.category}</span></td>
                  <td className="py-3 pr-4 hidden lg:table-cell">
                    <span className="text-white/60 text-xs">{item.sizes_available ? item.sizes_available.join(', ') : '—'}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-[#D89A27] text-sm font-semibold">{item.price !== null ? `€${item.price.toFixed(2)}` : 'TBC'}</span>
                  </td>
                  <td className="py-3 pr-4 text-center">
                    <button onClick={() => toggleField(item, 'available')} className="hover:scale-110 transition-transform">
                      {item.available ? <Eye className="w-4 h-4 text-green-400 mx-auto" /> : <EyeOff className="w-4 h-4 text-white/20 mx-auto" />}
                    </button>
                  </td>
                  <td className="py-3 pr-4 text-center">
                    <button onClick={() => toggleField(item, 'featured')} className="hover:scale-110 transition-transform">
                      <Star className={`w-4 h-4 mx-auto ${item.featured ? 'text-[#D89A27] fill-[#D89A27]' : 'text-white/20'}`} />
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
          {filtered.length === 0 && <p className="text-white/40 text-center py-8">No dishes found.</p>}
        </div>
      )}

      {showForm && (
        <DishForm
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
              <h3 className="font-heading text-lg font-bold text-white">Delete Dish?</h3>
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

function DishForm({ item, onClose, onSaved }: { item: MenuItem | null; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(item?.name ?? '');
  const [category, setCategory] = useState<string>(item?.category ?? menuCategories[0]);
  const [sizes, setSizes] = useState<string[]>(item?.sizes_available ?? []);
  const [pairsWith, setPairsWith] = useState((item?.pairs_with ?? []).join(', '));
  const [price, setPrice] = useState(item?.price !== null && item?.price !== undefined ? String(item.price) : '');
  const [imageUrl, setImageUrl] = useState(item?.image_url ?? '');
  const [moqRequired, setMoqRequired] = useState(item?.moq_required ?? false);
  const [available, setAvailable] = useState(item?.available ?? true);
  const [featured, setFeatured] = useState(item?.featured ?? false);
  const [addons, setAddons] = useState<string>(item?.addons ? item.addons.map((a: AddOn) => `${a.name}:${a.price}`).join(', ') : '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const toggleSize = (size: string) => {
    setSizes((prev) => prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `dish-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from('menu-images').upload(fileName, file);
    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from('menu-images').getPublicUrl(fileName);
    setImageUrl(urlData.publicUrl);
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const parsedAddons = addons.trim() ? addons.split(',').map((s) => { const [name, price] = s.split(':').map((p) => p.trim()); return { name, price: parseFloat(price) || 0 }; }).filter((a) => a.name) : null;

    const payload = {
      name,
      category,
      sizes_available: sizes.length > 0 ? sizes : null,
      pairs_with: pairsWith.trim() ? pairsWith.split(',').map((s) => s.trim()).filter(Boolean) : null,
      price: price.trim() ? parseFloat(price) : null,
      image_url: imageUrl || null,
      moq_required: moqRequired,
      available,
      featured,
      addons: parsedAddons,
    };

    const { error: saveError } = item
      ? await supabase.from('menu_items').update(payload).eq('id', item.id)
      : await supabase.from('menu_items').insert(payload);

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
          <h3 className="font-heading text-xl font-bold text-white">{item ? 'Edit Dish' : 'Add New Dish'}</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4"><p className="text-red-400 text-sm">{error}</p></div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-label tracking-wider text-white/50 mb-2">Dish Name *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="admin-input" placeholder="e.g. Jollof Rice" />
          </div>

          <div>
            <label className="block text-xs font-label tracking-wider text-white/50 mb-2">Category *</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="admin-input">
              {menuCategories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-label tracking-wider text-white/50 mb-2">Sizes Available</label>
            <div className="flex gap-3">
              {ALL_SIZES.map((size) => (
                <button key={size} type="button" onClick={() => toggleSize(size)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${sizes.includes(size) ? 'bg-[#D89A27] text-black' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-label tracking-wider text-white/50 mb-2">Pairs With (comma separated)</label>
            <input type="text" value={pairsWith} onChange={(e) => setPairsWith(e.target.value)} className="admin-input" placeholder="Vegetable Salad, Fried Plantains" />
          </div>

          <div>
            <label className="block text-xs font-label tracking-wider text-white/50 mb-2">Price in € (leave blank = Price on request)</label>
            <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="admin-input" placeholder="8.00" />
          </div>

          <div>
            <label className="block text-xs font-label tracking-wider text-white/50 mb-2">Photo</label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white/70 text-sm px-4 py-2.5 rounded-lg cursor-pointer transition-colors">
                <Upload className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Upload Photo'}
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleUpload} className="hidden" disabled={uploading} />
              </label>
              {imageUrl && <img src={imageUrl} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />}
            </div>
          </div>

          <div>
            <label className="block text-xs font-label tracking-wider text-white/50 mb-2">Add-ons (name:price, comma separated)</label>
            <input type="text" value={addons} onChange={(e) => setAddons(e.target.value)} className="admin-input" placeholder="Extra Plantain:2.50, Extra Meat:3.50" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Toggle label="MOQ Required" value={moqRequired} onChange={setMoqRequired} />
            <Toggle label="Available" value={available} onChange={setAvailable} />
            <Toggle label="Featured" value={featured} onChange={setFeatured} />
          </div>

          <button type="submit" disabled={saving}
            className="w-full bg-[#D89A27] hover:bg-[#D89A27]/90 text-black font-label text-sm font-semibold tracking-wider py-3.5 rounded-lg transition-all disabled:opacity-60">
            {saving ? 'Saving...' : 'Save Dish'}
          </button>
        </form>
      </div>
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!value)} className="flex flex-col items-center gap-2">
      <span className="text-[10px] font-label tracking-wider text-white/50">{label}</span>
      <div className={`w-12 h-6 rounded-full transition-colors relative ${value ? 'bg-[#D89A27]' : 'bg-white/10'}`}>
        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-0.5'}`} />
      </div>
    </button>
  );
}
