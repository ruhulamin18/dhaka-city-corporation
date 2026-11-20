import type { Metadata } from 'next';
import { StatusRouteView } from '@/components/status/StatusRouteView';

export const metadata: Metadata = {
  title: 'Under Maintenance | Dhaka City Corporation',
  description:
    'সেবাটির মান উন্নয়ন ও প্রযুক্তিগত রক্ষণাবেক্ষণের জন্য বর্তমানে কাজ চলছে। কাজ সম্পন্ন হলে সেবাটি পুনরায় চালু করা হবে।',
};

export default function MaintenancePage() {
  return <StatusRouteView type="maintenance" />;
}
