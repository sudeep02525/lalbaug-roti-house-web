import { Inter, Playfair_Display, Outfit, Great_Vibes } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import FloatingCart from "@/components/FloatingCart";
import LocalBusinessSchema from "@/components/seo/LocalBusinessSchema";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const greatVibes = Great_Vibes({
  weight: "400",
  variable: "--font-great-vibes",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL('https://www.lalbaugrotihouse.com'),
  title: "Lalbaug Roti House | Authentic Fresh Food Delivery",
  description: "Order fresh, authentic handmade Roti, Bhakari, Thepla, and complete meals delivered straight to your door in Mumbai. Experience the taste of tradition.",
  keywords: ["fresh handmade roti", "bhakri delivery", "thepla online", "fresh food delivery", "mumbai food delivery", "authentic traditional food", "lalbaug roti house", "veg thali", "tiffin service dadar", "pure veg restaurant mumbai"],
  alternates: {
    canonical: 'https://www.lalbaugrotihouse.com',
  },
  openGraph: {
    title: 'Lalbaug Roti House | Authentic Fresh Food',
    description: 'Fresh Handmade Roti, Bhakari, Thepla & Delicious Food Delivered Daily.',
    url: 'https://www.lalbaugrotihouse.com',
    siteName: 'Lalbaug Roti House',
    images: [
      {
        url: '/logo.jpeg',
        width: 800,
        height: 600,
        alt: 'Lalbaug Roti House Logo',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lalbaug Roti House | Authentic Fresh Food',
    description: 'Fresh Handmade Roti, Bhakari, Thepla & Delicious Food Delivered Daily.',
    images: ['/logo.jpeg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} ${outfit.variable} ${greatVibes.variable} font-sans antialiased min-h-screen flex flex-col bg-[var(--background)]`}>
        <LocalBusinessSchema />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <main className="flex-1 pb-24">
                {children}
              </main>
              <FloatingCart />
              <Footer />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
