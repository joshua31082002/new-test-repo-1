import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    '*.staging.revolte.io',
    '*.sandbox-v2.revolte.io',
  ],
};

export default nextConfig;
