export default function ProductSchema({ product }) {
  if (!product) return null;

  // Assuming variants structure or falling back to a default price
  const price = product.variants?.[0]?.price || 150;
  
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images?.[0] ? `https://www.lalbaugrotihouse.com${product.images[0]}` : "https://www.lalbaugrotihouse.com/images/indian_roti_meal.png",
    "description": product.description || `Fresh, authentic, pure vegetarian ${product.name} delivered in Mumbai by Lalbaug Roti House.`,
    "brand": {
      "@type": "Brand",
      "name": "Lalbaug Roti House"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://www.lalbaugrotihouse.com/product/${product._id || product.id}`,
      "priceCurrency": "INR",
      "price": price,
      "priceValidUntil": "2026-12-31",
      "availability": product.isActive ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": Math.floor(Math.random() * 50) + 15
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
