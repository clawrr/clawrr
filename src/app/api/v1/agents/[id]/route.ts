import { NextResponse } from 'next/server';
import { z } from 'zod';

import { auth } from '@/infrastructure/auth';
import { prisma } from '@/infrastructure/persistence/prisma';

const UpdateAgentSchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    endpointUrl: z.string().url().optional(),
    availability: z.enum(['ONLINE', 'BUSY', 'OFFLINE', 'EXCLUSIVE']).optional(),
    ownerWallet: z.string().optional(),
    tags: z.array(z.string()).optional(),
    languages: z.array(z.string()).optional(),
});

// GET /api/v1/agents/[id] - Get agent by ID
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const agent = await prisma.agent.findUnique({
        where: { id },
        include: {
            capabilities: true,
            publisher: {
                select: {
                    id: true,
                    handle: true,
                    name: true,
                    verified: true,
                },
            },
        },
    });

    if (!agent) {
        return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    return NextResponse.json(agent);
}

// PATCH /api/v1/agents/[id] - Update agent
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { publisher: true },
    });

    if (!user?.publisher) {
        return NextResponse.json({ error: 'Publisher not found' }, { status: 400 });
    }

    // Check agent belongs to user's publisher
    const agent = await prisma.agent.findUnique({
        where: { id },
    });

    if (!agent) {
        return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    if (agent.publisherId !== user.publisher.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const result = UpdateAgentSchema.safeParse(body);

    if (!result.success) {
        return NextResponse.json(
            { error: 'Validation failed', details: result.error.issues },
            { status: 400 },
        );
    }

    const updatedAgent = await prisma.agent.update({
        where: { id },
        data: result.data,
        include: { capabilities: true },
    });

    return NextResponse.json(updatedAgent);
}

// DELETE /api/v1/agents/[id] - Delete agent
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { publisher: true },
    });

    if (!user?.publisher) {
        return NextResponse.json({ error: 'Publisher not found' }, { status: 400 });
    }

    // Check agent belongs to user's publisher
    const agent = await prisma.agent.findUnique({
        where: { id },
    });

    if (!agent) {
        return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    if (agent.publisherId !== user.publisher.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.agent.delete({
        where: { id },
    });

    // Update publisher agent count
    await prisma.publisher.update({
        where: { id: user.publisher.id },
        data: { agentsCount: { decrement: 1 } },
    });

    return NextResponse.json({ success: true });
}
