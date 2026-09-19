import type {MetaFunction} from 'react-router';
import {PolicyLayout} from '../components/PolicyLayout';

export const meta: MetaFunction = () => {
  return [
    {title: 'Terms of Service | AVIRENA'},
    {
      name: 'description',
      content:
        'Terms of service, pricing conditions, craftsmanship authenticity, and legal agreements for Avirena Jewels storefront.',
    },
    {property: 'og:title', content: 'Terms of Service | AVIRENA'},
    {
      property: 'og:description',
      content: 'Storefront terms and conditions for Avirena Jewels.',
    },
  ];
};

export default function TermsOfServiceRoute() {
  return <PolicyLayout activeHandle="terms-of-service" />;
}
