// System Sync: 1777061474
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone', // ADD THIS LINE
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }]
  }
};

export default nextConfig;
