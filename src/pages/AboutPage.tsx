import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, MapPin, Heart, ShieldCheck, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#C5A059]/40 bg-[#F5F0EB] px-4 py-1.5">
          <Sparkles className="h-3.5 w-3.5 text-[#C5A059]" />
          <span className="text-[11px] font-semibold tracking-[0.25em] text-[#C5A059] uppercase">
            Eldoret, Kenya
          </span>
        </div>
        <h1 className="font-serif-display text-4xl sm:text-6xl font-light text-[#1A1412] uppercase tracking-wide">
          Our Eldoret Beauty Story
        </h1>
        <p className="text-sm text-gray-600 font-light leading-relaxed">
          AMIRI DIVA was born out of a desire to create an authentic, high-end African luxury cosmetics house rooted in Eldoret, Kenya.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        <div className="relative aspect-[4/5] overflow-hidden border border-[#C5A059]/40">
          <img
            src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1200&auto=format&fit=crop"
            alt="Amiri Diva Cosmetics"
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-6 left-6 bg-[#1A1412]/90 backdrop-blur-md p-6 border border-[#C5A059]/40 text-[#FAF8F5]">
            <p className="font-serif-display text-xl font-bold">BEAUTY, ELEVATED.</p>
            <p className="text-xs text-[#E8D8CE]">Eldoret Town, Kenya</p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="font-serif-display text-3xl font-semibold text-[#1A1412]">
            Authentic African Luxury & Botanical Mastery
          </h2>
          <p className="text-xs text-gray-700 font-light leading-relaxed">
            Every product in the Amiri Diva collection is meticulously crafted to deliver rich pigment payoff, comfortable moisture, and radiant skin health. We celebrate the richness of melanin-toned skin by selecting formulations that perform flawlessly in African climates.
          </p>
          <p className="text-xs text-gray-700 font-light leading-relaxed">
            From our signature Baobab Face Oil harvested from native wild flora to our Velvet Satin Lip Elixirs named after iconic Kenyan landmarks, Amiri Diva stands for dignity, quality, and sophistication.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E8D8CE]">
            <div className="space-y-1">
              <span className="font-mono text-2xl font-bold text-[#C5A059]">100%</span>
              <p className="text-xs font-bold text-[#1A1412] uppercase">Cruelty-Free & Authentic</p>
              <p className="text-[11px] text-gray-500 font-light">Ethically formulated without harsh mineral oils or heavy parabens.</p>
            </div>
            <div className="space-y-1">
              <span className="font-mono text-2xl font-bold text-[#C5A059]">47</span>
              <p className="text-xs font-bold text-[#1A1412] uppercase">Counties in Kenya</p>
              <p className="text-[11px] text-gray-500 font-light">Direct delivery across all regions with Pochi la Biashara support.</p>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => navigateTo('shop')}
              className="bg-[#1A1412] text-[#FAF8F5] px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-[#C5A059] hover:text-[#1A1412] transition-colors flex items-center gap-2"
            >
              <span>Explore Collection</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
