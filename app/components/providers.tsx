'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@/app/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UnreadMessagesProvider } from '@/app/contexts/UnreadMessagesContext';
import { useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <UnreadMessagesProvider>
          {children}
          <Toaster position="top-center" richColors closeButton />
        </UnreadMessagesProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}