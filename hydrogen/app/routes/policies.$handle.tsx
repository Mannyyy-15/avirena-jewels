import type {LoaderFunctionArgs, MetaFunction} from 'react-router';
import {useLoaderData} from 'react-router';
import {PolicyLayout} from '../components/PolicyLayout';
import {POLICIES} from '../data/policies';

type SelectedPolicies =
  | 'privacyPolicy'
  | 'shippingPolicy'
  | 'termsOfService'
  | 'refundPolicy';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  const title = data?.title || 'Policy | AVIRENA';
  return [
    {title: `${title} | AVIRENA`},
    {name: 'description', content: `Official ${title} for Avirena Jewels.`},
  ];
};

export async function loader({params, context}: LoaderFunctionArgs) {
  const handle = params.handle || 'refund-policy';

  const policyNameMap: Record<string, SelectedPolicies> = {
    'privacy-policy': 'privacyPolicy',
    'shipping-policy': 'shippingPolicy',
    'terms-of-service': 'termsOfService',
    'refund-policy': 'refundPolicy',
  };

  const shopifyPolicyField = policyNameMap[handle];
  let serverPolicyTitle: string | undefined;
  let serverPolicyBodyHtml: string | undefined;

  if (shopifyPolicyField) {
    try {
      const data = await context.storefront.query(POLICY_CONTENT_QUERY, {
        variables: {
          privacyPolicy: false,
          shippingPolicy: false,
          termsOfService: false,
          refundPolicy: false,
          [shopifyPolicyField]: true,
        },
      });
      const fetchedPolicy = data.shop?.[shopifyPolicyField];
      if (fetchedPolicy) {
        serverPolicyTitle = fetchedPolicy.title;
        serverPolicyBodyHtml = fetchedPolicy.body;
      }
    } catch {
      // Fallback gracefully to local curated policy copy
    }
  }

  // Find local policy title if server policy didn't return one
  const localPolicy = Object.values(POLICIES).find((p) => p.handle === handle);
  const title = serverPolicyTitle || localPolicy?.title || 'Policy';

  return {
    handle,
    title,
    serverPolicyTitle,
    serverPolicyBodyHtml,
  };
}

export default function PolicyRoute() {
  const {handle, serverPolicyTitle, serverPolicyBodyHtml} = useLoaderData<typeof loader>();

  return (
    <PolicyLayout
      activeHandle={handle}
      serverPolicyTitle={serverPolicyTitle}
      serverPolicyBodyHtml={serverPolicyBodyHtml}
    />
  );
}

const POLICY_CONTENT_QUERY = `#graphql
  fragment Policy on ShopPolicy {
    body
    handle
    id
    title
    url
  }
  query Policy(
    $privacyPolicy: Boolean!
    $shippingPolicy: Boolean!
    $termsOfService: Boolean!
    $refundPolicy: Boolean!
  ) {
    shop {
      privacyPolicy @include(if: $privacyPolicy) {
        ...Policy
      }
      shippingPolicy @include(if: $shippingPolicy) {
        ...Policy
      }
      termsOfService @include(if: $termsOfService) {
        ...Policy
      }
      refundPolicy @include(if: $refundPolicy) {
        ...Policy
      }
    }
  }
` as const;
