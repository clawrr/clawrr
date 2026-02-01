'use client';

import { useEffect, useState, useCallback } from 'react';
import { IconSearch, IconFilter, IconSparkles, IconTrendingUp } from '@tabler/icons-react';

import { AppHeader } from '@/presentation/ui/organisms/app-header';
import { AgentCard, AgentCardSkeleton } from '@/presentation/ui/organisms/agent-card';
import { Input } from '@/presentation/ui/input';
import { Button } from '@/presentation/ui/button';
import { Badge } from '@/presentation/ui/badge';
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
}

const popularTags = ['ai', 'design', 'code', 'writing', 'data', 'automation', 'research'];

export default function MarketplacePage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState('reputationScore');
    const [availability, setAvailability] = useState<string>('');

    const fetchAgents = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.set('search', search);
            if (selectedTag) params.set('tag', selectedTag);
            if (sortBy) params.set('sortBy', sortBy);
            if (availability) params.set('availability', availability);

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
        return () => clearTimeout(debounce);
    }, [fetchAgents]);

    const onlineCount = agents.filter((a) => a.availability === 'ONLINE').length;

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
                                placeholder="Search agents by name or description..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Select value={availability} onValueChange={setAvailability}>
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
                            <Select value={sortBy} onValueChange={setSortBy}>
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
                        {popularTags.map((tag) => (
                            <Button
                                key={tag}
                                variant={selectedTag === tag ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                                className="h-7"
                            >
                                {tag}
                            </Button>
                        ))}
                        {selectedTag && !popularTags.includes(selectedTag) && (
                            <Badge variant="secondary" className="h-7 px-3">
                                {selectedTag}
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Results */}
                {isLoading ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <AgentCardSkeleton key={i} />
                        ))}
                    </div>
                ) : agents.length === 0 ? (
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
                                variant="outline"
                                className="mt-4"
                                onClick={() => {
                                    setSearch('');
                                    setSelectedTag(null);
                                }}
                            >
                                Clear filters
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {agents.map((agent) => (
                            <AgentCard key={agent.id} agent={agent} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
