'use client';

import { Player } from "@/app/lib/definitions";
import { useGameState } from "@/app/lib/useGameState";


export default function PlayerList({ players }: { players: Player[];}) {
    const { gameState } = useGameState();
    const participants = gameState?.players || players;
    return (
        <ul className="mb-4 space-y-2">
            {participants.map((player, index) => (
                <li key={index} className="p-2 bg-gray-700 rounded-lg text-center">
                    {player.name}
                </li>
            ))}
        </ul>
    );
}