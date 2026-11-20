import type { Metadata } from 'next';
import { StatusRouteView } from '@/components/status/StatusRouteView';

export const metadata: Metadata = {
  title: 'Service Temporarily Unavailable | Dhaka City Corporation',
  description:
    'এই সেবাটি বর্তমানে সাময়িকভাবে বন্ধ রয়েছে। আমরা যত দ্রুত সম্ভব সেবাটি পুনরায় চালু করার চেষ্টা করছি।',
};

export default function UnavailablePage() {
  return <StatusRouteView type="unavailable" />;
}
