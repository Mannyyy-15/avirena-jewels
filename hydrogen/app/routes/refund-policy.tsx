import type {MetaFunction} from 'react-router';
import {PolicyLayout} from '../components/PolicyLayout';

export const meta: MetaFunction = () => {
  return [
    {title: 'Return and Refund Policy | AVIRENA'},
    {
      name: 'description',
      content:
        'Official Avirena Jewels Return and Refund Policy: 7-day hassle-free return and exchange window, pickup process, and refund timelines.',
    },
    {property: 'og:title', content: 'Return and Refund Policy | AVIRENA'},
    {
      property: 'og:description',
      content: '7-Day Return and Exchange window on dailywear jewelry creations.',
    },
  ];
};

export default function RefundPolicyRoute() {
  return <PolicyLayout activeHandle="refund-policy" />;
}
