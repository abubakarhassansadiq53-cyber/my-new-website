import { MapPin, Clock, Phone, Smartphone, Mail, Instagram, MessageCircle, Navigation } from 'lucide-react';
import Reveal from '@/components/Reveal';
import SectionTitle from '@/components/SectionTitle';
import { site } from '@/data/site';

const contactItems = [
  { icon: MapPin, label: 'Address', value: site.address },
  { icon: Clock, label: 'Opening Hours', value: 'Open daily 08:00 – 23:45' },
  { icon: Phone, label: 'Phone', value: site.phone, href: `tel:${site.phoneRaw}` },
  { icon: Smartphone, label: 'Mobile', value: site.phone, href: `tel:${site.phoneRaw}` },
  { icon: Mail, label: 'Email', value: site.email, href: `mailto:${site.email}` },
  { icon: Instagram, label: 'Instagram', value: site.instagramHandle, href: site.instagram },
];

export default function Location() {
  return (
    <div className="pt-20">
      {/* Header */}
      <section className="bg-are-primary py-16 kente-overlay">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionTitle
            eyebrow="Location"
            title="Find Us in"
            italicPart="Tallinn"
            subtitle="Visit us at Nelgi tn 29 in Tallinn for authentic West African cuisine."
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
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-are-primary/5">
                <h3 className="font-heading text-2xl font-bold text-are-primary mb-6">Contact Details</h3>
                <div className="space-y-5">
                  {contactItems.map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-11 h-11 rounded-full bg-are-gold/10 flex items-center justify-center shrink-0">
                        <item.icon className="w-5 h-5 text-are-gold" />
                      </div>
                      <div>
                        <p className="font-label text-[10px] tracking-wider text-are-primary/50 mb-1">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="text-are-primary hover:text-are-gold transition-colors break-all">
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-are-primary">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <a
                  href={site.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 w-full bg-[#25D366] hover:bg-[#1da851] text-white font-label text-sm font-semibold tracking-wider py-3.5 rounded-full transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" fill="currentColor" />
                  Message us on WhatsApp
                </a>
              </div>
            </Reveal>

            {/* Right — map */}
            <Reveal delay={100}>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-are-primary/5 h-full flex flex-col">
                <div className="flex-1 min-h-[300px] rounded-xl overflow-hidden">
                  <iframe
                    title="ARE location on Google Maps"
                    src="https://www.google.com/maps?q=Nelgi+tn+29,+11213+Tallinn,+Estonia&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '300px', filter: 'invert(0.9) hue-rotate(180deg) contrast(0.9)' }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=Nelgi+tn+29,+11213+Tallinn,+Estonia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 bg-are-gold hover:bg-are-gold/90 text-are-black font-label text-sm font-semibold tracking-wider py-3.5 rounded-full transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
