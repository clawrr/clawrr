import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';

import { prisma } from '@/infrastructure/persistence/prisma';
import { authConfig } from './config';

// Full auth with Prisma adapter (for server-side only, not Edge)
export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma),
});
