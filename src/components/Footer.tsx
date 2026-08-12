import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Send,
  Heart,
  Smartphone
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, showToast } = useStore();
  const [emailInput, setEmailInput] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    showToast('Welcome to the Diva Circle! Use promo code DIVA10 for 10% off.');
    setEmailInput('');
  };

  return (
    <footer className="bg-[#1A1412] text-[#FAF8F5] pt-16 pb-12 border-t border-[#C5A059]/30 no-print">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 pb-16 border-b border-[#2C221E]">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div>
              <h2 className="font-serif-display text-2xl tracking-widest text-[#FAF8F5] uppercase">
                AMIRI DIVA
              </h2>
              <p className="text-[10px] tracking-[0.25em] text-[#C5A059] uppercase font-semibold">
                BEAUTY, ELEVATED.
              </p>
            </div>
            <p className="text-xs text-[#E8D8CE]/80 leading-relaxed font-light">
              Eldoret's premier destination for curated luxury cosmetics, botanical face oils, velvet lip elixirs, and bespoke beauty essentials tailored for vibrant African skin tones.
            </p>
            <div className="pt-2 text-xs text-[#E8D8CE] space-y-2 font-light">
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-[#C5A059] shrink-0" />
                <span>Eldoret Town, Uasin Gishu County, Kenya</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[#C5A059] shrink-0" />
                <a href="tel:0741775878" className="hover:text-[#C5A059] transition-colors">
                  0741775878
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#C5A059] shrink-0" />
                <a href="mailto:amiridiva@gmail.com" className="hover:text-[#C5A059] transition-colors">
                  amiridiva@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Payment & Pochi Instructions */}
          <div className="space-y-4">
            <h3 className="font-serif-display text-lg text-[#FAF8F5] tracking-wider uppercase">
              Manual Payment Method
            </h3>
            <div className="rounded-none bg-[#2C221E] p-4 border border-[#C5A059]/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#C5A059]">
                <Smartphone className="h-4 w-4" />
                <span>Pochi la Biashara Payment</span>
              </div>
              <p className="text-[11px] text-[#E8D8CE] font-light">
                Pay directly through M-Pesa Pochi la Biashara:
              </p>
              <div className="bg-[#1A1412] px-3 py-2 border border-[#C5A059]/40 text-center">
                <p className="text-xs text-[#E8D8CE] uppercase tracking-wider">Pochi Number</p>
                <p className="font-mono text-base font-bold text-[#C5A059] tracking-widest">07417758</p>
                <p className="text-[9px] text-[#E8D8CE]/70">Account Name: AMIRI DIVA COSMETICS</p>
              </div>
              <p className="text-[10px] text-[#E8D8CE]/70 italic">
                *Order stock reserved upon placement. Instant payment reference verification by store manager.
              </p>
            </div>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="space-y-4">
            <h3 className="font-serif-display text-lg text-[#FAF8F5] tracking-wider uppercase">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-xs text-[#E8D8CE] font-light uppercase tracking-wider">
              <li>
                <button onClick={() => navigateTo('home')} className="hover:text-[#C5A059] transition-colors">
                  Home Collection
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('shop')} className="hover:text-[#C5A059] transition-colors">
                  Shop Beauty Catalog
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-[#C5A059] transition-colors">
                  Our Eldoret Story
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('orders')} className="hover:text-[#C5A059] transition-colors">
                  Track Order / Submit Code
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-[#C5A059] transition-colors">
                  Store Contact & Map
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('admin')} className="text-[#C5A059] hover:underline flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Manager Portal Access
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-4">
            <h3 className="font-serif-display text-lg text-[#FAF8F5] tracking-wider uppercase">
              The Diva Circle
            </h3>
            <p className="text-xs text-[#E8D8CE]/80 font-light leading-relaxed">
              Subscribe for exclusive secret launches, beauty tips, and receive 10% off your first Eldoret order with code <strong className="text-[#C5A059]">DIVA10</strong>.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
                className="w-full bg-[#2C221E] px-3.5 py-2.5 text-xs text-[#FAF8F5] placeholder-[#E8D8CE]/50 focus:outline-none focus:ring-1 focus:ring-[#C5A059] border border-[#2C221E]"
              />
              <button
                type="submit"
                className="bg-[#C5A059] px-4 py-2.5 text-[#1A1412] hover:bg-[#D4AF37] transition-colors flex items-center justify-center shrink-0"
                aria-label="Subscribe to newsletter"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#E8D8CE]/60 gap-4 font-light">
          <p>© {new Date().getFullYear()} AMIRI DIVA. All rights reserved. Eldoret, Kenya.</p>
          <p className="flex items-center gap-1">
            Crafted with <Heart className="h-3 w-3 text-[#C5A059] fill-[#C5A059]" /> for African Beauty
          </p>
          <div className="flex gap-4">
            <button onClick={() => navigateTo('contact')} className="hover:underline">Terms</button>
            <button onClick={() => navigateTo('contact')} className="hover:underline">Privacy</button>
            <button onClick={() => navigateTo('orders')} className="hover:underline">Delivery Info</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
