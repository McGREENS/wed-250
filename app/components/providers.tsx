'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@/app/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster position="top-center" richColors closeButton />
      </QueryClientProvider>
    </SessionProvider>
  );
}