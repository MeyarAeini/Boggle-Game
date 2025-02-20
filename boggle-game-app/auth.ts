import NextAuth from "next-auth";
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { authConfig } from "./auth.config";
export const { auth, handlers, signIn, signOut } = NextAuth(
    {
        ...authConfig,
        providers: [
            Credentials({
                async authorize(credentials) {

                    const parsedCredentials = z.object({ email: z.string().email(), password: z.string().min(6) })
                        .safeParse(credentials);
                    if (parsedCredentials.success) {
                        const res = await fetch("http://boggle-game-dictionary-service-1:3003/auth/login", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(parsedCredentials.data),
                        });
                        const data = await res.json();
                        if (!res.ok || !data.access_token) {
                            throw new Error(data.message || "Invalid credentials");
                        }

                        const profile = await fetch(`http://boggle-game-dictionary-service-1:3003/auth/profile`, {
                            method: "GET",
                            headers: { "Authorization": `Bearer ${data.access_token}` },
                        });
                        const user = await profile.json();
                        return {
                            id: user.userId,
                            name: user.username,
                            email: user.email,
                            accessToken: data.access_token,
                            refreshToken: data.refresh_token,
                        };
                    }
                    return null;
                },
            }),
        ],
        callbacks: {
            async jwt({ token, user }) {
                if (user) {
                    token.accessToken = user.accessToken;
                    token.refreshToken = user.refreshToken;
                }
                return token;
            },
            async session({ session, token }) {
                session.user = {
                    ...session.user,
                    accessToken: token.accessToken,
                };
                return session;
            }
        },        
    },
);