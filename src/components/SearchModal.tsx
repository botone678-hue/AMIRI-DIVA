import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, products, navigateTo } = useStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isSearchOpen) setQuery('');
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filtered = query.trim() === ''
    ? []
    : products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto no-print">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="relative min-h-screen px-4 pt-16 pb-20 text-center sm:block sm:p-0">
        <div className="relative inline-block w-full max-w-2xl text-left transition-all my-8 bg-[#FAF8F5] p-6 shadow-2xl border border-[#C5A059]/40">
          
          <div className="flex items-center justify-between pb-4 border-b border-[#E8D8CE]">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#C5A059]" />
              <span className="font-serif-display text-lg uppercase font-semibold text-[#1A1412]">
                Search Amiri Diva Collection
              </span>
            </div>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-1 text-gray-500 hover:text-[#1A1412]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-[#C5A059]" />
            <input
              type="text"
              autoFocus
              placeholder="Search lip elixirs, baobab face oils, fragrances..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-white pl-12 pr-4 py-3 text-sm text-[#1A1412] placeholder-gray-400 border border-[#E8D8CE] focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          {/* Quick Suggestions */}
          {query === '' && (
            <div className="mt-6 space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Popular Searches:
              </p>
              <div className="flex flex-wrap gap-2">
                {['Lip Elixir', 'Baobab Face Oil', 'Amber Oud Perfume', 'Hydra-Mist', 'Crown Palette'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="bg-white px-3 py-1.5 text-xs text-[#1A1412] border border-[#E8D8CE] hover:border-[#C5A059] hover:text-[#C5A059] transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {query !== '' && (
            <div className="mt-6 max-h-96 overflow-y-auto space-y-3">
              {filtered.length === 0 ? (
                <p className="text-sm text-gray-500 py-8 text-center font-light">
                  No beauty products found matching "<strong className="text-[#1A1412]">{query}</strong>". Try searching for "lips", "oil", or "perfume".
                </p>
              ) : (
                filtered.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      navigateTo('product', prod.slug);
                    }}
                    className="flex items-center justify-between p-3 bg-white border border-[#E8D8CE]/50 hover:border-[#C5A059] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="h-12 w-12 object-cover bg-[#F5F0EB]"
                      />
                      <div>
                        <h4 className="font-serif-display text-sm font-semibold text-[#1A1412] group-hover:text-[#C5A059] transition-colors">
                          {prod.name}
                        </h4>
                        <p className="text-[11px] text-gray-500 uppercase tracking-wider">
                          {prod.category} • KES {prod.priceKES.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[#C5A059] group-hover:translate-x-1 transition-transform" />
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
