'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    IconArrowLeft,
    IconCircleFilled,
    IconStar,
    IconCheck,
    IconClock,
    IconWorld,
    IconWallet,
    IconExternalLink,
} from '@tabler/icons-react';

import { AppHeader } from '@/presentation/ui/organisms/app-header';
import { Button } from '@/presentation/ui/button';
import { Badge } from '@/presentation/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/ui/card';
import { Separator } from '@/presentation/ui/separator';

interface AgentDetail {
    id: string;
    name: string;
    description: string;
    availability: 'ONLINE' | 'BUSY' | 'OFFLINE' | 'EXCLUSIVE';
    reputationScore: number;
    totalTasks: number;
    successRate: number;
    avgLatencyMs: number;
    tags: string[];
    languages: string[];
    capabilities: {
        id: string;
        name: string;
        description: string;
        pricingAmount: number;
        pricingCurrency: string;
    }[];
    publisher?: {
        handle: string;
        name: string;
        verified: boolean;
        description?: string;
        walletAddress?: string;
    };
    createdAt: string;
}

const availabilityConfig = {
    ONLINE: { color: 'text-green-500', label: 'Online', bg: 'bg-green-500' },
    BUSY: { color: 'text-amber-500', label: 'Busy', bg: 'bg-amber-500' },
    OFFLINE: { color: 'text-gray-400', label: 'Offline', bg: 'bg-gray-400' },
    EXCLUSIVE: { color: 'text-purple-500', label: 'Exclusive', bg: 'bg-purple-500' },
};

export default function AgentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [agent, setAgent] = useState<AgentDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAgent = async () => {
            try {
                const response = await fetch(`/api/v1/marketplace/agents/${params.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setAgent(data);
                }
            } catch (error) {
                console.error('Failed to fetch agent:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            fetchAgent();
        }
    }, [params.id]);

    if (isLoading) {
        return (
            <>
                <AppHeader title="Loading..." />
                <div className="flex flex-1 items-center justify-center">
                    <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            </>
        );
    }

    if (!agent) {
        return (
            <>
                <AppHeader title="Agent Not Found" />
                <div className="flex flex-1 flex-col items-center justify-center gap-4">
                    <p className="text-muted-foreground">
                        This agent doesn't exist or was removed.
                    </p>
                    <Button onClick={() => router.push('/marketplace')}>
                        <IconArrowLeft className="mr-2 size-4" />
                        Back to Marketplace
                    </Button>
                </div>
            </>
        );
    }

    const availability = availabilityConfig[agent.availability];

    return (
        <>
            <AppHeader title={agent.name} />

            <div className="flex flex-1 flex-col gap-6 p-4">
                {/* Back button */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-fit"
                    onClick={() => router.push('/marketplace')}
                >
                    <IconArrowLeft className="mr-2 size-4" />
                    Back to Marketplace
                </Button>

                {/* Main content grid */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left column - Main info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Header card */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <CardTitle className="text-2xl">{agent.name}</CardTitle>
                                            <span
                                                className={`flex items-center gap-1.5 text-sm ${availability.color}`}
                                            >
                                                <IconCircleFilled className="size-2" />
                                                {availability.label}
                                            </span>
                                        </div>
                                        {agent.publisher && (
                                            <CardDescription className="flex items-center gap-1">
                                                by {agent.publisher.name} (@{agent.publisher.handle}
                                                )
                                                {agent.publisher.verified && (
                                                    <IconCheck className="size-4 text-blue-500" />
                                                )}
                                            </CardDescription>
                                        )}
                                    </div>
                                    {agent.reputationScore > 0 && (
                                        <div className="flex items-center gap-1.5 text-amber-500">
                                            <IconStar className="size-5 fill-current" />
                                            <span className="text-lg font-semibold">
                                                {agent.reputationScore.toFixed(1)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-muted-foreground">{agent.description}</p>

                                <div className="flex flex-wrap gap-2">
                                    {agent.tags.map((tag) => (
                                        <Badge key={tag} variant="secondary">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>

                                <Separator />

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                                    <div>
                                        <p className="text-2xl font-bold">{agent.totalTasks}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Tasks Completed
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">
                                            {(agent.successRate * 100).toFixed(0)}%
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Success Rate
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">
                                            {agent.avgLatencyMs > 0
                                                ? `${(agent.avgLatencyMs / 1000).toFixed(1)}s`
                                                : 'N/A'}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Avg Response
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">
                                            {agent.capabilities.length}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Capabilities
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Capabilities */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Capabilities</CardTitle>
                                <CardDescription>What this agent can do for you</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {agent.capabilities.map((cap) => (
                                    <div
                                        key={cap.id}
                                        className="flex items-start justify-between p-4 rounded-lg border bg-muted/30"
                                    >
                                        <div className="flex-1">
                                            <h4 className="font-medium">{cap.name}</h4>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {cap.description}
                                            </p>
                                        </div>
                                        <div className="text-right ml-4">
                                            <p className="font-semibold">
                                                ${cap.pricingAmount.toFixed(2)}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                per task in {cap.pricingCurrency}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right column - Sidebar */}
                    <div className="space-y-6">
                        {/* Quick actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Hire this Agent</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button className="w-full" size="lg">
                                    Create Contract
                                </Button>
                                <p className="text-xs text-center text-muted-foreground">
                                    Start a negotiation with this agent
                                </p>
                            </CardContent>
                        </Card>

                        {/* Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <IconWorld className="size-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Languages</p>
                                        <p className="text-sm text-muted-foreground">
                                            {agent.languages.join(', ')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <IconClock className="size-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Registered</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(agent.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                {agent.publisher?.walletAddress && (
                                    <div className="flex items-center gap-3">
                                        <IconWallet className="size-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">Payment Wallet</p>
                                            <p className="text-sm text-muted-foreground font-mono truncate max-w-[180px]">
                                                {agent.publisher.walletAddress}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Publisher info */}
                        {agent.publisher && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Publisher</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-sm font-medium text-primary">
                                                {agent.publisher.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium flex items-center gap-1">
                                                {agent.publisher.name}
                                                {agent.publisher.verified && (
                                                    <IconCheck className="size-4 text-blue-500" />
                                                )}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                @{agent.publisher.handle}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
