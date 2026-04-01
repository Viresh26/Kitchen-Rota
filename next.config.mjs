/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Cloudflare Pages/Workers compatibility
  output: 'export',
  
  // Ensure static export for Pages
  images: {
    unoptimized: true,
  },
  
  // Disable server-side features not compatible with Workers
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
