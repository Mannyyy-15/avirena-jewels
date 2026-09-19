import { useLoaderData } from 'react-router';
import type { Route } from './+types/collections.all';
import { CollectionPageView } from '~/components/CollectionPageView';
import { STOREFRONT_PRODUCTS_QUERY, transformShopifyProduct } from '~/lib/shopify';
import type { Product } from '~/types/storefront';

export const meta: Route.MetaFunction = () => {
  return [
    { title: 'All Jewellery Pieces | AVIRENA Jewels' },
    {
      name: 'description',
      content:
        'Explore all anti-tarnish dailywear earrings, rings, and curated jewelry suites by Avirena Jewels.',
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: 'https://avirenajewels.com/collections/all',
    },
  ];
};

export async function loader({ context }: Route.LoaderArgs) {
  const { storefront } = context;

  const data = await storefront.query(STOREFRONT_PRODUCTS_QUERY, {
    variables: { first: 50 },
  });

  const rawEdges = data?.products?.edges || [];
  const products: Product[] = rawEdges.map((edge: any) =>
    transformShopifyProduct(edge.node)
  );

  return {
    products,
  };
}

export default function AllProductsPage() {
  const { products } = useLoaderData<typeof loader>();
  return <CollectionPageView products={products} selectedCategory="all" />;
}
