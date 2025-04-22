import { BoardSolution, GameSession } from "@/app/lib/definitions";
import Timer from "./timer";

interface BoardHeaderProps {
    gameSession: GameSession;
    word: string;
    score: number;
    board: BoardSolution
}
export default function BoardHeader({ gameSession, word, score, board }: BoardHeaderProps) {

    const scores = Object.entries(board.scores)
        .sort(([, a], [, b]) => b - a)
        .map(([key, value]) => (
            <span key={key} className="mr-2">
                <strong className="font-semibold">{key}:</strong> {value}
            </span>
        ));

    const lengths = Object.entries(board.lengths)
        .sort(([, a], [, b]) => b - a)
        .map(([key, value]) => (
            <span key={key} className="mr-2">
                <strong className="font-semibold">{key}:</strong> {value}
            </span>
        ));

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
            <div className="border border-gray-300 p-2 text-xs">
                <div>
                    <strong className="font-semibold">Scores:</strong>{' '}
                    {scores.length > 0 ? scores : <span className="text-gray-500">N/A</span>}
                </div>
                <div>
                    <strong className="font-semibold">Lengths:</strong>{' '}
                    {lengths.length > 0 ? lengths : <span className="text-gray-500">N/A</span>}
                </div>
            </div>

        </div>
        //SS</div>
    );
}