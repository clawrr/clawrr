import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

import { auth } from '@/infrastructure/auth';
import { prisma } from '@/infrastructure/persistence/prisma';

// GET /api/v1/user/api-key - Get current user's API key
export async function GET() {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { apiKey: true },
    });

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ apiKey: user.apiKey });
}

// POST /api/v1/user/api-key - Regenerate API key
export async function POST() {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const newApiKey = randomUUID();

    const user = await prisma.user.update({
        where: { id: session.user.id },
        data: { apiKey: newApiKey },
        select: { apiKey: true },
    });

    return NextResponse.json({ apiKey: user.apiKey });
}
