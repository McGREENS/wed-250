'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@/app/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UnreadMessagesProvider } from '@/app/contexts/UnreadMessagesContext';
import { RealtimeMessagingProvider } from '@/app/contexts/RealtimeMessagingContext';
import { useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <UnreadMessagesProvider>
          <RealtimeMessagingProvider>
            {children}
            <Toaster position="top-center" richColors closeButton />
          </RealtimeMessagingProvider>
        </UnreadMessagesProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}