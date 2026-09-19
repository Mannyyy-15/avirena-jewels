import { useLoaderData } from 'react-router';
import type { Route } from './+types/shop.$category';
import { CollectionPageView } from '~/components/CollectionPageView';
import { STOREFRONT_PRODUCTS_QUERY, transformShopifyProduct } from '~/lib/shopify';
import type { Product, Category } from '~/types/storefront';

const CATEGORY_TITLES: Record<string, string> = {
  earrings: 'Anti-Tarnish Earrings Online India | AVIRENA',
  necklaces: 'Anti-Tarnish Necklaces Online India | AVIRENA',
  rings: 'Anti-Tarnish Rings Online India | AVIRENA',
  bracelets: 'Anti-Tarnish Bracelets Online India | AVIRENA',
  brooches: 'Anti-Tarnish Brooches Online India | AVIRENA',
  sets: 'Anti-Tarnish Jewellery Sets Online India | AVIRENA',
};

export const meta: Route.MetaFunction = ({ data, params }) => {
  const category = params.category?.toLowerCase() || 'earrings';
  const hasProducts = (data?.allProducts?.some((p: any) => p.category === category)) || false;
  const title = CATEGORY_TITLES[category] || `${category.toUpperCase()} | AVIRENA Jewels`;

  const metaList: any[] = [
    { title },
    {
      name: 'description',
      content: `Explore Avirena's anti-tarnish dailywear ${category}. High-grade brass with protective e-coating. Free delivery across India.`,
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: `https://avirenajewels.com/shop/${category}`,
    },
  ];

  if (!hasProducts) {
    metaList.push({ name: 'robots', content: 'noindex, follow' });
  }

  return metaList;
};

export async function loader({ params, context }: Route.LoaderArgs) {
  const category = (params.category || '').toLowerCase() as Category;
  const { storefront } = context;

  const data = await storefront.query(STOREFRONT_PRODUCTS_QUERY, {
    variables: { first: 50 },
  });

  const rawEdges = data?.products?.edges || [];
  const allProducts: Product[] = rawEdges.map((edge: any) =>
    transformShopifyProduct(edge.node)
  );

  return {
    category,
    allProducts,
  };
}

export default function ShopCategoryPage() {
  const { category, allProducts } = useLoaderData<typeof loader>();
  return <CollectionPageView products={allProducts} selectedCategory={category} />;
}
