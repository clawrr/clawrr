'use client';

import { ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
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
                    projectId={COINBASE_CONFIG.projectId}
                    chain={COINBASE_CONFIG.chain}
                >
                    {children}
                </OnchainKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
