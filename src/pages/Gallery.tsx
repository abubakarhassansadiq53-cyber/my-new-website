import { useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Reveal from '@/components/Reveal';
import SectionTitle from '@/components/SectionTitle';
import { galleryImages } from '@/data/site';

export default function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const nextImage = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % galleryImages.length));
  }, []);
  const prevImage = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? null : (prev - 1 + galleryImages.length) % galleryImages.length));
  }, []);

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="bg-are-primary py-16 kente-overlay">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionTitle
            eyebrow="Gallery"
            title="A Feast for"
            italicPart="the Eyes"
            subtitle="Vibrant dishes, warm moments and the soul of West Africa at ARE."
            light
          />
        </div>
      </section>

      {/* Masonry grid */}
      <section className="py-16 bg-are-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {galleryImages.map((img, i) => (
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

      {/* Lightbox */}
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
              src={galleryImages[lightboxIndex].src.replace('w=800', 'w=1200')}
              alt={galleryImages[lightboxIndex].alt}
              className="max-w-full max-h-[80vh] object-contain"
            />
            <div className="bg-are-primary text-center py-3">
              <p className="text-are-ivory font-heading text-lg">{galleryImages[lightboxIndex].alt}</p>
              <p className="text-are-ivory/50 text-xs font-label mt-1">{galleryImages[lightboxIndex].label}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
