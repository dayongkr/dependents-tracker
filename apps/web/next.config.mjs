import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import unpluginIcons from 'unplugin-icons/webpack';
import NextBundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = NextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const rootMonorepo = resolve(import.meta.dirname ?? __dirname, '../../');
const configJson = readFileSync(resolve(rootMonorepo, 'dependents.json'), 'utf-8');

const config = JSON.parse(configJson);

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    PACKAGE: config.package,
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
