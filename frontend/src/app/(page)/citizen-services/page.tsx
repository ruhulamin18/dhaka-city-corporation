import type { Metadata } from 'next';
import CitizenServicesHub from '@/components/citizen-services/CitizenServicesHub';

export const metadata: Metadata = {
  title: 'Citizen Services | Dhaka City Corporation',
  description:
    'Browse all 31 official Dhaka City Corporation citizen services across Registration & Certificates, Business & Licensing, Tax & Revenue, and Infrastructure & Public Services.',
};

export default function CitizenServicesPage() {
  return <CitizenServicesHub />;
}
