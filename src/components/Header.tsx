import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShoppingBag,
  Search,
  User,
  ShieldCheck,
  Menu,
  X,
  PhoneCall,
  Sparkles,
  MapPin,
  ChevronRight
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentRoute,
    navigateTo,
    cartCount,
    setIsCartOpen,
    setIsSearchOpen,
    managerMode,
    setManagerMode,
    showToast
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', route: 'home' },
    { label: 'Shop All', route: 'shop' },
    { label: 'About Amiri Diva', route: 'about' },
    { label: 'Contact & Store', route: 'contact' },
    { label: 'Track Order', route: 'orders' }
  ];

  const handleNavClick = (route: string) => {
    navigateTo(route);
    setMobileMenuOpen(false);
  };

  const toggleManagerPortal = () => {
    const nextMode = !managerMode;
    setManagerMode(nextMode);
    if (nextMode) {
      showToast('Switched to Manager Portal Mode (Eldoret Store Control)');
      navigateTo('admin');
    } else {
      showToast('Switched to Customer Experience');
      navigateTo('home');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E8D8CE]/50 bg-[#FAF8F5]/95 backdrop-blur-md">
      {/* Top Announcement Bar */}
      <div className="bg-[#1A1412] text-[#F5F0EB] py-2 px-4 text-center text-[11px] tracking-widest uppercase font-medium flex items-center justify-between">
        <div className="hidden md:flex items-center gap-2 text-[#C5A059] text-[10px]">
          <MapPin className="h-3 w-3" />
          <span>Eldoret Store, Kenya</span>
        </div>
        <div className="mx-auto flex items-center gap-2">
          <Sparkles className="h-3 w-3 text-[#C5A059] animate-pulse" />
          <span>FREE ELDORET DELIVERY OVER KES 3,000 | POCHI LA BIASHARA: <strong className="text-[#C5A059]">07417758</strong></span>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs">
          <PhoneCall className="h-3 w-3 text-[#C5A059]" />
          <a href="tel:0741775878" className="hover:underline text-[#FAF8F5]">0741775878</a>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#1A1412] lg:hidden hover:text-[#C5A059] transition-colors"
            aria-label="Toggle navigation menu"
            id="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Brand Logo */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavClick('home')}
              className="group text-left focus:outline-none"
              id="brand-logo-btn"
            >
              <span className="font-serif-display text-2xl sm:text-3xl font-semibold tracking-widest text-[#1A1412] uppercase group-hover:text-[#C5A059] transition-colors">
                AMIRI DIVA
              </span>
              <span className="block text-[9px] tracking-[0.3em] font-medium text-[#C5A059] uppercase -mt-1">
                BEAUTY, ELEVATED.
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 text-xs font-medium tracking-widest uppercase">
            {navLinks.map((link) => (
              <button
                key={link.route}
                onClick={() => handleNavClick(link.route)}
                className={`transition-colors duration-200 py-1 relative ${
                  currentRoute === link.route
                    ? 'text-[#1A1412] font-semibold border-b-2 border-[#C5A059]'
                    : 'text-[#1A1412]/70 hover:text-[#C5A059]'
                }`}
                id={`nav-${link.route}`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-[#1A1412]/80 hover:text-[#C5A059] transition-colors"
              title="Search products"
              aria-label="Search products"
              id="header-search-btn"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Orders / Account */}
            <button
              onClick={() => handleNavClick('orders')}
              className="p-2 text-[#1A1412]/80 hover:text-[#C5A059] transition-colors hidden sm:block"
              title="Orders & Account"
              aria-label="Track Orders"
              id="header-orders-btn"
            >
              <User className="h-5 w-5" />
            </button>

            {/* Manager Mode Toggle Badge */}
            <button
              onClick={toggleManagerPortal}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] tracking-wider uppercase font-semibold transition-all border ${
                managerMode
                  ? 'bg-[#C5A059] text-[#1A1412] border-[#C5A059] shadow-sm'
                  : 'bg-[#F5F0EB] text-[#1A1412]/80 border-[#E8D8CE] hover:border-[#C5A059]'
              }`}
              title="Toggle Manager Dashboard"
              id="header-manager-toggle-btn"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{managerMode ? 'Manager Mode' : 'Store Portal'}</span>
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-[#1A1412] hover:text-[#C5A059] transition-colors"
              aria-label="Shopping Bag"
              id="header-cart-btn"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#1A1412] text-[9px] font-bold text-[#FAF8F5]">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#E8D8CE] bg-[#FAF8F5] px-6 py-6 animate-fade-in shadow-xl">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <button
                key={link.route}
                onClick={() => handleNavClick(link.route)}
                className="flex items-center justify-between text-left text-sm font-medium uppercase tracking-wider py-2 text-[#1A1412] border-b border-[#E8D8CE]/40 hover:text-[#C5A059]"
              >
                <span>{link.label}</span>
                <ChevronRight className="h-4 w-4 text-[#C5A059]" />
              </button>
            ))}

            <button
              onClick={toggleManagerPortal}
              className="flex items-center justify-between text-left text-sm font-semibold uppercase tracking-wider py-2 text-[#C5A059] border-b border-[#E8D8CE]/40"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span>{managerMode ? 'Switch to Customer View' : 'Manager Portal (Eldoret Store)'}</span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </button>

            <div className="pt-4 text-xs text-[#1A1412]/70 space-y-2 font-light">
              <p className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#C5A059]" />
                Eldoret Town, Kenya
              </p>
              <p className="flex items-center gap-2">
                <PhoneCall className="h-3.5 w-3.5 text-[#C5A059]" />
                0741775878 | amiridiva@gmail.com
              </p>
              <p className="text-[11px] text-[#C5A059] font-medium pt-1">
                Pochi la Biashara: 07417758
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
