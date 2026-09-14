import { Link } from 'react-router-dom';
import { Instagram, Facebook, MessageCircle, Music2, MapPin, Phone, Mail } from 'lucide-react';
import { site } from '@/data/site';

const exploreLinks = [
  { label: 'Home', path: '/' },
  { label: 'Menu', path: '/menu' },
  { label: 'About', path: '/about' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Location', path: '/location' },
  { label: 'Contact', path: '/contact' },
];

export default function Footer() {
  return (
    <footer className="bg-are-black text-are-ivory pt-16 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-are-ivory/10">
          {/* Column 1 — Brand */}
          <div>
            <img
              src="/ARE'S_LOGO.png"
              alt="African Restaurant Estonia"
              className="w-full max-w-[380px] rounded-md object-contain mb-5"
            />
            <p className="font-heading italic text-are-gold/80 text-lg mb-4">"{site.tagline}"</p>
            <div className="flex gap-3">
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-are-ivory/10 hover:bg-are-gold flex items-center justify-center transition-colors group" aria-label="Instagram">
                <Instagram className="w-4 h-4 text-are-ivory group-hover:text-are-black transition-colors" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-are-ivory/10 hover:bg-are-gold flex items-center justify-center transition-colors group" aria-label="Facebook">
                <Facebook className="w-4 h-4 text-are-ivory group-hover:text-are-black transition-colors" />
              </a>
              <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-are-ivory/10 hover:bg-are-gold flex items-center justify-center transition-colors group" aria-label="WhatsApp">
                <MessageCircle className="w-4 h-4 text-are-ivory group-hover:text-are-black transition-colors" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-are-ivory/10 hover:bg-are-gold flex items-center justify-center transition-colors group" aria-label="TikTok">
                <Music2 className="w-4 h-4 text-are-ivory group-hover:text-are-black transition-colors" />
              </a>
            </div>
          </div>

          {/* Column 2 — Explore */}
          <div>
            <h4 className="font-label text-xs tracking-wider text-are-gold mb-5">Explore</h4>
            <ul className="space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-are-ivory/70 hover:text-are-gold transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Order */}
          <div>
            <h4 className="font-label text-xs tracking-wider text-are-gold mb-5">Order</h4>
            <ul className="space-y-3">
              <li>
                <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="text-are-ivory/70 hover:text-are-gold transition-colors text-sm">
                  Order via WhatsApp
                </a>
              </li>
              <li>
                <Link to="/contact" className="text-are-ivory/70 hover:text-are-gold transition-colors text-sm">
                  Start an Order
                </Link>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="text-are-ivory/70 hover:text-are-gold transition-colors text-sm">
                  Catering Enquiries
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 — Find Us */}
          <div>
            <h4 className="font-label text-xs tracking-wider text-are-gold mb-5">Find Us</h4>
            <ul className="space-y-3 text-sm text-are-ivory/70">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-are-gold mt-0.5 shrink-0" />
                <span>{site.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-are-gold shrink-0" />
                <a href={`tel:${site.phoneRaw}`} className="hover:text-are-gold transition-colors">{site.phone}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-are-gold shrink-0" />
                <a href={`mailto:${site.email}`} className="hover:text-are-gold transition-colors break-all">{site.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col items-center gap-2">
          <p className="text-center text-are-ivory/50 text-xs">
            © 2026 African Restaurant Estonia. All rights reserved.
          </p>
          <p className="font-heading italic text-are-gold text-lg">Tastes like Love.</p>
        </div>
      </div>
    </footer>
  );
}
