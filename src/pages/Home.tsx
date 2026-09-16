import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, UtensilsCrossed, Carrot, MessageCircle, MapPin, BookOpen, Users, Heart, Plus, Flame, Calendar, Leaf } from 'lucide-react';
import HeroCarousel from '@/components/HeroCarousel';
import Reveal from '@/components/Reveal';
import SectionTitle from '@/components/SectionTitle';
import type { MenuItem } from '@/data/menu';
import type { ChefSpecial } from '@/data/menu';
import { chefSpecialTypes } from '@/data/menu';
import { cateringImages, aboutValueCards, site } from '@/data/site';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';

const badges = [
  { icon: UtensilsCrossed, text: 'Authentic West African Cuisine' },
  { icon: Carrot, text: 'Fresh Ingredients Daily' },
  { icon: MessageCircle, text: 'Order via WhatsApp' },
  { icon: MapPin, text: 'Nelgi tn 29, Tallinn' },
];

const valueIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  Carrot,
  Users,
  Heart,
};

const SIZE_PRICES: Record<string, number> = { Small: 8, Medium: 12, Large: 16 };

const specialTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  special_edition: Star,
  todays_menu: Calendar,
  combo_meal: Flame,
  vegan_option: Leaf,
};

function getDisplayPrice(item: MenuItem): number | null {
  if (item.price !== null) return item.price;
  if (item.sizes_available && item.sizes_available.length > 0) {
    const firstSize = item.sizes_available[0];
    return SIZE_PRICES[firstSize] ?? null;
  }
  return null;
}

export default function Home() {
  const { addItem } = useCart();
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
  const [chefSpecials, setChefSpecials] = useState<ChefSpecial[]>([]);
  const [todaysMeal, setTodaysMeal] = useState<ChefSpecial | null>(null);
  const previewCatering = cateringImages.slice(0, 6);

  useEffect(() => {
    const fetchFeatured = async () => {
      const { data } = await supabase
        .from('menu_items')
        .select('*')
        .eq('available', true)
        .eq('featured', true)
        .order('sort_order', { ascending: true })
        .limit(4);
      setFeaturedItems((data as MenuItem[]) ?? []);
    };
    fetchFeatured();

    const fetchChefSpecials = async () => {
      const { data } = await supabase
        .from('chef_specials')
        .select('*')
        .eq('available', true)
        .order('sort_order', { ascending: true });
      const all = (data as ChefSpecial[]) ?? [];
      setChefSpecials(all);
      const todays = all.find((s) => s.is_todays_meal && s.special_type === 'todays_menu') ?? null;
      setTodaysMeal(todays);
    };
    fetchChefSpecials();
  }, []);

  return (
    <div>
      <HeroCarousel />

      <div className="bg-are-primary py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {badges.map((badge, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="flex items-center gap-3 justify-center lg:justify-start">
                  <badge.icon className="w-5 h-5 text-are-gold" />
                  <span className="font-label text-xs sm:text-sm text-are-ivory/80 tracking-wide">{badge.text}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* Chef Special Section with 4 subsections */}
      <section className="py-20 bg-are-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="Chef Special"
            title="Our Signature"
            italicPart="Dishes"
            subtitle="Tastes like Love — Made with passion every day"
          />

          {/* Today's Meal highlight */}
          {todaysMeal && (
            <Reveal>
              <div className="mt-10 mb-12 bg-gradient-to-r from-are-primary to-[#321B29] rounded-2xl overflow-hidden shadow-lg">
                <div className="grid md:grid-cols-2 gap-0 items-center">
                  <div className="p-8 sm:p-10 text-are-ivory">
                    <span className="inline-flex items-center gap-2 bg-are-gold text-are-black text-[10px] font-label font-bold px-3 py-1.5 rounded-full mb-4">
                      <Calendar className="w-3 h-3" /> Today's Meal
                    </span>
                    <h3 className="font-heading text-3xl font-bold mb-3">{todaysMeal.name}</h3>
                    {todaysMeal.description && <p className="text-are-ivory/70 text-sm mb-4">{todaysMeal.description}</p>}
                    <div className="flex items-center gap-4">
                      <span className="font-heading text-3xl font-bold text-are-gold">€{todaysMeal.price.toFixed(2)}</span>
                      <Link to="/contact" className="bg-are-gold hover:bg-are-gold/90 text-are-black font-label text-xs font-semibold tracking-wider px-6 py-3 rounded-full transition-all hover:scale-105">
                        Order Now
                      </Link>
                    </div>
                  </div>
                  <div className="h-full min-h-[200px] bg-are-gold/10 flex items-center justify-center">
                    {todaysMeal.image_url ? (
                      <img src={todaysMeal.image_url} alt={todaysMeal.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-are-ivory/20 font-label text-sm">[Photo: {todaysMeal.name}]</span>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>
          )}

          {/* 4 subsections */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {chefSpecialTypes.map((type, i) => {
              const Icon = specialTypeIcons[type.key] ?? Star;
              const items = chefSpecials.filter((s) => s.special_type === type.key && s.available);
              return (
                <Reveal key={type.key} delay={i * 100}>
                  <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-are-primary/5 overflow-hidden flex flex-col h-full">
                    <div className="p-5 border-b border-are-primary/5 bg-gradient-to-br from-are-primary/5 to-are-gold/5">
                      <div className="w-10 h-10 rounded-full bg-are-gold/15 flex items-center justify-center mb-3">
                        <Icon className="w-5 h-5 text-are-gold" />
                      </div>
                      <h3 className="font-heading text-base font-semibold text-are-primary">{type.label}</h3>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      {items.length === 0 ? (
                        <p className="text-sm text-are-primary/40 italic">Coming soon</p>
                      ) : (
                        <div className="space-y-3">
                          {items.slice(0, 3).map((item) => (
                            <div key={item.id} className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-are-primary">{item.name}</p>
                                {item.is_todays_meal && (
                                  <span className="text-[9px] bg-are-gold/20 text-are-gold px-1.5 py-0.5 rounded-full font-label">Today</span>
                                )}
                              </div>
                              <span className="font-heading text-sm font-bold text-are-gold">€{item.price.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <Link to="/contact" className="mt-auto pt-4 text-xs font-label tracking-wider text-are-paprika hover:text-are-primary transition-colors">
                        Order →
                      </Link>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Featured dishes */}
          {featuredItems.length > 0 && (
            <>
              <div className="mt-16 pt-8 border-t border-are-primary/10">
                <h3 className="font-heading text-xl font-semibold text-are-primary mb-6 text-center">Featured Dishes</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredItems.map((item, i) => {
                    const displayPrice = getDisplayPrice(item);
                    const firstSize = item.sizes_available && item.sizes_available.length > 0 ? item.sizes_available[0] : null;
                    return (
                      <Reveal key={item.id} delay={i * 100}>
                        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-are-primary/5 overflow-hidden flex flex-col h-full">
                          <div className="aspect-[4/3] bg-gradient-to-br from-are-primary/5 to-are-gold/5 flex items-center justify-center relative">
                            {item.image_url ? (
                              <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-are-primary/20 font-label text-xs tracking-wider text-center px-4">[Photo: {item.name}]</span>
                            )}
                            <span className="absolute top-3 left-3 flex items-center gap-1 bg-are-gold text-are-black text-[10px] font-label font-bold px-2.5 py-1 rounded-full">
                              <Star className="w-3 h-3 fill-are-black" /> Featured
                            </span>
                          </div>
                          <div className="p-5 flex flex-col flex-1">
                            <h3 className="font-heading text-lg font-semibold text-are-primary mb-1">{item.name}</h3>
                            {item.pairs_with && item.pairs_with.length > 0 && (
                              <p className="text-sm italic text-are-primary/50 mb-3">Pairs with: {item.pairs_with.slice(0, 3).join(', ')}</p>
                            )}
                            <div className="mt-auto">
                              <div className="flex items-center justify-between mb-3">
                                {displayPrice !== null ? (
                                  <span className="font-heading text-xl font-bold text-are-gold">€{displayPrice.toFixed(2)}</span>
                                ) : (
                                  <span className="font-heading text-sm italic text-are-primary/50">Price on request</span>
                                )}
                                {firstSize && <span className="text-[10px] text-are-primary/40">from {firstSize}</span>}
                              </div>
                              <button
                                onClick={() => addItem(item, firstSize, displayPrice ?? 0)}
                                className="w-full bg-[#B9472E] hover:bg-[#B9472E]/90 text-are-ivory font-label text-xs font-semibold tracking-wider py-3 rounded-full transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
                              >
                                <Plus className="w-3.5 h-3.5" /> Add to Order
                              </button>
                            </div>
                          </div>
                        </div>
                      </Reveal>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          <div className="text-center mt-10">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 bg-are-gold hover:bg-are-gold/90 text-are-black font-label text-sm font-semibold tracking-wider px-8 py-3.5 rounded-full transition-all duration-300 hover:scale-105"
            >
              View Full Menu <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-are-primary kente-overlay relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionTitle
                eyebrow="Our Story"
                title="Tastes like"
                italicPart="Love."
                light
                center={false}
              />
              <Reveal>
                <p className="mt-6 text-are-ivory/70 text-lg leading-relaxed">
                  African Restaurant Estonia was born from a simple but powerful dream — to bring the bold, soulful flavours of West Africa to the heart of Tallinn. Every dish we serve carries the warmth of Nigerian kitchens and the love of home-cooked food.
                </p>
              </Reveal>
              <Reveal delay={100}>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 mt-8 border-2 border-are-gold text-are-gold hover:bg-are-gold hover:text-are-black font-label text-sm font-semibold tracking-wider px-8 py-3.5 rounded-full transition-all duration-300"
                >
                  Read Our Story <ArrowRight className="w-4 h-4" />
                </Link>
              </Reveal>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {aboutValueCards.map((card, i) => {
                const Icon = valueIcons[card.icon] ?? BookOpen;
                return (
                  <Reveal key={i} delay={i * 100}>
                    <div className="bg-are-ivory/5 backdrop-blur-sm border border-are-ivory/10 rounded-2xl p-6 hover:bg-are-ivory/10 transition-all duration-300 h-full">
                      <div className="w-12 h-12 rounded-full bg-are-gold/15 flex items-center justify-center mb-3">
                        <Icon className="w-6 h-6 text-are-gold" />
                      </div>
                      <h4 className="font-heading text-lg font-semibold text-are-gold mb-2">{card.title}</h4>
                      <p className="text-sm text-are-ivory/60">{card.text}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-are-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="Catering"
            title="A Feast for"
            italicPart="the Eyes"
            subtitle="A glimpse of the vibrant dishes and warm moments at ARE."
          />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-12">
            {previewCatering.map((img, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="group relative overflow-hidden rounded-xl aspect-[4/3]">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-are-primary/0 group-hover:bg-are-primary/30 transition-colors duration-300" />
                  <div className="absolute bottom-2 right-2 bg-are-black/50 text-are-ivory/60 text-[8px] font-label px-2 py-1 rounded-full pointer-events-none">
                    {img.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/catering"
              className="inline-flex items-center gap-2 border-2 border-are-primary text-are-primary hover:bg-are-primary hover:text-are-ivory font-label text-sm font-semibold tracking-wider px-8 py-3.5 rounded-full transition-all duration-300"
            >
              View Full Catering <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-are-paprika relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-are-gold blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-are-primary blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto px-4 text-center relative">
          <Reveal>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-are-ivory mb-4">
              Ready to taste West Africa?
            </h2>
            <p className="text-are-ivory/80 text-lg mb-8">
              Order via WhatsApp or browse our menu today. {site.tagline}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-are-gold hover:bg-are-gold/90 text-are-black font-label text-sm font-semibold tracking-wider px-8 py-3.5 rounded-full transition-all duration-300 hover:scale-105"
              >
                Order via WhatsApp
              </a>
              <Link
                to="/menu"
                className="border-2 border-are-ivory/60 text-are-ivory hover:border-are-gold hover:text-are-gold font-label text-sm font-semibold tracking-wider px-8 py-3.5 rounded-full transition-all duration-300"
              >
                Browse the Menu
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
