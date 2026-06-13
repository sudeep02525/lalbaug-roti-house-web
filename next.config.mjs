/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/images/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'https://api.lalbaugrotihouse.com'}/images/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'https://api.lalbaugrotihouse.com'}/uploads/:path*`,
      }
    ];
  },
};

export default nextConfig;
