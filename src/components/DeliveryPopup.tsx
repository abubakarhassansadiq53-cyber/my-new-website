import { useState, useEffect } from 'react';
import { Truck, Store, X, Flame, Clock, Heart } from 'lucide-react';

const POPUP_KEY = 'are_delivery_popup_seen';

export default function DeliveryPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem(POPUP_KEY);
    if (!seen) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem(POPUP_KEY, '1');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-are-black/70 px-4 py-8" onClick={handleClose}>
      <div
        className="bg-are-ivory rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative overflow-hidden animate-[fadeIn_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-are-primary/40 hover:text-are-primary transition-colors z-10"
          aria-label="Close popup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="relative h-20 w-20 rounded-full overflow-hidden bg-are-gold/10 ring-2 ring-are-gold/40 mx-auto mb-5"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(216,154,39,0.3))' }}
          >
            <img src="https://i.imgur.com/JHfTvcb.png" alt="ARE" className="h-full w-full object-cover" />
          </div>

          <h2 className="font-heading text-2xl font-bold text-are-primary mb-2">
            We Cook Fresh to Order
          </h2>
          <p className="text-are-primary/60 text-sm mb-6">
            Not a restaurant — every dish is prepared fresh just for you. Here's how to get your meal:
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-are-primary/5 rounded-2xl p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-are-gold/15 flex items-center justify-center mx-auto mb-3">
                <Truck className="w-6 h-6 text-are-gold" />
              </div>
              <h3 className="font-heading text-base font-semibold text-are-primary mb-1">Delivery</h3>
              <p className="text-xs text-are-primary/50">Straight to your door anywhere in Tallinn</p>
            </div>
            <div className="bg-are-primary/5 rounded-2xl p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-are-gold/15 flex items-center justify-center mx-auto mb-3">
                <Store className="w-6 h-6 text-are-gold" />
              </div>
              <h3 className="font-heading text-base font-semibold text-are-primary mb-1">Pick-up</h3>
              <p className="text-xs text-are-primary/50">Collect from Nelgi 30, Tallinn</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-are-primary/5 to-are-gold/5 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Flame className="w-4 h-4 text-are-paprika" />
              <span className="font-heading text-sm font-semibold text-are-primary">Today's Meal Special</span>
            </div>
            <p className="text-xs text-are-primary/60">
              Check the homepage for today's freshly cooked meal — available to order now with add-ons!
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-are-primary/40 mb-6">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> 08:00–23:45 daily
            </span>
            <span className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5" /> Tastes like Love
            </span>
          </div>

          <button
            onClick={handleClose}
            className="w-full bg-are-gold hover:bg-are-gold/90 text-are-black font-label text-sm font-semibold tracking-wider py-3.5 rounded-full transition-all duration-300 hover:scale-[1.02]"
          >
            Got it, let me explore!
          </button>
        </div>
      </div>
    </div>
  );
}
