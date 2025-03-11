import clsx from "clsx";

export default function BoardLeftSide({ id, words }: { id: string, words: any[] }) {
    return (
        <>
            <h2 className="text-xl font-semibold mb-4">History</h2>
            <div >
                <ul className="space-y-2 overflow-y-auto" style={{ maxHeight: '270px' }}>
                    {[...words.entries()].reverse().map(([path, word]) => (
                        <li key={path} className={clsx("p-2 rounded-md shadow-sm",
                            {
                                "bg-gray-50": !word.exist,
                                "bg-green-500": word.exist
                            }
                        )}>
                            {word.word}
                        </li>
                    ))}
                </ul>
            </div>
        </>);
}