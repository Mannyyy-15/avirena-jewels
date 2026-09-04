import { Product, CurrencyConfig, Currency } from '../types';

export const CURRENCIES: Record<Currency, CurrencyConfig> = {
  INR: { code: 'INR', symbol: '₹', rate: 90.0, label: 'INR (₹)' },
  EUR: { code: 'EUR', symbol: '₹', rate: 90.0, label: 'INR (₹)' },
  USD: { code: 'USD', symbol: '₹', rate: 90.0, label: 'INR (₹)' },
  GBP: { code: 'GBP', symbol: '₹', rate: 90.0, label: 'INR (₹)' },
};

export const formatPrice = (price: number, currency: Currency = 'INR'): string => {
  const inrAmount = price < 500 ? Math.round(price * 90) : Math.round(price);
  return `₹${inrAmount.toLocaleString('en-IN')}`;
};

export const PRODUCTS: Product[] = [
  {
    id: 'square-form-necklace',
    name: 'Square Form Necklace',
    subtitle: 'Architectural Geometric Figaro Chain',
    category: 'necklaces',
    metal: 'Gold-Tone Brass',
    price: 32, // Premium dailywear pricing
    originalPrice: 40,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85',
    ],
    description: 'An architectural dailywear statement featuring interlocking square-cut Figaro links rendered in premium brass with an advanced anti-tarnish gold-tone finish.',
    details: [
      'Square profile interlocking links in durable premium brass',
      'Custom Avirena ergonomic box clasp with security lock',
      'Length: 45cm + 5cm extension for flexible layering',
      'Water-resistant & anti-tarnish e-coating for everyday longevity',
      'Homegrown design handcrafted by skilled Indian artisans'
    ],
    materials: 'Premium High-Grade Brass with Anti-Tarnish Gold-Tone E-Coating (Hypoallergenic & Nickel-Free)',
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
    metal: 'Gold-Tone Brass',
    price: 26,
    originalPrice: 32,
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Textured golden vortices created with organic molten folds that catch ambient light. Featherlight dailywear designed for zero lobe strain.',
    details: [
      'Handcrafted organic molten texture in premium brass',
      'Diameter: 22mm',
      'Surgical steel hypoallergenic posts with comfort secure backings',
      'Featherweight core for comfortable all-day wear'
    ],
    materials: 'High-Grade Brass with Anti-Tarnish Gold-Tone Finish, Surgical Steel Posts',
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
    metal: 'Silver-Tone Alloy',
    price: 28,
    images: [
      'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Inspired by modern kinetic art, this fluid ribbon pin secures outerwear, silk scarves, or tailored lapels with effortless grace.',
    details: [
      'High-polished mirror silver-tone protective finish',
      'Reinforced safety barrel closure pin',
      'Dimensions: 52mm x 26mm'
    ],
    materials: 'Durable Alloy & Brass with Anti-Tarnish Silver-Tone Polish',
    inStock: true,
    isSculptural: true,
    styledWithIds: ['twin-hoop-earrings', 'wave-prism-ring']
  },
  {
    id: 'ornate-scroll-pendant',
    name: 'Ornate Scroll Pendant',
    subtitle: 'Sculptural Filigree Relief Medallion',
    category: 'necklaces',
    metal: 'Gold-Tone Brass',
    price: 36,
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
    ],
    description: 'An intricate openwork relief medallion suspended on an airy chain. A statement dailywear jewel designed to elevate any outfit.',
    details: [
      'Intricate laser-detailed openwork scroll medallion',
      '50cm adjustable trace chain with 5cm extension',
      'Pendant diameter: 28mm'
    ],
    materials: 'High-Grade Brass with Dual-Layer Anti-Tarnish Gold-Tone Finish',
    sizes: ['45 cm + 5 cm Extender'],
    inStock: true,
    isBestseller: true,
    styledWithIds: ['lucid-studs', 'two-pearl-cuff']
  },
  {
    id: 'two-pearl-cuff',
    name: 'Two Pearl Cuff',
    subtitle: 'Open Wire Bangle with Floating Lustrous Pearls',
    category: 'bracelets',
    metal: 'Gold-Tone Brass',
    price: 29,
    images: [
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'A minimal open cuff framed with dual luminous cultured pearls nestled at each terminal tip. Ergonomic tension band effortlessly adjusts to any wrist.',
    details: [
      'Flexible open contour architecture with spring-back memory in brass',
      'Lustrous hand-selected pearls (approx 8mm)',
      'Anti-tarnish gold-tone protective seal'
    ],
    materials: 'Durable Brass with Gold-Tone Finish & Cultured Lustrous Pearls',
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
    metal: 'Silver-Tone Alloy',
    price: 22,
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Sculpted with vertical flute ridges that capture light in rhythmic intervals. Subtle dailywear luxury suitable for daily work and outings.',
    details: [
      'Click-in snap huggie clasp with secure locking mechanism',
      'Diameter: 22mm, width: 8mm',
      'Hypoallergenic dailywear construction'
    ],
    materials: 'Durable Alloy & Brass with Anti-Tarnish Silver-Tone Finish',
    inStock: true,
    styledWithIds: ['solid-wave-brooch', 'linked-heart-bracelet']
  },
  {
    id: 'row-edge-ring',
    name: 'Row Edge Ring',
    subtitle: 'Etched Sunburst Wide Gold-Tone Cigar Band',
    category: 'rings',
    metal: 'Gold-Tone Brass',
    price: 24,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Etched with fine ray motifs. A standout standalone piece or confident ring-stack foundation for everyday styling.',
    details: [
      'Comfort-fit smooth polished interior',
      'Micro-etched relief detailing along edge fluting',
      'Band width: 8mm'
    ],
    materials: 'High-Grade Brass with Anti-Tarnish Gold-Tone Finish',
    sizes: ['US 5', 'US 6', 'US 7', 'US 8', 'US 9'],
    inStock: true,
    isBestseller: true,
    styledWithIds: ['wave-prism-ring', 'square-form-necklace']
  },
  {
    id: 'wave-prism-ring',
    name: 'Wave Prism Ring',
    subtitle: 'Faceted Crystal on Contoured Band',
    category: 'rings',
    metal: 'Gold-Tone Brass',
    price: 22,
    images: [
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'A single bezel-set faceted sparkling zirconia crystal nestled atop a contoured, knife-edge minimal band.',
    details: [
      '4.5mm round brilliant cut sparkling cubic zirconia',
      'Low-profile protective bezel setting in brass',
      'Micro knife-edge contour band'
    ],
    materials: 'Durable Brass with Gold-Tone Coating, Brilliant Zirconia Crystal',
    sizes: ['US 5', 'US 6', 'US 7', 'US 8'],
    inStock: true,
    styledWithIds: ['row-edge-ring', 'two-pearl-cuff']
  },
  {
    id: 'shell-radiance-studs',
    name: 'Shell Radiance Studs',
    subtitle: 'Scalloped Textured Fan Seashell Earrings',
    category: 'earrings',
    metal: 'Gold-Tone Brass',
    price: 23,
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Delicate fluted scallop shells sculpted from molded brass with an anti-tarnish golden luster, capturing coastal aesthetics with everyday refinement.',
    details: [
      'Dimensions: 16mm x 14mm',
      'Hypoallergenic post and silicone-padded backing',
      'Featherweight 3.8g pair weight for zero fatigue'
    ],
    materials: 'High-Grade Brass with Anti-Tarnish Gold-Tone Finish',
    inStock: true,
    isBestseller: true,
    styledWithIds: ['gold-curve-necklace', 'two-pearl-cuff']
  },
  {
    id: 'gold-curve-necklace',
    name: 'Gold Curve Necklace',
    subtitle: 'Minimalist Wavy Wire Collar Necklace',
    category: 'necklaces',
    metal: 'Gold-Tone Brass',
    price: 34,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'An architectural Y-silhouette featuring a fluid molten wire arch that floats gracefully over the clavicle collarbone.',
    details: [
      'Fluid hand-shaped golden wire centerpiece in brass',
      'Adjustable 42cm + 5cm cable chain',
      'Comfort tapered dailywear profile'
    ],
    materials: 'Premium Brass with Anti-Tarnish Gold-Tone Finish',
    sizes: ['42 cm + 5 cm Extender'],
    inStock: true,
    isSculptural: true,
    styledWithIds: ['shell-radiance-studs', 'scalo-bracelet']
  },
  {
    id: 'accent-earrings',
    name: 'Accent Huggies',
    subtitle: 'Micro Crystal Huggie Hoops',
    category: 'earrings',
    metal: 'Gold-Tone Brass',
    price: 25,
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Refined miniature hoops encrusted with hand-set brilliant micro crystals. Designed to hug the lobe seamlessly for daily styling.',
    details: [
      'Precision flush-set sparkling micro crystals',
      'Audible locking snap closure',
      'Inner diameter: 10mm, outer 14mm'
    ],
    materials: 'Durable Brass with Gold-Tone Finish, High-Brilliance Zirconia Crystals',
    inStock: true,
    isBestseller: true,
    styledWithIds: ['square-form-necklace', 'scalo-bracelet']
  },
  {
    id: 'linked-heart-bracelet',
    name: 'Linked Heart Bracelet',
    subtitle: 'Liquid Snake Chain with Sculpted Heart Toggle',
    category: 'bracelets',
    metal: 'Silver-Tone Alloy',
    price: 26,
    images: [
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'A liquid-finish snake chain completed by an organic, sculpted heart charm and ergonomic T-bar toggle.',
    details: [
      'High-grade brass and alloy core',
      'Total chain length: 18cm',
      'Anti-tarnish silver-tone e-coating for shine retention'
    ],
    materials: 'Premium Brass & Alloy with Anti-Tarnish Silver-Tone Finish',
    sizes: ['17 cm', '19 cm'],
    inStock: true,
    styledWithIds: ['twin-hoop-earrings', 'solid-wave-brooch']
  },
  {
    id: 'scalo-bracelet',
    name: 'Scalo Bracelet',
    subtitle: 'Undulating Molten Wave Wrist Cuff',
    category: 'bracelets',
    metal: 'Gold-Tone Brass',
    price: 35,
    originalPrice: 42,
    images: [
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'A continuous fluid wave of gold-tone brass that wraps organically around the wrist. Sculpted with an architectural opening for effortless wear.',
    details: [
      'Adjustable tension fit cuff in durable brass',
      'Width: 16mm at undulating peak',
      'Comfortable lightweight dailywear build'
    ],
    materials: 'High-Grade Brass with Anti-Tarnish Gold-Tone Protective Coating',
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
    metal: 'Gold-Tone Brass',
    price: 28,
    originalPrice: 35,
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85',
    ],
    description: 'Bold, hollow-formed spherical dome studs echoing modern architecture. Featherlight for all-day comfort yet visually commanding.',
    details: [
      'Hollow-form construction for zero lobe fatigue',
      'High-polish mirror gold-tone finish',
      'Surgical steel hypoallergenic posts with secure backing',
      'Diameter: 26mm'
    ],
    materials: 'Premium Brass with Anti-Tarnish Gold-Tone Finish, Surgical Steel Posts',
    inStock: true,
    isBestseller: true,
    isSculptural: true,
    styledWithIds: ['square-form-necklace', 'scalo-bracelet']
  },
  {
    id: 'pearl-drop-meridian',
    name: 'Pearl Drop Meridian',
    subtitle: 'Figaro Chain with Floating Baroque Pearl',
    category: 'necklaces',
    metal: 'Gold-Tone Brass',
    price: 36,
    originalPrice: 45,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'A classic Figaro link chain reimagined with a lustrous teardrop baroque pearl floating asymmetrically at the collarbone.',
    details: [
      'Durable Figaro chain in 4.5mm width in brass',
      'Luminous cultured teardrop baroque pearl (18mm)',
      'Length: 42cm + 5cm extension'
    ],
    materials: 'High-Grade Brass with Anti-Tarnish Gold-Tone Coating, Cultured Baroque Pearl',
    sizes: ['42 cm', '45 cm'],
    inStock: true,
    isBestseller: true,
    isSculptural: true,
    styledWithIds: ['dome-studs', 'two-pearl-cuff']
  },
  {
    id: 'luna-pearl-choker',
    name: 'Luna Pearl Choker',
    subtitle: 'Triple-Wire Gold-Tone Choker with Baroque Pearl',
    category: 'necklaces',
    metal: 'Gold-Tone Brass',
    price: 39,
    originalPrice: 48,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=1200&q=85',
    ],
    description: 'A sculptural layered collar choker featuring three fine fluid gold-tone brass bands crowned with an organic irregular cultured baroque pearl.',
    details: [
      'Triple layered contour collar in high-grade brass with anti-tarnish protective finish',
      'Naturally formed organic baroque pearl (approx 16-18mm)',
      'Hypoallergenic, nickel-free & water-resistant dailywear build',
      'Custom Avirena ergonomic box clasp with 2-inch micro-extender'
    ],
    materials: 'Premium Brass with Anti-Tarnish Gold-Tone Finish, Cultured Baroque Pearl',
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
    metal: 'Gold-Tone Brass',
    price: 24,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=85',
    ],
    description: 'Two parallel organic ripples of gold-tone brass create an illusion of floating layers on the finger. Sculpted with generous curves and ergonomic tapering.',
    details: [
      'Organic double-tier open contour architecture in durable brass',
      'Comfort-fit tapered inner profile for everyday wear',
      'Width: 9mm at apex, tapering to 4mm base'
    ],
    materials: 'High-Grade Brass with Anti-Tarnish Gold-Tone Coating',
    sizes: ['US 5', 'US 6', 'US 7', 'US 8'],
    inStock: true,
    isBestseller: true,
    styledWithIds: ['scalo-bracelet', 'luna-pearl-choker']
  },
  {
    id: 'veda-ring',
    name: 'Veda Woven Ring',
    subtitle: 'Braided Molten Gold-Tone Band',
    category: 'rings',
    metal: 'Gold-Tone Brass',
    price: 22,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Three intertwined golden strands woven seamlessly into a continuous infinity loop, signifying eternal poise.',
    details: [
      'Intricate triple-strand hand braid in brass',
      'Width: 5.5mm',
      'Comfortable lightweight dailywear profile'
    ],
    materials: 'Durable Brass with Anti-Tarnish Gold-Tone Finish',
    sizes: ['US 5', 'US 6', 'US 7', 'US 8', 'US 9'],
    inStock: true,
    isBestseller: true,
    styledWithIds: ['papette-gem-ring', 'luna-pearl-choker']
  },
  {
    id: 'papette-gem-ring',
    name: 'Papette Pavé Cigar Ring',
    subtitle: 'Encrusted Micro-Crystal Wide Statement Band',
    category: 'rings',
    metal: 'Gold-Tone Brass',
    price: 26,
    originalPrice: 32,
    images: [
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'A substantial domed cigar band encrusted with flush-set sparkling crystals in an organic celestial constellation.',
    details: [
      'Flush-set brilliant cubic zirconia crystals',
      'Substantial 10mm width tapering to 5mm base',
      'Durable dailywear finish'
    ],
    materials: 'High-Grade Brass with Anti-Tarnish Gold-Tone Finish, Brilliant Zirconia Crystals',
    sizes: ['US 6', 'US 7', 'US 8'],
    inStock: true,
    styledWithIds: ['veda-ring', 'scalo-bracelet']
  }
];
