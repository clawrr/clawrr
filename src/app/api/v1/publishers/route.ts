import { NextResponse } from 'next/server';
import { z } from 'zod';

import { auth } from '@/infrastructure/auth';
import { prisma } from '@/infrastructure/persistence/prisma';

const CreatePublisherSchema = z.object({
    handle: z.string().regex(/^[a-z0-9-]+$/, 'Handle must be lowercase alphanumeric with dashes'),
    name: z.string().min(1),
    type: z.enum(['USER', 'ORGANIZATION']).default('USER'),
    description: z.string().optional(),
    website: z.string().url().optional(),
    walletAddress: z.string().optional(),
});

// GET /api/v1/publishers - Get current user's publisher profile
export async function GET() {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { publisher: true },
    });

    if (!user?.publisher) {
        return NextResponse.json({ error: 'Publisher not found' }, { status: 404 });
    }

    return NextResponse.json(user.publisher);
}

// POST /api/v1/publishers - Create a publisher profile for current user
export async function POST(request: Request) {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user already has a publisher
    const existingUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { publisher: true },
    });

    if (existingUser?.publisher) {
        return NextResponse.json({ error: 'Publisher already exists' }, { status: 400 });
    }

    const body = await request.json();
    const result = CreatePublisherSchema.safeParse(body);

    if (!result.success) {
        return NextResponse.json(
            { error: 'Validation failed', details: result.error.issues },
            { status: 400 },
        );
    }

    const data = result.data;

    // Check if handle is already taken
    const existingHandle = await prisma.publisher.findUnique({
        where: { handle: data.handle },
    });

    if (existingHandle) {
        return NextResponse.json({ error: 'Handle already taken' }, { status: 400 });
    }

    // Create publisher and link to user
    const publisher = await prisma.publisher.create({
        data: {
            handle: data.handle,
            name: data.name,
            type: data.type,
            description: data.description,
            website: data.website,
            walletAddress: data.walletAddress,
            user: {
                connect: { id: session.user.id },
            },
        },
    });

    return NextResponse.json(publisher, { status: 201 });
}

// PATCH /api/v1/publishers - Update current user's publisher profile
export async function PATCH(request: Request) {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { publisher: true },
    });

    if (!user?.publisher) {
        return NextResponse.json({ error: 'Publisher not found' }, { status: 404 });
    }

    const body = await request.json();
    const UpdateSchema = CreatePublisherSchema.partial().omit({ handle: true }); // Handle cannot be changed
    const result = UpdateSchema.safeParse(body);

    if (!result.success) {
        return NextResponse.json(
            { error: 'Validation failed', details: result.error.issues },
            { status: 400 },
        );
    }

    const publisher = await prisma.publisher.update({
        where: { id: user.publisher.id },
        data: result.data,
    });

    return NextResponse.json(publisher);
}
