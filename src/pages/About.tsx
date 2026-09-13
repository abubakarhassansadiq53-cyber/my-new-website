import { BookOpen, Carrot, Users, Heart } from 'lucide-react';
import Reveal from '@/components/Reveal';
import SectionTitle from '@/components/SectionTitle';
import { aboutStory, aboutValueCards, site } from '@/data/site';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  Carrot,
  Users,
  Heart,
};

export default function About() {
  const storyParagraphs = aboutStory.split('\n\n');

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-are-primary py-16 kente-overlay relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionTitle
            eyebrow="About Us"
            title="Our Story"
            italicPart="Tastes like Love."
            light
          />
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-are-primary">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {storyParagraphs.map((para, i) => (
            <Reveal key={i} delay={i * 100}>
              <p className={`text-are-ivory/70 text-lg leading-relaxed mb-6 ${i === storyParagraphs.length - 1 ? 'font-heading italic text-are-gold text-xl text-center mt-10' : ''}`}>
                {para}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Value cards */}
      <section className="py-20 bg-are-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="What We Stand For"
            title="Our"
            italicPart="Values"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {aboutValueCards.map((card, i) => {
              const Icon = iconMap[card.icon] ?? BookOpen;
              return (
                <Reveal key={i} delay={i * 100}>
                  <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-are-primary/5 text-center h-full hover:-translate-y-1">
                    <div className="w-16 h-16 rounded-full bg-are-gold/10 flex items-center justify-center mx-auto mb-5">
                      <Icon className="w-8 h-8 text-are-gold" />
                    </div>
                    <h4 className="font-heading text-lg font-semibold text-are-primary mb-3">{card.title}</h4>
                    <p className="text-sm text-are-primary/60">{card.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-16 bg-are-paprika">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Reveal>
            <p className="font-heading italic text-are-ivory text-2xl sm:text-3xl">
              "Food is more than just nourishment — it is connection."
            </p>
            <p className="mt-4 font-label text-xs tracking-wider text-are-gold">
              {site.name}
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
