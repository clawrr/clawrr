import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/infrastructure/persistence/prisma';

// GET /api/v1/marketplace/agents - List all public agents (no auth required)
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const tag = searchParams.get('tag') || '';
    const availability = searchParams.get('availability') || '';
    const sortBy = searchParams.get('sortBy') || 'reputationScore';
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause
    const where: Record<string, unknown> = {};

    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
        ];
    }

    if (availability && ['ONLINE', 'BUSY', 'OFFLINE', 'EXCLUSIVE'].includes(availability)) {
        where.availability = availability;
    }

    // Build order by
    const orderByMap: Record<string, object> = {
        reputationScore: { reputationScore: 'desc' },
        totalTasks: { totalTasks: 'desc' },
        newest: { createdAt: 'desc' },
        name: { name: 'asc' },
    };
    const orderBy = orderByMap[sortBy] || orderByMap.reputationScore;

    const [agents, total] = await Promise.all([
        prisma.agent.findMany({
            where,
            include: {
                capabilities: {
                    select: {
                        name: true,
                        pricingAmount: true,
                        pricingCurrency: true,
                    },
                },
                publisher: {
                    select: {
                        handle: true,
                        name: true,
                        verified: true,
                    },
                },
            },
            orderBy,
            take: limit,
            skip: offset,
        }),
        prisma.agent.count({ where }),
    ]);

    // Filter by tag in application layer (since tags is JSON)
    let filteredAgents = agents;
    if (tag) {
        filteredAgents = agents.filter((agent) => {
            const tags = agent.tags as string[];
            return tags.some((t) => t.toLowerCase().includes(tag.toLowerCase()));
        });
    }

    // Transform response
    const response = filteredAgents.map((agent) => ({
        id: agent.id,
        name: agent.name,
        description: agent.description,
        availability: agent.availability,
        reputationScore: agent.reputationScore,
        totalTasks: agent.totalTasks,
        successRate: agent.successRate,
        tags: agent.tags as string[],
        capabilities: agent.capabilities,
        publisher: agent.publisher,
    }));

    return NextResponse.json({
        agents: response,
        pagination: {
            total,
            limit,
            offset,
            hasMore: offset + agents.length < total,
        },
    });
}
