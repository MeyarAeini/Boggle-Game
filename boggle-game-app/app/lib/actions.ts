'use server';

import { AuthError } from "next-auth";
import { signIn } from '@/auth';
import z from 'zod';
import { register } from "../services/user.service";

export async function authenticate(
    prevState: string | undefined,
    formData: FormData
) {
    try {
        const actionType = formData.get("actionType");
        if (actionType === "register") {
            const RegisterSchema = z.object({
                name: z.string().min(2, "Name must be at least 2 characters"),
                email: z.string().email("Invalid email format"),
                password: z.string().min(6, "Password must be at least 6 characters"),
            });

            const name = formData.get("name")?.toString();
            const email = formData.get("email")?.toString();
            const password = formData.get("password")?.toString();
            const result = RegisterSchema.safeParse({ name, email, password });

            if (!result.success) {
                return result.error.issues.map((issue) => issue.message).join(", "); // Return errors
            }

            await register(result.data);
        }
        else {
            await signIn('credentials', formData);
        }
    }
    catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}