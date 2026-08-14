'use client';

import { useEffect } from 'react';
import { generateOrganizationSchema, generateWebsiteSchema, generateLocalBusinessSchema } from '@/lib/seo';

export default function SchemaScript() {
  useEffect(() => {
    // Create and inject schema script on client side only
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify([
      generateOrganizationSchema(),
      generateWebsiteSchema(),
      generateLocalBusinessSchema(),
    ]);
    document.head.appendChild(script);
  }, []);

  return null;
}
