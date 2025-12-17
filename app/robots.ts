import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/data/seo.data';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/operator/dashboard/',
          '/dashboard/',
          '/api/',
        ],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}

