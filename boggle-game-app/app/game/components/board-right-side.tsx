import { WordScore } from "@/app/lib/definitions";

export default function BoardRightSide({ id, words }: { id: string, words: WordScore[] }) {
    const map = new Map<string, number>();
    for (const word of words.sort((a: WordScore, b: WordScore) => {
        if (a.score && b.score && a.score !== b.score) return b.score - a.score;
        if (a.word.length !== b.word.length) return b.word.length - a.word.length;
        return a.word.localeCompare(b.word);
    })) {
        if (!map.has(word.word)) {
            map.set(word.word, word.score);
        }
    }
    return (
        <>
            <h2 className="text-xl font-semibold mb-4">Valid Words</h2>
            <div >
                <ul className="space-y-2 overflow-y-auto" style={{ maxHeight: '270px' }}>
                    {Array.from(map).map(([key, value]) => (
                        <li key={key} className="p-2 rounded-md shadow-sm bg-green-500">
                            {key} - {value}
                        </li>
                    ))}
                </ul>
            </div>
        </>);
}