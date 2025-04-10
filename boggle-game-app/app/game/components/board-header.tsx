import { GameSession } from "@/app/lib/definitions";
import Timer from "./timer";

interface BoardHeaderProps {
    gameSession: GameSession;
    word: string;
    score: number
}
export default function BoardHeader({ gameSession, word, score }: BoardHeaderProps) {
    return (
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
            <div className="text-lg font-semibold">
                <Timer elapsedMilliSeconds={gameSession.timeElapsed}/>
            </div>
            <div className="text-lg font-semibold">
                Score: {score}
            </div>
            <div className="text-lg font-semibold">
                <span className="text-green-500">{word}</span>
            </div>
        </div>
        //SS</div>
    );
}