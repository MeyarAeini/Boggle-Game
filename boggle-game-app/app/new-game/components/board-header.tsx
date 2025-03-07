import Timer from "./timer";

export default function BoardHeader({ id, word }: { id: string, word: string }) {
    return (
        // <div className="flex justify-between items-center mb-8">
        //     {/* Score */}
        //     <div className="text-2xl font-bold text-green-600">
        //         Score: <span className="text-gray-800">42</span>
        //     </div>

        //     {/* Current Word */}
        //     <div className="text-3xl font-semibold text-blue-600">
        //         Current Word: <span className="text-gray-800">REST</span>
        //     </div>

        //     {/* Timer */}
        //     <div className="text-2xl font-bold text-red-600">
        //         Time Left: <span className="text-gray-800">1:45</span>
        //     </div>


        // </div>
        //<div className="w-full max-w-2xl mb-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
                <div className="text-lg font-semibold">
                    <Timer />
                </div>
                <div className="text-lg font-semibold">
                    <span className="text-green-500">{word}</span>
                </div>
            </div>
        //SS</div>
    );
}