import { GameSession } from "@/app/lib/definitions";
import { getGamePlayers } from "@/app/services/game.service";
import PlayerList from "./players-list";


export default async function BoggleGamePlayers({ gameSession }: { gameSession: GameSession; }) {
    const players = await getGamePlayers(gameSession.sessionId)||[];
    return (<>
        <h2 className="text-xl font-bold text-center mb-4">Waiting Room</h2>
        <PlayerList players={players} />
    </>);

}
