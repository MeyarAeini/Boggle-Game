'use client';

import { endGame } from "@/app/services/game.service";

export default function BoardFooter({ id }: { id: string }) {
    const endGameWithId = endGame.bind(null, id);
    return (<div className="flex justify-center mt-8">
        <form action={endGameWithId}>
            <button type="submit" className="bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition-colors">
                End Game
            </button>
        </form>
    </div>);
}