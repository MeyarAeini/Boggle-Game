'use client';

import { useGameState } from "@/app/lib/useGameState";
import { joinGame } from "@/app/services/game.service";
import React from "react"

export default function JoinBoggleGame() {

    const { join } = useGameState();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const sessionId = formData.get("sessionId") as string;

        await joinGame(sessionId);
        join(sessionId);
    }
    
    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <input className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="sessionId"
                type="sessionId"
                name="sessionId"
                placeholder="Enter game session to join"
                required />
            <button type="submit" className="w-full text-white py-2 rounded bg-green-600 hover:bg-green-700">
                Join
            </button>
        </form>
    );
}