'use client';

import { useSession } from "next-auth/react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BoggleBoard from "./boggle-board";
import { endGame, newGame, startGame } from "@/app/services/game.service";

export default function BoggleForm() {
    const { data: session, status } = useSession({ required: true });
    const [gameId, setGameId] = useState('');
    const [board, setBoard] = useState(Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => '')));
    const searchParam = useSearchParams();
    const pathName = usePathname();
    const { replace } = useRouter();
    useEffect(() => {
        const fetchBoard = async () => {
            if (!gameId || gameId.length===0) {
                const token = session?.user?.accessToken;
                const gameSession = await newGame(token);
                if (!!gameSession.id) {
                    setGameId(gameSession.id);
                    setBoard(gameSession.board);
                    setParams(gameSession.id);
                    await startGame(token, gameSession.id);
                }
            }
        };
        fetchBoard();
    });

    const setParams = (gameSessionId: string) => {
        //update params
        const params = new URLSearchParams(searchParam?.toString() || "");
        params.set("gameId", gameSessionId);
        replace(`${pathName}?${params.toString()}`);
    }
    const restart = async () => {
        const token = session?.user?.accessToken;

        //end current game session
        await endGame(token, gameId);

        //start a new game session
        const gameSession = await newGame(token);
        if (!!gameSession.id) {
            setGameId(gameSession.id);
            setBoard(gameSession.board);
            await startGame(token, gameSession.id);
        }

        //update params
        setParams(gameSession.id);
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
                <BoggleBoard key={gameId} gameId={gameId} board={board} />
            </div>
        </>
    );
}