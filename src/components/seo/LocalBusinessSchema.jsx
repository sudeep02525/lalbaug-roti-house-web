export default function LocalBusinessSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Lalbaug Roti House",
    "image": "https://www.lalbaugrotihouse.com/logo.jpeg",
    "@id": "https://www.lalbaugrotihouse.com",
    "url": "https://www.lalbaugrotihouse.com",
    "telephone": "+919324688099",
    "menu": "https://www.lalbaugrotihouse.com/menu",
    "servesCuisine": "Indian, Traditional, Pure Vegetarian",
    "acceptsReservations": "False",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Shop No 17/45, HY, Ganesh Nagar, Lal Baug",
      "addressLocality": "Mumbai",
      "postalCode": "400012",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 18.9912,
      "longitude": 72.8354
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "10:00",
      "closes": "22:00"
    },
    "priceRange": "₹",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "250"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
