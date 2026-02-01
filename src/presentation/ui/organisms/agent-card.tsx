import Link from 'next/link';
import { IconCircleFilled, IconStar, IconClock, IconCheck } from '@tabler/icons-react';

import { Card, CardContent, CardFooter, CardHeader } from '@/presentation/ui/card';
import { Badge } from '@/presentation/ui/badge';

interface AgentCardProps {
    agent: {
        id: string;
        name: string;
        description: string;
        availability: 'ONLINE' | 'BUSY' | 'OFFLINE' | 'EXCLUSIVE';
        reputationScore: number;
        totalTasks: number;
        successRate: number;
        tags: string[];
        capabilities: {
            name: string;
            pricingAmount: number;
            pricingCurrency: string;
        }[];
        publisher?: {
            handle: string;
            name: string;
            verified: boolean;
        };
    };
}

const availabilityConfig = {
    ONLINE: { color: 'text-green-500', label: 'Online', bg: 'bg-green-500/10' },
    BUSY: { color: 'text-amber-500', label: 'Busy', bg: 'bg-amber-500/10' },
    OFFLINE: { color: 'text-gray-400', label: 'Offline', bg: 'bg-gray-500/10' },
    EXCLUSIVE: { color: 'text-purple-500', label: 'Exclusive', bg: 'bg-purple-500/10' },
};

export function AgentCard({ agent }: AgentCardProps) {
    const availability = availabilityConfig[agent.availability];
    const lowestPrice = agent.capabilities.length
        ? Math.min(...agent.capabilities.map((c) => c.pricingAmount))
        : null;

    return (
        <Link href={`/marketplace/${agent.id}`}>
            <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer group">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                                    {agent.name}
                                </h3>
                                <span
                                    className={`flex items-center gap-1 text-xs ${availability.color}`}
                                >
                                    <IconCircleFilled className="size-2" />
                                </span>
                            </div>
                            {agent.publisher && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                    @{agent.publisher.handle}
                                    {agent.publisher.verified && (
                                        <IconCheck className="size-3 text-blue-500" />
                                    )}
                                </p>
                            )}
                        </div>
                        {agent.reputationScore > 0 && (
                            <div className="flex items-center gap-1 text-amber-500">
                                <IconStar className="size-4 fill-current" />
                                <span className="text-sm font-medium">
                                    {agent.reputationScore.toFixed(1)}
                                </span>
                            </div>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="pb-3">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {agent.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                        {agent.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                        {agent.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                                +{agent.tags.length - 3}
                            </Badge>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                            <IconCheck className="size-3" />
                            {agent.totalTasks} tasks
                        </span>
                        {agent.successRate > 0 && (
                            <span className="flex items-center gap-1">
                                <IconClock className="size-3" />
                                {(agent.successRate * 100).toFixed(0)}% success
                            </span>
                        )}
                    </div>
                    {lowestPrice !== null && (
                        <span className="font-medium text-foreground">
                            from ${lowestPrice.toFixed(2)}
                        </span>
                    )}
                </CardFooter>
            </Card>
        </Link>
    );
}

export function AgentCardSkeleton() {
    return (
        <Card className="h-full">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                        <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                        <div className="h-3 w-20 bg-muted rounded animate-pulse mt-1.5" />
                    </div>
                    <div className="h-5 w-10 bg-muted rounded animate-pulse" />
                </div>
            </CardHeader>
            <CardContent className="pb-3">
                <div className="h-4 w-full bg-muted rounded animate-pulse mb-2" />
                <div className="h-4 w-2/3 bg-muted rounded animate-pulse mb-3" />
                <div className="flex gap-1.5">
                    <div className="h-5 w-12 bg-muted rounded animate-pulse" />
                    <div className="h-5 w-16 bg-muted rounded animate-pulse" />
                </div>
            </CardContent>
            <CardFooter className="pt-3 border-t">
                <div className="h-4 w-full bg-muted rounded animate-pulse" />
            </CardFooter>
        </Card>
    );
}
