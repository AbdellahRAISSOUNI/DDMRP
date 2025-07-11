/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['react-quill'],
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['via.placeholder.com', 'localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    unoptimized: true, // Allow Next.js to serve images from API routes
  },
  // Add redirects for the old intuitive-flow paths to the new intuiflow paths
  async redirects() {
    return [
      {
        source: '/intuitive-flow',
        destination: '/intuiflow',
        permanent: true,
      },
      {
        source: '/intuitive-flow/book-demo',
        destination: '/intuiflow/book-demo',
        permanent: true,
      },
      {
        source: '/intuitive-flow/book-demo/thank-you',
        destination: '/intuiflow/book-demo/thank-you',
        permanent: true,
      },
    ];
  },
  webpack: (config) => {
    // Handle Quill's SVG files
    config.module.rules.push({
      test: /\.(png|jpg|gif|svg)$/i,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 8192,
            publicPath: '/_next/static/images/',
            outputPath: 'static/images/',
            name: '[name].[hash:7].[ext]',
          },
        },
      ],
    });
    return config;
  },
};

module.exports = nextConfig; 