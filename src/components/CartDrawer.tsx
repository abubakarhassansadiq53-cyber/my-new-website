import { useState } from 'react';
import { X, Plus, Minus, Trash2, MessageCircle, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { site } from '@/data/site';
import { supabase } from '@/lib/supabase';

type OrderType = 'Dine In' | 'Collection' | 'Delivery';

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
  const [notes, setNotes] = useState('');
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  const handleWhatsAppOrder = () => {
    const orderLines = items.map(
      (i) => {
        const addonText = i.selectedAddOns && i.selectedAddOns.length > 0 ? ` (Add-ons: ${i.selectedAddOns.map(a => a.name).join(', ')})` : '';
        return `${i.quantity}x ${i.name}${i.selectedSize ? ` (${i.selectedSize})` : ''}${addonText} — €${((i.unitPrice + (i.selectedAddOns?.reduce((s, a) => s + a.price, 0) ?? 0)) * i.quantity).toFixed(2)}`;
      }
    );
    const message =
      `Hi African Restaurant Estonia!\n\nI'd like to place an order:\n\n${orderLines.join('\n')}\n\nOrder Total: €${totalPrice.toFixed(2)}\nSpecial requests: ${notes || 'None'}\n\nPlease confirm. Thank you!`;
    window.open(`${site.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-are-black/60 z-[70] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={closeCart}
      />
      <div
        className={`fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#321B29] z-[80] shadow-2xl transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="px-6 py-5 flex items-center justify-between border-b border-are-ivory/10">
          <h3 className="font-heading text-xl font-bold text-are-gold">Your Order</h3>
          <button onClick={closeCart} className="text-are-ivory/60 hover:text-are-gold transition-colors" aria-label="Close cart">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-full bg-are-ivory/5 flex items-center justify-center mb-4">
                <MessageCircle className="w-8 h-8 text-are-ivory/30" />
              </div>
              <p className="font-heading text-lg text-are-ivory mb-2">Your cart is empty</p>
              <p className="text-sm text-are-ivory/50">Browse the menu and add your favourite dishes.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const addonTotal = (item.selectedAddOns ?? []).reduce((s, a) => s + a.price, 0);
                return (
                  <div key={item.cartId} className="flex gap-3 pb-4 border-b border-are-ivory/10">
                    <div className="flex-1">
                      <h4 className="font-heading text-base text-are-ivory font-semibold">{item.name}</h4>
                      {item.selectedSize && <p className="text-xs text-are-gold/70 mb-1">Size: {item.selectedSize}</p>}
                      {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                        <p className="text-xs text-are-ivory/50 mb-1">Add-ons: {item.selectedAddOns.map(a => a.name).join(', ')}</p>
                      )}
                      <p className="text-xs text-are-ivory/40 mb-2">€{(item.unitPrice + addonTotal).toFixed(2)} each</p>
                      <div className="flex items-center gap-3">
                        <button onClick={() => updateQuantity(item.cartId, -1)} className="w-7 h-7 rounded-full bg-are-ivory/10 hover:bg-are-ivory/20 flex items-center justify-center transition-colors" aria-label={`Decrease ${item.name}`}>
                          <Minus className="w-3.5 h-3.5 text-are-ivory" />
                        </button>
                        <span className="font-label text-sm font-semibold w-6 text-center text-are-ivory">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.cartId, 1)} className="w-7 h-7 rounded-full bg-are-ivory/10 hover:bg-are-ivory/20 flex items-center justify-center transition-colors" aria-label={`Increase ${item.name}`}>
                          <Plus className="w-3.5 h-3.5 text-are-ivory" />
                        </button>
                        <button onClick={() => removeItem(item.cartId)} className="ml-auto text-are-paprika hover:text-are-paprika/70 transition-colors" aria-label={`Remove ${item.name}`}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-heading text-base font-bold text-are-gold">€{((item.unitPrice + addonTotal) * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-are-ivory/10 px-6 py-5 bg-[#321B29]">
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
              className="w-full bg-are-ivory/5 text-are-ivory placeholder:text-are-ivory/30 text-sm rounded-xl px-4 py-3 resize-none border border-are-ivory/10 focus:border-are-gold focus:outline-none transition-colors mb-4"
              placeholder="Special requests or dietary requirements?" />

            <div className="flex items-center justify-between mb-4">
              <span className="font-label text-sm text-are-ivory/70">Order total</span>
              <span className="font-heading text-2xl font-bold text-are-gold">€{totalPrice.toFixed(2)}</span>
            </div>

            <button onClick={handleWhatsAppOrder}
              className="w-full bg-[#25D366] hover:bg-[#1da851] text-white font-label text-sm font-semibold tracking-wider py-3.5 rounded-full transition-all duration-300 flex items-center justify-center gap-2 mb-2">
              <MessageCircle className="w-5 h-5" fill="currentColor" /> Order via WhatsApp
            </button>

            <button onClick={() => setEmailModalOpen(true)}
              className="w-full bg-[#B9472E] hover:bg-[#B9472E]/90 text-are-ivory font-label text-sm font-semibold tracking-wider py-3.5 rounded-full transition-all duration-300 flex items-center justify-center gap-2 mb-2">
              <Mail className="w-5 h-5" /> Order via Email
            </button>

            <button onClick={clearCart} className="w-full text-are-ivory/40 hover:text-are-paprika text-xs font-label transition-colors py-2">
              Clear cart
            </button>
          </div>
        )}
      </div>

      {emailModalOpen && (
        <EmailCheckoutModal items={items} total={totalPrice} notes={notes}
          onClose={() => setEmailModalOpen(false)}
          onSuccess={() => { clearCart(); setNotes(''); setEmailModalOpen(false); }} />
      )}
    </>
  );
}

function EmailCheckoutModal({
  items, total, notes, onClose, onSuccess,
}: {
  items: ReturnType<typeof useCart>['items'];
  total: number;
  notes: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [orderType, setOrderType] = useState<OrderType>('Collection');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [preferredDateTime, setPreferredDateTime] = useState('');
  const [specialRequests, setSpecialRequests] = useState(notes);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const orderItems = items.map((i) => ({
      name: i.name,
      size: i.selectedSize,
      quantity: i.quantity,
      price: i.unitPrice,
      add_ons: i.selectedAddOns ?? [],
    }));

    try {
      const { error } = await supabase.from('orders').insert({
        customer_name: fullName,
        customer_phone: phone,
        customer_email: email,
        order_type: orderType,
        delivery_address: orderType === 'Delivery' ? deliveryAddress : null,
        preferred_datetime: preferredDateTime || null,
        order_items: orderItems,
        order_total: total,
        special_requests: specialRequests || null,
        status: 'new',
      });

      if (error) throw error;
      setStatus('success');
      setTimeout(onSuccess, 4000);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="fixed inset-0 z-[90] flex items-center justify-center bg-are-black/70 px-4" onClick={onSuccess}>
        <div className="bg-are-ivory rounded-2xl p-8 max-w-md w-full text-center" onClick={(e) => e.stopPropagation()}>
          <div className="w-16 h-16 rounded-full bg-are-gold/15 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-8 h-8 text-are-gold" />
          </div>
          <h3 className="font-heading text-2xl font-bold text-are-primary mb-2">Order Received!</h3>
          <p className="text-are-primary/60 text-sm">Thank you {fullName}! Check your email for confirmation. Tastes Heavenly awaits!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-are-black/70 px-4 py-8 overflow-y-auto" onClick={onClose}>
      <div className="bg-are-ivory rounded-2xl p-6 sm:p-8 max-w-lg w-full my-auto max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading text-2xl font-bold text-are-primary">Confirm Your Order</h3>
          <button onClick={onClose} className="text-are-primary/40 hover:text-are-primary transition-colors" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {status === 'error' && (
          <div className="bg-are-paprika/10 border border-are-paprika/20 rounded-xl p-4 flex gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-are-paprika shrink-0 mt-0.5" />
            <div>
              <p className="text-are-paprika text-sm font-semibold">Couldn't submit order</p>
              <p className="text-are-paprika/80 text-xs mt-1">{errorMsg}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField label="Full Name" required>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="form-input" placeholder="Your name" />
            </FormField>
            <FormField label="Phone" required>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="form-input" placeholder="+372 ..." />
            </FormField>
          </div>

          <FormField label="Email" required>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="form-input" placeholder="you@example.com" />
          </FormField>

          <div>
            <label className="block font-label text-[10px] tracking-wider text-are-primary/60 mb-2">Order type</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Dine In', 'Collection', 'Delivery'] as OrderType[]).map((type) => (
                <button key={type} type="button" onClick={() => setOrderType(type)}
                  className={`px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${orderType === type ? 'bg-are-gold text-are-black' : 'bg-are-primary/5 text-are-primary/60 hover:bg-are-primary/10'}`}>
                  {type}
                </button>
              ))}
            </div>
          </div>

          {orderType === 'Delivery' && (
            <FormField label="Delivery address" required>
              <input type="text" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} required className="form-input" placeholder="Street, city" />
            </FormField>
          )}

          <FormField label="Preferred date & time">
            <input type="datetime-local" value={preferredDateTime} onChange={(e) => setPreferredDateTime(e.target.value)} className="form-input" />
          </FormField>

          <FormField label="Special requests">
            <textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} rows={2} className="form-input resize-none" placeholder="Any dietary requirements, allergies, etc." />
          </FormField>

          <div className="bg-are-primary/5 rounded-xl p-4">
            <p className="font-label text-[10px] tracking-wider text-are-primary/50 mb-2">Order summary</p>
            <div className="space-y-1">
              {items.map((item) => {
                const addonTotal = (item.selectedAddOns ?? []).reduce((s, a) => s + a.price, 0);
                return (
                  <div key={item.cartId} className="flex justify-between text-sm text-are-primary/70">
                    <span>{item.quantity}x {item.name}{item.selectedSize ? ` (${item.selectedSize})` : ''}{item.selectedAddOns && item.selectedAddOns.length > 0 ? ` +${item.selectedAddOns.map(a => a.name).join('/')}` : ''}</span>
                    <span>€{((item.unitPrice + addonTotal) * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between font-heading font-bold text-are-primary pt-2 mt-2 border-t border-are-primary/10">
              <span>Total</span>
              <span className="text-are-gold">€{total.toFixed(2)}</span>
            </div>
          </div>

          <button type="submit" disabled={status === 'submitting'}
            className="w-full bg-are-gold hover:bg-are-gold/90 text-are-black font-label text-sm font-semibold tracking-wider py-4 rounded-full transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed">
            {status === 'submitting' ? 'Submitting...' : 'Confirm My Order'}
          </button>
        </form>
      </div>
    </div>
  );
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-label text-[10px] tracking-wider text-are-primary/60 mb-2">
        {label} {required && <span className="text-are-paprika">*</span>}
      </label>
      {children}
    </div>
  );
}
