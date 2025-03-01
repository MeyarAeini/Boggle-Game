//'use client';

//import { useSession } from "next-auth/react";
//import { usePathname, useSearchParams, useRouter } from "next/navigation";
//import { useEffect, useState } from "react";
import BoggleBoard from "./boggle-board";
import { newGame, startGame } from "@/app/services/game.service";
import { auth } from "@/auth";
import EndGame from "./end-game";
import { Suspense } from "react";

export default async function BoggleForm() {
    const session = await auth();
    const gameSession = await newGame();
    if (!!gameSession.id) {
        await startGame(gameSession.id);
    }
    return (
        <>
            <p>Welcome, {session?.user?.email}</p>
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <Suspense>
                    <EndGame id={gameSession.id} />
                </Suspense>
                <BoggleBoard key={gameSession.id} gameId={gameSession.id} board={gameSession.board} />
            </div>
        </>
    );
}