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
    const [isLogin, setIsLogin] = useState(true);

    return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">{isLogin ? "Login" : "Register"}</h2>

      <form className="space-y-4" action={formAction}>
        {!isLogin && (
          <input type="text"
            name="name" 
            placeholder="Full Name"
            className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            required
          />
        )}
        <input type="hidden" name="actionType" value={isLogin ? "login" : "register"} />
        <input className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email address"
                            required />
        <input id="password"
                        type="password"
                        name="password"
                        placeholder="Enter Password"
                        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                        required
                        minLength={6} />
        <input type="hidden" name="redirectTo" value={callbackUrl} />
        <button type="submit"
          className={`w-full text-white py-2 rounded ${
            isLogin ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
          }`}
          aria-disabled={isPending}>
          {isLogin ? "Login" : "Register"}
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

      <p className="text-center text-gray-600 mt-4">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-600 hover:underline" >
          {isLogin ? "Sign up" : "Login"}
        </button>
      </p>
    </div>
  );
}