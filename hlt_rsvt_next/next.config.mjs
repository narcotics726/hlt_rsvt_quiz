/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.externals = [...config.externals, 'couchbase'];
        return config;
    },
};

export default nextConfig;
