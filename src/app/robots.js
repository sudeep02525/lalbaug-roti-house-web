export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/private/', '/checkout', '/profile', '/order-success', '/orders'],
    },
    sitemap: 'https://www.lalbaugrotihouse.com/sitemap.xml',
  }
}
