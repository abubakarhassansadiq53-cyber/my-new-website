import { useState } from 'react';
import { X, Plus, Minus, Trash2, MessageCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { site } from '@/data/site';

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
  const [orderSent, setOrderSent] = useState(false);

  const handleWhatsAppOrder = () => {
    const orderText = items
      .map((i) => `${i.quantity}x ${i.name} — €${(i.price * i.quantity).toFixed(2)}`)
      .join('%0A');
    const total = `Total: €${totalPrice.toFixed(2)}`;
    const message = `Hello ARE! I'd like to order:%0A%0A${orderText}%0A%0A${total}%0A%0AThank you!`;
    window.open(`${site.whatsapp}?text=${message}`, '_blank');
    setOrderSent(true);
    setTimeout(() => {
      setOrderSent(false);
      clearCart();
      closeCart();
    }, 2000);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-are-black/60 z-[70] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-full max-w-md bg-are-ivory z-[80] shadow-2xl transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="bg-are-primary text-are-ivory px-6 py-5 flex items-center justify-between">
          <h3 className="font-heading text-xl font-bold">Your Order</h3>
          <button onClick={closeCart} className="text-are-ivory/70 hover:text-are-gold transition-colors" aria-label="Close cart">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-full bg-are-primary/10 flex items-center justify-center mb-4">
                <MessageCircle className="w-8 h-8 text-are-primary/40" />
              </div>
              <p className="font-heading text-lg text-are-primary mb-2">Your cart is empty</p>
              <p className="text-sm text-are-primary/60">Browse our menu and add your favourite dishes.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 pb-4 border-b border-are-primary/10">
                  <div className="flex-1">
                    <h4 className="font-heading text-base text-are-primary font-semibold">{item.name}</h4>
                    <p className="text-xs text-are-primary/60 mb-2">€{item.price.toFixed(2)} each</p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-7 h-7 rounded-full bg-are-primary/10 hover:bg-are-primary/20 flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5 text-are-primary" />
                      </button>
                      <span className="font-label text-sm font-semibold w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-7 h-7 rounded-full bg-are-primary/10 hover:bg-are-primary/20 flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5 text-are-primary" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto text-are-paprika hover:text-are-paprika/70 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-heading text-base font-bold text-are-gold">
                      €{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-are-primary/10 px-6 py-5 bg-are-ivory">
            <div className="flex items-center justify-between mb-4">
              <span className="font-label text-sm text-are-primary/70">Total</span>
              <span className="font-heading text-2xl font-bold text-are-primary">€{totalPrice.toFixed(2)}</span>
            </div>
            <button
              onClick={handleWhatsAppOrder}
              disabled={orderSent}
              className="w-full bg-[#25D366] hover:bg-[#1da851] text-white font-label text-sm font-semibold tracking-wider py-3.5 rounded-full transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              <MessageCircle className="w-5 h-5" fill="currentColor" />
              {orderSent ? 'Opening WhatsApp...' : 'Order via WhatsApp'}
            </button>
            <button
              onClick={clearCart}
              className="w-full mt-2 text-are-primary/50 hover:text-are-paprika text-xs font-label transition-colors py-2"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
