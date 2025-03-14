import { GameSession } from "@/app/lib/definitions";
import StartBoggleGame from "./start-boggle-game";
import BoggleGamePlayers from "./boggle-game-players";

export default function BoggleStartPanel({ gameSession }: { gameSession: GameSession }) {
    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-600 text-white p-4">
                <h2 className="text-xl font-bold text-center mb-4">Game Id : {gameSession.sessionId}</h2>
                <BoggleGamePlayers gameSession={gameSession} />
                <StartBoggleGame gameSession={gameSession} />
            </div>
        </>
    );
}


