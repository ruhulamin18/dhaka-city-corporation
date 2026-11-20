import type { Metadata } from 'next';
import { StatusRouteView } from '@/components/status/StatusRouteView';

export const metadata: Metadata = {
  title: 'Coming Soon | Dhaka City Corporation',
  description:
    'এই সেবাটি বর্তমানে উন্নয়নাধীন রয়েছে। খুব শিগগিরই নাগরিকদের জন্য সেবাটি চালু করা হবে।',
};

export default function ComingSoonPage() {
  return <StatusRouteView type="coming-soon" />;
}
