import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/mockProducts';
import { ProductCard } from '../components/ProductCard';
import { Search, SlidersHorizontal, Sparkles, RotateCcw } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery
  } = useStore();

  const [priceMax, setPriceMax] = useState<number>(6000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Filtering Logic
  let filtered = products.filter((p) => {
    // Category check
    if (selectedCategory !== 'all' && p.category !== selectedCategory) {
      return false;
    }
    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const match =
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      if (!match) return false;
    }
    // Price range
    if (p.priceKES > priceMax) return false;
    // Stock filter
    if (inStockOnly && p.stockQuantity <= 0) return false;

    return true;
  });

  // Sorting Logic
  if (sortBy === 'price-asc') {
    filtered.sort((a, b) => a.priceKES - b.priceKES);
  } else if (sortBy === 'price-desc') {
    filtered.sort((a, b) => b.priceKES - a.priceKES);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setPriceMax(6000);
    setInStockOnly(false);
    setSortBy('featured');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-[#1A1412] text-[#FAF8F5] p-8 sm:p-12 border border-[#C5A059]/40 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 text-[#C5A059] text-[10px] font-bold tracking-widest uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Full Catalog • Eldoret Store</span>
          </div>
          <h1 className="font-serif-display text-4xl sm:text-5xl font-light tracking-wide uppercase">
            Beauty Collection
          </h1>
          <p className="text-xs text-[#E8D8CE]/80 font-light leading-relaxed">
            Explore our complete range of velvet lip elixirs, wild baobab face oils, serum foundations, and luxury perfumes.
          </p>
        </div>
      </div>

      {/* Main Filter & Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar Filters */}
        <div className={`space-y-6 lg:block ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="p-6 bg-white border border-[#E8D8CE]/60 space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#E8D8CE]">
              <h3 className="font-serif-display text-lg font-bold text-[#1A1412] uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-[#C5A059]" />
                Filter Catalog
              </h3>
              <button
                onClick={resetFilters}
                className="text-[11px] text-[#C5A059] hover:underline flex items-center gap-1 font-medium"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            </div>

            {/* Search Box */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#1A1412] uppercase tracking-wider block">
                Keyword Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#FAF8F5] pl-9 pr-3 py-2 text-xs border border-[#E8D8CE] focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#1A1412] uppercase tracking-wider block">
                Category
              </label>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors border ${
                    selectedCategory === 'all'
                      ? 'bg-[#1A1412] text-[#FAF8F5] border-[#1A1412]'
                      : 'bg-[#FAF8F5] text-gray-700 border-[#E8D8CE] hover:border-[#C5A059]'
                  }`}
                >
                  All Categories ({products.length})
                </button>
                {CATEGORIES.map((cat) => {
                  const count = products.filter((p) => p.category === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-3 py-2 text-xs font-medium flex justify-between items-center transition-colors border ${
                        selectedCategory === cat.id
                          ? 'bg-[#1A1412] text-[#FAF8F5] border-[#1A1412]'
                          : 'bg-[#FAF8F5] text-gray-700 border-[#E8D8CE] hover:border-[#C5A059]'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] font-mono opacity-80">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-[#1A1412] uppercase tracking-wider">
                <span>Max Price:</span>
                <span className="font-mono text-[#C5A059]">KES {priceMax.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={1500}
                max={6000}
                step={250}
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-[#C5A059]"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>KES 1,500</span>
                <span>KES 6,000</span>
              </div>
            </div>

            {/* In Stock Only */}
            <div className="flex items-center justify-between pt-2 border-t border-[#F5F0EB]">
              <span className="text-xs font-semibold text-[#1A1412] uppercase tracking-wider">
                In Stock Only
              </span>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="h-4 w-4 rounded accent-[#C5A059]"
              />
            </div>

          </div>
        </div>

        {/* Right Main Grid */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Top Bar for Results & Sorting */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white border border-[#E8D8CE]/60 gap-4">
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden bg-[#1A1412] text-[#FAF8F5] px-3.5 py-2 text-xs font-semibold uppercase flex items-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
              </button>
              <p className="text-xs text-gray-600">
                Showing <strong className="text-[#1A1412] font-semibold">{filtered.length}</strong> beauty products
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500 uppercase tracking-wider font-medium">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#FAF8F5] border border-[#E8D8CE] px-3 py-1.5 text-xs text-[#1A1412] font-semibold focus:outline-none focus:border-[#C5A059]"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
              </select>
            </div>

          </div>

          {/* Product Grid */}
          {filtered.length === 0 ? (
            <div className="bg-white p-16 text-center border border-[#E8D8CE]/60 space-y-4">
              <p className="font-serif-display text-xl text-[#1A1412] font-semibold">
                No products found matching your filters.
              </p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto font-light">
                Try loosening your search terms or resetting the price filter.
              </p>
              <button
                onClick={resetFilters}
                className="bg-[#1A1412] text-[#FAF8F5] px-6 py-3 text-xs font-semibold uppercase tracking-widest hover:bg-[#C5A059] hover:text-[#1A1412] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
