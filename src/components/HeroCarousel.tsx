import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { heroSlides } from '@/data/site';

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const next = useCallback(() => setCurrent((c) => (c + 1) % heroSlides.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + heroSlides.length) % heroSlides.length), []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const handleButtonClick = (link: string, external?: boolean) => {
    if (external) {
      window.open(link, '_blank');
    } else {
      navigate(link);
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-are-primary">
      {heroSlides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.headline.replace('\n', ' ')}
            className={`w-full h-full object-cover ${i === current ? 'animate-kenburns' : ''}`}
          />
          <div className="absolute inset-0 bg-are-primary/65" />
          {/* Upload label */}
          <div className="absolute top-4 right-4 bg-are-black/50 text-are-ivory/60 text-[10px] font-label px-3 py-1.5 rounded-full pointer-events-none">
            {slide.label}
          </div>
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-4">
        <div className="text-center max-w-3xl">
          {heroSlides.map((slide, i) => (
            <div
              key={i}
              className={`transition-all duration-700 ${
                i === current
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8 absolute inset-0 flex items-center justify-center pointer-events-none'
              }`}
            >
              {i === current && (
                <div className="flex flex-col items-center">
                  <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-are-ivory leading-tight whitespace-pre-line mb-6">
                    {slide.headline}
                  </h1>
                  <p className="text-are-ivory/80 text-base sm:text-lg md:text-xl max-w-2xl mb-8 font-body">
                    {slide.subtext}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {slide.buttons.map((btn, bi) => (
                      <button
                        key={bi}
                        onClick={() => handleButtonClick(btn.link, btn.external)}
                        className={`px-8 py-3.5 rounded-full font-label text-sm font-semibold tracking-wider transition-all duration-300 hover:scale-105 ${
                          btn.variant === 'gold'
                            ? 'bg-are-gold text-are-black hover:shadow-lg hover:shadow-are-gold/30'
                            : 'border-2 border-are-ivory/60 text-are-ivory hover:border-are-gold hover:text-are-gold'
                        }`}
                      >
                        {btn.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Dot navigation */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === current ? 'w-8 bg-are-gold' : 'w-2.5 bg-are-ivory/40 hover:bg-are-ivory/70'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Arrow buttons */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-are-black/30 hover:bg-are-gold text-are-ivory hover:text-are-black flex items-center justify-center transition-all duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-are-black/30 hover:bg-are-gold text-are-ivory hover:text-are-black flex items-center justify-center transition-all duration-300"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-are-ivory/50">
        <span className="font-label text-[10px] tracking-wider">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </div>
    </section>
  );
}
