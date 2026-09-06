import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // Every build artefact lives under .artifacts/<tool>/.
    distDir: '.artifacts/next',
};

export default nextConfig;
