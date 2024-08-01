import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.hbs$/,
      use: {
        loader: 'handlebars-loader',
        options: {
          helperDirs: [path.resolve(__dirname, 'helpers')],
          partialDirs: [path.resolve(__dirname, 'partials')],
        },
      },
    });

    return config;
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
