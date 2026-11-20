import type { Metadata } from 'next';
import { StatusRouteView } from '@/components/status/StatusRouteView';

export const metadata: Metadata = {
  title: 'Connection Problem | Dhaka City Corporation',
  description:
    'সার্ভারের সঙ্গে সংযোগ স্থাপন করা যাচ্ছে না। অনুগ্রহ করে আপনার ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।',
};

export default function ConnectionProblemPage() {
  return <StatusRouteView type="connection-problem" />;
}
