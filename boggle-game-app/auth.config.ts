import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {      
        if(!!auth?.user) return true;
        return false;
    },
  },
  providers: [], // Add providers with an empty array for now
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
} satisfies NextAuthConfig;