import { useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, UtensilsCrossed, Heart, Users, CalendarDays } from 'lucide-react';
import Reveal from '@/components/Reveal';
import SectionTitle from '@/components/SectionTitle';
import { cateringImages, site } from '@/data/site';
import { Link } from 'react-router-dom';

export default function Catering() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const nextImage = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % cateringImages.length));
  }, []);
  const prevImage = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? null : (prev - 1 + cateringImages.length) % cateringImages.length));
  }, []);

  const cateringFeatures = [
    { icon: Users, title: 'Events & Gatherings', text: 'From intimate dinners to large celebrations — we cater for all occasions with authentic West African flavours.' },
    { icon: CalendarDays, title: 'Pre-order Required', text: 'All catering orders must be placed at least 48 hours in advance so we can prepare everything fresh.' },
    { icon: Heart, title: 'Custom Menus', text: 'Tell us your vision and dietary needs — we will build a bespoke menu that brings West Africa to your table.' },
  ];

  return (
    <div className="pt-20">
      <section className="bg-are-primary py-16 kente-overlay">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionTitle
            eyebrow="Catering"
            title="A Feast for"
            italicPart="Every Occasion"
            subtitle="Authentic West African catering — bringing bold flavours and warm moments to your events."
            light
          />
        </div>
      </section>

      <section className="py-16 bg-are-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {cateringFeatures.map((feature, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-are-primary/5 h-full text-center">
                  <div className="w-14 h-14 rounded-full bg-are-gold/15 flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-7 h-7 text-are-gold" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-are-primary mb-2">{feature.title}</h3>
                  <p className="text-sm text-are-primary/60 leading-relaxed">{feature.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <SectionTitle
            eyebrow="Our Work"
            title="A Feast for"
            italicPart="the Eyes"
            subtitle="A glimpse of the vibrant dishes and catering moments from ARE."
          />
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4 mt-12">
            {cateringImages.map((img, i) => (
              <Reveal key={i} delay={(i % 6) * 60}>
                <button
                  onClick={() => setLightboxIndex(i)}
                  className="group relative w-full overflow-hidden rounded-xl block break-inside-avoid"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    style={{ aspectRatio: i % 3 === 0 ? '4/5' : i % 3 === 1 ? '4/3' : '1/1' }}
                  />
                  <div className="absolute inset-0 bg-are-primary/0 group-hover:bg-are-primary/40 transition-colors duration-300 flex items-center justify-center">
                    <span className="text-are-ivory opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-heading text-lg">
                      View
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-are-black/50 text-are-ivory/60 text-[8px] font-label px-2 py-1 rounded-full pointer-events-none">
                    {img.label}
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-are-primary kente-overlay">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Reveal>
            <div className="w-16 h-16 rounded-full bg-are-gold/15 flex items-center justify-center mx-auto mb-6">
              <UtensilsCrossed className="w-8 h-8 text-are-gold" />
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-are-ivory mb-4">
              Ready to book catering?
            </h2>
            <p className="text-are-ivory/70 text-lg mb-8">
              Use our reservation form to request a cooking service for your special occasion. Tell us the date, number of guests, and any special requests.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-are-gold hover:bg-are-gold/90 text-are-black font-label text-sm font-semibold tracking-wider px-8 py-3.5 rounded-full transition-all duration-300 hover:scale-105"
            >
              Book Catering Service
            </Link>
          </Reveal>
        </div>
      </section>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[90] bg-are-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-are-ivory/70 hover:text-are-gold transition-colors z-10"
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-are-ivory/10 hover:bg-are-gold text-are-ivory hover:text-are-black flex items-center justify-center transition-all duration-300"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-are-ivory/10 hover:bg-are-gold text-are-ivory hover:text-are-black flex items-center justify-center transition-all duration-300"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="border-4 border-are-gold rounded-2xl overflow-hidden max-w-3xl max-h-[80vh] mx-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={cateringImages[lightboxIndex].src.replace('w=800', 'w=1200')}
              alt={cateringImages[lightboxIndex].alt}
              className="max-w-full max-h-[80vh] object-contain"
            />
            <div className="bg-are-primary text-center py-3">
              <p className="text-are-ivory font-heading text-lg">{cateringImages[lightboxIndex].alt}</p>
              <p className="text-are-ivory/50 text-xs font-label mt-1">{cateringImages[lightboxIndex].label}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
