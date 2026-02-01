import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/infrastructure/persistence/prisma';

// GET /api/v1/marketplace/agents/[id] - Get single agent details (no auth required)
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const agent = await prisma.agent.findUnique({
        where: { id },
        include: {
            capabilities: true,
            publisher: {
                select: {
                    handle: true,
                    name: true,
                    description: true,
                    verified: true,
                    walletAddress: true,
                },
            },
        },
    });

    if (!agent) {
        return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    return NextResponse.json({
        id: agent.id,
        name: agent.name,
        description: agent.description,
        availability: agent.availability,
        reputationScore: agent.reputationScore,
        totalTasks: agent.totalTasks,
        successRate: agent.successRate,
        avgLatencyMs: agent.avgLatencyMs,
        tags: agent.tags as string[],
        languages: agent.languages as string[],
        capabilities: agent.capabilities,
        publisher: agent.publisher,
        createdAt: agent.createdAt.toISOString(),
    });
}
