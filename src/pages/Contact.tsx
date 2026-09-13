import { ArrowRight, CheckCircle2, Clock3, Mail, MapPin, MessageCircle, Phone, ShoppingBag, Truck, Store } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from '@/components/Reveal';
import SectionTitle from '@/components/SectionTitle';
import { site } from '@/data/site';

const steps = [
  { number: '01', title: 'Choose your dishes', text: 'Browse the menu and add everything you want to your cart.' },
  { number: '02', title: 'Select fulfilment', text: 'Choose delivery or pick-up when you review your order.' },
  { number: '03', title: 'Send via WhatsApp', text: 'Your order opens in WhatsApp so we can confirm the details with you.' },
];

export default function Contact() {
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
                <div className="mt-8 pt-6 border-t border-are-primary/10 grid sm:grid-cols-2 gap-4">
                  <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white font-label text-xs font-semibold tracking-wider px-5 py-3 rounded-full transition-colors">
                    <MessageCircle className="w-4 h-4" fill="currentColor" /> WhatsApp us
                  </a>
                  <a href={`mailto:${site.email}`} className="inline-flex items-center justify-center gap-2 border border-are-primary/20 hover:border-are-gold text-are-primary font-label text-xs font-semibold tracking-wider px-5 py-3 rounded-full transition-colors">
                    <Mail className="w-4 h-4" /> Email us
                  </a>
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
    </div>
  );
}
