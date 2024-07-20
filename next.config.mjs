/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        mdxRs: true,
        serverComponentsExternalPackages: ["mongoose"]
    },
    images:{
        remotePatterns:[
            {
                protocol: 'http',
                hostname:'*'
            },
            {
                protocol: 'https',
                hostname: '*'
            }
        ]
    },
    webpack(config) {
        config.experiments = { ...config.experiments, topLevelAwait: true };
        return config;
    }
};

export default nextConfig;
