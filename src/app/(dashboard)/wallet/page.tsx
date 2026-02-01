'use client';

import { useEffect, useState } from 'react';
import {
    IconWallet,
    IconPlus,
    IconArrowUpRight,
    IconArrowDownLeft,
    IconCreditCard,
    IconBuildingBank,
    IconHistory,
} from '@tabler/icons-react';
import { FundButton, getOnrampBuyUrl } from '@coinbase/onchainkit/fund';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';

import { AppHeader } from '@/presentation/ui/organisms/app-header';
import { Button } from '@/presentation/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/ui/card';
import { Separator } from '@/presentation/ui/separator';
import { Badge } from '@/presentation/ui/badge';

interface Transaction {
    id: string;
    type: 'DEPOSIT' | 'WITHDRAWAL' | 'TASK_PAYMENT' | 'TASK_EARNING' | 'PLATFORM_FEE' | 'REFUND';
    amount: number;
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
    description: string | null;
    createdAt: string;
}

interface WalletData {
    balance: number;
    walletAddress: string | null;
    transactions: Transaction[];
}

const transactionTypeConfig = {
    DEPOSIT: { icon: IconArrowDownLeft, color: 'text-green-500', label: 'Deposit' },
    WITHDRAWAL: { icon: IconArrowUpRight, color: 'text-orange-500', label: 'Withdrawal' },
    TASK_PAYMENT: { icon: IconArrowUpRight, color: 'text-red-500', label: 'Task Payment' },
    TASK_EARNING: { icon: IconArrowDownLeft, color: 'text-green-500', label: 'Task Earning' },
    PLATFORM_FEE: { icon: IconArrowUpRight, color: 'text-gray-500', label: 'Platform Fee' },
    REFUND: { icon: IconArrowDownLeft, color: 'text-blue-500', label: 'Refund' },
};

const statusConfig = {
    PENDING: { variant: 'outline' as const, label: 'Pending' },
    COMPLETED: { variant: 'default' as const, label: 'Completed' },
    FAILED: { variant: 'destructive' as const, label: 'Failed' },
    CANCELLED: { variant: 'secondary' as const, label: 'Cancelled' },
};

export default function WalletPage() {
    const [walletData, setWalletData] = useState<WalletData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const { address, isConnected } = useAccount();
    const { connect } = useConnect();
    const { disconnect } = useDisconnect();

    useEffect(() => {
        fetchWalletData();
    }, []);

    // Sync wallet address when connected
    useEffect(() => {
        if (isConnected && address) {
            syncWalletAddress(address);
        }
    }, [isConnected, address]);

    const fetchWalletData = async () => {
        try {
            const response = await fetch('/api/v1/user/wallet');
            if (response.ok) {
                const data = await response.json();
                setWalletData(data);
            }
        } catch (error) {
            console.error('Failed to fetch wallet data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const syncWalletAddress = async (walletAddress: string) => {
        try {
            await fetch('/api/v1/user/wallet', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ walletAddress }),
            });
            fetchWalletData();
        } catch (error) {
            console.error('Failed to sync wallet:', error);
        }
    };

    const handleConnectWallet = () => {
        connect({
            connector: coinbaseWallet({
                appName: 'Clawrr',
                preference: 'smartWalletOnly',
            }),
        });
    };

    if (isLoading) {
        return (
            <>
                <AppHeader title="Wallet" />
                <div className="flex flex-1 items-center justify-center">
                    <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            </>
        );
    }

    return (
        <>
            <AppHeader title="Wallet" />

            <div className="flex flex-1 flex-col gap-6 p-4">
                {/* Balance Card */}
                <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
                    <CardHeader>
                        <CardDescription>Available Balance</CardDescription>
                        <CardTitle className="text-4xl font-bold">
                            ${(walletData?.balance ?? 0).toFixed(2)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-3">
                            {isConnected ? (
                                <>
                                    <FundButton className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 rounded-md font-medium" />
                                    <Button variant="outline">
                                        <IconArrowUpRight className="mr-2 size-4" />
                                        Withdraw
                                    </Button>
                                </>
                            ) : (
                                <Button onClick={handleConnectWallet}>
                                    <IconWallet className="mr-2 size-4" />
                                    Connect Coinbase Wallet
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Total Earned</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-green-500">
                                $
                                {(
                                    walletData?.transactions
                                        .filter(
                                            (t) =>
                                                t.type === 'TASK_EARNING' &&
                                                t.status === 'COMPLETED',
                                        )
                                        .reduce((sum, t) => sum + t.amount, 0) ?? 0
                                ).toFixed(2)}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Total Spent</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-orange-500">
                                $
                                {Math.abs(
                                    walletData?.transactions
                                        .filter(
                                            (t) =>
                                                t.type === 'TASK_PAYMENT' &&
                                                t.status === 'COMPLETED',
                                        )
                                        .reduce((sum, t) => sum + t.amount, 0) ?? 0,
                                ).toFixed(2)}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Platform Fees</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-gray-500">
                                $
                                {Math.abs(
                                    walletData?.transactions
                                        .filter(
                                            (t) =>
                                                t.type === 'PLATFORM_FEE' &&
                                                t.status === 'COMPLETED',
                                        )
                                        .reduce((sum, t) => sum + t.amount, 0) ?? 0,
                                ).toFixed(2)}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Wallet Connection Status */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <IconWallet className="size-5" />
                            Coinbase Smart Wallet
                        </CardTitle>
                        <CardDescription>
                            Connect your wallet to add funds and withdraw earnings
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isConnected && address ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                    <div>
                                        <p className="text-sm font-medium">Connected Wallet</p>
                                        <p className="text-sm text-muted-foreground font-mono">
                                            {address.slice(0, 6)}...{address.slice(-4)}
                                        </p>
                                    </div>
                                    <Badge variant="default" className="bg-green-500">
                                        Connected
                                    </Badge>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => disconnect()}>
                                    Disconnect
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="flex items-start gap-3 p-4 rounded-lg border">
                                        <IconCreditCard className="size-5 text-primary mt-0.5" />
                                        <div>
                                            <p className="font-medium">Add Funds</p>
                                            <p className="text-sm text-muted-foreground">
                                                Buy USDC with card, Apple Pay, or bank transfer
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 rounded-lg border">
                                        <IconBuildingBank className="size-5 text-primary mt-0.5" />
                                        <div>
                                            <p className="font-medium">Withdraw</p>
                                            <p className="text-sm text-muted-foreground">
                                                Send earnings directly to your bank account
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <Button onClick={handleConnectWallet} className="w-full sm:w-auto">
                                    <IconWallet className="mr-2 size-4" />
                                    Connect Coinbase Smart Wallet
                                </Button>
                                <p className="text-xs text-muted-foreground">
                                    No crypto knowledge needed. Sign in with Face ID, fingerprint,
                                    or passkey.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Transaction History */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <IconHistory className="size-5" />
                            Transaction History
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {walletData?.transactions && walletData.transactions.length > 0 ? (
                            <div className="space-y-3">
                                {walletData.transactions.map((tx) => {
                                    const typeConfig = transactionTypeConfig[tx.type];
                                    const status = statusConfig[tx.status];
                                    const Icon = typeConfig.icon;

                                    return (
                                        <div
                                            key={tx.id}
                                            className="flex items-center justify-between p-3 rounded-lg border"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`p-2 rounded-full bg-muted ${typeConfig.color}`}
                                                >
                                                    <Icon className="size-4" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">
                                                        {typeConfig.label}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {tx.description ||
                                                            new Date(
                                                                tx.createdAt,
                                                            ).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p
                                                    className={`font-medium ${tx.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}
                                                >
                                                    {tx.amount >= 0 ? '+' : ''}$
                                                    {Math.abs(tx.amount).toFixed(2)}
                                                </p>
                                                <Badge variant={status.variant} className="text-xs">
                                                    {status.label}
                                                </Badge>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <IconHistory className="size-12 mx-auto mb-3 opacity-20" />
                                <p>No transactions yet</p>
                                <p className="text-sm">
                                    Add funds to start hiring agents or earning from tasks
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
