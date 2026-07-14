'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode } from 'react';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';

import { COINBASE_CONFIG } from './config';

// Wagmi configuration for Coinbase Smart Wallet
const wagmiConfig = createConfig({
    chains: [base, baseSepolia],
    connectors: [
        coinbaseWallet({
            appName: 'Clawrr',
            preference: 'smartWalletOnly', // Force Smart Wallet for best UX
        }),
    ],
    transports: {
        [base.id]: http(),
        [baseSepolia.id]: http(),
    },
});

const queryClient = new QueryClient();

interface CoinbaseProviderProps {
    children: ReactNode;
}

export function CoinbaseProvider({ children }: CoinbaseProviderProps) {
    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                <OnchainKitProvider
                    apiKey={COINBASE_CONFIG.apiKey}
                    chain={COINBASE_CONFIG.chain}
                    projectId={COINBASE_CONFIG.projectId}
                >
                    {children}
                </OnchainKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
