'use client'; // Mark this as a Client Component

import { SessionProvider, useSession } from 'next-auth/react';
// import { usePathname, useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>
      <Auth>{children}</Auth>
  </SessionProvider>;
}

function Auth({ children }: { children: React.ReactNode }) {
  
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  // const { status } = useSession({ required: true })
  // const path = usePathname();
  // if (path!=='/login' && status === "loading") {
  //   return <div>Loading...</div>
  // }

  return children
}