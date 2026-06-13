export default async function sitemap() {
  const baseUrl = 'https://www.lalbaugrotihouse.com';

  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/menu`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  let dynamicRoutes = [];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.lalbaugrotihouse.com'}/api/v1/catalog/menu`);
    const data = await res.json();
    
    if (data.success && data.data) {
      const allProducts = Object.values(data.data).flat();
      dynamicRoutes = allProducts.map((product) => ({
        url: `${baseUrl}/product/${product.id || product._id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      }));
    }
  } catch (err) {
    console.error("Error fetching menu for sitemap:", err);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
