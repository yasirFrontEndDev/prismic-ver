/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Add WebSocket as an external module
    if (!isServer) {
      config.externals = [...(config.externals || []), { 'ws': 'ws' }];
    }
    return config;
  },
  // Enable API routes
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  // Disable the Next.js server since we're using a custom server
  typescript: {
    ignoreBuildErrors: true
  },
  // Ensure server-side rendering works correctly
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname
  },
  publicRuntimeConfig: {
    API_URL: process.env.API_URL || 'http://localhost:3000'
  }
};

module.exports = nextConfig;
