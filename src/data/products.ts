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

/**
 * Resolves the compare-at price (MRP) for discount display.
 * If a valid compare-at price > selling price is provided, it is prioritized.
 * Otherwise, derives an attractive luxury retail MRP (~65%–72% off, ending in 99).
 */
export const getCompareAtPrice = (price: number, existingOriginalPrice?: number): number => {
  if (existingOriginalPrice && existingOriginalPrice > price) {
    return existingOriginalPrice;
  }
  const inrSelling = price < 500 ? Math.round(price * 90) : Math.round(price);
  
  let inrCompare: number;
  if (inrSelling <= 500) {
    inrCompare = 1699; // ~70% off
  } else if (inrSelling <= 600) {
    inrCompare = 1899; // ~68% off (Volute Spiral: 599 vs 1899 = 68% off)
  } else if (inrSelling <= 700) {
    inrCompare = 2199; // ~68%–70% off (Solene 649, Lume 699, Petra 699)
  } else if (inrSelling <= 800) {
    inrCompare = 2499; // ~68%–70% off (Foglia 749 vs 2499, Nadir 799, Amara 799)
  } else if (inrSelling <= 1000) {
    inrCompare = 2999; // ~68%–70% off
  } else if (inrSelling <= 1250) {
    inrCompare = 3999; // ~70% off (Forma 1199 vs 3999 = 70% off)
  } else if (inrSelling <= 1500) {
    inrCompare = 4699; // ~68%–70% off
  } else {
    inrCompare = Math.round((inrSelling * 3.2) / 100) * 100 - 1;
  }

  return price < 500 ? inrCompare / 90.0 : inrCompare;
};

/**
 * Calculates the integer discount percentage between selling price and compare-at price.
 */
export const getDiscountPercentage = (price: number, compareAtPrice?: number): number => {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  const inrSelling = price < 500 ? Math.round(price * 90) : Math.round(price);
  const inrCompare = compareAtPrice < 500 ? Math.round(compareAtPrice * 90) : Math.round(compareAtPrice);
  if (inrCompare <= inrSelling) return 0;
  return Math.max(1, Math.round(((inrCompare - inrSelling) / inrCompare) * 100));
};

export const PRODUCTS: Product[] = [
  {
    id: 'avirena-square-studs-gold-tone-brass-earrings',
    shopifyId: 'gid://shopify/Product/10511623815490',
    handle: 'avirena-square-studs-gold-tone-brass-earrings',
    name: 'Avirena Square Studs',
    subtitle: 'Modern Geometric Square Stud Earrings',
    category: 'earrings',
    metal: 'Gold-Tone Brass',
    price: 8.88,
    originalPrice: 27.77,
    images: [
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/square_nadir-square-studs-gold-tone-brass-earrings_1.png?v=1788779598',
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/square_clean_nadir-square-studs-gold-tone-brass-earrings_2.png?v=1788782981',
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/ChatGPTImageSep3_2026_03_17_00PM.png?v=1788433626',
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/square_clean_nadir-square-studs-gold-tone-brass-earrings_4.png?v=1788783010',
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/ChatGPTImageSep3_2026_03_17_40PM.png?v=1788433627',
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/square_clean_nadir-square-studs-gold-tone-brass-earrings_6.png?v=1788783055'
    ],
    description: 'Modern geometry. Effortless statement. A refined square silhouette that adds structure to everyday dressing. Brushed gold-tone texture meets a smooth polished edge, creating a subtle contrast that catches the light as you move. Clean enough for the office, distinctive enough for evenings. Product highlights Modern geometric square design Brushed and polished surface contrast Contemporary statement silhouette Lightweight for comfortable all-day wear Materials High-grade brass with an anti-tarnish gold-tone protective coating Nickel-free, lead-free and cadmium-free Surgical steel posts, suitable for sensitive skin This is fashion jewellery. It is not solid gold, gold vermeil or sterling silver, and is not hallmarked to any precious-metal standard. Style them with Sarees and ethnic wear Dresses and evening outfits Shirts and smart-casual looks Office wear Care Remove before swimming, bathing or exercise. Apply perfume and lotion before putting them on. Wipe gently with a soft dry cloth after wear and store dry. Tracked express delivery. Free delivery across India. 7-day easy returns on unworn pieces in original packaging.',
    details: [
      'Modern geometric square design with brushed-and-polished contrast',
      'Contemporary architectural statement silhouette',
      'Lightweight core for comfortable all-day wear',
      'Surgical steel hypoallergenic posts for sensitive ears',
      'Free delivery across India & 7-day easy returns'
    ],
    materials: 'High-grade brass with anti-tarnish gold-tone protective coating (nickel-free, lead-free) and surgical steel posts',
    inStock: true,
    isBestseller: true,
    isSculptural: true
  },
  {
    id: 'avirena-drop-earrings-gold-tone-brass',
    shopifyId: 'gid://shopify/Product/10511624438082',
    handle: 'avirena-drop-earrings-gold-tone-brass',
    name: 'Avirena Drop Earrings',
    subtitle: 'Elongated Minimalist Drop Earrings',
    category: 'earrings',
    metal: 'Gold-Tone Brass',
    price: 7.77,
    originalPrice: 24.43,
    images: [
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/square_lume-drop-earrings-gold-tone-brass_1.png?v=1788779533',
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/square_clean_lume-drop-earrings-gold-tone-brass_2.png?v=1788782837',
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/square_clean_lume-drop-earrings-gold-tone-brass_3.png?v=1788782872',
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/square_clean_lume-drop-earrings-gold-tone-brass_4.png?v=1788782905',
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/square_clean_lume-drop-earrings-gold-tone-brass_5.png?v=1788782931',
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/square_clean_lume-drop-earrings-gold-tone-brass_6.png?v=1788782949'
    ],
    description: 'Delicate length. Effortless elegance. An elongated silhouette with a sleek polished finish, finished with a clear round accent that catches the light as it moves. Streamlined enough for daily wear, graceful enough to carry an evening look. Product highlights Elegant elongated drop design Minimalist contemporary silhouette Polished gold-tone finish Clear round accent detail Light on the lobe for all-day wear Materials High-grade brass with an anti-tarnish gold-tone protective coating Nickel-free, lead-free and cadmium-free Surgical steel posts, suitable for sensitive skin This is fashion jewellery. It is not solid gold, gold vermeil or sterling silver, and is not hallmarked to any precious-metal standard. Perfect for Everyday and office wear Dinner dates and celebrations Sarees and ethnic wear Dresses and western outfits Gifting Care Remove before swimming, bathing or exercise. Apply perfume and lotion before putting them on. Wipe gently with a soft dry cloth after wear and store dry. Tracked express delivery. Free delivery across India. 7-day easy returns on unworn pieces in original packaging.',
    details: [
      'Elegant elongated drop design with clear round accent detail',
      'Streamlined minimalist silhouette suitable from office to evening',
      'Hollow-formed drop staying featherlight on the lobe',
      'Surgical steel hypoallergenic posts for sensitive ears',
      'Free delivery across India & 7-day easy returns'
    ],
    materials: 'High-grade brass with anti-tarnish gold-tone protective coating (nickel-free, lead-free) and surgical steel posts',
    inStock: true,
    isBestseller: true,
    isSculptural: true
  },
  {
    id: 'avirena-statement-drops-geometric-brass-earrings',
    shopifyId: 'gid://shopify/Product/10511624896834',
    handle: 'avirena-statement-drops-geometric-brass-earrings',
    name: 'Avirena Statement Drops',
    subtitle: 'Sculptural Layered Geometric Brass Earrings',
    category: 'earrings',
    metal: 'Gold-Tone Brass',
    price: 13.32,
    originalPrice: 44.43,
    images: [
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/square_forma-statement-drops-geometric-brass-earrings_1.png?v=1788779456',
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/square_clean_forma-statement-drops-geometric-brass-earrings_2.png?v=1788782683',
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/square_clean_forma-statement-drops-geometric-brass-earrings_3.png?v=1788782716',
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/square_clean_forma-statement-drops-geometric-brass-earrings_4.png?v=1788782767',
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/square_clean_forma-statement-drops-geometric-brass-earrings_5.png?v=1788782807',
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/square_clean_forma-statement-drops-geometric-brass-earrings_6.png?v=1788782819'
    ],
    description: 'Bold geometry. Effortless glamour. Layered organic shapes in a polished gold-tone finish, built to hold their line as they move. A sculptural drop that carries an outfit on its own — no other jewellery required. Product highlights Layered geometric drop design Sculptural organic shaping Polished gold-tone finish Statement scale without the weight Materials High-grade brass with an anti-tarnish gold-tone protective coating Nickel-free, lead-free and cadmium-free Surgical steel posts, suitable for sensitive skin This is fashion jewellery. It is not solid gold, gold vermeil or sterling silver, and is not hallmarked to any precious-metal standard. Perfect for Festive and occasion wear Sarees and ethnic outfits Parties and celebrations Dresses and evening looks Gifting Care Remove before swimming, bathing or exercise. Apply perfume and lotion before putting them on. Wipe gently with a soft dry cloth after wear and store dry. Tracked express delivery. Free delivery across India. 7-day easy returns on unworn pieces in original packaging.',
    details: [
      'Layered organic geometric drop design with fluid movement',
      'Sculptural statement scale without lobe weight',
      'High-polish mirror gold-tone finish',
      'Surgical steel hypoallergenic posts for sensitive ears',
      'Free delivery across India & 7-day easy returns'
    ],
    materials: 'High-grade brass with anti-tarnish gold-tone protective coating (nickel-free, lead-free) and surgical steel posts',
    inStock: true,
    isBestseller: true,
    isSculptural: true
  },
  {
    id: 'avirena-heart-drops-silver-tone-earrings',
    shopifyId: 'gid://shopify/Product/10513953587522',
    handle: 'avirena-heart-drops-silver-tone-earrings',
    name: 'Avirena Heart Drops',
    subtitle: 'Puffed Double Heart Silver-Tone Earrings',
    category: 'earrings',
    metal: 'Silver-Tone Alloy',
    price: 8.66,
    originalPrice: 27.77,
    images: [
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/460a6da3-5131-4cc4-8bf4-d23f372a1bfc.png?v=1788590707',
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/03671b94-4c80-43ea-bf2e-400a4feaa839.png?v=1788590708',
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/b9877952-87d7-4365-bf19-9654613908c1.png?v=1788590708',
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/square_clean_amara-heart-drops-silver-tone-earrings_4.png?v=1788782434',
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/77cf164e-ff07-4bb4-b201-f6351b5af304.png?v=1788590709'
    ],
    description: 'Two hearts, one clean line. A puffed heart stud carries a larger heart below it, both finished in a high-polish silver tone that catches light as you move. The volume gives it presence; the smooth unbroken surface keeps it from tipping into sweet. Romantic without being girlish. Product highlights Double heart drop silhouette Puffed, high-polish silver-tone finish Articulated link so the lower heart moves with you Hollow-formed to stay light on the lobe Materials Durable alloy with an anti-tarnish silver-tone protective coating Nickel-free, lead-free and cadmium-free Surgical steel posts, suitable for sensitive skin This is fashion jewellery. It is not solid gold, gold vermeil or sterling silver, and is not hallmarked to any precious-metal standard. Perfect for Date nights and dinners Birthdays and anniversaries Dresses and western outfits Gifting Care Remove before swimming, bathing or exercise. Apply perfume and lotion before putting them on. Wipe gently with a soft dry cloth after wear and store dry. Tracked express delivery. Free delivery across India. 7-day easy returns on unworn pieces in original packaging.',
    details: [
      'Articulated double puffed heart drop silhouette',
      'Mirror-polished cool silver-tone protective finish',
      'Hollow-formed construction for zero lobe fatigue',
      'Surgical steel hypoallergenic posts for sensitive ears',
      'Free delivery across India & 7-day easy returns'
    ],
    materials: 'Durable alloy with anti-tarnish silver-tone protective coating (nickel-free, lead-free) and surgical steel posts',
    inStock: true,
    isBestseller: true,
    isSculptural: true
  },
  {
    id: 'avirena-spiral-earrings-silver-tone',
    shopifyId: 'gid://shopify/Product/10513953751362',
    handle: 'avirena-spiral-earrings-silver-tone',
    name: 'Avirena Spiral Earrings',
    subtitle: 'Sculptural Continuous Curve Silver-Tone Studs',
    category: 'earrings',
    metal: 'Silver-Tone Alloy',
    price: 6.66,
    originalPrice: 21.10,
    images: [
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/f58237af-d871-497b-ab88-a544835f938c.png?v=1788590744',
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/6d19c2fb-0a84-4bb0-a8ee-225f025799c4.png?v=1788590746',
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/358ae3eb-06b5-4d3c-bed5-ccf29ed4e771.png?v=1788590747',
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/25d04dc2-dbb0-41c7-8052-5591c7e89e7b.png?v=1788590747',
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/ef9688d8-8f05-4daa-841a-4fdcb08baaca.png?v=1788590748'
    ],
    description: 'One continuous curve. A single tapered form spirals around itself and comes to a fine point, hugging the lobe rather than hanging from it. The high-polish silver-tone surface reads as one unbroken line from every angle — architectural, and quietly unusual. Product highlights Sculptural spiral silhouette that curves around the lobe Tapered form finishing in a fine point High-polish silver-tone finish Sits close to the ear, so it stays comfortable through the day Materials Durable alloy with an anti-tarnish silver-tone protective coating Nickel-free, lead-free and cadmium-free Surgical steel posts, suitable for sensitive skin This is fashion jewellery. It is not solid gold, gold vermeil or sterling silver, and is not hallmarked to any precious-metal standard. Perfect for Everyday and office wear Minimalist and contemporary outfits Dresses and western wear Gifting Care Remove before swimming, bathing or exercise. Apply perfume and lotion before putting them on. Wipe gently with a soft dry cloth after wear and store dry. Tracked express delivery. Free delivery across India. 7-day easy returns on unworn pieces in original packaging.',
    details: [
      'Continuous tapered spiral curving around the lobe',
      'Architectural unbroken line from every angle',
      'Sits close to the ear for continuous daily comfort',
      'Surgical steel hypoallergenic posts for sensitive ears',
      'Free delivery across India & 7-day easy returns'
    ],
    materials: 'Durable alloy with anti-tarnish silver-tone protective coating (nickel-free, lead-free) and surgical steel posts',
    inStock: true,
    isBestseller: true,
    isSculptural: true
  },
  {
    id: 'avirena-crystal-hoops-gold-tone-earrings',
    shopifyId: 'gid://shopify/Product/10513953784130',
    handle: 'avirena-crystal-hoops-gold-tone-earrings',
    name: 'Avirena Crystal Hoops — Gold',
    subtitle: 'Chunky Domed Hoop with Prong-Set Oval Crystal',
    category: 'earrings',
    metal: 'Gold-Tone Brass',
    price: 6.66,
    originalPrice: 24.43,
    images: [
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/1779ca2c-3943-43e1-b94b-054e4fb9da4e.png?v=1788590763',
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/f95f087e-282f-495b-b543-bada0813d93c_1.png?v=1788590763',
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/f7c43b57-ea2d-4f32-bfdd-3fce051f57d0.png?v=1788590764',
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/4a6593d0-5428-46d6-93f8-b0ceb75f6266.png?v=1788590765',
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/ee1faa67-d9f8-4fad-847b-6c57285b8525.png?v=1788590765'
    ],
    description: 'Weight below, light above. A chunky domed hoop anchors a prong-set oval crystal, so the eye catches the sparkle first and the solid gold-tone curve second. The proportion is what makes it work — substantial enough to read as a statement, contained enough to wear with a saree or a shirt. Product highlights Chunky domed hoop with a prong-set oval crystal Polished gold-tone finish Hollow-formed hoop, so the scale does not weigh on the lobe Secure post and back fitting Materials High-grade brass with an anti-tarnish gold-tone protective coating Faceted glass crystal stone Nickel-free, lead-free and cadmium-free Surgical steel posts, suitable for sensitive skin This is fashion jewellery. The stone is a faceted crystal, not a diamond or precious gemstone. The metal is not solid gold, gold vermeil or sterling silver, and is not hallmarked to any precious-metal standard. Perfect for Festive and occasion wear Sarees and ethnic outfits Weddings and celebrations Evening looks Gifting Care Remove before swimming, bathing or exercise. Apply perfume and lotion before putting them on. Wipe gently with a soft dry cloth after wear and store dry. Tracked express delivery. Free delivery across India. 7-day easy returns on unworn pieces in original packaging.',
    details: [
      'Chunky domed hoop anchoring a brilliant prong-set oval crystal',
      'Polished gold-tone finish with high light-refraction stone',
      'Hollow-formed hoop so scale does not weigh down the lobe',
      'Surgical steel hypoallergenic posts for sensitive ears',
      'Free delivery across India & 7-day easy returns'
    ],
    materials: 'High-grade brass with anti-tarnish gold-tone coating & faceted glass crystal stone',
    inStock: true,
    isBestseller: true,
    isSculptural: true
  },
  {
    id: 'avirena-crystal-hoops-silver-tone-earrings',
    shopifyId: 'gid://shopify/Product/10513953849666',
    handle: 'avirena-crystal-hoops-silver-tone-earrings',
    name: 'Avirena Crystal Hoops — Silver',
    subtitle: 'Chunky Domed Hoop with Prong-Set Oval Crystal',
    category: 'earrings',
    metal: 'Silver-Tone Alloy',
    price: 6.66,
    originalPrice: 24.43,
    images: [
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/9e4d8963-b26d-4e81-bcba-8b9bcd3abd1e.png?v=1788590783',
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/square_clean_solene-crystal-hoops-silver-tone-earrings_2.png?v=1788783306',
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/c30137bc-944e-471c-a6a8-c79d5c51adad.png?v=1788590785',
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/42f9b9e3-ac6d-4bc9-9545-99ce1268621b.png?v=1788590785',
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/6343dbee-940f-45a1-9bd8-16a4960909bc.png?v=1788590785'
    ],
    description: 'Weight below, light above. A chunky domed hoop anchors a prong-set oval crystal, finished in a cool silver tone that plays the sparkle down rather than up. The proportion is what makes it work — substantial enough to read as a statement, contained enough to wear with a saree or a shirt. Product highlights Chunky domed hoop with a prong-set oval crystal Polished silver-tone finish Hollow-formed hoop, so the scale does not weigh on the lobe Secure post and back fitting Materials Durable alloy with an anti-tarnish silver-tone protective coating Faceted glass crystal stone Nickel-free, lead-free and cadmium-free Surgical steel posts, suitable for sensitive skin This is fashion jewellery. The stone is a faceted crystal, not a diamond or precious gemstone. The metal is not solid gold, gold vermeil or sterling silver, and is not hallmarked to any precious-metal standard. Perfect for Festive and occasion wear Sarees and ethnic outfits Weddings and celebrations Evening looks Gifting Care Remove before swimming, bathing or exercise. Apply perfume and lotion before putting them on. Wipe gently with a soft dry cloth after wear and store dry. Tracked express delivery. Free delivery across India. 7-day easy returns on unworn pieces in original packaging.',
    details: [
      'Chunky domed hoop anchoring a brilliant prong-set oval crystal',
      'Polished cool silver-tone finish with crisp sparkle',
      'Hollow-formed hoop so scale does not weigh down the lobe',
      'Surgical steel hypoallergenic posts for sensitive ears',
      'Free delivery across India & 7-day easy returns'
    ],
    materials: 'Durable alloy with anti-tarnish silver-tone coating & faceted glass crystal stone',
    inStock: true,
    isBestseller: true,
    isSculptural: true
  },
  {
    id: 'avirena-pebble-studs-gold-tone-earrings',
    shopifyId: 'gid://shopify/Product/10513953915202',
    handle: 'avirena-pebble-studs-gold-tone-earrings',
    name: 'Avirena Pebble Studs',
    subtitle: 'Organic Faceted Dome Gold-Tone Studs',
    category: 'earrings',
    metal: 'Gold-Tone Brass',
    price: 7.77,
    originalPrice: 24.43,
    images: [
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/6310d2a5-36df-496b-a2e5-abff46b9ab15.png?v=1788590806',
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/491a899d-7408-4df8-96ab-29e285ac024a.png?v=1788590808',
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/000ab104-805e-4ddd-b825-00679e71a54e.png?v=1788590809',
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/ChatGPT_Image_Sep_5_2026_11_49_10_AM.png?v=1788590809',
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/db5a9d8b-88dc-4043-b0f5-d25e69d7f1a6.png?v=1788590809'
    ],
    description: 'Shaped like something the sea finished. An oval dome broken into smooth pebble-like facets, each catching light at a slightly different angle. The surface is what carries this piece — nothing is symmetrical, so it reads as organic rather than manufactured, and it holds attention without needing scale. Product highlights Organic pebble-faceted dome silhouette Polished gold-tone finish with soft shadowed recesses Hugs the lobe, so there is no swing or snagging Hollow-formed to stay comfortable for all-day wear Materials High-grade brass with an anti-tarnish gold-tone protective coating Nickel-free, lead-free and cadmium-free Surgical steel posts, suitable for sensitive skin This is fashion jewellery. It is not solid gold, gold vermeil or sterling silver, and is not hallmarked to any precious-metal standard. Perfect for Everyday and office wear Sarees and ethnic outfits Shirts and smart-casual looks Gifting Care Remove before swimming, bathing or exercise. Apply perfume and lotion before putting them on. Wipe gently with a soft dry cloth after wear and store dry. Tracked express delivery. Free delivery across India. 7-day easy returns on unworn pieces in original packaging.',
    details: [
      'Organic pebble-faceted dome silhouette inspired by sea-worn stone',
      'Natural asymmetrical light-catching contours',
      'Snug fit to the lobe with zero swing or snagging',
      'Surgical steel hypoallergenic posts for sensitive ears',
      'Free delivery across India & 7-day easy returns'
    ],
    materials: 'High-grade brass with anti-tarnish gold-tone protective coating (nickel-free, lead-free) and surgical steel posts',
    inStock: true,
    isBestseller: true,
    isSculptural: true
  },
  {
    id: 'avirena-leaf-studs-gold-tone-earrings',
    shopifyId: 'gid://shopify/Product/10513954013506',
    handle: 'avirena-leaf-studs-gold-tone-earrings',
    name: 'Avirena Leaf Studs',
    subtitle: 'Sculptural Folded Leaf Gold-Tone Earrings',
    category: 'earrings',
    metal: 'Gold-Tone Brass',
    price: 7.77,
    originalPrice: 27.77,
    images: [
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/4d4af4c2-5be2-47f5-9785-f20644f3285f.png?v=1788590830',
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/1cf7a837-5d3f-4f05-964a-0e81d5b80002.png?v=1788590832',
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/43ed091e-3ca2-43c8-9303-a3a247ef30ad.png?v=1788590833',
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/ChatGPT_Image_Sep_5_2026_11_49_25_AM.png?v=1788590833',
      'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/d8d64cdf-978d-4286-b058-6df9d32972df.png?v=1788590834'
    ],
    description: 'A leaf caught mid-fold. A tapered petal form with a soft twist through the centre, so the polished gold-tone surface bends light down its length instead of flashing flat. It sits upward along the lobe rather than hanging, which gives it presence while staying easy to wear. Product highlights Sculptural folded leaf silhouette High-polish gold-tone finish with a soft central twist Sits upward on the lobe for an elongating line Hollow-formed to stay light through a full day Materials High-grade brass with an anti-tarnish gold-tone protective coating Nickel-free, lead-free and cadmium-free Surgical steel posts, suitable for sensitive skin This is fashion jewellery. It is not solid gold, gold vermeil or sterling silver, and is not hallmarked to any precious-metal standard. Perfect for Everyday and office wear Sarees and ethnic outfits Evening and occasion looks Gifting Care Remove before swimming, bathing or exercise. Apply perfume and lotion before putting them on. Wipe gently with a soft dry cloth after wear and store dry. Tracked express delivery. Free delivery across India. 7-day easy returns on unworn pieces in original packaging.',
    details: [
      'Sculptural folded leaf silhouette with gentle central twist',
      'Sits upward along the earlobe creating an elongating line',
      'High-polish gold-tone luster reflecting light continuously',
      'Surgical steel hypoallergenic posts for sensitive ears',
      'Free delivery across India & 7-day easy returns'
    ],
    materials: 'High-grade brass with anti-tarnish gold-tone protective coating (nickel-free, lead-free) and surgical steel posts',
    inStock: true,
    isBestseller: true,
    isSculptural: true
  }
];
