import { useState, useEffect } from 'react';
import { Star, Minus, Plus, AlertTriangle, ChevronDown } from 'lucide-react';
import Reveal from '@/components/Reveal';
import SectionTitle from '@/components/SectionTitle';
import { menuCategories, type MenuItem, type AddOn, defaultAddOns } from '@/data/menu';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';

const SIZE_PRICES: Record<string, number> = {
  Small: 8, Medium: 12, Large: 16,
};

export function getPriceForSize(item: MenuItem, size: string | null): number | null {
  if (item.price !== null) return item.price;
  if (size && SIZE_PRICES[size]) return SIZE_PRICES[size];
  return null;
}

export default function Menu() {
  const [allItems, setAllItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchMenu = async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('available', true)
        .order('sort_order', { ascending: true });
      if (error) console.error('Failed to load menu:', error);
      setAllItems((data as MenuItem[]) ?? []);
      setLoading(false);
    };
    fetchMenu();
  }, []);

  const categoriesWithData = menuCategories.filter((cat) =>
    allItems.some((i) => i.category === cat)
  );

  return (
    <div className="pt-20">
      <section className="bg-[#321B29] py-16 relative overflow-hidden kente-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionTitle eyebrow="Our Menu" title="Our" italicPart="Menu" subtitle="Authentic Nigerian & West African Cuisine" light />
          <div className="w-24 h-1 bg-are-gold mx-auto mt-6 rounded-full" />
        </div>
      </section>

      <section className="py-16 bg-are-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-are-primary/5 animate-pulse">
                  <div className="h-40 bg-are-primary/5 rounded-xl mb-4" />
                  <div className="h-5 bg-are-primary/5 rounded w-2/3 mb-3" />
                  <div className="h-4 bg-are-primary/5 rounded w-1/3 mb-4" />
                  <div className="h-10 bg-are-primary/5 rounded-full" />
                </div>
              ))}
            </div>
          ) : allItems.length === 0 ? (
            <p className="text-center text-are-primary/50 py-20">No dishes available right now. Please check back soon!</p>
          ) : (
            <div className="space-y-16">
              {categoriesWithData.map((category) => (
                <div key={category}>
                  <div className="flex items-center gap-4 mb-8">
                    <h2 className="font-heading text-2xl sm:text-3xl font-bold text-are-primary">{category}</h2>
                    <div className="flex-1 h-px bg-are-primary/10" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allItems.filter((i) => i.category === category).map((item, i) => (
                      <Reveal key={item.id} delay={i * 50}>
                        <MenuItemCard item={item} onAdd={addItem} />
                      </Reveal>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function MenuItemCard({
  item,
  onAdd,
}: {
  item: MenuItem;
  onAdd: (item: MenuItem, size: string | null, unitPrice: number, addOns?: AddOn[]) => void;
}) {
  const sizes = item.sizes_available;
  const defaultSize = sizes && sizes.length > 0 ? sizes[0] : null;
  const defaultPrice = getPriceForSize(item, defaultSize);
  const [selectedSize, setSelectedSize] = useState<string | null>(defaultSize);
  const [quantity, setQuantity] = useState(1);
  const [showAddOns, setShowAddOns] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);

  const currentPrice = getPriceForSize(item, selectedSize);
  const addons = item.addons ?? defaultAddOns;
  const addonTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);

  const toggleAddOn = (addon: AddOn) => {
    setSelectedAddOns((prev) =>
      prev.find((a) => a.name === addon.name)
        ? prev.filter((a) => a.name !== addon.name)
        : [...prev, addon]
    );
  };

  const handleAdd = () => {
    onAdd(item, selectedSize, currentPrice ?? 0, selectedAddOns);
    setQuantity(1);
    setSelectedAddOns([]);
    setShowAddOns(false);
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-are-primary/5 overflow-hidden flex flex-col">
      <div className="aspect-[4/3] bg-gradient-to-br from-are-primary/5 to-are-gold/5 flex items-center justify-center relative">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-are-primary/20 font-label text-xs tracking-wider text-center px-4">[Photo: {item.name}]</span>
        )}
        {item.featured && (
          <span className="absolute top-3 left-3 flex items-center gap-1 bg-are-gold text-are-black text-[10px] font-label font-bold px-2.5 py-1 rounded-full">
            <Star className="w-3 h-3 fill-are-black" /> Featured
          </span>
        )}
        {item.moq_required && (
          <span className="absolute top-3 right-3 flex items-center gap-1 bg-are-paprika text-are-ivory text-[10px] font-label font-bold px-2.5 py-1 rounded-full">
            <AlertTriangle className="w-3 h-3" /> Min. Order
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-heading text-lg font-semibold text-are-primary mb-2">{item.name}</h3>

        {item.pairs_with && item.pairs_with.length > 0 && (
          <div className="mb-3">
            <p className="text-[10px] font-label tracking-wider text-are-primary/40 mb-1.5">Pairs well with:</p>
            <div className="flex flex-wrap gap-1.5">
              {item.pairs_with.map((pair) => (
                <span key={pair} className="text-[10px] bg-are-primary/5 text-are-primary/50 px-2 py-1 rounded-full">{pair}</span>
              ))}
            </div>
          </div>
        )}

        {sizes && sizes.length > 0 && (
          <div className="mb-3">
            <div className="flex gap-2">
              {sizes.map((size) => (
                <button key={size} onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedSize === size ? 'bg-are-gold text-are-black' : 'bg-are-primary/5 text-are-primary/60 hover:bg-are-primary/10'
                  }`}>
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-3">
          {currentPrice !== null ? (
            <span className="font-heading text-2xl font-bold text-are-gold">€{(currentPrice + addonTotal).toFixed(2)}</span>
          ) : (
            <span className="font-heading text-lg italic text-are-primary/50">Price on request</span>
          )}
        </div>

        {/* Add-ons section */}
        <button
          onClick={() => setShowAddOns((v) => !v)}
          className="flex items-center gap-2 text-xs font-label tracking-wider text-are-primary/50 hover:text-are-primary mb-3 transition-colors"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${showAddOns ? 'rotate-180' : ''}`} />
          Add-ons {selectedAddOns.length > 0 && `(${selectedAddOns.length} selected)`}
        </button>

        {showAddOns && (
          <div className="mb-4 space-y-2 bg-are-primary/5 rounded-xl p-3">
            {addons.map((addon) => {
              const isSelected = selectedAddOns.some((a) => a.name === addon.name);
              return (
                <button
                  key={addon.name}
                  onClick={() => toggleAddOn(addon)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                    isSelected ? 'bg-are-gold/20 text-are-primary font-semibold' : 'bg-white text-are-primary/60 hover:bg-are-primary/5'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-4 h-4 rounded border-2 flex items-center justify-center ${isSelected ? 'bg-are-gold border-are-gold' : 'border-are-primary/20'}`}>
                      {isSelected && <Plus className="w-2.5 h-2.5 text-are-black" />}
                    </span>
                    {addon.name}
                  </span>
                  <span className="font-semibold">+€{addon.price.toFixed(2)}</span>
                </button>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-9 h-9 rounded-full bg-are-primary/10 hover:bg-are-primary/20 flex items-center justify-center transition-colors"
            aria-label="Decrease quantity">
            <Minus className="w-4 h-4 text-are-primary" />
          </button>
          <span className="font-label text-base font-semibold w-8 text-center">{quantity}</span>
          <button onClick={() => setQuantity((q) => q + 1)}
            className="w-9 h-9 rounded-full bg-are-primary/10 hover:bg-are-primary/20 flex items-center justify-center transition-colors"
            aria-label="Increase quantity">
            <Plus className="w-4 h-4 text-are-primary" />
          </button>
        </div>

        <button onClick={handleAdd}
          className="mt-auto w-full bg-[#B9472E] hover:bg-[#B9472E]/90 text-are-ivory font-label text-sm font-semibold tracking-wider py-3 rounded-full transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Add to Cart
        </button>
      </div>
    </div>
  );
}
