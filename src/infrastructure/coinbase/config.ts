import { base, baseSepolia } from 'wagmi/chains';

export const COINBASE_CONFIG = {
    // Chain configuration
    chain: process.env.NODE_ENV === 'production' ? base : baseSepolia,
    chainId: process.env.NODE_ENV === 'production' ? base.id : baseSepolia.id,

    // API keys (from environment)
    apiKey: process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || '',
    projectId: process.env.NEXT_PUBLIC_CDP_PROJECT_ID || '',

    // Onramp/Offramp settings
    defaultFiatCurrency: 'USD',
    defaultCryptoAsset: 'USDC',

    // Platform fee
    platformFeePercent: 1, // 1%
};

export const isProduction = process.env.NODE_ENV === 'production';
