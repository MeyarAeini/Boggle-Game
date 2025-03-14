'use client';

import { GameSession } from "@/app/lib/definitions";
import { startGame } from "@/app/services/game.service";
import clsx from "clsx";
import React, { useState } from "react";


export default function StartBoggleGame({ gameSession }: { gameSession: GameSession; }) {
    const [isStarting, setIsStarting] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
        setIsStarting(true);
        await startGame(gameSession.sessionId);
        setIsStarting(false);
    }
    return (
        <div className="relative">
            {isStarting && (
                <div className="absolute inset-0 bg-green bg-opacity-50 flex justify-center items-center z-10">
                    <div className="text-white text-xl font-bold">Game will start soon ...</div>
                </div>
            )}
            <div className={clsx("flex justify-center mt-8", {
                "blur-sm": isStarting,
                "": !isStarting
            })}>
                <div className="flex justify-center mt-8">
                    <form onSubmit={handleSubmit}>
                        <button type="submit" className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors"
                            disabled={!!gameSession.startTime || isStarting}>
                            {isStarting ? "Starting" : "Start Game"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
