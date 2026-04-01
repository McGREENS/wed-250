import { Metadata } from 'next';

const siteConfig = {
  name: 'Andiza',
  title: 'Andiza - Rwanda\'s Premier Wedding Planning Platform',
  description: 'Plan your dream wedding in Rwanda with Andiza. Browse top venues, book trusted vendors, and manage your entire wedding plan in one place. Simple, stress-free, and purely magical.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://andiza.co.rw',
  ogImage: '/og-image.png',
  keywords: [
    'wedding planning Rwanda',
    'Rwanda wedding venues',
    'wedding vendors Rwanda',
    'Kigali wedding planners',
    'Rwanda wedding marketplace',
    'wedding services Rwanda',
    'destination wedding Rwanda',
    'wedding photography Rwanda',
    'wedding catering Rwanda',
    'wedding decoration Rwanda',
    'Rwandan wedding',
    'marriage planning Rwanda',
    'wedding budget planner',
    'wedding checklist',
    'wedding guest management',
  ],
  authors: [
    {
      name: 'Andiza',
      url: 'https://andiza.rw',
    },
  ],
  creator: 'Andiza',
  publisher: 'Andiza',
  locale: 'en_RW',
  alternateLocales: ['fr_RW', 'rw_RW'],
};

export function generateSEOMetadata({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  noIndex = false,
}: {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  noIndex?: boolean;
}): Metadata {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title;
  const pageDescription = description || siteConfig.description;
  const pageImage = image || siteConfig.ogImage;
  const pageUrl = url ? `${siteConfig.url}${url}` : siteConfig.url;
  const pageKeywords = keywords ? [...siteConfig.keywords, ...keywords] : siteConfig.keywords;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: pageKeywords.join(', '),
    authors: siteConfig.authors,
    creator: siteConfig.creator,
    publisher: siteConfig.publisher,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: pageUrl,
      languages: {
        'en-RW': pageUrl,
        'fr-RW': pageUrl,
        'rw-RW': pageUrl,
      },
    },
    openGraph: {
      type,
      locale: siteConfig.locale,
      alternateLocale: siteConfig.alternateLocales,
      url: pageUrl,
      title: pageTitle,
      description: pageDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [pageImage],
      creator: '@andizarw',
      site: '@andizarw',
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    },
    category: 'Wedding Planning',
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kigali',
      addressCountry: 'RW',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+250-788-123-456',
      contactType: 'Customer Service',
      email: 'support@andiza.co.rw',
      availableLanguage: ['English', 'French', 'Kinyarwanda'],
    },
    sameAs: [
      'https://facebook.com/andizarw',
      'https://twitter.com/andizarw',
      'https://instagram.com/andizarw',
      'https://linkedin.com/company/andizarw',
    ],
  };
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/vendors?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteConfig.url}/#localbusiness`,
    name: siteConfig.name,
    image: `${siteConfig.url}/logo.png`,
    url: siteConfig.url,
    telephone: '+250-788-123-456',
    email: 'support@andiza.rw',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Norrsken House Kigali',
      addressLocality: 'Kigali',
      addressCountry: 'RW',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -1.9441,
      longitude: 30.0619,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00',
      },
    ],
    priceRange: '$$',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '250',
    },
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  };
}

export function generateVendorSchema(vendor: {
  name: string;
  description: string;
  category: string;
  rating: number;
  reviewCount: number;
  location: string;
  priceRange?: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: vendor.name,
    description: vendor.description,
    image: vendor.image || `${siteConfig.url}/logo.png`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: vendor.location,
      addressCountry: 'RW',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: vendor.rating.toString(),
      reviewCount: vendor.reviewCount.toString(),
    },
    priceRange: vendor.priceRange || '$$',
    category: vendor.category,
  };
}

export function generateEventSchema(event: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: string;
  image?: string;
  organizer?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate || event.startDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.location,
      address: {
        '@type': 'PostalAddress',
        addressLocality: event.location,
        addressCountry: 'RW',
      },
    },
    image: event.image || `${siteConfig.url}/logo.png`,
    organizer: {
      '@type': 'Organization',
      name: event.organizer || siteConfig.name,
      url: siteConfig.url,
    },
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export { siteConfig };
