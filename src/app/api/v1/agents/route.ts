import { NextResponse } from 'next/server';
import { z } from 'zod';
import type { Prisma } from '@/generated/prisma/client';

import { auth } from '@/infrastructure/auth';
import { prisma } from '@/infrastructure/persistence/prisma';

const CapabilitySchema = z.object({
    name: z.string().regex(/^[a-z0-9-]+$/, 'Capability name must be lowercase with dashes'),
    description: z.string(),
    inputSchema: z.unknown().optional(),
    outputSchema: z.unknown().optional(),
    pricingAmount: z.number().positive(), // Always per-task
    pricingCurrency: z.string().default('USDC'),
    slaMaxLatencyMs: z.number().int().positive().optional(),
    slaAvailability: z.number().min(0).max(1).optional(),
});

const CreateAgentSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    tags: z.array(z.string()).default([]),
    languages: z.array(z.string()).default(['en']),
    capabilities: z.array(CapabilitySchema).min(1),
});

/**
 * Authenticate request via session or API key
 * Returns user with publisher if found
 */
async function authenticateRequest(request: Request) {
    // Try API key first (for programmatic access)
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
        const apiKey = authHeader.slice(7);
        const user = await prisma.user.findUnique({
            where: { apiKey },
            include: { publisher: true },
        });
        if (user) {
            return user;
        }
    }

    // Fall back to session auth (for dashboard)
    const session = await auth();
    if (session?.user?.id) {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { publisher: true },
        });
        return user;
    }

    return null;
}

// GET /api/v1/agents - List current user's agents
export async function GET(request: Request) {
    const user = await authenticateRequest(request);

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!user.publisher) {
        return NextResponse.json(
            { error: 'Publisher not found. Create a publisher profile first.' },
            { status: 400 },
        );
    }

    const agents = await prisma.agent.findMany({
        where: { publisherId: user.publisher.id },
        include: { capabilities: true },
        orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(agents);
}

// POST /api/v1/agents - Create a new agent
export async function POST(request: Request) {
    const user = await authenticateRequest(request);

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!user.publisher) {
        return NextResponse.json(
            { error: 'Publisher not found. Create a publisher profile first.' },
            { status: 400 },
        );
    }

    const body = await request.json();
    const result = CreateAgentSchema.safeParse(body);

    if (!result.success) {
        return NextResponse.json(
            { error: 'Validation failed', details: result.error.issues },
            { status: 400 },
        );
    }

    const data = result.data;

    const agent = await prisma.agent.create({
        data: {
            name: data.name,
            description: data.description,
            tags: data.tags,
            languages: data.languages,
            publisherId: user.publisher.id,
            capabilities: {
                create: data.capabilities.map((cap) => ({
                    name: cap.name,
                    description: cap.description,
                    inputSchema: cap.inputSchema as Prisma.InputJsonValue | undefined,
                    outputSchema: cap.outputSchema as Prisma.InputJsonValue | undefined,
                    pricingAmount: cap.pricingAmount,
                    pricingCurrency: cap.pricingCurrency,
                    slaMaxLatencyMs: cap.slaMaxLatencyMs,
                    slaAvailability: cap.slaAvailability,
                })),
            },
        },
        include: { capabilities: true },
    });

    // Update publisher agent count
    await prisma.publisher.update({
        where: { id: user.publisher.id },
        data: { agentsCount: { increment: 1 } },
    });

    return NextResponse.json(agent, { status: 201 });
}
