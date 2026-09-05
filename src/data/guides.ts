/**
 * Long-form, crawlable guide content.
 *
 * Single source of truth for the /guides hub and its four guide routes. Both
 * src/pages/GuidesPage.tsx (client render) and scripts/prerender.ts (static
 * prerender + JSON-LD + sitemap) import from here, so the indexed HTML and the
 * hydrated DOM can never drift apart.
 *
 * EVERY claim here must be verifiable from the real product:
 *   high-grade brass and durable alloys, protective anti-tarnish e-coating in
 *   gold-tone / silver-tone / rose gold-tone, nickel-free, lead-free,
 *   cadmium-free, surgical steel earring posts, cultured freshwater baroque
 *   pearls, cubic zirconia accents.
 *
 * This is fashion jewelry. It is NOT solid gold, NOT gold vermeil, NOT sterling
 * silver, and it is NOT hallmarked to any precious-metal standard. Never
 * describe it as any of those, and never add ratings, reviews, testimonials,
 * invented test data, certifications, or contact details.
 */

export type GuideSlug =
  | 'does-brass-jewelry-turn-skin-green'
  | 'anti-tarnish-jewelry-care'
  | 'jewelry-materials-guide'
  | 'ring-size-guide';

/** A body block. `lead` renders the direct answer; `table` renders sizing data. */
export type GuideBlock =
  | { type: 'lead'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'table'; caption: string; columns: string[]; rows: string[][] };

export interface GuideFaq {
  question: string;
  answer: string;
}

export interface Guide {
  slug: GuideSlug;
  /** On-page <h1>. */
  heading: string;
  /** Short label for cards, breadcrumbs and nav. */
  shortTitle: string;
  /** <title>, kept at ~60 characters. */
  metaTitle: string;
  /** <meta name="description">, kept at ~155 characters. */
  metaDescription: string;
  /** One-line summary used on the hub cards and as the schema description. */
  summary: string;
  category: 'Materials' | 'Care' | 'Fit';
  readTime: string;
  /**
   * The direct answer, 1-2 sentences. Repeated as the first body block and as
   * the schema description so an answer engine can lift it standalone.
   */
  directAnswer: string;
  blocks: GuideBlock[];
  /** Rendered on-page AND emitted as FAQPage JSON-LD for this route. */
  faqs: GuideFaq[];
}

/** International ring sizing data. Mirrors src/components/RingSizerModal.tsx SIZE_CHART. */
export const RING_SIZE_ROWS: string[][] = [
  ['US 5', 'J 1/2', '49', '9', '15.7 mm', '49.3 mm'],
  ['US 6', 'L 1/2', '51.5', '12', '16.5 mm', '51.8 mm'],
  ['US 7', 'N 1/2', '54', '14', '17.3 mm', '54.4 mm'],
  ['US 8', 'P 1/2', '56.5', '16', '18.1 mm', '56.9 mm'],
  ['US 9', 'R 1/2', '59', '18', '18.9 mm', '59.5 mm'],
  ['US 10', 'T 1/2', '61.5', '20', '19.8 mm', '62.1 mm'],
];

export const GUIDES: Guide[] = [
  // ------------------------------------------------------------------
  {
    slug: 'does-brass-jewelry-turn-skin-green',
    heading: 'Does Brass Jewelry Turn Your Skin Green?',
    shortTitle: 'Does Brass Turn Skin Green?',
    metaTitle: 'Does Brass Jewellery Turn Skin Green? | AVIRENA',
    metaDescription:
      'Brass can leave a green mark on skin. The real chemistry, what an anti-tarnish coating changes, and how humid Indian weather and sweat affect it.',
    summary:
      'The honest answer to the most common brass jewelry objection, including what our protective coating does and does not prevent.',
    category: 'Materials',
    readTime: '5 min read',
    directAnswer:
      'Bare brass can turn skin green, because the copper in brass reacts with moisture and the acids in your sweat to form copper salts that transfer onto the skin. It is a harmless, temporary surface stain that washes off — and on coated jewelry like ours the brass never touches your skin directly, so for most wearers it does not happen at all.',
    blocks: [
      {
        type: 'lead',
        text: 'Bare brass can turn skin green, because the copper in brass reacts with moisture and the acids in your sweat to form copper salts that transfer onto the skin. It is a harmless, temporary surface stain that washes off — and on coated jewelry like ours the brass never touches your skin directly, so for most wearers it does not happen at all.',
      },
      {
        type: 'heading',
        text: 'Why it happens: the actual chemistry',
      },
      {
        type: 'paragraph',
        text: 'Brass is an alloy of copper and zinc. Copper is what gives brass its warmth, its weight and its workability — the same properties that let us shape sculptural, architectural forms that hold their line. Copper is also reactive. When bare copper meets water, oxygen and the mild acids in perspiration, it forms copper compounds on the surface. Those compounds are green, they sit loosely on the metal, and they rub off onto whatever they touch. That is the green mark. It is a stain on the skin, not a stain in the skin, and soap and water remove it.',
      },
      {
        type: 'paragraph',
        text: 'This is also why the reaction is so personal. Two people can wear the same ring and get completely different results. Skin pH varies from person to person and from day to day. So does how much you perspire, the humidity where you live, whether hand cream or sanitiser sits on your fingers when you put a ring on, and how tightly a piece presses against the skin. Nobody can honestly promise you a universal outcome, because the variable is partly you.',
      },
      {
        type: 'heading',
        text: 'What the anti-tarnish e-coating actually does',
      },
      {
        type: 'paragraph',
        text: 'Every Avirena piece is finished with a protective anti-tarnish e-coating over the brass or alloy base, in gold-tone, silver-tone or rose gold-tone. That coating is a physical barrier. Where it is intact, sweat and humidity do not reach the copper underneath, the copper-salt reaction does not start, and there is nothing to transfer to your skin. This is the single biggest difference between coated and uncoated brass jewelry, and it is why unsealed market-stall brass has given the whole material its reputation.',
      },
      {
        type: 'paragraph',
        text: 'What a coating cannot do is be permanent. It is a finish, and finishes wear. Constant abrasion, chlorinated pool water, salt water, harsh cleaning chemicals, alcohol-based sanitiser and perfume sprayed directly onto metal all shorten its life. Rings take the most punishment because hands do the most work; earrings and pendants, which rest rather than rub, keep their finish far longer. If the coating eventually thins at a high-contact edge, the brass beneath is exposed again and the reaction becomes possible again. We would rather tell you that than pretend a coating is forever.',
      },
      {
        type: 'heading',
        text: 'How to minimise it',
      },
      {
        type: 'list',
        items: [
          'Take pieces off before swimming, showering and workouts. Chlorine, salt water and sustained sweat are the three fastest ways to wear a finish down.',
          'Apply perfume, sunscreen, hairspray and lotion first, let them dry fully, and put jewelry on last.',
          'Wipe each piece with a dry, soft cloth after wearing. This removes the body oils and salts that would otherwise sit on the surface overnight.',
          'Store pieces dry and separately — a pouch or a lined compartment — so they neither scratch each other nor sit in bathroom humidity.',
          'If you are prone to reactions, favour earrings and pendants over rings for continuous daily wear; they contact far less skin and take far less friction.',
        ],
      },
      {
        type: 'heading',
        text: 'Is a green mark dangerous?',
      },
      {
        type: 'paragraph',
        text: 'No. Copper-salt discolouration is cosmetic and washes off. It is a different thing entirely from a metal allergy, which is usually an itchy, raised, persistent rash and is most often a reaction to nickel. Avirena jewelry is made nickel-free, lead-free and cadmium-free, and our earring posts are surgical steel, which is why our pieces suit most people with sensitive ears. If you ever get genuine irritation rather than a washable mark, stop wearing the piece and speak to a doctor — that is not something a jewelry brand should diagnose for you.',
      },
      {
        type: 'heading',
        text: 'Why we still choose brass',
      },
      {
        type: 'paragraph',
        text: 'Avirena is dailywear jewelry, priced roughly between ₹2,000 and ₹3,600. Brass with a protective coating is what lets a piece be substantial, sculptural and genuinely wearable at that price. It holds crisp edges and real weight in a way that thin, hollow alternatives do not. We are open that this is fashion jewelry rather than fine jewelry: it is not solid gold, not gold vermeil and not sterling silver, and it is not hallmarked to any precious-metal standard. It is honest brass, well finished, made to be worn every day rather than kept in a safe.',
      },
    ],
    faqs: [
      {
        question: 'Does brass jewelry turn your skin green?',
        answer:
          'Bare brass can, because the copper in brass reacts with moisture and skin acids to form green copper salts that rub off onto the skin. The mark is harmless and washes off with soap and water. Avirena pieces carry a protective anti-tarnish e-coating over the brass, so while that coating is intact the copper never contacts your skin and the reaction does not start. Results still vary with individual skin chemistry, humidity and how hard a piece is worn, and any coating can eventually wear at high-friction points such as the inside of a ring. Removing pieces before swimming, bathing and exercise, applying cosmetics before putting jewelry on, and wiping pieces dry after wear are the three habits that make the most difference.',
      },
      {
        question: 'Will the anti-tarnish coating wear off eventually?',
        answer:
          'A coating is a finish, not a permanent property of the metal, so with enough abrasion and chemical exposure it will thin. How long it lasts depends almost entirely on how a piece is worn. Rings wear fastest because hands are constantly in contact with surfaces, water and sanitiser; earrings and pendants rest against skin without friction and keep their finish far longer. Chlorinated water, salt water, perfume sprayed directly onto metal, alcohol-based sanitiser and abrasive cleaners are the main accelerators. Once a coating thins at an edge, the brass beneath is exposed and can tarnish or react again. Careful daily habits are what extend the finish, and we would rather set that expectation honestly than claim a coating lasts forever.',
      },
      {
        question: 'Is brass jewelry safe for sensitive skin?',
        answer:
          'For most people, yes. The reaction that makes brass notorious — a green skin mark — is a harmless surface stain from copper salts, not an allergic response. True jewelry allergies are most commonly caused by nickel, and Avirena jewelry is made nickel-free, lead-free and cadmium-free, with surgical steel posts on earrings, which is the part of a piece that sits inside the body. The protective anti-tarnish e-coating adds a further barrier between the alloy and your skin. If you experience genuine irritation — itching, redness or a persistent rash rather than a mark that washes away — stop wearing the piece and consult a doctor rather than a jewelry brand.',
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    slug: 'anti-tarnish-jewelry-care',
    heading: 'How to Care for Anti-Tarnish Brass Jewelry',
    shortTitle: 'Anti-Tarnish Care Guide',
    metaTitle: 'Anti-Tarnish Jewellery Care Guide India | AVIRENA',
    metaDescription:
      'How to make anti-tarnish jewellery last in Indian humidity: when to take pieces off, how to clean them, what to avoid, and how to store them.',
    summary:
      'Practical daily habits that make a protective coating last, and the everyday exposures that quietly wear it down.',
    category: 'Care',
    readTime: '4 min read',
    directAnswer:
      'To care for anti-tarnish brass jewelry, keep the protective coating dry and free of chemicals: take pieces off before swimming, bathing and exercise, put jewelry on last after cosmetics have dried, wipe each piece with a dry soft cloth after wearing, and store it dry and separate from other pieces.',
    blocks: [
      {
        type: 'lead',
        text: 'To care for anti-tarnish brass jewelry, keep the protective coating dry and free of chemicals: take pieces off before swimming, bathing and exercise, put jewelry on last after cosmetics have dried, wipe each piece with a dry soft cloth after wearing, and store it dry and separate from other pieces. Everything below is an expansion of those four habits.',
      },
      {
        type: 'heading',
        text: 'Why care matters more on coated jewelry',
      },
      {
        type: 'paragraph',
        text: 'Avirena pieces are high-grade brass and durable alloys finished with a protective anti-tarnish e-coating. That coating is what keeps the metal looking the way it did on day one and what stops the copper in brass from reacting with skin. Because the protection lives in the finish rather than in the metal itself, care is not a nicety here — it is the whole mechanism. A coated piece that is never exposed to chlorine, perfume or abrasive cleaners will hold its colour for a very long time. The same piece worn into a swimming pool weekly will not.',
      },
      {
        type: 'heading',
        text: '1. Take it off before water and sweat',
      },
      {
        type: 'paragraph',
        text: 'Remove jewelry before swimming, showering, bathing and workouts. Chlorinated pool water and salt water are chemically aggressive toward any plated or coated finish, and sustained perspiration keeps a piece damp for hours against skin. Hot water and soap in the shower add surfactants that lift residues and, over time, the finish with them. Removing pieces takes ten seconds and is the single highest-impact habit on this list.',
      },
      {
        type: 'heading',
        text: '2. Cosmetics first, jewelry last',
      },
      {
        type: 'paragraph',
        text: 'Perfume, deodorant, hairspray, sunscreen, body lotion and alcohol-based hand sanitiser all contain solvents and oils that attack finishes. The rule is simple: get fully ready, let everything dry, then put jewelry on. Reverse it at the end of the day — jewelry comes off first, before makeup removers and cleansers. Never spray perfume onto or over a piece you are already wearing.',
      },
      {
        type: 'heading',
        text: '3. Wipe it down after wearing',
      },
      {
        type: 'paragraph',
        text: 'A soft, dry cloth — microfibre or the pouch cloth a piece arrives in — is the only cleaning tool most jewelry needs. Wipe each piece gently after wearing to lift body oils, salts and dust before they sit on the surface overnight. Do not use silver dips, tarnish-removing chemical solutions, toothpaste, baking soda, ultrasonic cleaners or abrasive pads. Those are formulated to strip a layer off the metal, which on coated jewelry means stripping the protection you are trying to preserve. If something needs more than a dry wipe, use the barely damp corner of a soft cloth and dry it immediately and completely.',
      },
      {
        type: 'heading',
        text: '4. Store it dry, dark and separated',
      },
      {
        type: 'list',
        items: [
          'Keep pieces out of the bathroom. Shower humidity is the most common cause of jewelry sitting damp for hours a day.',
          'Store each piece in its own pouch or a lined compartment so pieces cannot scratch one another. A harder piece dragged against a softer finish will mark it.',
          'Fasten chains and clasps before storing so they do not knot, and lay necklaces flat rather than coiled tight.',
          'A small silica sachet in a jewelry box is a cheap and genuinely effective way to keep the enclosed air dry through a humid monsoon.',
        ],
      },
      {
        type: 'heading',
        text: 'Caring for cultured freshwater pearls',
      },
      {
        type: 'paragraph',
        text: 'Pieces set with our cultured freshwater baroque pearls need slightly gentler handling than metal alone. A pearl is an organic material with a soft nacre surface, and it is more vulnerable to chemicals than the metal it is set into. Keep perfume and hairspray away from pearls entirely, wipe them with a soft dry cloth after wearing, and never soak them or use any cleaning solution. Store pearl pieces where they will not be pressed against harder stones or metal edges.',
      },
      {
        type: 'heading',
        text: 'What to expect over time',
      },
      {
        type: 'paragraph',
        text: 'With these habits, a coated piece keeps its finish for a long time. Without them, wear shows first where friction is greatest: the inside of a ring band, the underside of a bracelet, the edge of a clasp. That is normal for coated fashion jewelry at this price point and it is not a defect — it is a finish doing exactly what a finish does. Knowing where wear appears first is also useful, because it tells you which pieces suit continuous daily wear and which are better kept for lighter duty.',
      },
    ],
    faqs: [
      {
        question: 'How should I clean anti-tarnish brass jewelry?',
        answer:
          'Use a soft, dry cloth and nothing else for routine cleaning. Wipe each piece gently after wearing to remove body oils, perspiration salts and dust before they sit on the surface overnight. Avoid silver dips, chemical tarnish removers, toothpaste, baking soda, ultrasonic cleaners and abrasive pads entirely: those products work by removing a layer from the metal, and on coated jewelry the layer they remove is the protective anti-tarnish e-coating itself. If a piece needs more than a dry wipe, use the barely damp corner of a soft cloth on the affected spot, then dry it completely straight away. For pieces set with cultured freshwater pearls, keep all liquids and cleaning solutions away from the pearl and wipe the nacre only with a dry cloth.',
      },
      {
        question: 'Can I wear brass jewelry in the shower or swimming pool?',
        answer:
          'It is best not to. Chlorinated pool water and salt water are chemically aggressive toward plated and coated finishes, and repeated exposure is the fastest way to wear a protective coating down. Showering is gentler but not neutral: hot water, soap and shampoo contain surfactants that lift residues, and a piece left on afterwards stays damp against the skin for a long time. Sustained perspiration during exercise has the same effect. Taking pieces off before swimming, bathing and workouts is the single highest-impact care habit for anti-tarnish jewelry, and it costs a few seconds a day.',
      },
      {
        question: 'How should I store jewelry so it does not tarnish?',
        answer:
          'Store pieces dry, dark and separated. Keep jewelry out of the bathroom, where shower humidity would otherwise leave it damp for hours every day. Give each piece its own pouch or a lined compartment so harder pieces cannot scratch softer finishes, fasten clasps before storing so chains do not knot, and lay necklaces flat rather than coiling them tightly. A small silica gel sachet in a jewelry box keeps the enclosed air dry and is genuinely useful through a humid monsoon. Store cultured freshwater pearls where they will not be pressed against harder stones or metal edges, as the nacre surface marks more easily than metal.',
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    slug: 'jewelry-materials-guide',
    heading: 'Brass, Plated, Vermeil and Solid Gold: A Materials Guide',
    shortTitle: 'Jewelry Materials Guide',
    metaTitle: 'Brass vs Gold Plated vs Vermeil vs Gold | AVIRENA',
    metaDescription:
      'What each jewelry material actually is, how they differ in construction, price and lifespan, and where coated brass dailywear jewelry honestly fits in.',
    summary:
      'An honest comparison of the four constructions you will meet while shopping, and exactly what Avirena is among them.',
    category: 'Materials',
    readTime: '6 min read',
    directAnswer:
      'The four constructions differ in what sits under the surface: coated brass is a brass alloy with a protective finish, plated jewelry is any base metal under a thin gold or rhodium layer, gold vermeil is a thick gold layer over a sterling silver core, and solid gold is gold all the way through. Avirena is the first of these — high-grade brass with a protective anti-tarnish e-coating.',
    blocks: [
      {
        type: 'lead',
        text: 'The four constructions differ in what sits under the surface: coated brass is a brass alloy with a protective finish, plated jewelry is any base metal under a thin gold or rhodium layer, gold vermeil is a thick gold layer over a sterling silver core, and solid gold is gold all the way through. Avirena is the first of these — high-grade brass and durable alloys with a protective anti-tarnish e-coating, in gold-tone, silver-tone and rose gold-tone.',
      },
      {
        type: 'heading',
        text: 'Coated brass and alloys',
      },
      {
        type: 'paragraph',
        text: 'Brass is an alloy of copper and zinc. It is dense, warm-toned and workable, which is why it has been used for jewelry and metalwork for centuries and why it can hold a sculptural, architectural form without feeling flimsy. Left bare, brass tarnishes in air and its copper content can react with skin. A protective anti-tarnish coating solves both problems by sealing the alloy under a barrier, and the tone you see — gold, silver or rose gold — is the colour of that finish rather than of the metal underneath. The trade-off is honest and easy to state: you get real weight and real presence at an accessible price, and the protection lives in a finish that wears with time and use rather than in the metal itself. This is what Avirena makes.',
      },
      {
        type: 'heading',
        text: 'Plated jewelry',
      },
      {
        type: 'paragraph',
        text: '"Gold plated" is the broadest and least informative term in jewelry, because it describes a process rather than a construction. It means a layer of gold has been deposited over some other metal, and the label alone tells you nothing about which metal is underneath or how thick the layer is. Thickness ranges from a flash measured in fractions of a micron up to substantially heavier deposits, and a base can be brass, copper, steel or a cheap pot metal. Two pieces sold as gold plated can therefore behave completely differently in wear. When a seller will not say what the base metal is or how thick the plating is, that silence is itself information.',
      },
      {
        type: 'heading',
        text: 'Gold vermeil',
      },
      {
        type: 'paragraph',
        text: 'Gold vermeil is a regulated term in some markets, and its definition is specific: a sterling silver core with a gold layer over it, above a defined minimum thickness. The point of vermeil is that the core is itself a precious metal, so if the gold layer eventually wears the metal beneath is silver rather than a base alloy. That construction costs considerably more than coated brass, and it carries its own trade-offs — a sterling silver core still tarnishes, and vermeil is generally softer and more prone to scratching than a hard-coated alloy. Avirena does not make vermeil, and we mention it here only so you can compare constructions accurately while shopping.',
      },
      {
        type: 'heading',
        text: 'Solid gold',
      },
      {
        type: 'paragraph',
        text: 'Solid gold jewelry is gold alloy throughout, described by karat — 22k, 18k, 14k, 9k — where the number states how much of the alloy is gold. There is no surface layer to wear through, so the colour is permanent and the piece has genuine material value. It is also the most expensive option by a very wide margin, and in India it is subject to BIS hallmarking, which is the assurance system that applies to precious metals specifically. Solid gold is what you buy when you want an heirloom. It is a different purchase, at a different price, for a different purpose than dailywear.',
      },
      {
        type: 'heading',
        text: 'Side by side',
      },
      {
        type: 'table',
        caption: 'How the four constructions compare',
        columns: ['Construction', 'What is underneath', 'Surface', 'Typical use'],
        rows: [
          [
            'Coated brass (Avirena)',
            'High-grade brass or durable alloy',
            'Protective anti-tarnish e-coating in gold, silver or rose gold tone',
            'Everyday wear at an accessible price',
          ],
          [
            'Gold plated',
            'Varies — often unspecified base metal',
            'Gold layer of unspecified thickness',
            'Trend and occasion pieces; quality varies widely',
          ],
          [
            'Gold vermeil',
            'Sterling silver core',
            'Thicker gold layer over a defined minimum',
            'Demi-fine jewelry at a higher price point',
          ],
          [
            'Solid gold',
            'Gold alloy throughout',
            'No layer — the colour goes all the way through',
            'Heirloom and investment pieces',
          ],
        ],
      },
      {
        type: 'heading',
        text: 'What Avirena is, stated plainly',
      },
      {
        type: 'list',
        items: [
          'High-grade brass and durable alloys, finished with a protective anti-tarnish e-coating.',
          'Available in gold-tone, silver-tone and rose gold-tone. The tone is the finish, not a precious-metal content.',
          'Nickel-free, lead-free and cadmium-free, with surgical steel posts on earrings.',
          'Cultured freshwater baroque pearls and cubic zirconia accents where a piece uses them.',
          'Fashion jewelry, not fine jewelry. Not solid gold, not gold vermeil, not sterling silver, and not hallmarked to any precious-metal standard.',
          'Priced for daily wear, roughly ₹2,000 to ₹3,600.',
        ],
      },
      {
        type: 'heading',
        text: 'Why brass is a legitimate choice for dailywear',
      },
      {
        type: 'paragraph',
        text: 'The most expensive jewelry you own is usually the jewelry you are most afraid to wear. Dailywear is a different design problem: pieces have to survive commutes, desks, handwashing and being thrown into a bag, and they have to cost little enough that a scratch is not a disaster. Coated brass answers that problem well. It gives a piece the density and crispness that make a sculptural form read properly, at a price where you can own several and wear them without hesitation. It is not pretending to be gold. It is a well-made piece of fashion jewelry that is honest about its construction — and knowing exactly what you are buying is the point of this page.',
      },
    ],
    faqs: [
      {
        question:
          'What is the difference between brass, gold plated, gold vermeil and solid gold jewelry?',
        answer:
          'The difference is what sits beneath the surface. Coated brass is a copper and zinc alloy sealed under a protective anti-tarnish finish, which gives it real weight at an accessible price while the protection lives in the coating. Gold plated describes only a process — a gold layer over some other metal — and the term alone tells you nothing about the base metal or the layer thickness, so quality varies enormously. Gold vermeil is defined more strictly: a sterling silver core with a thicker gold layer above a minimum thickness, which costs considerably more. Solid gold is gold alloy throughout, described in karats, with no surface layer to wear through and a correspondingly higher price. Avirena makes the first of these.',
      },
      {
        question: 'What are Avirena pieces actually made of?',
        answer:
          'Avirena jewelry is made from high-grade brass and durable metal alloys, finished with a protective anti-tarnish e-coating in gold-tone, silver-tone or rose gold-tone. The tone you see is the colour of that protective finish, not a precious-metal content. Every piece is made nickel-free, lead-free and cadmium-free, and earring posts are surgical steel for comfort in continuous wear. Pieces that feature pearls use cultured freshwater baroque pearls, chosen for their asymmetric shape and organic lustre, and some designs use cubic zirconia as accent stones. This is fashion jewelry made for everyday wear: it is not solid gold, gold vermeil or sterling silver, and it is not hallmarked to any precious-metal standard.',
      },
      {
        question: 'Is brass jewelry worth buying?',
        answer:
          'It depends entirely on what you want the piece to do. If you are buying an heirloom or storing value, solid gold is the right purchase and nothing else substitutes for it. If you want jewelry you will actually wear on ordinary days — to work, on a commute, through handwashing and a bag — then coated brass is a genuinely good answer. It has the density and crispness that make a sculptural design read properly, unlike thin hollow alternatives, and at roughly ₹2,000 to ₹3,600 a scratch is not a disaster. The honest trade-off is that the protection is a finish and finishes wear with time and use, which careful daily habits meaningfully extend.',
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    slug: 'ring-size-guide',
    heading: 'Ring Size Guide: Measure Your Finger at Home',
    shortTitle: 'Ring Size Guide',
    metaTitle: 'Ring Size Chart India | US UK EU Conversion | AVIRENA',
    metaDescription:
      'Measure your ring size at home with a strip of paper, then convert millimetres to US, UK, EU and India sizes with our full international ring size chart.',
    summary:
      'Two ways to measure at home, plus the full US, UK, EU and India conversion chart with diameters and circumferences.',
    category: 'Fit',
    readTime: '4 min read',
    directAnswer:
      'To find your ring size at home, wrap a strip of paper snugly around the base of your finger, mark where it overlaps, and measure that length in millimetres — that is your circumference. A 54.4 mm circumference is a US 7, EU 54 and India 14.',
    blocks: [
      {
        type: 'lead',
        text: 'To find your ring size at home, wrap a strip of paper snugly around the base of your finger, mark where it overlaps, and measure that length in millimetres — that is your circumference. A 54.4 mm circumference is a US 7, EU 54 and India 14. The full conversion chart is below, along with a second method using a ring you already own.',
      },
      {
        type: 'heading',
        text: 'Method 1: measure your finger',
      },
      {
        type: 'list',
        items: [
          'Cut a thin strip of paper or take a length of string, roughly 8 to 10 cm long.',
          'Wrap it around the base of the finger you intend to wear the ring on. It should be snug — firm enough not to slide, loose enough to turn.',
          'Mark the point where the strip overlaps itself, then lay it flat against a ruler and read the length in millimetres.',
          'That measurement is your finger circumference. Find the closest value in the chart below to get your size.',
        ],
      },
      {
        type: 'heading',
        text: 'Method 2: measure a ring you already own',
      },
      {
        type: 'list',
        items: [
          'Choose a ring that fits the same finger well.',
          'Lay it flat and measure straight across the inside of the band, edge to edge through the centre, in millimetres.',
          'That is the inside diameter. Match it to the diameter column in the chart below.',
          'A ring measuring 17.3 mm across the inside is a US 7.',
        ],
      },
      {
        type: 'heading',
        text: 'International ring size conversion chart',
      },
      {
        type: 'table',
        caption: 'Ring size conversions with inside diameter and circumference',
        columns: [
          'US / Canada',
          'UK / Australia',
          'EU',
          'India / Asia',
          'Inside diameter',
          'Circumference',
        ],
        rows: RING_SIZE_ROWS,
      },
      {
        type: 'heading',
        text: 'Getting an accurate measurement',
      },
      {
        type: 'list',
        items: [
          'Measure at the end of the day. Fingers are at their smallest in the morning and swell slightly as the day goes on.',
          'Do not measure when your hands are cold — cold fingers can read a full size small.',
          'Measure the specific finger and the specific hand you will wear the ring on. Dominant hands are usually very slightly larger.',
          'Check that your measurement clears your knuckle. If the knuckle is noticeably wider than the base of the finger, size to the knuckle so the ring can get on and off.',
          'Take the measurement two or three times and use the largest reading.',
        ],
      },
      {
        type: 'heading',
        text: 'If you are between sizes',
      },
      {
        type: 'paragraph',
        text: 'Size up. A ring that is fractionally loose can be worn all day; a ring that is fractionally tight becomes uncomfortable by the afternoon and is difficult to remove when fingers swell in heat. Band width matters too: a wide band sits against more of the finger and feels tighter than a narrow band of the same nominal size, so if you are choosing a broad or domed band and sit between sizes, going up is the safer choice.',
      },
      {
        type: 'heading',
        text: 'Bracelets, cuffs and bangles',
      },
      {
        type: 'paragraph',
        text: 'Wrist measurements work the same way: wrap a strip of paper around your wrist just below the wrist bone, mark the overlap, and measure it in millimetres. Open cuffs and open bangles are more forgiving than closed forms because the opening can be eased very slightly to sit correctly — adjust gently and gradually with both hands rather than flexing a piece sharply, which stresses the metal and can mark the finish at the bend.',
      },
      {
        type: 'heading',
        text: 'If the size is not right',
      },
      {
        type: 'paragraph',
        text: 'Avirena offers a 14-day return and exchange window from delivery for unworn pieces in their original packaging, so a size exchange is straightforward if your measurement was off. Full details are on our policies page.',
      },
    ],
    faqs: [
      {
        question: 'How do I measure my ring size at home?',
        answer:
          'Wrap a thin strip of paper or a length of string around the base of the finger you will wear the ring on, snug enough that it will not slide but loose enough to turn. Mark the point where it overlaps, lay it flat against a ruler, and read the length in millimetres — that is your finger circumference, which you can match to a size chart. A circumference of 54.4 mm is a US 7, EU 54 and India 14. Alternatively, take a ring that already fits that finger, lay it flat, and measure straight across the inside of the band through the centre: 17.3 mm across is also a US 7. Measure at the end of the day, when fingers are at their largest.',
      },
      {
        question: 'What should I do if I am between two ring sizes?',
        answer:
          'Size up. A ring that is very slightly loose stays comfortable all day, while one that is very slightly tight becomes uncomfortable by the afternoon and can be difficult to remove when fingers swell in heat or humidity. Band width matters as well: a wide or domed band contacts more of the finger and wears tighter than a narrow band of the same nominal size, so with a broader design the larger size is the safer choice. It is also worth checking that your chosen size clears your knuckle — if the knuckle is noticeably wider than the base of the finger, size to the knuckle so the ring can be put on and taken off.',
      },
      {
        question: 'What ring size is 54 mm?',
        answer:
          'A finger circumference of about 54 mm corresponds to a US size 7, a UK size N 1/2, an EU size 54 and an India size 14. Measured the other way, that is an inside band diameter of roughly 17.3 mm. For reference on either side of it: 51.8 mm circumference (16.5 mm diameter) is a US 6, EU 51.5 and India 12, while 56.9 mm circumference (18.1 mm diameter) is a US 8, EU 56.5 and India 16. If your measurement falls between two rows on a conversion chart, choose the larger size, particularly for a wide or domed band, which sits against more of the finger and feels tighter than a narrow one.',
      },
    ],
  },
];

export const getGuide = (slug: string): Guide | undefined =>
  GUIDES.find((g) => g.slug === slug);
