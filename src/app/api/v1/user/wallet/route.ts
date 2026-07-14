import { NextResponse } from 'next/server';
import { z } from 'zod';

import { auth } from '@/infrastructure/auth';
import { prisma } from '@/infrastructure/persistence/prisma';

// GET /api/v1/user/wallet - Get user's wallet data and transactions
export async function GET() {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            balance: true,
            walletAddress: true,
            transactions: {
                orderBy: { createdAt: 'desc' },
                take: 50,
            },
        },
    });

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
        balance: user.balance,
        walletAddress: user.walletAddress,
        transactions: user.transactions,
    });
}

const UpdateWalletSchema = z.object({
    walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address'),
});

// PATCH /api/v1/user/wallet - Update wallet address
export async function PATCH(request: Request) {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const result = UpdateWalletSchema.safeParse(body);

    if (!result.success) {
        return NextResponse.json(
            { error: 'Validation failed', details: result.error.issues },
            { status: 400 },
        );
    }

    const user = await prisma.user.update({
        where: { id: session.user.id },
        data: { walletAddress: result.data.walletAddress },
        select: {
            balance: true,
            walletAddress: true,
        },
    });

    return NextResponse.json(user);
}
