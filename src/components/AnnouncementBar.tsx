import { Truck, Store } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div className="bg-are-primary py-1 relative z-[60] border-b border-are-gold/20">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-4 sm:gap-6 text-center">
        <span className="flex items-center gap-1.5 font-label text-[10px] sm:text-xs font-medium tracking-wide text-are-ivory">
          <Truck className="w-3 h-3 text-are-gold shrink-0" />
          Delivery
        </span>
        <span className="hidden sm:flex items-center gap-1.5 font-label text-[10px] sm:text-xs font-medium tracking-wide text-are-ivory">
          <Store className="w-3 h-3 text-are-gold shrink-0" />
          Pick-up
        </span>
        <span className="font-label text-[10px] sm:text-xs font-medium tracking-wide text-are-ivory">
          We cook fresh to order
        </span>
      </div>
    </div>
  );
}
