import { useState } from 'react';
import { X, Plus, Minus, Trash2, MessageCircle, Truck, Store } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { site } from '@/data/site';

type FulfilmentMethod = 'pickup' | 'delivery';

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
  const [orderSent, setOrderSent] = useState(false);
  const [method, setMethod] = useState<FulfilmentMethod>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  const handleWhatsAppOrder = () => {
    const orderText = items
      .map((item) => `${item.quantity}x ${item.name} — €${(item.price * item.quantity).toFixed(2)}`)
      .join('\n');
    const fulfilment = method === 'delivery'
      ? `Delivery\nAddress: ${deliveryAddress || 'Address to be confirmed on WhatsApp'}`
      : 'Pick-up from Nelgi tn 29, Tallinn';
    const message = [
      'Hello ARE, I would like to place an order.',
      '',
      orderText,
      '',
      `Total: €${totalPrice.toFixed(2)}`,
      fulfilment,
      '',
      'Thank you!',
    ].join('\n');

    window.open(`${site.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
    setOrderSent(true);
    setTimeout(() => {
      setOrderSent(false);
      clearCart();
      closeCart();
    }, 2000);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-are-black/60 z-[70] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={closeCart}
      />

      <div
        className={`fixed top-0 right-0 bottom-0 w-full max-w-md bg-are-ivory z-[80] shadow-2xl transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="bg-are-primary text-are-ivory px-6 py-5 flex items-center justify-between">
          <div>
            <h3 className="font-heading text-xl font-bold">Your Order</h3>
            <p className="text-are-ivory/60 text-xs mt-1">Choose pickup or delivery below.</p>
          </div>
          <button onClick={closeCart} className="text-are-ivory/70 hover:text-are-gold transition-colors" aria-label="Close cart">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-full bg-are-primary/10 flex items-center justify-center mb-4">
                <Store className="w-8 h-8 text-are-primary/40" />
              </div>
              <p className="font-heading text-lg text-are-primary mb-2">Your cart is empty</p>
              <p className="text-sm text-are-primary/60">Browse the menu and add your favourite dishes.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 pb-4 border-b border-are-primary/10">
                  <div className="flex-1">
                    <h4 className="font-heading text-base text-are-primary font-semibold">{item.name}</h4>
                    <p className="text-xs text-are-primary/60 mb-2">€{item.price.toFixed(2)} each</p>
                    <div className="flex items-center gap-3">
                      <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 rounded-full bg-are-primary/10 hover:bg-are-primary/20 flex items-center justify-center transition-colors" aria-label={`Decrease ${item.name}`}>
                        <Minus className="w-3.5 h-3.5 text-are-primary" />
                      </button>
                      <span className="font-label text-sm font-semibold w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 rounded-full bg-are-primary/10 hover:bg-are-primary/20 flex items-center justify-center transition-colors" aria-label={`Increase ${item.name}`}>
                        <Plus className="w-3.5 h-3.5 text-are-primary" />
                      </button>
                      <button onClick={() => removeItem(item.id)} className="ml-auto text-are-paprika hover:text-are-paprika/70 transition-colors" aria-label={`Remove ${item.name}`}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-heading text-base font-bold text-are-gold">€{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-are-primary/10 px-6 py-5 bg-are-ivory">
            <p className="font-label text-[10px] tracking-wider text-are-primary/60 mb-3">Fulfilment method</p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <button
                onClick={() => setMethod('pickup')}
                className={`rounded-xl border px-3 py-3 flex items-center gap-2 text-left transition-colors ${method === 'pickup' ? 'border-are-gold bg-are-gold/10 text-are-primary' : 'border-are-primary/15 text-are-primary/60'}`}
              >
                <Store className="w-4 h-4 shrink-0" />
                <span className="text-xs font-semibold">Pick up</span>
              </button>
              <button
                onClick={() => setMethod('delivery')}
                className={`rounded-xl border px-3 py-3 flex items-center gap-2 text-left transition-colors ${method === 'delivery' ? 'border-are-gold bg-are-gold/10 text-are-primary' : 'border-are-primary/15 text-are-primary/60'}`}
              >
                <Truck className="w-4 h-4 shrink-0" />
                <span className="text-xs font-semibold">Delivery</span>
              </button>
            </div>
            {method === 'delivery' && (
              <input
                value={deliveryAddress}
                onChange={(event) => setDeliveryAddress(event.target.value)}
                className="form-input mb-4"
                placeholder="Delivery address"
                aria-label="Delivery address"
              />
            )}
            <div className="flex items-center justify-between mb-4">
              <span className="font-label text-sm text-are-primary/70">Food total</span>
              <span className="font-heading text-2xl font-bold text-are-primary">€{totalPrice.toFixed(2)}</span>
            </div>
            <button
              onClick={handleWhatsAppOrder}
              disabled={orderSent || (method === 'delivery' && !deliveryAddress.trim())}
              className="w-full bg-[#25D366] hover:bg-[#1da851] text-white font-label text-sm font-semibold tracking-wider py-3.5 rounded-full transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <MessageCircle className="w-5 h-5" fill="currentColor" />
              {orderSent ? 'Opening WhatsApp...' : 'Send Order via WhatsApp'}
            </button>
            <button onClick={clearCart} className="w-full mt-2 text-are-primary/50 hover:text-are-paprika text-xs font-label transition-colors py-2">
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
