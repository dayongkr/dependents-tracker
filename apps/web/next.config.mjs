import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import unpluginIcons from 'unplugin-icons/webpack';
import NextBundleAnalyzer from '@next/bundle-analyzer';

const config = JSON.parse(readFileSync(resolve(import.meta.dirname, '../../dependents.json'), 'utf-8'));

const withBundleAnalyzer = NextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    PACKAGE: config.package,
    OWNER: config.owner,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack(config) {
    config.infrastructureLogging = {
      level: 'error',
    };
    config.plugins.push(
      unpluginIcons({
        compiler: 'jsx',
        jsx: 'react',
      })
    );
    return config;
  },
};
export default withBundleAnalyzer(nextConfig);
