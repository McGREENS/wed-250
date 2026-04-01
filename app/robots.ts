import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/vendor/', '/admin/'],
      },
    ],
    sitemap: 'https://andiza.co.rw/sitemap.xml',
  }
}
