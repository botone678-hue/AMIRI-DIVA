import React from 'react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/mockProducts';
import { ProductCard } from '../components/ProductCard';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  CheckCircle,
  Truck,
  Heart,
  Smartphone,
  PhoneCall,
  MapPin
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { products, navigateTo, setSelectedCategory } = useStore();

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 4);

  return (
    <div className="space-y-20 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#1A1412] text-[#FAF8F5]">
        {/* Background Editorial Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=2000&auto=format&fit=crop"
            alt="Amiri Diva Luxury Beauty"
            className="h-full w-full object-cover object-center opacity-35 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1412] via-[#1A1412]/60 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-4xl px-6 py-20 text-center space-y-8 animate-fade-in">
          
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C5A059]/50 bg-[#1A1412]/80 px-4 py-1.5 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-[#C5A059]" />
            <span className="text-[11px] font-semibold tracking-[0.25em] text-[#C5A059] uppercase">
              Eldoret's Premier Beauty Collection
            </span>
          </div>

          <h1 className="font-serif-display text-5xl sm:text-7xl lg:text-8xl font-light tracking-wider text-[#FAF8F5] leading-none">
            BEAUTY, ELEVATED.
          </h1>

          <p className="mx-auto max-w-2xl font-light text-base sm:text-lg text-[#E8D8CE]/90 leading-relaxed">
            Discover the Amiri Diva collection — curated beauty essentials, velvety lip elixirs, and golden face oils crafted to make every moment feel luxurious.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigateTo('shop')}
              className="w-full sm:w-auto bg-[#C5A059] text-[#1A1412] px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#D4AF37] transition-all shadow-xl flex items-center justify-center gap-3 group"
              id="hero-shop-btn"
            >
              <span>SHOP COLLECTION</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => navigateTo('about')}
              className="w-full sm:w-auto border border-[#E8D8CE]/60 text-[#FAF8F5] px-8 py-4 text-xs font-semibold uppercase tracking-widest hover:bg-[#FAF8F5]/10 transition-colors"
              id="hero-explore-btn"
            >
              EXPLORE BEAUTY STORY
            </button>
          </div>

          {/* Quick Payment Banner */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[#E8D8CE]/70 border-t border-[#C5A059]/20">
            <span className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-[#C5A059]" />
              Pochi la Biashara: <strong className="text-[#C5A059]">07417758</strong>
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#C5A059]" />
              Eldoret Store Pickup & Countrywide Kenya Delivery
            </span>
          </div>

        </div>
      </section>

      {/* 2. CATEGORIES GRID */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <p className="text-[11px] font-bold tracking-[0.25em] text-[#C5A059] uppercase">
            Curated Categories
          </p>
          <h2 className="font-serif-display text-3xl sm:text-4xl text-[#1A1412] uppercase font-semibold">
            Shop By Category
          </h2>
          <div className="h-0.5 w-16 bg-[#C5A059] mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                navigateTo('shop');
              }}
              className="group relative h-80 overflow-hidden cursor-pointer bg-[#1A1412] shadow-md transition-all hover:shadow-2xl"
            >
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="h-full w-full object-cover object-center opacity-80 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1412] via-[#1A1412]/30 to-transparent" />
              
              <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end text-white space-y-2">
                <span className="text-[10px] uppercase font-semibold tracking-widest text-[#C5A059]">
                  {cat.itemCount} Essentials
                </span>
                <h3 className="font-serif-display text-2xl font-bold tracking-wider group-hover:text-[#C5A059] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#E8D8CE]/80 font-light line-clamp-2">
                  {cat.description}
                </p>
                <div className="pt-2 flex items-center text-xs text-[#C5A059] font-semibold uppercase tracking-wider gap-1 group-hover:translate-x-2 transition-transform">
                  <span>Explore Catalog</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED COLLECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#E8D8CE] pb-4 gap-4">
          <div>
            <p className="text-[11px] font-bold tracking-[0.25em] text-[#C5A059] uppercase">
              Handpicked Essentials
            </p>
            <h2 className="font-serif-display text-3xl sm:text-4xl text-[#1A1412] uppercase font-semibold">
              Featured Collection
            </h2>
          </div>
          <button
            onClick={() => navigateTo('shop')}
            className="text-xs font-bold uppercase tracking-widest text-[#1A1412] hover:text-[#C5A059] flex items-center gap-2 group"
          >
            <span>View All Products</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. EDITORIAL BEAUTY FEATURE */}
      <section className="bg-[#1A1412] text-[#FAF8F5] py-20 my-12 border-y border-[#C5A059]/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Image Column */}
            <div className="relative aspect-[4/5] overflow-hidden border border-[#C5A059]/40">
              <img
                src="https://images.unsplash.com/photo-1608248597261-833258657640?q=80&w=1200&auto=format&fit=crop"
                alt="Royal Baobab Radiance Face Oil"
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-[#1A1412]/90 backdrop-blur-md p-6 border border-[#C5A059]/40 space-y-1">
                <span className="text-[10px] font-bold tracking-widest text-[#C5A059] uppercase">
                  Featured Botanical Nectar
                </span>
                <p className="font-serif-display text-xl font-bold text-[#FAF8F5]">
                  Royal Baobab Radiance Face Oil
                </p>
                <p className="text-xs text-[#E8D8CE]/80">
                  Wild-harvested cold-pressed Baobab seed oil from Kenyan flora.
                </p>
              </div>
            </div>

            {/* Content Column */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-[#C5A059] text-xs font-bold tracking-widest uppercase">
                <Sparkles className="h-4 w-4" />
                <span>Editorial Feature</span>
              </div>

              <h2 className="font-serif-display text-4xl sm:text-5xl font-light tracking-wide text-[#FAF8F5] leading-tight">
                Pure Kenyan Botanicals for Radiant Glow
              </h2>

              <p className="text-sm text-[#E8D8CE]/90 font-light leading-relaxed">
                At AMIRI DIVA, we combine centuries-old African botanical wisdom with modern cosmetic science. Our signature Baobab Face Oil is cold-pressed to retain native Vitamin C, Omegas 3, 6, 9, and antioxidant tocopherols that nourish the skin without clogging pores.
              </p>

              <ul className="space-y-3 text-xs text-[#E8D8CE] font-light">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-[#C5A059]" />
                  <span>Sourced from wild sustainable Baobab & Marula harvests in Kenya</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-[#C5A059]" />
                  <span>Dermatologist tested and formulated for melanin-rich tones</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-[#C5A059]" />
                  <span>100% Cruelty-Free, Paraben-Free, & Mineral Oil-Free</span>
                </li>
              </ul>

              <div className="pt-4 flex flex-wrap gap-4">
                <button
                  onClick={() => navigateTo('product', 'baobab-radiance-glow-oil')}
                  className="bg-[#C5A059] text-[#1A1412] px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-[#D4AF37] transition-colors"
                >
                  Shop Baobab Oil (KES 3,800)
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 5. BEST SELLERS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <p className="text-[11px] font-bold tracking-[0.25em] text-[#C5A059] uppercase">
            Customer Favorites
          </p>
          <h2 className="font-serif-display text-3xl sm:text-4xl text-[#1A1412] uppercase font-semibold">
            Best Sellers
          </h2>
          <div className="h-0.5 w-16 bg-[#C5A059] mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. WHY AMIRI DIVA */}
      <section className="bg-[#F5F0EB] py-16 border-y border-[#E8D8CE]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            
            <div className="p-6 bg-white border border-[#E8D8CE]/50 space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#1A1412] text-[#C5A059]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-serif-display text-lg font-bold text-[#1A1412] uppercase">
                Authentic & Dermatologist Approved
              </h3>
              <p className="text-xs text-gray-600 font-light leading-relaxed">
                Formulated specifically for high-performance pigment and skin compatibility on diverse skin complexions.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#E8D8CE]/50 space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#1A1412] text-[#C5A059]">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="font-serif-display text-lg font-bold text-[#1A1412] uppercase">
                Fast Eldoret & Kenya Shipping
              </h3>
              <p className="text-xs text-gray-600 font-light leading-relaxed">
                Same-day or next-day delivery in Eldoret Town. Express parcels sent safely across all 47 counties in Kenya.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#E8D8CE]/50 space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#1A1412] text-[#C5A059]">
                <Smartphone className="h-6 w-6" />
              </div>
              <h3 className="font-serif-display text-lg font-bold text-[#1A1412] uppercase">
                Seamless Pochi la Biashara
              </h3>
              <p className="text-xs text-gray-600 font-light leading-relaxed">
                Pay directly to Pochi la Biashara 07417758. Secure instant transaction validation by store managers.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <p className="text-[11px] font-bold tracking-[0.25em] text-[#C5A059] uppercase">
            Real Customer Words
          </p>
          <h2 className="font-serif-display text-3xl sm:text-4xl text-[#1A1412] uppercase font-semibold">
            Loved Across Kenya
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 bg-white border border-[#E8D8CE]/60 space-y-4">
            <div className="flex text-[#C5A059]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-[#C5A059]" />
              ))}
            </div>
            <p className="text-xs text-[#1A1412] font-light leading-relaxed italic">
              "The Velvet Satin Lip Elixir in shade 'Eldoret Sunset' is my everyday staple now! It doesn't dry my lips like other matte lipsticks."
            </p>
            <div className="pt-2 border-t border-[#F5F0EB]">
              <p className="text-xs font-bold text-[#1A1412]">Amina W.</p>
              <p className="text-[10px] text-[#C5A059]">Verified Buyer • Nairobi</p>
            </div>
          </div>

          <div className="p-6 bg-white border border-[#E8D8CE]/60 space-y-4">
            <div className="flex text-[#C5A059]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-[#C5A059]" />
              ))}
            </div>
            <p className="text-xs text-[#1A1412] font-light leading-relaxed italic">
              "Living in Eldoret with dry cold winds, the Baobab face oil saved my skin barrier. Super fast delivery in Kapsoya!"
            </p>
            <div className="pt-2 border-t border-[#F5F0EB]">
              <p className="text-xs font-bold text-[#1A1412]">Faith Chebet</p>
              <p className="text-[10px] text-[#C5A059]">Verified Buyer • Eldoret</p>
            </div>
          </div>

          <div className="p-6 bg-white border border-[#E8D8CE]/60 space-y-4">
            <div className="flex text-[#C5A059]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-[#C5A059]" />
              ))}
            </div>
            <p className="text-xs text-[#1A1412] font-light leading-relaxed italic">
              "The Amber & Oud fragrance oil is intoxicating. Everyone asks what perfume I am wearing when I go out."
            </p>
            <div className="pt-2 border-t border-[#F5F0EB]">
              <p className="text-xs font-bold text-[#1A1412]">Brenda K.</p>
              <p className="text-[10px] text-[#C5A059]">Verified Buyer • Mombasa</p>
            </div>
          </div>

        </div>
      </section>

      {/* 8. CONSULTATION / CALLOUT BANNER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1A1412] text-[#FAF8F5] p-8 sm:p-12 border border-[#C5A059]/40 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="text-[10px] font-bold tracking-widest text-[#C5A059] uppercase">
              Need Shade Advice or Custom Gift Orders?
            </span>
            <h3 className="font-serif-display text-2xl sm:text-3xl font-semibold">
              Speak With Our Eldoret Beauty Consultant
            </h3>
            <p className="text-xs text-[#E8D8CE]/80 font-light leading-relaxed">
              Have questions about foundation matching, skincare routines, or bulk orders? Reach out to our store team directly on Phone or WhatsApp.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <a
              href="tel:0741775878"
              className="bg-[#C5A059] text-[#1A1412] px-6 py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-[#D4AF37] transition-colors flex items-center justify-center gap-2"
            >
              <PhoneCall className="h-4 w-4" />
              <span>Call 0741775878</span>
            </a>
            <button
              onClick={() => navigateTo('contact')}
              className="border border-[#E8D8CE]/60 text-[#FAF8F5] px-6 py-3.5 text-xs font-semibold uppercase tracking-wider hover:bg-white/10 transition-colors"
            >
              Visit Eldoret Store
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
