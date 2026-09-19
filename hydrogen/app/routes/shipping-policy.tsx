import type {MetaFunction} from 'react-router';
import {PolicyLayout} from '../components/PolicyLayout';

export const meta: MetaFunction = () => {
  return [
    {title: 'Shipping Policy | AVIRENA'},
    {
      name: 'description',
      content:
        'Official Avirena Jewels Shipping Policy: Free express delivery across India, 24-48h dispatch, and 100% transit insurance.',
    },
    {property: 'og:title', content: 'Shipping Policy | AVIRENA'},
    {
      property: 'og:description',
      content: 'Express tracked domestic delivery and transit insurance details.',
    },
  ];
};

export default function ShippingPolicyRoute() {
  return <PolicyLayout activeHandle="shipping-policy" />;
}
