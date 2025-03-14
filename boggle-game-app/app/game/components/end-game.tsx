'use client';

import { endGame } from "@/app/services/game.service";

export default function EndGame({ id }: { id: string }) {
    const endGameWithId = endGame.bind(null, id);

    return (
        <form action={endGameWithId}>
            <button type="submit" className="w-16 h-16 flex items-center justify-center text-xl font-bold text-white rounded-lg shadow-md bg-red-400">
                finish
            </button>
        </form>
    );
}