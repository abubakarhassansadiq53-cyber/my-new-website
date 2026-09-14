import { useState, useEffect, useMemo } from 'react';
import { Star, Minus, Plus, AlertTriangle } from 'lucide-react';
import Reveal from '@/components/Reveal';
import SectionTitle from '@/components/SectionTitle';
import { menuCategories, type MenuItem } from '@/data/menu';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<string>('Rice Dishes');
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
      if (error) {
        console.error('Failed to load menu:', error);
      }
      setAllItems((data as MenuItem[]) ?? []);
      setLoading(false);
    };
    fetchMenu();
  }, []);

  const filteredItems = useMemo(() => {
    return allItems.filter((i) => i.category === activeCategory);
  }, [activeCategory, allItems]);

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-[#321B29] py-16 relative overflow-hidden kente-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionTitle
            eyebrow="Our Menu"
            title="Our"
            italicPart="Menu"
            subtitle="Authentic Nigerian & West African Cuisine"
            light
          />
          <div className="w-24 h-1 bg-are-gold mx-auto mt-6 rounded-full" />
        </div>
      </section>

      {/* Category tabs */}
      <div className="sticky top-20 z-30 bg-are-ivory/95 backdrop-blur-sm border-b border-are-primary/10 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {menuCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-label text-xs font-semibold tracking-wider px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-are-primary text-are-ivory'
                    : 'bg-are-primary/5 text-are-primary/60 hover:bg-are-primary/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu items */}
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
          ) : filteredItems.length === 0 ? (
            <p className="text-center text-are-primary/50 py-20">No dishes available in this category right now.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, i) => (
                <Reveal key={item.id} delay={i * 50}>
                  <MenuItemCard item={item} onAdd={addItem} />
                </Reveal>
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
  onAdd: (item: MenuItem, size: string | null, unitPrice: number) => void;
}) {
  const sizes = item.sizes;
  const defaultSize = sizes && sizes.length > 0 ? sizes[0].label : null;
  const defaultPrice = sizes && sizes.length > 0 ? sizes[0].price : item.price;
  const [selectedSize, setSelectedSize] = useState<string | null>(defaultSize);
  const [quantity, setQuantity] = useState(1);

  const currentPrice = useMemo(() => {
    if (sizes) {
      const match = sizes.find((s) => s.label === selectedSize);
      return match ? match.price : sizes[0].price;
    }
    return item.price;
  }, [sizes, selectedSize, item.price]);

  const handleAdd = () => {
    onAdd(item, selectedSize, currentPrice ?? 0);
    setQuantity(1);
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-are-primary/5 overflow-hidden flex flex-col">
      {/* Photo placeholder */}
      <div className="aspect-[4/3] bg-gradient-to-br from-are-primary/5 to-are-gold/5 flex items-center justify-center relative">
        <span className="text-are-primary/20 font-label text-xs tracking-wider text-center px-4">
          [Photo: {item.name}]
        </span>
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

        {/* Pairs well with */}
        {item.pairs && item.pairs.length > 0 && (
          <div className="mb-3">
            <p className="text-[10px] font-label tracking-wider text-are-primary/40 mb-1.5">Pairs well with:</p>
            <div className="flex flex-wrap gap-1.5">
              {item.pairs.map((pair) => (
                <span key={pair} className="text-[10px] bg-are-primary/5 text-are-primary/50 px-2 py-1 rounded-full">
                  {pair}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Size selector */}
        {sizes && sizes.length > 0 && (
          <div className="mb-3">
            <div className="flex gap-2">
              {sizes.map((size) => (
                <button
                  key={size.label}
                  onClick={() => setSelectedSize(size.label)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedSize === size.label
                      ? 'bg-are-gold text-are-black'
                      : 'bg-are-primary/5 text-are-primary/60 hover:bg-are-primary/10'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price */}
        <div className="mb-3">
          {currentPrice !== null && currentPrice !== undefined ? (
            <span className="font-heading text-2xl font-bold text-are-gold">€{currentPrice.toFixed(2)}</span>
          ) : (
            <span className="font-heading text-lg italic text-are-primary/50">Price on request</span>
          )}
        </div>

        {/* Quantity selector */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-9 h-9 rounded-full bg-are-primary/10 hover:bg-are-primary/20 flex items-center justify-center transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4 text-are-primary" />
          </button>
          <span className="font-label text-base font-semibold w-8 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="w-9 h-9 rounded-full bg-are-primary/10 hover:bg-are-primary/20 flex items-center justify-center transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4 text-are-primary" />
          </button>
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAdd}
          className="mt-auto w-full bg-[#B9472E] hover:bg-[#B9472E]/90 text-are-ivory font-label text-sm font-semibold tracking-wider py-3 rounded-full transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add to Cart
        </button>
      </div>
    </div>
  );
}
