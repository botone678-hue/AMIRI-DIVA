import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShadePicker } from '../components/ShadePicker';
import { INITIAL_REVIEWS } from '../data/mockProducts';
import { ProductCard } from '../components/ProductCard';
import { Review } from '../types';
import {
  Star,
  ShoppingBag,
  Check,
  Truck,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Smartphone,
  MapPin,
  Heart,
  MessageSquarePlus
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { routeSlug, products, addToCart, navigateTo, showToast } = useStore();

  const product = products.find((p) => p.slug === routeSlug) || products[0];

  const [activeImage, setActiveImage] = useState<string>(product.image);
  const [selectedShade, setSelectedShade] = useState<string>(
    product.shades && product.shades.length > 0 ? product.shades[0].name : ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'howTo' | 'shipping'>('ingredients');
  const [added, setAdded] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>(
    INITIAL_REVIEWS.filter((r) => r.productId === product.id)
  );
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewLocation, setReviewLocation] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-lg">Product not found.</p>
        <button
          onClick={() => navigateTo('shop')}
          className="mt-4 bg-[#1A1412] text-white px-6 py-2 text-xs uppercase"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const allImages = [product.image, ...(product.additionalImages || [])];

  const handleAddToCart = () => {
    if (product.stockQuantity <= 0) return;
    addToCart(product, quantity, selectedShade || undefined);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor || !reviewComment) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      author: `${reviewAuthor} (${reviewLocation || 'Kenya'})`,
      rating: reviewRating,
      title: reviewTitle || 'Exceptional Quality',
      comment: reviewComment,
      date: new Date().toISOString().split('T')[0],
      verifiedPurchase: true,
      location: reviewLocation
    };

    setReviews([newRev, ...reviews]);
    showToast('Thank you! Your customer review has been published.');
    setReviewAuthor('');
    setReviewLocation('');
    setReviewTitle('');
    setReviewComment('');
    setShowReviewForm(false);
  };

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider">
        <button onClick={() => navigateTo('home')} className="hover:text-[#C5A059]">Home</button>
        <ChevronRight className="h-3 w-3 text-gray-400" />
        <button onClick={() => navigateTo('shop')} className="hover:text-[#C5A059]">Shop</button>
        <ChevronRight className="h-3 w-3 text-gray-400" />
        <span className="text-[#1A1412] font-semibold">{product.name}</span>
      </nav>

      {/* Main Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F5F0EB] border border-[#E8D8CE]/60">
            <img
              src={activeImage}
              alt={product.name}
              className="h-full w-full object-cover object-center transition-all duration-500"
            />
            {product.isBestSeller && (
              <span className="absolute top-4 left-4 bg-[#1A1412] text-[#C5A059] px-3 py-1 text-[10px] font-bold tracking-widest uppercase">
                Best Seller
              </span>
            )}
          </div>

          {/* Image Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden bg-[#F5F0EB] border transition-all ${
                    activeImage === img
                      ? 'border-[#C5A059] ring-1 ring-[#C5A059]'
                      : 'border-[#E8D8CE] hover:border-[#C5A059]'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Information */}
        <div className="space-y-6">
          
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#C5A059] uppercase">
              {product.category} {product.volumeOrWeight ? `• ${product.volumeOrWeight}` : ''}
            </span>
            <h1 className="font-serif-display text-3xl sm:text-4xl font-semibold text-[#1A1412] mt-1 leading-tight">
              {product.name}
            </h1>
            <p className="text-sm text-gray-600 font-light mt-1">
              {product.subtitle}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-3 text-xs">
              <div className="flex text-[#C5A059]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[#C5A059]" />
                ))}
              </div>
              <span className="font-bold text-[#1A1412]">{product.rating}</span>
              <span className="text-gray-400">({reviews.length} customer reviews)</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 pt-3 border-t border-[#E8D8CE]">
            <span className="font-mono text-3xl font-bold text-[#1A1412]">
              KES {product.priceKES.toLocaleString()}
            </span>
            {product.originalPriceKES && (
              <span className="font-mono text-base text-gray-400 line-through">
                KES {product.originalPriceKES.toLocaleString()}
              </span>
            )}
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
              Tax Included
            </span>
          </div>

          {/* Description */}
          <p className="text-xs text-gray-700 font-light leading-relaxed">
            {product.description}
          </p>

          {/* Shade Picker */}
          {product.shades && product.shades.length > 0 && (
            <div className="p-4 bg-[#F5F0EB] border border-[#E8D8CE] space-y-2">
              <ShadePicker
                shades={product.shades}
                selectedShade={selectedShade}
                onSelectShade={(shadeName) => setSelectedShade(shadeName)}
              />
            </div>
          )}

          {/* Stock & Quantity controls */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold uppercase tracking-wider text-[#1A1412]">
                Quantity
              </span>
              <span className={`font-semibold ${product.stockQuantity > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                {product.stockQuantity > 0 ? `In Stock (${product.stockQuantity} units in Eldoret)` : 'Out of Stock'}
              </span>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center border border-[#1A1412] bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-sm text-[#1A1412] hover:bg-[#F5F0EB]"
                >
                  -
                </button>
                <span className="px-5 py-3 font-mono font-bold text-sm text-[#1A1412]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 text-sm text-[#1A1412] hover:bg-[#F5F0EB]"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stockQuantity <= 0}
                className={`flex-1 py-3.5 px-6 text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl ${
                  product.stockQuantity <= 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
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
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" />
                    <span>Add to Bag (KES {(product.priceKES * quantity).toLocaleString()})</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Pochi la Biashara Quick Instruction Box */}
          <div className="p-4 bg-[#1A1412] text-[#FAF8F5] border border-[#C5A059]/40 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#C5A059]">
              <Smartphone className="h-4 w-4" />
              <span>Easy Order & Payment via Pochi la Biashara</span>
            </div>
            <p className="text-[11px] text-[#E8D8CE]/90 font-light">
              Add to bag, complete checkout, and submit your M-Pesa transaction code to Pochi <strong className="text-[#C5A059] font-mono">07417758</strong>.
            </p>
          </div>

          {/* Tabs / Accordion for Ingredients & Usage */}
          <div className="border-t border-[#E8D8CE] pt-6 space-y-4">
            <div className="flex border-b border-[#E8D8CE]">
              <button
                onClick={() => setActiveTab('ingredients')}
                className={`py-2 px-4 text-xs font-bold uppercase tracking-wider border-b-2 ${
                  activeTab === 'ingredients'
                    ? 'border-[#C5A059] text-[#1A1412]'
                    : 'border-transparent text-gray-500 hover:text-[#1A1412]'
                }`}
              >
                Ingredients
              </button>
              <button
                onClick={() => setActiveTab('howTo')}
                className={`py-2 px-4 text-xs font-bold uppercase tracking-wider border-b-2 ${
                  activeTab === 'howTo'
                    ? 'border-[#C5A059] text-[#1A1412]'
                    : 'border-transparent text-gray-500 hover:text-[#1A1412]'
                }`}
              >
                How to Apply
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`py-2 px-4 text-xs font-bold uppercase tracking-wider border-b-2 ${
                  activeTab === 'shipping'
                    ? 'border-[#C5A059] text-[#1A1412]'
                    : 'border-transparent text-gray-500 hover:text-[#1A1412]'
                }`}
              >
                Delivery Info
              </button>
            </div>

            <div className="text-xs text-gray-600 font-light leading-relaxed min-h-[80px]">
              {activeTab === 'ingredients' && <p>{product.ingredients}</p>}
              {activeTab === 'howTo' && <p>{product.howToUse}</p>}
              {activeTab === 'shipping' && (
                <div className="space-y-2">
                  <p className="flex items-center gap-2 text-[#1A1412] font-semibold">
                    <MapPin className="h-3.5 w-3.5 text-[#C5A059]" />
                    Eldoret Town: Same-Day Dispatch / Store Pickup (Free over KES 3,000)
                  </p>
                  <p className="flex items-center gap-2">
                    <Truck className="h-3.5 w-3.5 text-[#C5A059]" />
                    Nairobi, Kisumu, Nakuru, Mombasa & Countrywide Kenya: 24-48 Hours Express Courier.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Customer Reviews Section */}
      <section className="border-t border-[#E8D8CE] pt-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif-display text-2xl font-bold uppercase text-[#1A1412]">
              Customer Reviews ({reviews.length})
            </h2>
            <p className="text-xs text-gray-500 font-light">
              Real feedback from Verified Kenya Beauty Customers.
            </p>
          </div>
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-[#1A1412] text-[#FAF8F5] px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-[#C5A059] hover:text-[#1A1412] transition-colors flex items-center gap-2 self-start"
          >
            <MessageSquarePlus className="h-4 w-4" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <form onSubmit={handleReviewSubmit} className="bg-white p-6 border border-[#E8D8CE] space-y-4">
            <h3 className="font-serif-display text-lg font-bold text-[#1A1412] uppercase">
              Share Your Experience
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase text-gray-700 block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Joy Wanjiku"
                  value={reviewAuthor}
                  onChange={(e) => setReviewAuthor(e.target.value)}
                  className="w-full bg-[#FAF8F5] px-3 py-2 text-xs border border-[#E8D8CE] focus:outline-none focus:border-[#C5A059]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-700 block mb-1">Town / County</label>
                <input
                  type="text"
                  placeholder="e.g. Eldoret Town"
                  value={reviewLocation}
                  onChange={(e) => setReviewLocation(e.target.value)}
                  className="w-full bg-[#FAF8F5] px-3 py-2 text-xs border border-[#E8D8CE] focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase text-gray-700 block mb-1">Rating</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="w-full bg-[#FAF8F5] px-3 py-2 text-xs border border-[#E8D8CE] focus:outline-none focus:border-[#C5A059]"
                >
                  <option value={5}>5 Stars — Excellent</option>
                  <option value={4}>4 Stars — Very Good</option>
                  <option value={3}>3 Stars — Average</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-700 block mb-1">Review Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Stunning shade and fast delivery!"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full bg-[#FAF8F5] px-3 py-2 text-xs border border-[#E8D8CE] focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase text-gray-700 block mb-1">Review Comments</label>
              <textarea
                rows={3}
                required
                placeholder="Tell us what you loved about this formulation..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full bg-[#FAF8F5] p-3 text-xs border border-[#E8D8CE] focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-4 py-2 text-xs uppercase border border-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#C5A059] text-[#1A1412] px-6 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[#D4AF37]"
              >
                Submit Review
              </button>
            </div>
          </form>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-xs text-gray-500 italic">No reviews submitted for this item yet. Be the first!</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="p-4 bg-white border border-[#E8D8CE]/50 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex text-[#C5A059]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-[#C5A059]" />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">{rev.date}</span>
                </div>
                <h4 className="font-serif-display text-sm font-bold text-[#1A1412]">{rev.title}</h4>
                <p className="text-xs text-gray-700 font-light leading-relaxed">{rev.comment}</p>
                <div className="flex items-center gap-2 pt-1 text-[10px] text-gray-500">
                  <span className="font-bold text-[#1A1412]">{rev.author}</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-medium">Verified Purchase</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="border-t border-[#E8D8CE] pt-12 space-y-6">
          <h2 className="font-serif-display text-2xl font-bold uppercase text-[#1A1412]">
            You May Also Love
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
