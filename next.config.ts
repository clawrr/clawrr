import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // Every build artefact lives under .artifacts/<tool>/.
    distDir: '.artifacts/next',
    // Next infers the workspace root by walking up for a lockfile, and a
    // Workbench clone sits under a checkout that has one. This app is its own
    // Root: nothing above it belongs to the build.
    outputFileTracingRoot: import.meta.dirname,
    turbopack: {
        root: import.meta.dirname,
    },
};

export default nextConfig;
