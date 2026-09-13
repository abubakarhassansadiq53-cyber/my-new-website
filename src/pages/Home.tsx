import { Link } from 'react-router-dom';
import { ArrowRight, Star, UtensilsCrossed, Carrot, MessageCircle, MapPin, BookOpen, Users, Heart } from 'lucide-react';
import HeroCarousel from '@/components/HeroCarousel';
import Reveal from '@/components/Reveal';
import SectionTitle from '@/components/SectionTitle';
import { menuItems } from '@/data/menu';
import { galleryImages, aboutValueCards, site } from '@/data/site';
import { useCart } from '@/context/CartContext';

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

export default function Home() {
  const { addItem } = useCart();
  const featuredItems = menuItems.filter((i) => i.popular).slice(0, 4);
  const previewGallery = galleryImages.slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <HeroCarousel />

      {/* Badges strip */}
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

      {/* Featured Menu */}
      <section className="py-20 bg-are-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="Chef's Selection"
            title="Most Loved"
            italicPart="Dishes"
            subtitle="Discover the flavours that keep our guests coming back for more."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {featuredItems.map((item, i) => (
              <Reveal key={item.id} delay={i * 100}>
                <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-are-primary/5 flex gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-heading text-xl font-semibold text-are-primary">{item.name}</h3>
                      <span className="font-heading text-lg font-bold text-are-gold whitespace-nowrap ml-4">€{item.price}</span>
                    </div>
                    <p className="text-sm text-are-primary/60 mb-4">{item.description}</p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => addItem(item)}
                        className="bg-are-primary hover:bg-are-primary/90 text-are-ivory font-label text-xs font-semibold tracking-wider px-5 py-2.5 rounded-full transition-all duration-300 hover:scale-105"
                      >
                        Add to Order
                      </button>
                      <div className="flex gap-1.5">
                        {item.popular && (
                          <span className="flex items-center gap-1 text-[10px] font-label text-are-gold bg-are-gold/10 px-2 py-1 rounded-full">
                            <Star className="w-3 h-3 fill-are-gold" /> Popular
                          </span>
                        )}
                        {item.spicy && <span className="text-[10px] font-label text-are-paprika bg-are-paprika/10 px-2 py-1 rounded-full">Spicy</span>}
                        {item.vegetarian && <span className="text-[10px] font-label text-are-indigo bg-are-indigo/10 px-2 py-1 rounded-full">Veg</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
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

      {/* About preview */}
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

      {/* Gallery preview */}
      <section className="py-20 bg-are-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="Gallery"
            title="A Feast for"
            italicPart="the Eyes"
            subtitle="A glimpse of the vibrant dishes and warm moments at ARE."
          />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-12">
            {previewGallery.map((img, i) => (
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
              to="/gallery"
              className="inline-flex items-center gap-2 border-2 border-are-primary text-are-primary hover:bg-are-primary hover:text-are-ivory font-label text-sm font-semibold tracking-wider px-8 py-3.5 rounded-full transition-all duration-300"
            >
              View Full Gallery <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
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
