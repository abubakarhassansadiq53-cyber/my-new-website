import { useState, useMemo } from 'react';
import { Star, Flame, Leaf, Plus } from 'lucide-react';
import Reveal from '@/components/Reveal';
import SectionTitle from '@/components/SectionTitle';
import { menuItems, menuCategories, type MenuItem } from '@/data/menu';
import { useCart } from '@/context/CartContext';

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const { addItem } = useCart();

  const categories = ['All', ...menuCategories];

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return menuItems;
    return menuItems.filter((i) => i.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="bg-are-primary py-16 kente-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="Our Menu"
            title="Authentic West African"
            italicPart="Flavours"
            subtitle="From smoky Jollof Rice to rich Egusi soup — every dish made fresh with love."
            light
          />
        </div>
      </section>

      {/* Category filter */}
      <div className="sticky top-20 z-30 bg-are-ivory/95 backdrop-blur-sm border-b border-are-primary/10 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide justify-start lg:justify-center">
            {categories.map((cat) => (
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
          {activeCategory === 'All' ? (
            // Group by category
            <div className="space-y-12">
              {menuCategories.map((cat) => {
                const catItems = menuItems.filter((i) => i.category === cat);
                if (catItems.length === 0) return null;
                return (
                  <div key={cat}>
                    <Reveal>
                      <h3 className="font-heading text-2xl font-bold text-are-primary mb-6 pb-3 border-b-2 border-are-gold/30 inline-block">
                        {cat}
                      </h3>
                    </Reveal>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {catItems.map((item, i) => (
                        <Reveal key={item.id} delay={i * 50}>
                          <MenuItemCard item={item} onAdd={addItem} />
                        </Reveal>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

function MenuItemCard({ item, onAdd }: { item: MenuItem; onAdd: (item: MenuItem) => void }) {
  return (
    <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-are-primary/5 flex gap-4">
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-xl font-semibold text-are-primary">{item.name}</h3>
            <div className="flex gap-1">
              {item.popular && <Star className="w-3.5 h-3.5 fill-are-gold text-are-gold" />}
              {item.spicy && <Flame className="w-3.5 h-3.5 text-are-paprika" />}
              {item.vegetarian && <Leaf className="w-3.5 h-3.5 text-are-indigo" />}
            </div>
          </div>
          <span className="font-heading text-lg font-bold text-are-gold whitespace-nowrap ml-4">€{item.price}</span>
        </div>
        <p className="text-sm text-are-primary/60 mb-4">{item.description}</p>
        <button
          onClick={() => onAdd(item)}
          className="bg-are-primary hover:bg-are-primary/90 text-are-ivory font-label text-xs font-semibold tracking-wider px-5 py-2.5 rounded-full transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
        >
          <Plus className="w-3.5 h-3.5" /> Add to Order
        </button>
      </div>
    </div>
  );
}
