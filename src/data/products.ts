import { Product, CurrencyConfig, Currency } from '../types';

export const CURRENCIES: Record<Currency, CurrencyConfig> = {
  EUR: { code: 'EUR', symbol: '€', rate: 1.0, label: 'EUR (€)' },
  INR: { code: 'INR', symbol: '₹', rate: 90.0, label: 'INR (₹)' },
  USD: { code: 'USD', symbol: '$', rate: 1.08, label: 'USD ($)' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.85, label: 'GBP (£)' },
};

export const formatPrice = (priceInEur: number, currency: Currency): string => {
  const config = CURRENCIES[currency];
  const converted = priceInEur * config.rate;
  
  if (currency === 'INR') {
    return `₹${Math.round(converted).toLocaleString('en-IN')}`;
  } else if (currency === 'EUR') {
    return `€${Math.round(converted)}`;
  } else if (currency === 'USD') {
    return `$${Math.round(converted)}`;
  } else {
    return `£${Math.round(converted)}`;
  }
};

export const PRODUCTS: Product[] = [
  {
    id: 'square-form-necklace',
    name: 'Square Form Necklace',
    subtitle: 'Architectural Geometric Figaro Chain',
    category: 'necklaces',
    metal: '18k Gold Vermeil',
    price: 176, // ~$190 in USD
    originalPrice: 200,
    rating: 5.0,
    reviewsCount: 34,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85',
    ],
    description: 'An architectural statement featuring interlocking square-cut Figaro links rendered in heavy 18k gold vermeil. Clean geometric silhouette designed for effortless modern elegance.',
    details: [
      'Square profile hand-assembled interlocking links',
      'Custom Avirena ergonomic box clasp with security lock',
      'Length: 45cm + 5cm extension',
      'Heavy 18k thick gold vermeil over 925 sterling silver',
      'Handcrafted by master Italian & Indian goldsmiths'
    ],
    materials: '18k Solid Gold Vermeil (3.0 microns) over Recycled 925 Sterling Silver',
    sizes: ['42 cm', '45 cm', '50 cm'],
    inStock: true,
    isBestseller: true,
    isSculptural: true,
    styledWithIds: ['lucid-studs', 'scalo-bracelet', 'row-edge-ring']
  },
  {
    id: 'lucid-studs',
    name: 'Lucid Studs',
    subtitle: 'Sculptural Molten Organic Spiral Studs',
    category: 'earrings',
    metal: '18k Gold Vermeil',
    price: 157, // ~$170 USD
    originalPrice: 180,
    rating: 4.9,
    reviewsCount: 48,
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Textured golden vortices created with organic folds that catch ambient light from every angle. Understated luxury at its finest.',
    details: [
      'Hand-wax molded molten texture',
      'Diameter: 22mm',
      'Titanium-reinforced post with wide comfort backing',
      'Featherweight hollow core for zero lobe fatigue'
    ],
    materials: '18k Gold Vermeil on 925 Sterling Silver',
    inStock: true,
    isBestseller: true,
    isSculptural: true,
    styledWithIds: ['square-form-necklace', 'row-edge-ring']
  },
  {
    id: 'solid-wave-brooch',
    name: 'Solid Wave Brooch',
    subtitle: 'Fluid Sculptural Kinetic Ribbon Pin',
    category: 'brooches',
    metal: '925 Sterling Silver',
    price: 208, // ~$225 USD
    rating: 4.8,
    reviewsCount: 21,
    images: [
      'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Inspired by modern kinetic art, this fluid ribbon pin secures outerwear, silk scarves, or tailored lapels with effortless grace.',
    details: [
      'High-polished mirror rhodium-plated sterling silver',
      'Reinforced safety barrel closure',
      'Dimensions: 52mm x 26mm'
    ],
    materials: 'Solid 925 Sterling Silver with anti-tarnish rhodium barrier',
    inStock: true,
    isSculptural: true,
    styledWithIds: ['twin-hoop-earrings', 'wave-prism-ring']
  },
  {
    id: 'ornate-scroll-pendant',
    name: 'Ornate Scroll Pendant',
    subtitle: 'Italian Renaissance Relief Medallion',
    category: 'necklaces',
    metal: '18k Gold Vermeil',
    price: 231, // ~$250 USD
    rating: 4.9,
    reviewsCount: 56,
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
    ],
    description: 'A celebration of Italian Renaissance scrollwork translated into modern, minimal architecture. An ornate openwork medallion suspended on an airy box chain.',
    details: [
      'Intricate laser-sculpted relief medallion',
      '50cm adjustable diamond-cut trace chain with 5cm extension',
      'Pendant diameter: 28mm'
    ],
    materials: '18k Gold Vermeil with anti-scratch ceramic micro-coating',
    sizes: ['45 cm + 5 cm Extender'],
    inStock: true,
    isBestseller: true,
    styledWithIds: ['lucid-studs', 'two-pearl-cuff']
  },
  {
    id: 'two-pearl-cuff',
    name: 'Two Pearl Cuff',
    subtitle: 'Open Gold Wire Bangle with Floating Pearls',
    category: 'bracelets',
    metal: '18k Gold Vermeil',
    price: 143, // ~$155 USD
    rating: 4.8,
    reviewsCount: 29,
    images: [
      'https://images.unsplash.com/photo-1611591475168-98967b5eb488?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'A minimal open cuff framed with dual luminous freshwater pearls nestled at each terminal tip. Ergonomic tension band effortlessly adjusts to any wrist.',
    details: [
      'Flexible open contour architecture with spring-back memory',
      'Naturally formed grade-AAA white freshwater pearls (approx 8mm)',
      '18k thick yellow gold vermeil'
    ],
    materials: '18k Gold Vermeil over Recycled 925 Silver, Grade-AAA Pearls',
    sizes: ['Small (14-16cm)', 'Medium (16-18cm)', 'Large (18-20cm)'],
    inStock: true,
    isBestseller: true,
    styledWithIds: ['ornate-scroll-pendant', 'wave-prism-ring']
  },
  {
    id: 'twin-hoop-earrings',
    name: 'Twin Hoop Earrings',
    subtitle: 'Two-Tone Ribbed Oval Huggie Hoops',
    category: 'earrings',
    metal: '925 Sterling Silver',
    price: 88, // ~$95 USD
    rating: 4.7,
    reviewsCount: 19,
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Sculpted with vertical flute ridges that capture light in rhythmic intervals. Subtle luxury suitable for both boardroom and candlelit dinners.',
    details: [
      'Click-in snap huggie clasp with audible locking mechanism',
      'Diameter: 22mm, width: 8mm',
      'Solid 925 Silver with rhodium plating'
    ],
    materials: 'Rhodium-Plated 925 Sterling Silver',
    inStock: true,
    styledWithIds: ['solid-wave-brooch', 'linked-heart-bracelet']
  },
  {
    id: 'row-edge-ring',
    name: 'Row Edge Ring',
    subtitle: 'Etched Sunburst Wide Gold Cigar Band',
    category: 'rings',
    metal: '18k Gold Vermeil',
    price: 104, // ~$112 USD
    rating: 4.8,
    reviewsCount: 38,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Etched with fine ray motifs inspired by ancient astronomical instruments. A standout standalone piece or confident ring-stack foundation.',
    details: [
      'Comfort-fit polished interior',
      'Micro-etched relief detailing along edge fluting',
      'Band width: 8mm'
    ],
    materials: '18k Gold Vermeil over 925 Silver',
    sizes: ['US 5', 'US 6', 'US 7', 'US 8', 'US 9'],
    inStock: true,
    isBestseller: true,
    styledWithIds: ['wave-prism-ring', 'square-form-necklace']
  },
  {
    id: 'wave-prism-ring',
    name: 'Wave Prism Ring',
    subtitle: 'Solitary Topaz on Contoured Gold Band',
    category: 'rings',
    metal: '18k Gold Vermeil',
    price: 97, // ~$105 USD
    rating: 4.9,
    reviewsCount: 41,
    images: [
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'A single bezel-set faceted white topaz nestled atop a contoured, knife-edge minimal band. Stacks seamlessly alongside bold cigar bands.',
    details: [
      '4.5mm round brilliant cut natural white topaz',
      'Low-profile protective bezel setting',
      'Micro knife-edge contour band'
    ],
    materials: '18k Gold Vermeil, Natural Untreated White Topaz',
    sizes: ['US 5', 'US 6', 'US 7', 'US 8'],
    inStock: true,
    styledWithIds: ['row-edge-ring', 'two-pearl-cuff']
  },
  {
    id: 'shell-radiance-studs',
    name: 'Shell Radiance Studs',
    subtitle: 'Scalloped Textured Fan Seashell Earrings',
    category: 'earrings',
    metal: '18k Gold Vermeil',
    price: 106, // ~$115 USD
    rating: 4.8,
    reviewsCount: 33,
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Delicate fluted scallop shells sculpted from cast gold, capturing coastal sunlight with timeless refinement.',
    details: [
      'Dimensions: 16mm x 14mm',
      'Hypoallergenic post and silicone-padded backing',
      'Featherweight 3.8g pair weight'
    ],
    materials: '18k Gold Vermeil',
    inStock: true,
    isBestseller: true,
    styledWithIds: ['gold-curve-necklace', 'two-pearl-cuff']
  },
  {
    id: 'gold-curve-necklace',
    name: 'Gold Curve Necklace',
    subtitle: 'Minimalist Wavy Wire Collar Necklace',
    category: 'necklaces',
    metal: '18k Gold Vermeil',
    price: 194, // ~$210 USD
    rating: 4.8,
    reviewsCount: 27,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'An architectural Y-silhouette featuring a fluid molten wire arch that floats gracefully over the clavicle collarbone.',
    details: [
      'Fluid hand-cast golden wire centerpiece',
      'Adjustable 42cm + 5cm cable chain',
      'Comfort tapered profile'
    ],
    materials: '18k Gold Vermeil on 925 Sterling Silver',
    sizes: ['42 cm + 5 cm Extender'],
    inStock: true,
    isSculptural: true,
    styledWithIds: ['shell-radiance-studs', 'scalo-bracelet']
  },
  {
    id: 'accent-earrings',
    name: 'Accent Huggies',
    subtitle: 'Diamond Pavé Micro Huggie Hoops',
    category: 'earrings',
    metal: '18k Gold Vermeil',
    price: 231, // ~$250 USD
    rating: 5.0,
    reviewsCount: 52,
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Refined miniature hoops encrusted with hand-set brilliant lab crystals. Designed to hug the lobe with seamless brilliance.',
    details: [
      'Precision flush-set lab zircons',
      'Audible locking snap closure',
      'Inner diameter: 10mm, outer 14mm'
    ],
    materials: '18k Gold Vermeil, Lab-grown Flawless Zircons',
    inStock: true,
    isBestseller: true,
    styledWithIds: ['square-form-necklace', 'scalo-bracelet']
  },
  {
    id: 'linked-heart-bracelet',
    name: 'Linked Heart Bracelet',
    subtitle: 'Liquid Snake Chain with Sculpted Heart Toggle',
    category: 'bracelets',
    metal: '925 Sterling Silver',
    price: 125, // ~$135 USD
    rating: 4.9,
    reviewsCount: 36,
    images: [
      'https://images.unsplash.com/photo-1611591475168-98967b5eb488?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'A liquid-finish snake chain completed by an organic, non-symmetrical sculpted heart charm and ergonomic T-bar toggle.',
    details: [
      'High-grade solid 925 sterling silver',
      'Total chain length: 18cm',
      'Rhodium plated for maximum shine retention'
    ],
    materials: '925 Sterling Silver',
    sizes: ['17 cm', '19 cm'],
    inStock: true,
    styledWithIds: ['twin-hoop-earrings', 'solid-wave-brooch']
  },
  {
    id: 'scalo-bracelet',
    name: 'Scalo Bracelet',
    subtitle: 'Undulating Molten Wave Wrist Cuff',
    category: 'bracelets',
    metal: '18k Gold Vermeil',
    price: 213, // ~$230 USD
    originalPrice: 250,
    rating: 4.9,
    reviewsCount: 44,
    images: [
      'https://images.unsplash.com/photo-1611591475168-98967b5eb488?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'A continuous fluid wave of 18k gold that wraps organically around the wrist. Sculpted with an architectural opening for effortless wear.',
    details: [
      'Adjustable tension fit cuff',
      'Width: 16mm at undulating peak',
      'Weight: 24.5 grams solid core'
    ],
    materials: '18k Gold Vermeil over hypoallergenic 925 Silver',
    sizes: ['Small (14-16cm)', 'Medium (16-18cm)', 'Large (18-20cm)'],
    inStock: true,
    isBestseller: true,
    isSculptural: true,
    styledWithIds: ['square-form-necklace', 'row-edge-ring']
  },
  {
    id: 'dome-studs',
    name: 'Dome Studs',
    subtitle: 'Sculptural Molten Spherical Stud Earrings',
    category: 'earrings',
    metal: '18k Gold Vermeil',
    price: 167, // ~$180 USD
    originalPrice: 200,
    rating: 5.0,
    reviewsCount: 62,
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85',
    ],
    description: 'Bold, hollow-cast spherical dome studs echoing modern mid-century architecture. Feather-light for all-day comfort yet visually commanding.',
    details: [
      'Hollow-form construction for zero lobe fatigue',
      'High-polish mirror 18k gold vermeil finish',
      'Titanium reinforced post and secure wide backing',
      'Diameter: 26mm'
    ],
    materials: '18k Gold Vermeil over 925 Sterling Silver',
    inStock: true,
    isBestseller: true,
    isSculptural: true,
    styledWithIds: ['square-form-necklace', 'scalo-bracelet']
  },
  {
    id: 'pearl-drop-meridian',
    name: 'Pearl Drop Meridian',
    subtitle: 'Chunky Figaro Chain with Floating Baroque Pearl',
    category: 'necklaces',
    metal: '18k Gold Vermeil',
    price: 222, // ~$240 USD
    originalPrice: 260,
    rating: 4.9,
    reviewsCount: 49,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'A classic Italian Figaro link reimagined with a lustrous teardrop freshwater pearl floating asymmetrically at the collarbone.',
    details: [
      'Heavy solid Figaro chain in 4.5mm width',
      'Grade AAA luminous freshwater teardrop pearl (18mm)',
      'Length: 42cm + 5cm extension'
    ],
    materials: '18k Gold Vermeil, Natural Luminous Baroque Pearl',
    sizes: ['42 cm', '45 cm'],
    inStock: true,
    isBestseller: true,
    isSculptural: true,
    styledWithIds: ['dome-studs', 'two-pearl-cuff']
  },
  {
    id: 'luna-pearl-choker',
    name: 'Luna Pearl Choker',
    subtitle: 'Triple-Wire Gold Choker with Baroque Pearl',
    category: 'necklaces',
    metal: '18k Gold Vermeil',
    price: 280,
    originalPrice: 320,
    rating: 4.9,
    reviewsCount: 42,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1611591475168-98967b5eb488?auto=format&fit=crop&w=1200&q=85',
    ],
    description: 'A sculptural layered collar choker featuring three fine fluid gold bands crowned with an organic irregular cultured baroque freshwater pearl.',
    details: [
      'Triple layered contour collar in 18k thick gold vermeil over 925 sterling silver',
      'Naturally formed organic baroque pearl (approx 16-18mm)',
      'Hypoallergenic, nickel-free & anti-tarnish protective finish',
      'Custom Avirena ergonomic box clasp with 2-inch micro-extender'
    ],
    materials: '18k Solid Gold Vermeil over Recycled 925 Sterling Silver, Grade-A Natural Baroque Pearl',
    sizes: ['38 cm', '40 cm', '42 cm', '45 cm'],
    inStock: true,
    isBestseller: true,
    isSculptural: true,
    styledWithIds: ['dome-studs', 'scalo-bracelet']
  },
  {
    id: 'vela-ring',
    name: 'Vela Dual Wave Ring',
    subtitle: 'Contoured Sculptural Double Band',
    category: 'rings',
    metal: '18k Gold Vermeil',
    price: 175,
    rating: 4.8,
    reviewsCount: 29,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=85',
    ],
    description: 'Two parallel organic ripples of molten gold create an illusion of floating layers on the finger. Sculpted with generous curves and ergonomic tapering.',
    details: [
      'Organic double-tier open contour architecture',
      'Comfort-fit tapered inner profile',
      'Width: 9mm at apex, tapering to 4mm base'
    ],
    materials: 'Heavy 18k Yellow Gold Vermeil on recycled 925 Silver',
    sizes: ['US 5', 'US 6', 'US 7', 'US 8'],
    inStock: true,
    isBestseller: true,
    styledWithIds: ['scalo-bracelet', 'luna-pearl-choker']
  },
  {
    id: 'veda-ring',
    name: 'Veda Woven Ring',
    subtitle: 'Braided Molten Gold Band',
    category: 'rings',
    metal: '18k Gold Vermeil',
    price: 145,
    rating: 5.0,
    reviewsCount: 37,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Three intertwined golden strands woven seamlessly by hand into a continuous infinity loop, signifying eternal poise.',
    details: [
      'Intricate triple-strand hand braid',
      'Width: 5.5mm',
      'Solid weight with silky inner profile'
    ],
    materials: '18k Solid Gold Vermeil',
    sizes: ['US 5', 'US 6', 'US 7', 'US 8', 'US 9'],
    inStock: true,
    isBestseller: true,
    styledWithIds: ['papette-gem-ring', 'luna-pearl-choker']
  },
  {
    id: 'papette-gem-ring',
    name: 'Papette Pavé Cigar Ring',
    subtitle: 'Encrusted Pavé Wide Statement Band',
    category: 'rings',
    metal: '18k Gold Vermeil',
    price: 215,
    originalPrice: 250,
    rating: 4.9,
    reviewsCount: 45,
    images: [
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'A substantial domed cigar band encrusted with flush-set laboratory gemstones in an organic celestial constellation.',
    details: [
      'Flush-set lab zircons across upper arch',
      'Substantial 10mm width tapering to 5mm base',
      'Weight: 8.4 grams'
    ],
    materials: '18k Gold Vermeil, Lab Brilliance Crystals',
    sizes: ['US 6', 'US 7', 'US 8'],
    inStock: true,
    styledWithIds: ['veda-ring', 'scalo-bracelet']
  }
];
