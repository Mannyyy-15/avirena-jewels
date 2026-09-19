import type {MetaFunction} from 'react-router';
import {PolicyLayout} from '../components/PolicyLayout';

export const meta: MetaFunction = () => {
  return [
    {title: 'Legal Notice & Material Disclosures | AVIRENA'},
    {
      name: 'description',
      content:
        'Legal notice, business registration details, grievance officer contact, and fashion jewelry brass alloy material disclosures.',
    },
    {property: 'og:title', content: 'Legal Notice & Material Disclosures | AVIRENA'},
    {
      property: 'og:description',
      content: 'Official business details and legal disclosures for Avirena Jewels.',
    },
  ];
};

export default function LegalNoticeRoute() {
  return <PolicyLayout activeHandle="legal-notice" />;
}
