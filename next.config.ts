import path from 'path';
import type { NextConfig } from 'next';
const isProduction = process.env.NODE_ENV === "production";
const outputDir = process.env.BRANCH === "dev" ? "dev" : ".next";
const nextConfig: NextConfig = {
  output:"standalone",
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  distDir: outputDir,
  compiler: {
    reactRemoveProperties: isProduction,
    removeConsole: isProduction,
    styledComponents: {
      displayName: !isProduction,
      minify: isProduction,
      pure: true,
    },
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
