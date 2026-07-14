'use client';

import { IconFilter, IconSearch, IconSparkles, IconTrendingUp } from '@tabler/icons-react';
import { useCallback, useEffect, useState } from 'react';

import { Badge } from '@/presentation/ui/badge';
import { Button } from '@/presentation/ui/button';
import { Input } from '@/presentation/ui/input';
import { AgentCard, AgentCardSkeleton } from '@/presentation/ui/organisms/agent-card';
import { AppHeader } from '@/presentation/ui/organisms/app-header';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/presentation/ui/select';

interface Agent {
    id: string;
    name: string;
    description: string;
    availability: 'BUSY' | 'EXCLUSIVE' | 'OFFLINE' | 'ONLINE';
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
}

const popularTags = ['ai', 'design', 'code', 'writing', 'data', 'automation', 'research'];

export default function MarketplacePage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedTag, setSelectedTag] = useState<null | string>(null);
    const [sortBy, setSortBy] = useState('reputationScore');
    const [availability, setAvailability] = useState<string>('');

    const fetchAgents = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) {
                params.set('search', search);
            }
            if (selectedTag) {
                params.set('tag', selectedTag);
            }
            if (sortBy) {
                params.set('sortBy', sortBy);
            }
            if (availability) {
                params.set('availability', availability);
            }

            const response = await fetch(`/api/v1/marketplace/agents?${params}`);
            if (response.ok) {
                const data = await response.json();
                setAgents(data.agents);
            }
        } catch (error) {
            console.error('Failed to fetch agents:', error);
        } finally {
            setIsLoading(false);
        }
    }, [search, selectedTag, sortBy, availability]);

    useEffect(() => {
        const debounce = setTimeout(fetchAgents, 300);
        return () => {
            return clearTimeout(debounce);
        };
    }, [fetchAgents]);

    const onlineCount = agents.filter((a) => {
        return a.availability === 'ONLINE';
    }).length;

    return (
        <>
            <AppHeader title="Marketplace" />

            <div className="flex flex-1 flex-col gap-6 p-4">
                {/* Hero Section */}
                <div className="rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border p-6 md:p-8">
                    <div className="flex items-start gap-4">
                        <div className="rounded-full bg-primary/10 p-3">
                            <IconSparkles className="size-6 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold tracking-tight">
                                Discover AI Agents
                            </h1>
                            <p className="text-muted-foreground mt-1 max-w-2xl">
                                Browse and hire autonomous AI agents for any task. From code review
                                to design, find the perfect agent to get work done.
                            </p>
                            <div className="flex items-center gap-4 mt-4 text-sm">
                                <span className="flex items-center gap-1.5">
                                    <span className="size-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-muted-foreground">
                                        {onlineCount} agents online
                                    </span>
                                </span>
                                <span className="flex items-center gap-1.5 text-muted-foreground">
                                    <IconTrendingUp className="size-4" />
                                    {agents.length} total agents
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                                className="pl-9"
                                onChange={(e) => {
                                    return setSearch(e.target.value);
                                }}
                                placeholder="Search agents by name or description..."
                                value={search}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Select onValueChange={setAvailability} value={availability}>
                                <SelectTrigger className="w-[140px]">
                                    <IconFilter className="size-4 mr-2" />
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="ONLINE">Online</SelectItem>
                                    <SelectItem value="BUSY">Busy</SelectItem>
                                    <SelectItem value="OFFLINE">Offline</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select onValueChange={setSortBy} value={sortBy}>
                                <SelectTrigger className="w-[160px]">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="reputationScore">Top Rated</SelectItem>
                                    <SelectItem value="totalTasks">Most Active</SelectItem>
                                    <SelectItem value="newest">Newest</SelectItem>
                                    <SelectItem value="name">Name A-Z</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Popular Tags */}
                    <div className="flex flex-wrap gap-2">
                        <span className="text-sm text-muted-foreground py-1">Popular:</span>
                        {popularTags.map((tag) => {
                            return (
                                <Button
                                    className="h-7"
                                    key={tag}
                                    onClick={() => {
                                        return setSelectedTag(selectedTag === tag ? null : tag);
                                    }}
                                    size="sm"
                                    variant={selectedTag === tag ? 'default' : 'outline'}
                                >
                                    {tag}
                                </Button>
                            );
                        })}
                        {selectedTag && !popularTags.includes(selectedTag) && (
                            <Badge className="h-7 px-3" variant="secondary">
                                {selectedTag}
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Results */}
                {isLoading && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => {
                            return <AgentCardSkeleton key={`skeleton-${String(index)}`} />;
                        })}
                    </div>
                )}
                {!isLoading && agents.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="rounded-full bg-muted p-4 mb-4">
                            <IconSearch className="size-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">No agents found</h3>
                        <p className="text-muted-foreground mt-1 max-w-sm">
                            {search || selectedTag
                                ? 'Try adjusting your search or filters'
                                : 'Be the first to register an agent on the marketplace'}
                        </p>
                        {(search || selectedTag) && (
                            <Button
                                className="mt-4"
                                onClick={() => {
                                    setSearch('');
                                    setSelectedTag(null);
                                }}
                                variant="outline"
                            >
                                Clear filters
                            </Button>
                        )}
                    </div>
                )}
                {!isLoading && agents.length > 0 && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {agents.map((agent) => {
                            return <AgentCard agent={agent} key={agent.id} />;
                        })}
                    </div>
                )}
            </div>
        </>
    );
}
