import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { site } from '@/data/site';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Menu', path: '/menu' },
  { label: 'About', path: '/about' },
  { label: 'Catering', path: '/catering' },
  { label: 'Location', path: '/location' },
  { label: 'Order', path: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass-nav shadow-lg shadow-black/20' : 'bg-are-primary'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center group bg-white rounded-full pl-1 pr-3 py-1" aria-label="African Restaurant Estonia home">
              <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-full overflow-hidden ring-2 ring-are-gold/50 transition-transform duration-300 group-hover:scale-105 group-hover:ring-are-gold shrink-0"
                style={{ filter: 'drop-shadow(0 2px 8px rgba(216,154,39,0.4))' }}
              >
                <img
                  src="https://i.imgur.com/JHfTvcb.png"
                  alt="African Restaurant Estonia"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="hidden sm:inline font-heading text-base font-bold text-are-primary tracking-wide ml-2">
                ARE
              </span>
            </Link>

            {/* Center links */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-label text-xs font-semibold tracking-wider transition-colors duration-300 relative group ${
                    location.pathname === link.path
                      ? 'text-are-gold'
                      : 'text-are-ivory/80 hover:text-are-gold'
                  }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 right-0 h-px bg-are-gold transition-transform duration-300 ${
                    location.pathname === link.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`} />
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={openCart}
                className="relative p-2 text-are-ivory hover:text-are-gold transition-colors"
                aria-label="Open cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-are-paprika text-are-ivory text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center font-label">
                    {totalItems}
                  </span>
                )}
              </button>

              <button
                onClick={() => navigate('/contact')}
                className="hidden sm:inline-flex bg-are-paprika hover:bg-are-paprika/90 text-are-ivory font-label text-xs font-semibold tracking-wider px-5 py-2.5 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-are-paprika/30 hover:scale-105"
              >
                Start an Order
              </button>

              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden text-are-ivory p-2"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-[55] bg-are-primary transition-all duration-500 lg:hidden ${
          mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="flex justify-end p-6">
          <button
            onClick={() => setMobileOpen(false)}
            className="text-are-gold p-2"
            aria-label="Close menu"
          >
            <X className="w-8 h-8" />
          </button>
        </div>
        <div className="flex flex-col items-center justify-center gap-8 mt-8">
          {navLinks.map((link, i) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-heading text-3xl transition-all duration-500 ${
                mobileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              } ${location.pathname === link.path ? 'text-are-gold' : 'text-are-ivory'}`}
              style={{ transitionDelay: mobileOpen ? `${i * 80}ms` : '0ms' }}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => { setMobileOpen(false); navigate('/contact'); }}
            className="mt-4 bg-are-paprika text-are-ivory font-label text-sm font-semibold tracking-wider px-8 py-3 rounded-full"
          >
            Start an Order
          </button>
        </div>
      </div>
    </>
  );
}
