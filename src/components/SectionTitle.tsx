import Reveal from './Reveal';

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  italicPart?: string;
  subtitle?: string;
  light?: boolean;
  center?: boolean;
}

export default function SectionTitle({
  eyebrow,
  title,
  italicPart,
  subtitle,
  light = false,
  center = true,
}: SectionTitleProps) {
  return (
    <Reveal className={center ? 'text-center' : ''}>
      {eyebrow && (
        <p className="font-label text-xs tracking-[0.2em] text-are-gold mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className={`font-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-tight ${light ? 'text-are-ivory' : 'text-are-primary'}`}>
        {title} {italicPart && <span className="italic text-are-gold">{italicPart}</span>}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-base sm:text-lg max-w-2xl ${center ? 'mx-auto' : ''} ${light ? 'text-are-ivory/70' : 'text-are-primary/70'}`}>
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
