import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hnelectronics.lk';

export default function robots(): MetadataRoute.Robots {
  const aiBots = [
    'GPTBot',
    'ChatGPT-User',
    'ClaudeBot',
    'PerplexityBot',
    'Google-Extended',
    'Applebot-Extended',
    'Bytespider',
    'CCBot',
    'anthropic-ai',
    'FacebookBot',
    'Amazonbot'
  ];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/login'],
      },
      ...aiBots.map(bot => ({
        userAgent: bot,
        disallow: '/',
      }))
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
