export async function generateMetadata({ params }) {
  const { id } = params;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.lalbaugrotihouse.com'}/api/v1/catalog/products/${id}`);
    const data = await res.json();
    
    if (data.success && data.data) {
      const product = data.data;
      const imageUrl = product.image 
        ? (product.image.startsWith('/uploads') ? `${process.env.NEXT_PUBLIC_API_URL || 'https://api.lalbaugrotihouse.com'}${product.image}` : product.image) 
        : '/logo.jpeg';

      return {
        title: `${product.name} | Lalbaug Roti House`,
        description: product.desc || `Order fresh ${product.name} from Lalbaug Roti House.`,
        openGraph: {
          title: `${product.name} - Order Now`,
          description: product.desc || `Order fresh ${product.name} from Lalbaug Roti House.`,
          images: [{ url: imageUrl }],
        },
        twitter: {
          card: 'summary_large_image',
          title: `${product.name} - Order Now`,
          description: product.desc || `Order fresh ${product.name} from Lalbaug Roti House.`,
          images: [imageUrl],
        }
      };
    }
  } catch (err) {
    console.error("Error fetching product for metadata:", err);
  }

  // Fallback
  return {
    title: 'Product Details | Lalbaug Roti House',
  };
}

export default function ProductLayout({ children }) {
  return children;
}
