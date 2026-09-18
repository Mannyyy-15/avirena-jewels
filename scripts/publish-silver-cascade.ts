import dotenv from 'dotenv';
dotenv.config();

const SHOP_DOMAIN = process.env.VITE_SHOPIFY_STORE_DOMAIN || 'm5yhxq-gb.myshopify.com';
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET;
const API_VERSION = process.env.VITE_SHOPIFY_API_VERSION || '2025-01';

async function getAdminAccessToken(): Promise<string> {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('Missing SHOPIFY_CLIENT_ID or SHOPIFY_CLIENT_SECRET in .env');
  }

  const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to obtain Admin Access Token (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.access_token;
}

async function adminGraphQL(query: string, variables: any = {}) {
  const token = await getAdminAccessToken();
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`Admin GraphQL HTTP error (${res.status}): ${await res.text()}`);
  }

  const data = await res.json();
  if (data.errors) {
    throw new Error(`Admin GraphQL Error: ${JSON.stringify(data.errors, null, 2)}`);
  }
  return data.data;
}

async function main() {
  console.log('🚀 Step 1: Querying Locations and Product details...');
  const locData = await adminGraphQL(`
    query {
      locations(first: 5) {
        nodes {
          id
          name
          isActive
        }
      }
      product(id: "gid://shopify/Product/10536925659458") {
        id
        title
        handle
        status
        variants(first: 5) {
          nodes {
            id
            title
            price
            compareAtPrice
            inventoryItem {
              id
              tracked
            }
          }
        }
      }
      goldProduct: product(id: "gid://shopify/Product/10521318916418") {
        id
        title
        handle
      }
      publications(first: 10) {
        nodes {
          id
          name
        }
      }
    }
  `);

  const primaryLocation = locData.locations.nodes.find((l: any) => l.isActive) || locData.locations.nodes[0];
  console.log(`📍 Using primary location: ${primaryLocation.name} (${primaryLocation.id})`);

  const silverProduct = locData.product;
  if (!silverProduct) {
    throw new Error('Silver cascade product not found!');
  }
  console.log(`📦 Found Product: ${silverProduct.title} (Status: ${silverProduct.status})`);

  const variant = silverProduct.variants.nodes[0];
  const inventoryItemId = variant.inventoryItem.id;
  console.log(`🏷️ Variant: ${variant.id}, InventoryItem: ${inventoryItemId}`);

  // Step 2: Track inventory & set inventoryPolicy DENY
  console.log('\n🔒 Step 2: Setting variant inventory tracking and policy DENY...');
  const varUpdate = await adminGraphQL(`
    mutation updateVariant($input: ProductVariantsBulkInput!) {
      productVariantsBulkUpdate(productId: "gid://shopify/Product/10536925659458", variants: [$input]) {
        productVariants {
          id
          inventoryPolicy
        }
        userErrors {
          field
          message
        }
      }
    }
  `, {
    input: {
      id: variant.id,
      inventoryPolicy: 'DENY',
      inventoryItem: {
        tracked: true,
      },
    },
  });
  console.log('Variant update result:', JSON.stringify(varUpdate));

  // Step 3: Set inventory quantity = 2
  console.log('\n📦 Step 3: Setting inventory quantity to 2...');
  const invSet = await adminGraphQL(`
    mutation setInventory($input: InventorySetQuantitiesInput!) {
      inventorySetQuantities(input: $input) {
        inventoryAdjustmentGroup {
          reason
          changes {
            name
            delta
            quantityAfterChange
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `, {
    input: {
      name: 'available',
      reason: 'correction',
      ignoreCompareQuantity: true,
      quantities: [
        {
          inventoryItemId: inventoryItemId,
          locationId: primaryLocation.id,
          quantity: 2,
        },
      ],
    },
  });
  console.log('Inventory set result:', JSON.stringify(invSet));

  // Step 4: Set product status = ACTIVE
  console.log('\n🟢 Step 4: Setting product status to ACTIVE...');
  const prodUpdate = await adminGraphQL(`
    mutation updateProduct($input: ProductInput!) {
      productUpdate(input: $input) {
        product {
          id
          title
          status
        }
        userErrors {
          field
          message
        }
      }
    }
  `, {
    input: {
      id: silverProduct.id,
      status: 'ACTIVE',
    },
  });
  console.log('Product update result:', JSON.stringify(prodUpdate));

  // Step 5: Publish to all publications
  console.log('\n📢 Step 5: Publishing to all sales channels...');
  const pubInputs = locData.publications.nodes.map((p: any) => ({
    publicationId: p.id,
  }));
  const pubResult = await adminGraphQL(`
    mutation publishProduct($id: ID!, $input: [PublicationInput!]!) {
      publishablePublish(id: $id, input: $input) {
        publishable {
          availablePublicationsCount {
            count
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `, {
    id: silverProduct.id,
    input: pubInputs,
  });
  console.log('Publish result:', JSON.stringify(pubResult));

  // Step 6: Create the 4th Duo Bundle Discount
  console.log('\n🎁 Step 6: Checking discounts & creating Cascade Gold + Silver Duo bundle...');
  const existingDiscounts = await adminGraphQL(`
    query {
      discountNodes(first: 20) {
        nodes {
          id
          discount {
            ... on DiscountAutomaticBasic {
              title
              status
            }
          }
        }
      }
    }
  `);
  console.log('Existing automatic discounts:', JSON.stringify(existingDiscounts));

  const bundleTitle = 'Cascade Duo (Gold + Silver) — ₹100 Off';
  const alreadyExists = existingDiscounts.discountNodes.nodes.some(
    (n: any) => n.discount?.title === bundleTitle
  );

  if (!alreadyExists) {
    console.log(`Creating bundle discount: "${bundleTitle}"...`);
    const discountRes = await adminGraphQL(`
      mutation createBundleDiscount($automaticBasicDiscount: DiscountAutomaticBasicInput!) {
        discountAutomaticBasicCreate(automaticBasicDiscount: $automaticBasicDiscount) {
          automaticDiscountNode {
            id
            automaticDiscount {
              ... on DiscountAutomaticBasic {
                title
                status
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `, {
      automaticBasicDiscount: {
        title: bundleTitle,
        startsAt: new Date().toISOString(),
        customerGets: {
          value: {
            discountAmount: {
              amount: 50.0,
              appliesOnEachItem: true,
            },
          },
          items: {
            products: {
              productsToAdd: [
                "gid://shopify/Product/10521318916418", // Gold Cascade
                "gid://shopify/Product/10536925659458", // Silver Cascade
              ],
            },
          },
        },
        minimumRequirement: {
          quantity: {
            greaterThanOrEqualToQuantity: "2",
          },
        },
        combinesWith: {
          orderDiscounts: true,
          productDiscounts: true,
          shippingDiscounts: true,
        },
      },
    });
    console.log('Discount creation result:', JSON.stringify(discountRes, null, 2));
  } else {
    console.log(`Bundle discount "${bundleTitle}" already exists.`);
  }

  console.log('\n✨ All steps completed successfully!');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
