import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Star, AlertTriangle, Search, Languages } from 'lucide-react';
import Reveal from '@/components/Reveal';
import SectionTitle from '@/components/SectionTitle';
import { menuCategories, categoryTranslations, type MenuItem } from '@/data/menu';
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
  const [search, setSearch] = useState('');
  const [showNigerian, setShowNigerian] = useState(false);
  const [searchParams] = useSearchParams();
  const typeFilter = searchParams.get('type');

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

  const typeCategoryMap: Record<string, string> = {
    special_edition: 'Special Proteins',
    todays_menu: 'Rice Dishes',
    combo_meal: 'Rice Dishes',
    vegan_option: 'Nigerian Soups',
  };

  const baseItems = typeFilter ? allItems.filter((i) => i.category === (typeCategoryMap[typeFilter] ?? '')) : allItems;

  const filteredItems = search.trim()
    ? baseItems.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()) || i.category.toLowerCase().includes(search.toLowerCase()))
    : baseItems;

  const categoriesWithData = menuCategories.filter((cat) =>
    filteredItems.some((i) => i.category === cat)
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
          {/* Search bar and translation toggle */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-10">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-are-primary/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for a dish..."
                className="w-full bg-white border border-are-primary/10 rounded-full pl-11 pr-4 py-3 text-are-primary text-sm focus:border-are-gold focus:outline-none transition-colors shadow-sm"
              />
            </div>
            <button
              onClick={() => setShowNigerian((v) => !v)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-label font-semibold tracking-wider transition-all ${showNigerian ? 'bg-are-gold text-are-black' : 'bg-white border border-are-primary/10 text-are-primary hover:border-are-gold'}`}
            >
              <Languages className="w-4 h-4" />
              {showNigerian ? 'English' : 'Yoruba'}
            </button>
          </div>

          <p className="text-center text-are-primary/50 text-sm mb-10 max-w-2xl mx-auto">
            {typeFilter
              ? `Showing dishes from our Chef Selection. Browse and order — we cook fresh to order!`
              : `Browse our full menu of authentic West African dishes. To place an order, check out today's available meal on the homepage — we cook fresh to order!`}
          </p>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-are-primary/5 animate-pulse">
                  <div className="h-40 bg-are-primary/5 rounded-xl mb-4" />
                  <div className="h-5 bg-are-primary/5 rounded w-2/3 mb-3" />
                  <div className="h-4 bg-are-primary/5 rounded w-1/3 mb-4" />
                </div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <p className="text-center text-are-primary/50 py-20">No dishes found. Try a different search!</p>
          ) : (
            <div className="space-y-16">
              {categoriesWithData.map((category) => (
                <div key={category}>
                  <div className="flex items-center gap-4 mb-8">
                    <div>
                      <h2 className="font-heading text-2xl sm:text-3xl font-bold text-are-primary">{category}</h2>
                      {showNigerian && categoryTranslations[category] && (
                        <p className="font-heading text-base italic text-are-gold mt-1">{categoryTranslations[category]}</p>
                      )}
                    </div>
                    <div className="flex-1 h-px bg-are-primary/10" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.filter((i) => i.category === category).map((item, i) => (
                      <Reveal key={item.id} delay={i * 50}>
                        <MenuItemCard item={item} showNigerian={showNigerian} />
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

function MenuItemCard({ item, showNigerian }: { item: MenuItem; showNigerian: boolean }) {
  const sizes = item.sizes_available;
  const [selectedSize, setSelectedSize] = useState<string | null>(sizes && sizes.length > 0 ? sizes[0] : null);
  const displayPrice = getPriceForSize(item, selectedSize);

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
            <p className="text-[10px] font-label tracking-wider text-are-primary/40 mb-1.5">Sizes:</p>
            <div className="flex gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${selectedSize === size ? 'bg-are-gold text-are-black' : 'bg-are-primary/5 text-are-primary/60 hover:bg-are-primary/10'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto pt-3">
          {displayPrice !== null ? (
            <span className="font-heading text-2xl font-bold text-are-gold">€{displayPrice.toFixed(2)}</span>
          ) : (
            <span className="font-heading text-lg italic text-are-primary/50">Price on request</span>
          )}
        </div>
      </div>
    </div>
  );
}
