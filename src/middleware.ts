import NextAuth from 'next-auth';
import { authConfig } from '@/infrastructure/auth/config';

// Use base config without Prisma adapter for Edge Runtime
export default NextAuth(authConfig).auth;

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
