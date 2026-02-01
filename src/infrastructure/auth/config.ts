import type { NextAuthConfig } from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';

const isDev = process.env.NODE_ENV === 'development';

// Base config without database adapter (for Edge Runtime / middleware)
export const authConfig: NextAuthConfig = {
    providers: [
        GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        // Dev-only credentials provider for testing
        ...(isDev
            ? [
                  Credentials({
                      name: 'Dev Login',
                      credentials: {
                          email: { label: 'Email', type: 'email', placeholder: 'dev@example.com' },
                      },
                      async authorize(credentials) {
                          if (!credentials?.email) return null;
                          // In dev mode, accept any email
                          return {
                              id: `dev-${credentials.email}`,
                              email: credentials.email as string,
                              name: (credentials.email as string).split('@')[0],
                          };
                      },
                  }),
              ]
            : []),
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isAuthPage = nextUrl.pathname.startsWith('/login');
            const isApiRoute = nextUrl.pathname.startsWith('/api');

            // Allow API routes and auth pages
            if (isApiRoute || isAuthPage) {
                return true;
            }

            // Redirect to login if not authenticated
            if (!isLoggedIn) {
                return false;
            }

            return true;
        },
        // For credentials provider, we need to handle JWT
        jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        session({ session, token }) {
            if (session.user && token?.id) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
    // Use JWT for credentials provider
    session: {
        strategy: isDev ? 'jwt' : 'database',
    },
};
