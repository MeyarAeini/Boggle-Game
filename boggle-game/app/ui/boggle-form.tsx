'use client';

import { useSession } from "next-auth/react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import BoggleBoard from "./boggle-board";

export default function BoggleForm() {
    const { data: session, status } = useSession({ required: true });
    const [gameId, setGameId] = useState(1);
    const searchParam = useSearchParams();
    const pathName = usePathname();
    const { replace } = useRouter();

    const restart = () => {
        const params = new URLSearchParams(searchParam?.toString() || "");
        params.set("gameId", (gameId + 1).toString());
        replace(`${pathName}?${params.toString()}`);
        setGameId(prev => prev + 1);
    }
    if (status === 'loading') {
        return <p>Loading session...</p>; // Show a loading spinner or message
    }
    if (!session) {
        return null;
    }
    return (
        <>
            <p>Welcome, {session.user?.email}</p>
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <button onClick={restart}
                    className="w-16 h-16 flex items-center justify-center text-xl font-bold text-white rounded-lg shadow-md bg-green-400">
                    reset
                </button>
                <BoggleBoard key={gameId} />
            </div>
        </>
    );
}