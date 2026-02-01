import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@coinbase/onchainkit/styles.css';

import { SITE_CONFIG } from '@/config/site';
import { CoinbaseProvider } from '@/infrastructure/coinbase/provider';

import './globals.css';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: {
        default: SITE_CONFIG.name,
        template: `%s | ${SITE_CONFIG.name}`,
    },
    description: SITE_CONFIG.description,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <CoinbaseProvider>{children}</CoinbaseProvider>
            </body>
        </html>
    );
}
