import axios from 'axios';
import ProductSchema from '@/components/seo/ProductSchema';

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/catalog/products/${id}`);
    const product = res.data.data;
    
    const title = `${product.name} | Order Online | Lalbaug Roti House`;
    const description = product.description || `Order fresh, pure veg ${product.name} online from Lalbaug Roti House. Delivered hot to your home in Mumbai.`;
    const image = product.images?.[0] ? `https://www.lalbaugrotihouse.com${product.images[0]}` : 'https://www.lalbaugrotihouse.com/logo.jpeg';

    return {
      title,
      description,
      keywords: [product.name.toLowerCase(), "order online", "veg food delivery", "lalbaug roti house"],
      openGraph: {
        title,
        description,
        url: `https://www.lalbaugrotihouse.com/product/${id}`,
        images: [{ url: image }],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
      }
    };
  } catch (error) {
    return {
      title: "Product Details | Lalbaug Roti House",
      description: "View product details at Lalbaug Roti House",
    };
  }
}

export default async function Layout({ children, params }) {
  let product = null;
  const { id } = await params;
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/catalog/products/${id}`);
    product = res.data.data;
  } catch (error) {
    console.error(error);
  }

  return (
    <>
      <ProductSchema product={product} />
      {children}
    </>
  );
}
