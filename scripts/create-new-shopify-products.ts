import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const SHOP_DOMAIN = process.env.VITE_SHOPIFY_STORE_DOMAIN || 'm5yhxq-gb.myshopify.com';
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET;
const API_VERSION = process.env.VITE_SHOPIFY_API_VERSION || '2025-01';

async function getAdminAccessToken(): Promise<string> {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: CLIENT_ID!,
      client_secret: CLIENT_SECRET!,
    }),
  });
  const data = await res.json();
  return data.access_token;
}

const NEW_PRODUCTS = [
  {
    title: "Avirena Duo Curve Hoops",
    handle: "avirena-duo-curve-hoops-gold-tone-brass",
    productType: "Earrings",
    tags: ["Earrings", "Hoops", "Gold-Tone Brass", "Bestseller", "New", "Featured"],
    price: "699.00",
    compareAtPrice: "2199.00",
    images: [
      "https://cdn.shopify.com/s/files/1/1031/9364/1282/files/3a356044-e342-4f76-900a-66eaba135eb2.png",
      "https://cdn.shopify.com/s/files/1/1031/9364/1282/files/fb112afb-7805-44f8-a74e-b105b332280b.png",
      "https://cdn.shopify.com/s/files/1/1031/9364/1282/files/c91698fb-403a-4bbf-af99-7b3f7b7df8ba.png",
      "https://cdn.shopify.com/s/files/1/1031/9364/1282/files/39142a6f-ba44-4e53-96ba-3426b2b529b8.png",
      "https://cdn.shopify.com/s/files/1/1031/9364/1282/files/1b78fe01-2e02-47ed-8017-0caa7779304e.png"
    ],
    seo: {
      title: "Avirena Duo Curve Hoops | Gold-Tone Brass Earrings | AVIRENA",
      description: "Sculptural double-band huggie hoops in anti-tarnish gold-tone brass. Brushed & polished contrast. Free delivery across India & 7-day returns."
    },
    description: `Dual contours. Architectural harmony. A sculptural double-band silhouette pairing a rich brushed satin band with a gleaming mirror-polished gold-tone curve. Designed to sit snugly around the earlobe, creating a bold, multi-dimensional presence without any drag.

Product highlights
• Architectural dual-band layered silhouette
• Textural contrast: brushed satin and mirror-polish finish
• Snug huggie hoop fit for continuous comfort
• Hollow-formed core for lightweight all-day wear

Materials
• High-grade brass with anti-tarnish gold-tone protective e-coating
• Nickel-free, lead-free and cadmium-free (hypoallergenic)
• Surgical steel posts suitable for sensitive ears
• Fashion jewellery (not solid gold or sterling silver)

Perfect for
• Everyday and office wear
• Modern ethnic wear and sarees
• Evening dinners and celebrations
• Thoughtful gifting

Care
Remove before swimming, bathing or workouts. Apply perfume and lotion before putting them on. Wipe gently with a soft dry cloth after wear and store dry.

Free delivery across India. 7-day easy returns on unworn pieces in original packaging.`
  },
  {
    title: "Avirena Tiered Pebble Drops",
    handle: "avirena-tiered-pebble-drops-gold-tone-earrings",
    productType: "Earrings",
    tags: ["Earrings", "Drops", "Gold-Tone Brass", "Bestseller", "New", "Featured"],
    price: "799.00",
    compareAtPrice: "2499.00",
    images: [
      "https://cdn.shopify.com/s/files/1/1031/9364/1282/files/cfe3752b-17e9-413b-95a8-111c4798de48.png",
      "https://cdn.shopify.com/s/files/1/1031/9364/1282/files/da8512cc-cca6-40ad-8441-0f488799d4ad.png",
      "https://cdn.shopify.com/s/files/1/1031/9364/1282/files/8a3f2817-88b1-4962-b136-86b8a03d104b.png",
      "https://cdn.shopify.com/s/files/1/1031/9364/1282/files/73991050-4064-411a-bd93-d84b550434e6.png",
      "https://cdn.shopify.com/s/files/1/1031/9364/1282/files/52fb5211-1ea7-4228-9d7c-e0e121067614.png"
    ],
    seo: {
      title: "Avirena Tiered Pebble Drops | Gold-Tone Drop Earrings | AVIRENA",
      description: "Articulated triple oval pebble drop earrings in anti-tarnish gold-tone brass. Fluid movement. Free delivery across India & 7-day returns."
    },
    description: `Fluid motion. Sculptural poise. Three graduated oval pebbles articulated with delicate chain links that sway gracefully with every turn of the head. High-polish mirror surfaces catch ambient light in continuous rhythm, giving you an elongated silhouette that flatters the jawline.

Product highlights
• Articulated triple oval drop design with kinetic swing
• Fluid link joins creating natural, graceful movement
• High-polish gold-tone mirror finish
• Hollow-formed beads to prevent lobe fatigue

Materials
• High-grade brass with anti-tarnish gold-tone protective e-coating
• Nickel-free, lead-free and cadmium-free (hypoallergenic)
• Surgical steel posts with secure backings
• Fashion jewellery (not solid gold or sterling silver)

Perfect for
• Cocktail parties and festive celebrations
• Elegant date nights and evening wear
• Sarees, lehengas and ethnic styling
• Everyday luxury statements

Care
Remove before swimming, bathing or workouts. Apply perfume and lotion before putting them on. Wipe gently with a soft dry cloth after wear and store dry.

Free delivery across India. 7-day easy returns on unworn pieces in original packaging.`
  },
  {
    title: "Avirena Granulated Dome Studs",
    handle: "avirena-granulated-dome-studs-gold-tone",
    productType: "Earrings",
    tags: ["Earrings", "Studs", "Gold-Tone Brass", "Bestseller", "New", "Featured"],
    price: "699.00",
    compareAtPrice: "2199.00",
    images: [
      "https://cdn.shopify.com/s/files/1/1031/9364/1282/files/1f808ab7-ab6b-40c4-b79c-c19c69cf769a.png",
      "https://cdn.shopify.com/s/files/1/1031/9364/1282/files/91523fb6-efa9-4ab1-9d05-20d847eea07a.png",
      "https://cdn.shopify.com/s/files/1/1031/9364/1282/files/e968e840-7c9b-4246-be85-4ecce42fde10.png",
      "https://cdn.shopify.com/s/files/1/1031/9364/1282/files/03741f6b-d3fb-442c-955b-962244a257a6.png",
      "https://cdn.shopify.com/s/files/1/1031/9364/1282/files/fa77b548-a774-4d94-abcb-5dba2541004e.png"
    ],
    seo: {
      title: "Avirena Granulated Dome Studs | Beaded Gold-Tone Studs | AVIRENA",
      description: "Granulated caviar bead dome studs in anti-tarnish gold-tone brass. Hinged omega clip backing. Free delivery across India & 7-day returns."
    },
    description: `Sculptural texture. Timeless dome. Intricately beaded micro-granulation covers an arched oval dome, creating an enchanting play of light and shadow reminiscent of vintage high jewellery. Engineered with a premium hinged clasp that hugs the ear with supreme security and zero pinch.

Product highlights
• Rich granulated beaded caviar texture across an arched dome
• Dimensional relief with deep light scattering
• Ergonomic secure hinged post and latch mechanism
• Sits flat against the earlobe without tilting

Materials
• High-grade brass with anti-tarnish gold-tone protective e-coating
• Nickel-free, lead-free and cadmium-free (hypoallergenic)
• Skin-friendly comfort latch fitting
• Fashion jewellery (not solid gold or sterling silver)

Perfect for
• Power dressing and boardrooms
• Daily styling and chic coffee dates
• Sarees, kurtas and ethnic sets
• An elevated gifting gesture

Care
Remove before swimming, bathing or workouts. Apply perfume and lotion before putting them on. Wipe gently with a soft dry cloth after wear and store dry.

Free delivery across India. 7-day easy returns on unworn pieces in original packaging.`
  },
  {
    title: "Avirena Brushed Orb Drops",
    handle: "avirena-brushed-orb-drops-gold-tone-earrings",
    productType: "Earrings",
    tags: ["Earrings", "Drops", "Gold-Tone Brass", "Bestseller", "New", "Featured"],
    price: "799.00",
    compareAtPrice: "2499.00",
    images: [
      "https://cdn.shopify.com/s/files/1/1031/9364/1282/files/964e1755-681d-49cd-88a0-779b91b6ffa6.png",
      "https://cdn.shopify.com/s/files/1/1031/9364/1282/files/e5142a42-c85f-4ca9-a01d-b169df4b9ad5.png",
      "https://cdn.shopify.com/s/files/1/1031/9364/1282/files/ca569ab3-fc24-450e-b349-75cd636240ae.png",
      "https://cdn.shopify.com/s/files/1/1031/9364/1282/files/1f0c32fc-0e4e-4590-b717-daf23c2f1829.png",
      "https://cdn.shopify.com/s/files/1/1031/9364/1282/files/30ab8de1-138b-4721-bf9c-7a4cbfa18748.png",
      "https://cdn.shopify.com/s/files/1/1031/9364/1282/files/a68b65e8-c401-4ac4-857b-9f4a6d80ff4c.png"
    ],
    seo: {
      title: "Avirena Brushed Orb Drops | Gold-Tone Ball Drop Hoops | AVIRENA",
      description: "Spherical brushed satin orb drop earrings on polished gold mini hoops. Anti-tarnish brass. Free delivery across India & 7-day returns."
    },
    description: `Celestial sphere. Architectural charm. A perfect brushed-satin spherical sphere suspended freely from a polished mini hoop. The matte texture softens reflections into a warm, diffused golden glow, giving you a striking contemporary statement with sculptural simplicity.

Product highlights
• Perfect spherical orb silhouette with warm brushed-satin finish
• Suspended from an articulated polished mini-hoop
• Dynamic kinetic motion as the sphere rolls with your pace
• Lightweight hollow-formed sphere for fatigue-free wear

Materials
• High-grade brass with anti-tarnish gold-tone protective e-coating
• Nickel-free, lead-free and cadmium-free (hypoallergenic)
• Surgical steel hoop latch for sensitive skin
• Fashion jewellery (not solid gold or sterling silver)

Perfect for
• Modern minimalist tailoring
• Evening dresses and cocktail attire
• Contemporary ethnic wear and kurtis
• Gifting for architecture & design lovers

Care
Remove before swimming, bathing or workouts. Apply perfume and lotion before putting them on. Wipe gently with a soft dry cloth after wear and store dry.

Free delivery across India. 7-day easy returns on unworn pieces in original packaging.`
  },
  {
    title: "Avirena Cascade Statement Drops",
    handle: "avirena-cascade-statement-drops-gold-tone",
    productType: "Earrings",
    tags: ["Earrings", "Drops", "Statement", "Gold-Tone Brass", "Bestseller", "New", "Featured"],
    price: "1199.00",
    compareAtPrice: "3999.00",
    images: [
      "https://cdn.shopify.com/s/files/1/1031/9364/1282/files/f3887f27-b72b-4af5-b09c-325f425e3fc5.png",
      "https://cdn.shopify.com/s/files/1/1031/9364/1282/files/c0f1fc00-4cc7-4689-bb31-3c8049ec1018.png",
      "https://cdn.shopify.com/s/files/1/1031/9364/1282/files/5f154c99-a346-4524-b233-0dda7b1d7921.png",
      "https://cdn.shopify.com/s/files/1/1031/9364/1282/files/e396424d-a690-4eb4-a7a0-f3f529c27faf.png",
      "https://cdn.shopify.com/s/files/1/1031/9364/1282/files/d58c92d3-5bee-45bf-8a02-eb6aa55259b5.png",
      "https://cdn.shopify.com/s/files/1/1031/9364/1282/files/97fc5c1d-2d6b-4b98-9372-5db01c516f31.png"
    ],
    seo: {
      title: "Avirena Cascade Statement Drops | Molten Fringe Earrings | AVIRENA",
      description: "Tiered molten perforated fringe statement earrings in anti-tarnish gold-tone brass. Bold festive style. Free delivery in India & 7-day returns."
    },
    description: `Bold organic drama. Cascading light. Tiered organic plates sculpted with intricate openwork cellular perforations that tumble like golden molten water. A showstopping statement drop that holds the room on its own — no necklace or other accessories required.

Product highlights
• Multi-tiered cascading molten fringe architecture
• Intricate organic cellular openwork detailing
• High-gloss mirror gold-tone finish with deep light reflection
• Articulated tiers move gracefully without heavy lobe pull

Materials
• High-grade brass with anti-tarnish gold-tone protective e-coating
• Nickel-free, lead-free and cadmium-free (hypoallergenic)
• Surgical steel posts with comfort disc backings
• Fashion jewellery (not solid gold or sterling silver)

Perfect for
• Grand weddings, sangeet and reception looks
• Evening galas and red-carpet statements
• Designer sarees and occasion lehengas
• Luxury occasion gifting

Care
Remove before swimming, bathing or workouts. Apply perfume and lotion before putting them on. Wipe gently with a soft dry cloth after wear and store dry.

Free delivery across India. 7-day easy returns on unworn pieces in original packaging.`
  }
];

async function main() {
  const token = await getAdminAccessToken();

  for (const item of NEW_PRODUCTS) {
    console.log(`Creating product "${item.title}"...`);
    const media = item.images.map((url) => ({
      mediaContentType: "IMAGE",
      originalSource: url,
    }));

    const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token,
      },
      body: JSON.stringify({
        query: `
          mutation CreateProduct($input: ProductInput!, $media: [CreateMediaInput!]) {
            productCreate(input: $input, media: $media) {
              product {
                id
                title
                handle
                status
                variants(first: 1) {
                  edges {
                    node {
                      id
                    }
                  }
                }
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
        variables: {
          input: {
            title: item.title,
            handle: item.handle,
            productType: item.productType,
            tags: item.tags,
            descriptionHtml: item.description.replace(/\n/g, '<br/>'),
            status: "ACTIVE",
            seo: item.seo,
          },
          media,
        },
      }),
    });

    const data = await res.json();
    const created = data.data?.productCreate?.product;
    const errors = data.data?.productCreate?.userErrors;

    if (errors && errors.length > 0) {
      console.error(`Error creating ${item.title}:`, errors);
    } else if (created) {
      console.log(`✓ Created: ${created.title} (${created.id})`);
      const variantId = created.variants?.edges?.[0]?.node?.id;
      if (variantId) {
        // Update price & compare-at price on variant
        await fetch(`https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': token,
          },
          body: JSON.stringify({
            query: `
              mutation updateVariant($input: ProductVariantInput!) {
                productVariantUpdate(input: $input) {
                  productVariant {
                    id
                    price
                    compareAtPrice
                  }
                  userErrors {
                    field
                    message
                  }
                }
              }
            `,
            variables: {
              input: {
                id: variantId,
                price: item.price,
                compareAtPrice: item.compareAtPrice,
              }
            }
          })
        });
        console.log(`  ✓ Updated variant price to ₹${item.price} (MRP: ₹${item.compareAtPrice})`);
      }
    }
  }

  console.log('\nAll 5 new products created successfully in Shopify!');
}

main().catch(console.error);
