import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';

import { prisma } from '@/infrastructure/persistence/prisma';

import { authConfig } from './config';

// @auth/prisma-adapter is typed against the client the prisma-client-js
// Generator emitted; Prisma 7's prisma-client generator parameterises
// PrismaClient differently for the same runtime surface, so the adapter can
// Only be satisfied through the cast.
type AdapterClient = Parameters<typeof PrismaAdapter>[0];

// Full auth with Prisma adapter (for server-side only, not Edge)
export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma as unknown as AdapterClient),
});
