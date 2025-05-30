import clsx from 'clsx';
export default function BuggleLetter({ letter, visited, onVisit, onVisitStart, onVisiting, onVisitStop }
    : {
        letter: string,
        visited: boolean,
        onVisit: () => void,
        onVisitStart: () => void,
        onVisiting: () => void,
        onVisitStop: () => void
    }) {
    return (
        <button className={clsx("w-16 h-16 flex items-center justify-center text-xl font-bold text-white rounded-lg shadow-md",
            {
                "bg-sky-100": visited,
                "bg-sky-400": !visited
            })}
            onClick={onVisit}
            onMouseDown={onVisitStart}
            onMouseOver={onVisiting}
            onMouseUp={onVisitStop}>
            {letter}
        </button>
    )
};