import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Star, ShoppingBag, Eye, Check } from 'lucide-react';
import { ShadePicker } from './ShadePicker';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigateTo, addToCart } = useStore();
  const [selectedShade, setSelectedShade] = useState<string>(
    product.shades && product.shades.length > 0 ? product.shades[0].name : ''
  );
  const [added, setAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stockQuantity <= 0) return;
    addToCart(product, 1, selectedShade || undefined);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleCardClick = () => {
    navigateTo('product', product.slug);
  };

  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col justify-between overflow-hidden bg-white border border-[#E8D8CE]/50 transition-all duration-300 hover:shadow-xl hover:border-[#C5A059]/50 cursor-pointer"
      id={`product-card-${product.slug}`}
    >
      {/* Top Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F5F0EB]">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isBestSeller && (
            <span className="bg-[#1A1412] text-[#C5A059] px-2.5 py-1 text-[9px] font-bold tracking-widest uppercase">
              Best Seller
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-[#C5A059] text-[#1A1412] px-2.5 py-1 text-[9px] font-bold tracking-widest uppercase">
              New Arrival
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-red-900 text-white px-2.5 py-1 text-[9px] font-bold tracking-widest uppercase">
              Sold Out
            </span>
          )}
        </div>

        {/* Quick View Hover Button */}
        <div className="absolute inset-x-0 bottom-3 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4">
          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`w-full py-2.5 px-4 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg ${
              isOutOfStock
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : added
                ? 'bg-[#2E150A] text-[#FAF8F5]'
                : 'bg-[#1A1412] text-[#FAF8F5] hover:bg-[#C5A059] hover:text-[#1A1412]'
            }`}
          >
            {added ? (
              <>
                <Check className="h-4 w-4 text-[#C5A059]" />
                <span>Added to Bag</span>
              </>
            ) : isOutOfStock ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex flex-col flex-1 justify-between bg-white space-y-3">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[10px] tracking-widest uppercase text-[#C5A059] font-medium mb-1">
            <span>{product.category}</span>
            <div className="flex items-center gap-1 text-[#1A1412]">
              <Star className="h-3 w-3 fill-[#C5A059] text-[#C5A059]" />
              <span className="font-bold text-[11px]">{product.rating}</span>
              <span className="text-gray-400">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-serif-display text-lg font-semibold text-[#1A1412] leading-tight group-hover:text-[#C5A059] transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-gray-500 line-clamp-1 font-light mt-0.5">
            {product.subtitle}
          </p>

          {/* Shades preview if present */}
          {product.shades && product.shades.length > 0 && (
            <div className="mt-2.5 pt-2 border-t border-[#F5F0EB]">
              <ShadePicker
                shades={product.shades}
                selectedShade={selectedShade}
                onSelectShade={(shadeName) => setSelectedShade(shadeName)}
              />
            </div>
          )}
        </div>

        {/* Price Row */}
        <div className="pt-3 border-t border-[#F5F0EB] flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-base font-bold text-[#1A1412]">
              KES {product.priceKES.toLocaleString()}
            </span>
            {product.originalPriceKES && (
              <span className="font-mono text-xs text-gray-400 line-through">
                KES {product.originalPriceKES.toLocaleString()}
              </span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="text-[11px] font-semibold text-[#C5A059] hover:underline uppercase tracking-wider flex items-center gap-1"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Details</span>
          </button>
        </div>
      </div>
    </div>
  );
};
