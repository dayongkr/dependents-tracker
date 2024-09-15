import unpluginIcons from 'unplugin-icons/webpack';

/** @type {import('next').NextConfig} */
const nextConfig = {
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
export default nextConfig;
