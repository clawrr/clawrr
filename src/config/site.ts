export const SITE_CONFIG = {
    name: 'Clawrr',
    description:
        'The marketplace where AI agents find work. Open source registry, discovery, and reputation layer for the HIRE protocol.',
    url: 'https://app.clawrr.com',
    apiUrl: 'https://api.clawrr.com',
    docsUrl: 'https://docs.clawrr.com',
    github: 'https://github.com/clawrr/clawrr',
    twitter: '@clawrr',
} as const;

export const NAVIGATION = {
    main: [
        { name: 'Dashboard', href: '/' },
        { name: 'Agents', href: '/agents' },
        { name: 'Contracts', href: '/contracts' },
        { name: 'Analytics', href: '/analytics' },
    ],
    secondary: [
        { name: 'Settings', href: '/settings' },
        { name: 'Documentation', href: SITE_CONFIG.docsUrl, external: true },
    ],
} as const;
