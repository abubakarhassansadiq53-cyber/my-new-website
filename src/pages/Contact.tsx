import { useState, FormEvent } from 'react';
import { MessageCircle, Phone, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import Reveal from '@/components/Reveal';
import SectionTitle from '@/components/SectionTitle';
import { site } from '@/data/site';
import { supabase } from '@/lib/supabase';

const timeSlots = [
  '12:00', '12:30', '13:00', '13:30', '14:00',
  '17:00', '17:30', '18:00', '18:30', '19:00',
  '19:30', '20:00', '20:30', '21:00',
];

const occasions = [
  'Just dining',
  'Birthday 🎂',
  'Anniversary 💑',
  'Group event 👥',
  'Business lunch 🤝',
  'Other',
];

interface FormState {
  full_name: string;
  phone: string;
  email: string;
  reservation_date: string;
  reservation_time: string;
  guests: number;
  occasion: string;
  special_requests: string;
}

const initialForm: FormState = {
  full_name: '',
  phone: '',
  email: '',
  reservation_date: '',
  reservation_time: '',
  guests: 1,
  occasion: 'Just dining',
  special_requests: '',
};

export default function Contact() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const { error } = await supabase.from('reservations').insert({
        full_name: form.full_name,
        phone: form.phone,
        email: form.email,
        reservation_date: form.reservation_date,
        reservation_time: form.reservation_time,
        guests: form.guests,
        occasion: form.occasion,
        special_requests: form.special_requests || null,
      });

      if (error) throw error;

      setStatus('success');
      setForm(initialForm);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="bg-are-primary py-16 kente-overlay">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionTitle
            eyebrow="Contact"
            title="Get In"
            italicPart="Touch"
            subtitle="Reserve your table or reach out — we'd love to hear from you."
            light
          />
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-are-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Left — contact info */}
            <Reveal>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-are-primary/5 h-full">
                <h3 className="font-heading text-2xl font-bold text-are-primary mb-6">Reach Us Directly</h3>
                <p className="text-are-primary/60 text-sm mb-8">
                  The fastest way to reach us is WhatsApp — we usually respond within minutes.
                </p>

                <a
                  href={site.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-[#25D366] hover:bg-[#1da851] text-white font-label text-sm font-semibold tracking-wider py-4 rounded-full transition-all duration-300 flex items-center justify-center gap-2 mb-6 hover:scale-[1.02]"
                >
                  <MessageCircle className="w-5 h-5" fill="currentColor" />
                  WhatsApp — Fastest Option
                </a>

                <div className="space-y-5">
                  <a href={`tel:${site.phoneRaw}`} className="flex gap-4 group">
                    <div className="w-11 h-11 rounded-full bg-are-gold/10 flex items-center justify-center shrink-0 group-hover:bg-are-gold/20 transition-colors">
                      <Phone className="w-5 h-5 text-are-gold" />
                    </div>
                    <div>
                      <p className="font-label text-[10px] tracking-wider text-are-primary/50 mb-1">Phone</p>
                      <p className="text-are-primary group-hover:text-are-gold transition-colors">{site.phone}</p>
                    </div>
                  </a>

                  <div className="flex gap-4">
                    <div className="w-11 h-11 rounded-full bg-are-gold/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-are-gold" />
                    </div>
                    <div>
                      <p className="font-label text-[10px] tracking-wider text-are-primary/50 mb-1">Address</p>
                      <p className="text-are-primary">{site.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Right — reservation form */}
            <Reveal delay={100}>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-are-primary/5">
                <h3 className="font-heading text-2xl font-bold text-are-primary mb-6">Reserve a Table</h3>

                {status === 'success' ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 rounded-full bg-are-gold/10 flex items-center justify-center mx-auto mb-5">
                      <CheckCircle2 className="w-8 h-8 text-are-gold" />
                    </div>
                    <h4 className="font-heading text-xl font-bold text-are-primary mb-2">Reservation Sent!</h4>
                    <p className="text-are-primary/60 text-sm mb-6">
                      We've received your reservation request and will confirm shortly.
                    </p>
                    <a
                      href={site.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white font-label text-xs font-semibold tracking-wider px-6 py-3 rounded-full transition-all"
                    >
                      <MessageCircle className="w-4 h-4" fill="currentColor" />
                      Confirm on WhatsApp
                    </a>
                    <button
                      onClick={() => setStatus('idle')}
                      className="block mx-auto mt-4 text-are-primary/50 hover:text-are-primary text-xs font-label"
                    >
                      Make another reservation
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {status === 'error' && (
                      <div className="bg-are-paprika/10 border border-are-paprika/20 rounded-xl p-4 flex gap-3">
                        <AlertCircle className="w-5 h-5 text-are-paprika shrink-0 mt-0.5" />
                        <div>
                          <p className="text-are-paprika text-sm font-semibold">Couldn't send reservation</p>
                          <p className="text-are-paprika/80 text-xs mt-1">{errorMessage}</p>
                          <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="text-are-paprika text-xs underline mt-2 inline-block">
                            Send via WhatsApp instead
                          </a>
                        </div>
                      </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Full Name" required>
                        <input
                          type="text"
                          name="full_name"
                          value={form.full_name}
                          onChange={handleChange}
                          required
                          className="form-input"
                          placeholder="Your name"
                        />
                      </Field>
                      <Field label="Phone Number" required>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          required
                          className="form-input"
                          placeholder="+372 ..."
                        />
                      </Field>
                    </div>

                    <Field label="Email Address" required>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="form-input"
                        placeholder="you@example.com"
                      />
                    </Field>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Date" required>
                        <input
                          type="date"
                          name="reservation_date"
                          value={form.reservation_date}
                          onChange={handleChange}
                          required
                          className="form-input"
                        />
                      </Field>
                      <Field label="Time" required>
                        <select
                          name="reservation_time"
                          value={form.reservation_time}
                          onChange={handleChange}
                          required
                          className="form-input"
                        >
                          <option value="">Select time</option>
                          {timeSlots.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </Field>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Number of Guests" required>
                        <select
                          name="guests"
                          value={form.guests}
                          onChange={handleChange}
                          required
                          className="form-input"
                        >
                          {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                            <option key={n} value={n}>{n}</option>
                          ))}
                          <option value={21}>20+</option>
                        </select>
                      </Field>
                      <Field label="Occasion">
                        <select
                          name="occasion"
                          value={form.occasion}
                          onChange={handleChange}
                          className="form-input"
                        >
                          {occasions.map((o) => (
                            <option key={o} value={o}>{o}</option>
                          ))}
                        </select>
                      </Field>
                    </div>

                    <Field label="Special Requests">
                      <textarea
                        name="special_requests"
                        value={form.special_requests}
                        onChange={handleChange}
                        rows={3}
                        className="form-input resize-none"
                        placeholder="Any dietary requirements, seating preferences, etc."
                      />
                    </Field>

                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="w-full bg-are-gold hover:bg-are-gold/90 text-are-black font-label text-sm font-semibold tracking-wider py-4 rounded-full transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {status === 'submitting' ? 'Sending...' : 'Send Reservation'}
                    </button>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-label text-[10px] tracking-wider text-are-primary/60 mb-2">
        {label} {required && <span className="text-are-paprika">*</span>}
      </label>
      {children}
    </div>
  );
}
