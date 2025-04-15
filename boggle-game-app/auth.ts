import NextAuth from "next-auth";
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { authConfig } from "./auth.config";
import { jwtDecode } from "jwt-decode";
const BASE_URL = "http://boggle-game-boggle-game-server-1:3003/auth/";
export const { auth, handlers, signIn, signOut } = NextAuth(
    {
        ...authConfig,
        providers: [
            Credentials({
                async authorize(credentials) {

                    const parsedCredentials = z.object({ email: z.string().email(), password: z.string().min(6) })
                        .safeParse(credentials);
                    if (parsedCredentials.success) {
                        const res = await fetch(`${BASE_URL}login`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(parsedCredentials.data),
                        });
                        const data = await res.json();
                        if (!res.ok || !data.access_token) {
                            throw new Error(data.message || "Invalid credentials");
                        }

                        const profile = await fetch(`${BASE_URL}profile`, {
                            method: "GET",
                            headers: { "Authorization": `Bearer ${data.access_token}` },
                        });
                        const user = await profile.json();
                        const decodedToken = jwtDecode(data.access_token);
                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            accessToken: data.access_token,
                            refreshToken: data.refresh_token,
                            expiresIn: decodedToken.exp,
                        };
                    }
                    return null;
                },
            }),
        ],
        callbacks: {
            //ts-ignore 
            async jwt({ token, user, account }) {
                if (user) {
                    // Initial sign-in
                    token.accessToken = user.accessToken;
                    token.refreshToken = user.refreshToken;
                    token.accessTokenExpires = user.expiresIn * 1000; // Assuming your backend returns expiresIn in seconds
                }

                // Access token has expired, try to refresh
                if (Date.now() > (token.accessTokenExpires as number)) {
                    console.log('Access token expired, attempting to refresh...');
                    return refreshAccessToken(token);
                }

                return token;
            },
            async session({ session, token }) {
                session.sessionToken = token.accessToken as string;
                return session;
            }
        },
        session: {
            strategy: 'jwt',
        },
    },
);

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token: any) {
    try {
        const response = await fetch(`${BASE_URL}refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token.refreshToken}` },
        });

        const refreshedTokens = await response.json()

        if (!response.ok) {
            throw refreshedTokens
        }

        const decodedToken = jwtDecode(refreshedTokens.accessToken);
        return {
            ...token,
            accessToken: refreshedTokens.accessToken,
            accessTokenExpires: (decodedToken.exp ?? 0) * 1000,
            refreshToken: refreshedTokens.refreshToken ?? token.refreshToken, // Fall back to old refresh token
        }
    } catch (error) {
        console.log(error)

        return {
            ...token,
            error: "RefreshAccessTokenError",
        }
    }
}