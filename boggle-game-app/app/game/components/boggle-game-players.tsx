import { GameSession } from "@/app/lib/definitions";
import { getGamePlayers } from "@/app/services/game.service";


export default async function BoggleGamePlayers({ gameSession }: { gameSession: GameSession; }) {
    const players = await getGamePlayers(gameSession.sessionId)||[];
    console.log(players);
    return (<>
        <h2 className="text-xl font-bold text-center mb-4">Waiting Room</h2>
        <ul className="mb-4 space-y-2">
            {players.map((player, index) => (
                <li key={index} className="p-2 bg-gray-700 rounded-lg text-center">
                    {player.name}
                </li>
            ))}
        </ul>
    </>);

}
