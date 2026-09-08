import fs from 'fs';

const TAGS_MAP: Record<string, { tags: string[]; isNew?: boolean }> = {
  'avirena-square-studs-gold-tone-brass-earrings': {
    tags: ["anti-tarnish","brass","dailywear","earrings","ethnic-wear","geometric","gifting","gold-tone","nickel-free","office-wear","statement","studs","under-999"],
  },
  'avirena-drop-earrings-gold-tone-brass': {
    tags: ["anti-tarnish","brass","dailywear","dangle","drop-earrings","earrings","gifting","gold-tone","minimalist","nickel-free","occasion-wear","office-wear","under-999"],
  },
  'avirena-statement-drops-geometric-brass-earrings': {
    tags: ["anti-tarnish","brass","dangle","drop-earrings","earrings","ethnic-wear","festive","geometric","gifting","gold-tone","nickel-free","occasion-wear","statement","under-999"],
  },
  'avirena-heart-drops-silver-tone-earrings': {
    tags: ["anti-tarnish","dailywear","dangle","drop-earrings","earrings","gifting","hearts","nickel-free","occasion-wear","silver-tone","statement","under-999"],
  },
  'avirena-spiral-earrings-silver-tone': {
    tags: ["anti-tarnish","dailywear","earrings","gifting","minimalist","nickel-free","occasion-wear","office-wear","sculptural","silver-tone","statement","studs","under-999"],
  },
  'avirena-crystal-hoops-gold-tone-earrings': {
    tags: ["anti-tarnish","brass","crystal","earrings","ethnic-wear","festive","gifting","gold-tone","hoops","nickel-free","occasion-wear","statement","under-999"],
  },
  'avirena-crystal-hoops-silver-tone-earrings': {
    tags: ["anti-tarnish","crystal","earrings","ethnic-wear","festive","gifting","hoops","nickel-free","occasion-wear","silver-tone","statement","under-999"],
  },
  'avirena-pebble-studs-gold-tone-earrings': {
    tags: ["anti-tarnish","brass","dailywear","earrings","gifting","gold-tone","nickel-free","office-wear","organic","sculptural","statement","studs","under-999"],
  },
  'avirena-leaf-studs-gold-tone-earrings': {
    tags: ["anti-tarnish","brass","dailywear","earrings","gifting","gold-tone","leaf","nickel-free","occasion-wear","office-wear","sculptural","statement","studs","under-999"],
  },
  'avirena-duo-curve-hoops-gold-tone-brass': {
    tags: ["anti-tarnish","bestseller","brass","dailywear","earrings","featured","gifting","gold-tone","hoops","huggie","minimalist","new","nickel-free","office-wear","statement","under-999"],
    isNew: true,
  },
  'avirena-tiered-pebble-drops-gold-tone-earrings': {
    tags: ["anti-tarnish","bestseller","brass","dailywear","dangle","drop-earrings","earrings","ethnic-wear","featured","festive","gifting","gold-tone","new","nickel-free","occasion-wear","organic","sculptural","statement","under-999"],
    isNew: true,
  },
  'avirena-granulated-dome-studs-gold-tone': {
    tags: ["anti-tarnish","bestseller","brass","dailywear","earrings","ethnic-wear","featured","gifting","gold-tone","new","nickel-free","office-wear","sculptural","statement","studs","textured","under-999"],
    isNew: true,
  },
  'avirena-brushed-orb-drops-gold-tone-earrings': {
    tags: ["anti-tarnish","ball-earrings","bestseller","brass","dailywear","dangle","drop-earrings","earrings","featured","gifting","gold-tone","minimalist","new","nickel-free","occasion-wear","office-wear","sculptural","statement","under-999"],
    isNew: true,
  },
  'avirena-cascade-statement-drops-gold-tone': {
    tags: ["anti-tarnish","bestseller","brass","dangle","drop-earrings","earrings","ethnic-wear","featured","festive","gifting","gold-tone","new","nickel-free","occasion-wear","organic","sculptural","statement"],
    isNew: true,
  },
};

let content = fs.readFileSync('src/data/products.ts', 'utf8');

for (const [handle, data] of Object.entries(TAGS_MAP)) {
  const handleRegex = new RegExp(`(handle:\\s*'${handle}',[\\s\\S]*?)(isSculptural:\\s*true)`, 'g');
  content = content.replace(handleRegex, (match, prefix, suffix) => {
    const isNewStr = data.isNew ? `\n    isNew: true,` : '';
    const tagsStr = `\n    tags: ${JSON.stringify(data.tags)},`;
    // If already has tags, don't duplicate
    if (prefix.includes('tags:')) return match;
    return `${prefix}${suffix},${isNewStr}${tagsStr}`;
  });
}

fs.writeFileSync('src/data/products.ts', content, 'utf8');
console.log('Successfully updated src/data/products.ts with tags and isNew!');
