import { useLoaderData } from 'react-router';
import type { Route } from './+types/collections.$handle';
import { CollectionPageView } from '~/components/CollectionPageView';
import { STOREFRONT_PRODUCTS_QUERY, transformShopifyProduct } from '~/lib/shopify';
import type { Product } from '~/types/storefront';

const COLLECTION_TITLES: Record<string, { title: string; description: string }> = {
  'duo-suites': {
    title: 'Signature Duo Suites | AVIRENA',
    description:
      'Two complementary architectural brass earrings bundled together. An automatic ₹100 discount applies directly at checkout.',
  },
  'under-999': {
    title: 'Jewellery Under ₹999 | AVIRENA',
    description:
      'High-impact architectural studs and drop earrings in anti-tarnish brass priced under ₹999. Nickel-free with surgical steel posts.',
  },
  'gifting-edit': {
    title: 'The Gifting Edit | AVIRENA',
    description:
      'Sculptural brass jewelry edits packaged carefully for birthdays, celebrations, and festive gifting across India.',
  },
};

export const meta: Route.MetaFunction = ({ params }) => {
  const handle = params.handle?.toLowerCase() || 'duo-suites';
  const info = COLLECTION_TITLES[handle] || {
    title: `${handle.replace(/-/g, ' ').toUpperCase()} | AVIRENA`,
    description: 'Curated anti-tarnish jewelry collections by Avirena Jewels.',
  };

  return [
    { title: `${info.title}` },
    { name: 'description', content: info.description },
    {
      tagName: 'link',
      rel: 'canonical',
      href: `https://avirenajewels.com/collections/${handle}`,
    },
  ];
};

export async function loader({ params, context }: Route.LoaderArgs) {
  const handle = (params.handle || '').toLowerCase();
  const { storefront } = context;

  const data = await storefront.query(STOREFRONT_PRODUCTS_QUERY, {
    variables: { first: 50 },
  });

  const rawEdges = data?.products?.edges || [];
  const allProducts: Product[] = rawEdges.map((edge: any) =>
    transformShopifyProduct(edge.node)
  );

  return {
    handle,
    allProducts,
  };
}

export default function CollectionDetailPage() {
  const { handle, allProducts } = useLoaderData<typeof loader>();
  const isCuratedEdit = handle === 'under-999' || handle === 'gifting-edit' || handle === 'duo-suites';

  return (
    <CollectionPageView
      products={allProducts}
      selectedCategory="all"
      curatedEdit={isCuratedEdit ? (handle as any) : null}
    />
  );
}
