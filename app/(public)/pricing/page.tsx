import { Metadata } from 'next';
import PricingClient from './PricingClient';
import { SUBSCRIPTION_PLANS } from '@/lib/pesapal';

export const metadata: Metadata = {
  title: 'Pricing — Andiza',
  description:
    'Choose your wedding planning subscription — Individual (RWF 30,000) or Couple (RWF 55,000). Paid once a year, powered by PesaPal.',
};

export default function PricingPage() {
  // Spread into a plain array so the const-assertion readonly type doesn't
  // conflict with the client component prop expectations
  const plans = [...SUBSCRIPTION_PLANS];
  console.log('Server: SUBSCRIPTION_PLANS:', SUBSCRIPTION_PLANS);
  console.log('Server: spread plans:', plans);
  return <PricingClient plans={plans} />;
}
