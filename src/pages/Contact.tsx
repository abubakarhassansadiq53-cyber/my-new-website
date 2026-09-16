import { useState } from 'react';
import { ArrowRight, CheckCircle2, Clock3, Mail, MapPin, MessageCircle, Phone, ShoppingBag, Truck, Store, CalendarDays, Users, UtensilsCrossed, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from '@/components/Reveal';
import SectionTitle from '@/components/SectionTitle';
import { site } from '@/data/site';
import { supabase } from '@/lib/supabase';

const steps = [
  { number: '01', title: 'Choose your dishes', text: 'Browse the menu and add everything you want to your cart.' },
  { number: '02', title: 'Select fulfilment', text: 'Choose delivery or pick-up when you review your order.' },
  { number: '03', title: 'Send via WhatsApp', text: 'Your order opens in WhatsApp so we can confirm the details with you.' },
];

const occasionOptions = [
  'Birthday',
  'Anniversary',
  'Corporate Event',
  'Cooking Service Booking',
  'Family Gathering',
  'Other Special Request',
];

export default function Contact() {
  const [showReservation, setShowReservation] = useState(false);

  return (
    <div className="pt-20">
      <section className="bg-are-primary py-16 kente-overlay">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionTitle
            eyebrow="Order from ARE"
            title="Bring West Africa"
            italicPart="Home."
            subtitle="Build your order from our menu, then choose delivery or pick-up at checkout."
            light
          />
        </div>
      </section>

      <section className="py-16 bg-are-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10 items-stretch">
            <Reveal>
              <div className="bg-are-primary rounded-2xl p-8 sm:p-10 text-are-ivory h-full flex flex-col">
                <div className="w-14 h-14 rounded-full bg-are-gold/15 flex items-center justify-center mb-6">
                  <ShoppingBag className="w-7 h-7 text-are-gold" />
                </div>
                <h3 className="font-heading text-3xl font-bold mb-4">Order your way</h3>
                <p className="text-are-ivory/70 leading-relaxed mb-8">
                  Select your favourite Nigerian and West African dishes, add them to your cart, and send your order directly to our team on WhatsApp.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex gap-3 items-start">
                    <Truck className="w-5 h-5 text-are-gold mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold">Delivery</p>
                      <p className="text-sm text-are-ivory/60">Add your address in the cart and we will confirm delivery details.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <Store className="w-5 h-5 text-are-gold mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold">Pick-up</p>
                      <p className="text-sm text-are-ivory/60">Collect your order from Nelgi tn 29, Tallinn.</p>
                    </div>
                  </div>
                </div>
                <Link
                  to="/menu"
                  className="mt-auto inline-flex items-center justify-center gap-2 bg-are-gold hover:bg-are-gold/90 text-are-black font-label text-sm font-semibold tracking-wider px-7 py-3.5 rounded-full transition-all duration-300 hover:scale-[1.02]"
                >
                  Browse the Menu <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-are-primary/5 h-full">
                <p className="font-label text-xs tracking-[0.2em] text-are-gold mb-3">How it works</p>
                <h3 className="font-heading text-3xl font-bold text-are-primary mb-8">From our kitchen to you</h3>
                <div className="space-y-6">
                  {steps.map((step) => (
                    <div key={step.number} className="flex gap-5">
                      <span className="font-heading text-2xl text-are-gold font-bold">{step.number}</span>
                      <div>
                        <h4 className="font-heading text-xl font-semibold text-are-primary mb-1">{step.title}</h4>
                        <p className="text-sm text-are-primary/60 leading-relaxed">{step.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-are-primary/10">
                  <button
                    onClick={() => setShowReservation(true)}
                    className="w-full inline-flex items-center justify-center gap-2 bg-are-primary hover:bg-are-primary/90 text-are-ivory font-label text-sm font-semibold tracking-wider px-5 py-3.5 rounded-full transition-all duration-300 mb-3"
                  >
                    <CalendarDays className="w-4 h-4" /> Book a Reservation or Cooking Service
                  </button>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white font-label text-xs font-semibold tracking-wider px-5 py-3 rounded-full transition-colors">
                      <MessageCircle className="w-4 h-4" fill="currentColor" /> WhatsApp us
                    </a>
                    <a href={`mailto:${site.email}`} className="inline-flex items-center justify-center gap-2 border border-are-primary/20 hover:border-are-gold text-are-primary font-label text-xs font-semibold tracking-wider px-5 py-3 rounded-full transition-colors">
                      <Mail className="w-4 h-4" /> Email us
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-16 bg-are-paprika">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Reveal>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-are-ivory mb-4">Serving Tallinn every day</h2>
            <p className="text-are-ivory/80 mb-8">Order service is available Sunday through Sunday, from 08:00 until 23:45.</p>
            <div className="flex flex-wrap justify-center gap-5 text-are-ivory/90 text-sm">
              <span className="inline-flex items-center gap-2"><Clock3 className="w-4 h-4 text-are-gold" /> 08:00–23:45 daily</span>
              <span className="inline-flex items-center gap-2"><Phone className="w-4 h-4 text-are-gold" /> {site.phone}</span>
              <span className="inline-flex items-center gap-2"><MapPin className="w-4 h-4 text-are-gold" /> {site.addressShort}</span>
            </div>
          </Reveal>
        </div>
      </section>

      {showReservation && (
        <ReservationModal onClose={() => setShowReservation(false)} />
      )}
    </div>
  );
}

function ReservationModal({ onClose }: { onClose: () => void }) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(1);
  const [occasion, setOccasion] = useState('');
  const [reservationType, setReservationType] = useState<'dining' | 'cooking_service'>('dining');
  const [specialRequests, setSpecialRequests] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    try {
      const { error } = await supabase.from('reservations').insert({
        customer_name: fullName,
        customer_phone: phone,
        customer_email: email,
        date: date,
        time: time,
        guests: guests,
        occasion: occasion || null,
        special_requests: specialRequests || null,
        cooking_service: reservationType === 'cooking_service',
        reservation_type: reservationType,
        status: 'pending',
      });

      if (error) throw error;
      setStatus('success');
      setTimeout(onClose, 4000);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="fixed inset-0 z-[90] flex items-center justify-center bg-are-black/70 px-4" onClick={onClose}>
        <div className="bg-are-ivory rounded-2xl p-8 max-w-md w-full text-center" onClick={(e) => e.stopPropagation()}>
          <div className="w-16 h-16 rounded-full bg-are-gold/15 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-8 h-8 text-are-gold" />
          </div>
          <h3 className="font-heading text-2xl font-bold text-are-primary mb-2">Request Received!</h3>
          <p className="text-are-primary/60 text-sm">
            {reservationType === 'cooking_service'
              ? 'Thank you! We will contact you shortly to confirm your cooking service booking.'
              : 'Thank you! We will contact you shortly to confirm your reservation.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-are-black/70 px-4 py-8 overflow-y-auto" onClick={onClose}>
      <div className="bg-are-ivory rounded-2xl p-6 sm:p-8 max-w-lg w-full my-auto max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading text-2xl font-bold text-are-primary">Reservation / Cooking Service</h3>
          <button onClick={onClose} className="text-are-primary/40 hover:text-are-primary transition-colors" aria-label="Close">
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        {status === 'error' && (
          <div className="bg-are-paprika/10 border border-are-paprika/20 rounded-xl p-4 flex gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-are-paprika shrink-0 mt-0.5" />
            <div>
              <p className="text-are-paprika text-sm font-semibold">Couldn't submit request</p>
              <p className="text-are-paprika/80 text-xs mt-1">{errorMsg}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Reservation type toggle */}
          <div>
            <label className="block font-label text-[10px] tracking-wider text-are-primary/60 mb-2">Booking type</label>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setReservationType('dining')}
                className={`flex items-center justify-center gap-2 px-3 py-3 rounded-lg text-xs font-semibold transition-all ${reservationType === 'dining' ? 'bg-are-gold text-are-black' : 'bg-are-primary/5 text-are-primary/60 hover:bg-are-primary/10'}`}>
                <Users className="w-4 h-4" /> Dining
              </button>
              <button type="button" onClick={() => setReservationType('cooking_service')}
                className={`flex items-center justify-center gap-2 px-3 py-3 rounded-lg text-xs font-semibold transition-all ${reservationType === 'cooking_service' ? 'bg-are-gold text-are-black' : 'bg-are-primary/5 text-are-primary/60 hover:bg-are-primary/10'}`}>
                <UtensilsCrossed className="w-4 h-4" /> Cooking Service
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-label text-[10px] tracking-wider text-are-primary/60 mb-2">Full Name *</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="form-input" placeholder="Your name" />
            </div>
            <div>
              <label className="block font-label text-[10px] tracking-wider text-are-primary/60 mb-2">Phone *</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="form-input" placeholder="+372 ..." />
            </div>
          </div>

          <div>
            <label className="block font-label text-[10px] tracking-wider text-are-primary/60 mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" placeholder="you@example.com" />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-label text-[10px] tracking-wider text-are-primary/60 mb-2">Date *</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="form-input" />
            </div>
            <div>
              <label className="block font-label text-[10px] tracking-wider text-are-primary/60 mb-2">Time *</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required className="form-input" />
            </div>
            <div>
              <label className="block font-label text-[10px] tracking-wider text-are-primary/60 mb-2">Guests *</label>
              <input type="number" min="1" max="100" value={guests} onChange={(e) => setGuests(parseInt(e.target.value) || 1)} required className="form-input" />
            </div>
          </div>

          <div>
            <label className="block font-label text-[10px] tracking-wider text-are-primary/60 mb-2">Occasion</label>
            <select value={occasion} onChange={(e) => setOccasion(e.target.value)} className="form-input">
              <option value="">Select an occasion (optional)</option>
              {occasionOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div>
            <label className="block font-label text-[10px] tracking-wider text-are-primary/60 mb-2">
              {reservationType === 'cooking_service' ? 'Special request for your cooking service' : 'Special requests'}
            </label>
            <textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} rows={3}
              className="form-input resize-none"
              placeholder={reservationType === 'cooking_service'
                ? 'Tell us about the event, dietary needs, menu preferences, number of people to cook for, etc.'
                : 'Any dietary requirements, allergies, seating preferences, etc.'} />
          </div>

          <button type="submit" disabled={status === 'submitting'}
            className="w-full bg-are-gold hover:bg-are-gold/90 text-are-black font-label text-sm font-semibold tracking-wider py-4 rounded-full transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed">
            {status === 'submitting' ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
}
