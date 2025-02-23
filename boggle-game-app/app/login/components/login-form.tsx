'use client';

import { useActionState, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { authenticate } from "../../lib/actions";
import { getCsrfToken, useSession } from "next-auth/react";

export default function LoginForm() {

    /*https://github.com/nextauthjs/next-auth/issues/2426#issuecomment-1141406105
    //i copied the following code in the above link , however it does not fix the issue, i am going to keep the code since it does not break the page neither

    const session = useSession();
    const [csrfToken, setCsrfToken] = useState('');

    useEffect(() => {
        async function fetchCsrfToken() {
            const result = await getCsrfToken();
            if (!result) {
                throw new Error('Can not sign in without a CSRF token');
            }
            setCsrfToken(result);
        }

        //   Wait until session is fetched before obtaining csrfToken 
        //   to prevent synchronization issues caused by both 
        //   /api/auth/session and /api/auth/csrf setting the cookie. 
        //   Only happens in dev environment.
        if (session.status !== 'loading') {
            fetchCsrfToken();
        }
    }, [session.status]);
    */

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    const [errorMessage, formAction, isPending] = useActionState(
        authenticate,
        undefined,
    );

    return (
        <form action={formAction} className="space-y-3">
            <div className="w-full">
                <div>
                    <label className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                        htmlFor="email"> Email </label>
                    <div className="relative">
                        <input className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email address"
                            required />
                    </div>
                </div>
                <div>
                    <label className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                        htmlFor="password">Password</label>
                    <input id="password"
                        type="password"
                        name="password"
                        placeholder="Enter Password"
                        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                        required
                        minLength={6} />
                </div>
            </div>
            <input type="hidden" name="redirectTo" value={callbackUrl} />
            <button type="submit" className="mt-4 w-full" aria-disabled={isPending}>
                Log in
            </button>
            <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
                {errorMessage && (
                    <>
                        {/* <ExclamationCircleIcon className="h-5 w-5 text-red-500" /> */}
                        <p className="text-sm text-red-500">{errorMessage}</p>
                    </>
                )}
            </div>
        </form>
    );
}