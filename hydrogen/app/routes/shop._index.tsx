import { useLoaderData } from 'react-router';
import type { Route } from './+types/shop._index';
import { CollectionPageView } from '~/components/CollectionPageView';
import { STOREFRONT_PRODUCTS_QUERY, transformShopifyProduct } from '~/lib/shopify';
import type { Product } from '~/types/storefront';

export const meta: Route.MetaFunction = () => {
  return [
    { title: 'Anti-Tarnish Jewellery Online India | AVIRENA' },
    {
      name: 'description',
      content:
        'Explore our complete collection of anti-tarnish dailywear earrings, rings, and curated jewelry suites in gold and silver tone brass. Free express delivery across India.',
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: 'https://avirenajewels.com/shop',
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

export default function ShopIndexPage() {
  const { products } = useLoaderData<typeof loader>();
  return <CollectionPageView products={products} selectedCategory="all" />;
}
