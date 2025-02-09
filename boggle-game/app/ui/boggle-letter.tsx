
export default function BuggleLetter({letter}:{letter:any}){
    return (
        <button key={letter} className="w-16 h-16 flex items-center justify-center text-xl font-bold bg-sky-400 text-white rounded-lg shadow-md">
            {letter}
        </button>
    )
};