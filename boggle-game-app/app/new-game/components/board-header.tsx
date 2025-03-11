import Timer from "./timer";

interface BoardHeaderProps {
    id: string;
    word: string;
    score: number
}
export default function BoardHeader({ id, word, score }: BoardHeaderProps) {
    return (
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
            <div className="text-lg font-semibold">
                <Timer />
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