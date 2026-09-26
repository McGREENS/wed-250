import { Metadata } from 'next';
import PaymentSuccessClient from './PaymentSuccessClient';

export const metadata: Metadata = {
  title: 'Payment Successful — Andiza',
};

export default function PaymentSuccessPage() {
  return <PaymentSuccessClient />;
}
