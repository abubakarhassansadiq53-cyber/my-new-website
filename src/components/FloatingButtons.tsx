import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ShoppingBag, UtensilsCrossed } from 'lucide-react';
import { site } from '@/data/site';
import { useCart } from '@/context/CartContext';

export default function FloatingButtons() {
  const navigate = useNavigate();
  const { totalItems, openCart } = useCart();
  const [showOrder, setShowOrder] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowOrder(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <button
        onClick={() => navigate('/menu')}
        className={`fixed bottom-6 left-6 z-40 bg-are-paprika text-are-ivory font-label text-xs font-semibold tracking-wider px-5 py-3 rounded-full shadow-lg shadow-are-paprika/30 hover:scale-105 hover:bg-are-paprika/90 transition-all duration-300 flex items-center gap-2 ${
          showOrder ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <UtensilsCrossed className="w-4 h-4" />
        Start an Order
      </button>

      <button
        onClick={openCart}
        className="fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full bg-are-gold text-are-black shadow-lg shadow-are-gold/30 hover:scale-110 transition-all duration-300 flex items-center justify-center"
        aria-label="Open cart"
      >
        <ShoppingBag className="w-6 h-6" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-are-paprika text-are-ivory text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center font-label border-2 border-are-black">
            {totalItems}
          </span>
        )}
      </button>

      <a
        href={site.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 hover:scale-110 transition-all duration-300 flex items-center justify-center animate-pulseRing"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="w-7 h-7" fill="currentColor" />
      </a>
    </>
  );
}
