import { site } from '@/data/site';

const marqueeItems = [
  'Authentic Nigerian & West African Cuisine in Tallinn',
  `Tel ${site.phone}`,
  site.addressShort,
  'Order via WhatsApp or Email',
  'Tastes like Love',
  'A Taste of West Africa, Right Here',
];

const marqueeText = marqueeItems.join('  —  ');

export default function AnnouncementBar() {
  return (
    <div className="bg-are-gold text-are-black overflow-hidden py-2 relative z-[60]">
      <div className="flex whitespace-nowrap animate-marquee">
        <span className="font-label text-[11px] font-semibold tracking-wide px-8">{marqueeText}</span>
        <span className="font-label text-[11px] font-semibold tracking-wide px-8" aria-hidden="true">{marqueeText}</span>
      </div>
    </div>
  );
}
