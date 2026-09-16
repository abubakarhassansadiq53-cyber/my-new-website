import { Truck, Store } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div className="bg-are-primary text-are-ivory py-2 relative z-[60] border-b border-are-gold/20">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-6 text-center">
        <span className="flex items-center gap-2 font-label text-[11px] sm:text-xs font-medium tracking-wide text-are-ivory/80">
          <Truck className="w-3.5 h-3.5 text-are-gold shrink-0" />
          Delivery Available
        </span>
        <span className="hidden sm:flex items-center gap-2 font-label text-[11px] sm:text-xs font-medium tracking-wide text-are-ivory/80">
          <Store className="w-3.5 h-3.5 text-are-gold shrink-0" />
          Pick-up Available
        </span>
        <span className="font-label text-[11px] sm:text-xs font-medium tracking-wide text-are-gold/70 italic">
          Not a restaurant — we cook fresh to order
        </span>
      </div>
    </div>
  );
}
