import type {MetaFunction} from 'react-router';
import {PolicyLayout} from '../components/PolicyLayout';

export const meta: MetaFunction = () => {
  return [
    {title: 'Policies, Shipping & Returns | AVIRENA'},
    {
      name: 'description',
      content:
        'Official client assurance policies: 7-day returns, express tracked shipping across India, privacy compliance, and terms of service.',
    },
    {property: 'og:title', content: 'Policies, Shipping & Returns | AVIRENA'},
    {
      property: 'og:description',
      content:
        'Official client assurance policies: 7-day returns, express shipping, privacy compliance, and terms of service.',
    },
    {property: 'og:image', content: '/og-banner.jpg'},
  ];
};

export default function PoliciesIndex() {
  return <PolicyLayout activeHandle="refund-policy" />;
}
