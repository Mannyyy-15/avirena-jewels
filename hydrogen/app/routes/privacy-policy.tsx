import type {MetaFunction} from 'react-router';
import {PolicyLayout} from '../components/PolicyLayout';

export const meta: MetaFunction = () => {
  return [
    {title: 'Privacy Policy | AVIRENA'},
    {
      name: 'description',
      content:
        'Official Avirena Jewels Privacy Policy: 256-bit SSL encryption, PCI-DSS compliance, GDPR/DPDP data protection, and customer privacy.',
    },
    {property: 'og:title', content: 'Privacy Policy | AVIRENA'},
    {
      property: 'og:description',
      content: 'Data privacy and security standards at Avirena Jewels.',
    },
  ];
};

export default function PrivacyPolicyRoute() {
  return <PolicyLayout activeHandle="privacy-policy" />;
}
