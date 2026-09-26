import { Metadata } from 'next';
import PaymentCancelClient from './PaymentCancelClient';

export const metadata: Metadata = {
  title: 'Payment Cancelled — Andiza',
};

export default function PaymentCancelPage() {
  return <PaymentCancelClient />;
}
