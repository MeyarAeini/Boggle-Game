'use client';

import { GameSession } from "@/app/lib/definitions";
import { useGameState } from "@/app/lib/useGameState";
import { useSession } from "next-auth/react";
import { useEffect } from "react";


export default function BoardUpdateSubscribe({ gameSession }: { gameSession: GameSession }) {
    const { join, connected } = useGameState();
    const { data: session, status } = useSession({ required: true });
    useEffect(() => {
        join(gameSession.sessionId,session?.user?.accessToken);
    }, [connected,status]);
    return <></>;
}