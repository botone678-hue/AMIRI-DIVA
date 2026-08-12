import { Product, CategoryInfo, Review } from '../types';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'lips',
    name: 'Lip Beauty & Elixirs',
    slug: 'lips',
    description: 'Nourishing velvet lipsticks, high-shine glosses, and buttery lip liners designed for diverse skin tones.',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=1200&auto=format&fit=crop',
    itemCount: 8
  },
  {
    id: 'skincare',
    name: 'Nectar Skincare',
    slug: 'skincare',
    description: 'Botanical serums, glow oils, and hydrators infused with African Baobab, Shea, and Marula nectar.',
    image: 'https://images.unsplash.com/photo-1608248597261-833258657640?q=80&w=1200&auto=format&fit=crop',
    itemCount: 6
  },
  {
    id: 'complexion',
    name: 'Glow & Complexion',
    slug: 'complexion',
    description: 'Lightweight foundation drops, luminous concealers, and satin setting powders for an effortless radiance.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1200&auto=format&fit=crop',
    itemCount: 7
  },
  {
    id: 'eyes',
    name: 'Eyes & Brows',
    slug: 'eyes',
    description: 'Precision eyeliners, voluminous lengthening mascaras, and pigment-rich eye palettes.',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1200&auto=format&fit=crop',
    itemCount: 5
  },
  {
    id: 'fragrance',
    name: 'Luxury Fragrance',
    slug: 'fragrance',
    description: 'Seductive perfume oils and Eau de Parfums featuring notes of Amber, Wild Rose, Vanilla, and Spiced Oud.',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1200&auto=format&fit=crop',
    itemCount: 4
  },
  {
    id: 'hair',
    name: 'Crown Hair & Scalp Oils',
    slug: 'hair',
    description: 'Rich hair elixirs, scalp conditioning oils, and silk gloss serums for crown perfection.',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=1200&auto=format&fit=crop',
    itemCount: 4
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'ad-prod-1',
    slug: 'velvet-matte-lip-elixir',
    name: 'Velvet Satin Lip Elixir',
    category: 'lips',
    subtitle: 'Ultra-pigmented hydrating matte lip stain',
    priceKES: 2450,
    originalPriceKES: 2800,
    rating: 4.9,
    reviewCount: 48,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503236823255-94609f598e71?q=80&w=800&auto=format&fit=crop'
    ],
    shades: [
      { name: 'Eldoret Sunset (Warm Rose)', colorHex: '#A3485E', inStock: true },
      { name: 'Nandi Cocoa (Rich Chocolate)', colorHex: '#522E26', inStock: true },
      { name: 'Rift Valley Red (Classic Scarlet)', colorHex: '#9E1B24', inStock: true },
      { name: 'Satin Nude (Soft Caramel)', colorHex: '#B27B66', inStock: true },
      { name: 'Plum Diva (Deep Berry)', colorHex: '#4A1C2C', inStock: true }
    ],
    description: 'A revolutionary weightless lip formulation that combines the longevity of a matte stain with the velvety cushion of cold-pressed Baobab Oil and Vitamin E. Formulated specifically to complement melanin-rich tones without feathering or drying.',
    ingredients: 'Isododecane, Cold-Pressed Adansonia Digitata (Baobab) Seed Oil, Butyrospermum Parkii (Shea) Butter, Tocopherol (Vitamin E), Synthetic Beeswax, Mica, Titanium Dioxide, Organic Rosehip Extract, Flavor/Aroma.',
    howToUse: 'Outline lips with the precision applicator tip, then fill in starting from the center outward. Allow 30 seconds to lock into a featherproof satin finish.',
    isBestSeller: true,
    isFeatured: true,
    stockQuantity: 35,
    volumeOrWeight: '6.5ml / 0.22 fl oz'
  },
  {
    id: 'ad-prod-2',
    slug: 'baobab-radiance-glow-oil',
    name: 'Royal Baobab Radiance Face Oil',
    category: 'skincare',
    subtitle: 'Pure wild-harvested golden radiance elixir',
    priceKES: 3800,
    originalPriceKES: 4200,
    rating: 5.0,
    reviewCount: 62,
    image: 'https://images.unsplash.com/photo-1608248597261-833258657640?q=80&w=800&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Sourced from wild African Baobab trees and cold-pressed to preserve maximum nutrient density. Packed with Omegas 3, 6 & 9 and antioxidant Vitamin C to restore your natural glow, repair the moisture barrier, and soften fine lines.',
    ingredients: '100% Pure Organic Cold-Pressed Adansonia Digitata (Baobab) Oil, Sclerocarya Birrea (Marula) Kernel Oil, Rosa Canina (Rosehip) Fruit Oil, Squalane (Olive Derived), Frankincense Essential Oil, Golden Jojoba Oil.',
    howToUse: 'Warm 3–4 drops between clean palms and gently press onto freshly cleansed face, neck, and décolletage every morning and evening. Perfect under makeup or over moisturizers.',
    isBestSeller: true,
    isFeatured: true,
    isNewArrival: false,
    stockQuantity: 28,
    volumeOrWeight: '30ml / 1.0 fl oz'
  },
  {
    id: 'ad-prod-3',
    slug: 'luminous-silk-complexion-drops',
    name: 'Luminous Skin Serum Foundation Drops',
    category: 'complexion',
    subtitle: 'Breathable medium-coverage radiant finish',
    priceKES: 3400,
    rating: 4.8,
    reviewCount: 39,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop'
    ],
    shades: [
      { name: 'Shade 01 - Golden Honey', colorHex: '#C68B59', inStock: true },
      { name: 'Shade 02 - Amber Diva', colorHex: '#9C5B32', inStock: true },
      { name: 'Shade 03 - Warm Chestnut', colorHex: '#733D1E', inStock: true },
      { name: 'Shade 04 - Deep Espresso', colorHex: '#4A2312', inStock: true },
      { name: 'Shade 05 - Rich Ebony', colorHex: '#2E150A', inStock: true }
    ],
    description: 'An hybrid serum foundation infused with Hyaluronic Acid and Niacinamide. Delivers a second-skin satin finish that unifies skin tone, blurs imperfections, and hydrates for up to 16 hours.',
    ingredients: 'Water/Aqua, Dimethicone, Niacinamide, Hyaluronic Acid, Organic Glycerin, Magnesium Sulfate, Squalane, Baobab Oil Extract, Silica, May Contain Iron Oxides (CI 77491, CI 77492, CI 77499).',
    howToUse: 'Shake bottle thoroughly. Dispense 2-3 drops onto fingers or foundation brush. Blend seamlessly from the center of the face outward.',
    isBestSeller: false,
    isFeatured: true,
    isNewArrival: true,
    stockQuantity: 40,
    volumeOrWeight: '30ml / 1.0 fl oz'
  },
  {
    id: 'ad-prod-4',
    slug: 'diva-crown-rose-gold-palette',
    name: 'Diva Crown Luxe Eyeshadow Palette',
    category: 'eyes',
    subtitle: '12 rich buttery foil & velvet matte pigments',
    priceKES: 4200,
    originalPriceKES: 4800,
    rating: 4.9,
    reviewCount: 51,
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800&auto=format&fit=crop',
    description: 'Crafted for high impact with minimal fallout. Features 6 creamy velvet mattes, 4 pressed metallic bronzes & golds, and 2 duo-chrome toppers inspired by African sunsets and royal jewels.',
    ingredients: 'Mica, Talc, Synthetic Fluorphlogopite, Zinc Stearate, Octyldodecyl Stearoyl Stearate, Caprylic/Capric Triglyceride, Phenoxyethanol, Tocopheryl Acetate.',
    howToUse: 'Apply matte shades with a fluffy brush to crease and outer corner. Press foil shades onto center lid using fingertips for maximum molten shine.',
    isBestSeller: true,
    isFeatured: true,
    stockQuantity: 18,
    volumeOrWeight: '18g / 0.63 oz'
  },
  {
    id: 'ad-prod-5',
    slug: 'amber-oud-parfum-oil',
    name: 'Amiri Amber & Spiced Oud Perfume Oil',
    category: 'fragrance',
    subtitle: 'Intense artisanal alcohol-free fragrance elixir',
    priceKES: 4500,
    originalPriceKES: 5000,
    rating: 5.0,
    reviewCount: 33,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop',
    description: 'An intoxicating signature scent handcrafted in limited quantities. Warm golden amber blends seamlessly with rare Malaysian oud wood, damask rose, and Madagascar vanilla bean.',
    ingredients: 'Pure Parfum Fragrance Oil, Simmondsia Chinensis (Jojoba) Seed Oil, Caprylic/Capric Triglyceride, Tocopherol, Benzyl Benzoate, Linalool, Eugenol, Limonene.',
    howToUse: 'Dab the glass rollerball onto warm pulse points: wrists, behind ears, collarbones, and inside elbows. The scent intensifies with body warmth throughout the day.',
    isBestSeller: true,
    isFeatured: true,
    stockQuantity: 12,
    volumeOrWeight: '12ml / 0.4 fl oz'
  },
  {
    id: 'ad-prod-6',
    slug: 'hyaluronic-rose-hydramist',
    name: 'Hyaluronic & Organic Rosewater Hydra-Mist',
    category: 'skincare',
    subtitle: 'Dewy setting mist & skin revitalizer',
    priceKES: 1950,
    rating: 4.7,
    reviewCount: 29,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop',
    description: 'Instant hydration in a micro-fine spray. Infused with organic Damask Rose hydrosol, Sodium Hyaluronate, and soothing Aloe Vera leaf juice to instantly refresh makeup and boost skin plumpness.',
    ingredients: 'Rosa Damascena Flower Water, Aloe Barbadensis Leaf Juice, Glycerin, Sodium Hyaluronate, Centella Asiatica Extract, Potassium Sorbate, Citric Acid.',
    howToUse: 'Hold 8-10 inches away from face and spray in an X and T motion. Use before makeup to prep, after to set, or anytime during the day for a boost of dewiness.',
    isBestSeller: false,
    isNewArrival: true,
    stockQuantity: 45,
    volumeOrWeight: '100ml / 3.4 fl oz'
  },
  {
    id: 'ad-prod-7',
    slug: 'marula-silk-crown-hair-oil',
    name: 'Marula Silk Crown Scalp & Hair Elixir',
    category: 'hair',
    subtitle: 'Deep nourishing hair strengthener & shine serum',
    priceKES: 2800,
    rating: 4.9,
    reviewCount: 41,
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=800&auto=format&fit=crop',
    description: 'Formulated to lock in moisture, soothe dry scalp, and promote healthy growth. Combines pure Marula oil with Black Castor Oil and Peppermint essence.',
    ingredients: 'Sclerocarya Birrea (Marula) Seed Oil, Ricinus Communis (Jamaican Black Castor) Seed Oil, Argania Spinosa (Argan) Kernel Oil, Mentha Piperita (Peppermint) Oil, Rosemary Leaf Extract.',
    howToUse: 'Apply a few drops directly to scalp using dropper and massage gently in circular motions. Smooth remaining oil along hair strands to seal split ends.',
    isBestSeller: false,
    isFeatured: false,
    isNewArrival: true,
    stockQuantity: 22,
    volumeOrWeight: '50ml / 1.7 fl oz'
  },
  {
    id: 'ad-prod-8',
    slug: 'high-shine-glass-lip-gloss',
    name: 'Glass Reflection High-Shine Lip Gloss',
    category: 'lips',
    subtitle: 'Non-sticky cushion lip glaze with gold dust',
    priceKES: 1800,
    rating: 4.8,
    reviewCount: 26,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop',
    shades: [
      { name: 'Crystal Clear', colorHex: '#FFFFFF', inStock: true },
      { name: 'Champagne Sparkle', colorHex: '#E5C07B', inStock: true },
      { name: 'Rose Quartz', colorHex: '#E8A39A', inStock: true },
      { name: 'Honey Glaze', colorHex: '#C88D56', inStock: true }
    ],
    description: 'Enriched with Jojoba and Shea Butter, this non-sticky gloss drenches lips in a mirror-like shine while conditioning dry lip lines.',
    ingredients: 'Polybutene, Octyldodecanol, Hydrogenated Polyisobutene, Simmondsia Chinensis (Jojoba) Seed Oil, Tocopheryl Acetate, Silica Dimethyl Silylate.',
    howToUse: 'Glide on bare lips for a luminous natural sheen or layer over Velvet Satin Lip Elixir to create a multi-dimensional metallic lip statement.',
    isBestSeller: false,
    isNewArrival: true,
    stockQuantity: 30,
    volumeOrWeight: '5ml / 0.17 fl oz'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'ad-prod-1',
    author: 'Amina W. (Nairobi)',
    rating: 5,
    title: 'The shade Eldoret Sunset is absolute perfection!',
    comment: 'I bought this lip elixir last week and had it delivered to Nairobi. The formula is so comfortable, doesn\'t dry my lips, and stays on all day through lunch. Will definitely buy again!',
    date: '2026-08-01',
    verifiedPurchase: true,
    location: 'Nairobi, Kenya'
  },
  {
    id: 'rev-2',
    productId: 'ad-prod-2',
    author: 'Faith Chebet (Eldoret)',
    rating: 5,
    title: 'My holy grail face oil for cold Eldoret mornings!',
    comment: 'Living in Eldoret where mornings can get chilly and dry, this Baobab oil has completely transformed my skin barrier. My face looks radiant without feeling greasy.',
    date: '2026-07-28',
    verifiedPurchase: true,
    location: 'Eldoret Town, Kenya'
  },
  {
    id: 'rev-3',
    productId: 'ad-prod-5',
    author: 'Brenda K. (Mombasa)',
    rating: 5,
    title: 'Smells like absolute luxury!',
    comment: 'The Amber & Oud oil is divine. I get compliments everywhere I go in Mombasa. Pochi la Biashara payment process was smooth and quick!',
    date: '2026-08-05',
    verifiedPurchase: true,
    location: 'Mombasa, Kenya'
  }
];
