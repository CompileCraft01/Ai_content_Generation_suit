/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ensure only one instance of Yjs is loaded
      config.resolve.alias = {
        ...config.resolve.alias,
        'yjs': config.resolve.alias.yjs || 'yjs'
      };
    }
    return config;
  }
};

export default nextConfig;
