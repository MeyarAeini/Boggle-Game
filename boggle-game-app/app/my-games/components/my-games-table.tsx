import { getMyGames } from "@/app/services/game.service";

interface GameTableProps {
    page: number
}
export default async function GamesTable({ page }: GameTableProps) {
    const games = await getMyGames(page, 5);

    const formatDateToLocal = (
        dateStr: string,
        locale: string = 'en-US',
    ) => {
        if(!dateStr) return '';
        const date = new Date(dateStr);
        const options: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        const formatter = new Intl.DateTimeFormat(locale, options);
        return formatter.format(date);
    };

    const formatDuration =(from:string,to:string)=>{
        if(!to || !from) return "";
        const dt1 = new Date(to);
        const dt2 = new Date(from);
        const diff = Math.abs(dt1.getTime() - dt2.getTime())/1000;
        return `${Math.floor(diff/60)}:${Math.floor(diff%60)}`
    }

    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <table className="hidden min-w-full text-gray-900 md:table">
                        <thead className="rounded-lg text-left text-sm font-normal">
                            <tr>
                                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                                    board
                                </th>
                                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                                    start time
                                </th>
                                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                                    end time
                                </th>
                                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                                    duration
                                </th>
                                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                                    score
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {games.map((g: any, index: number) => (
                                <tr key={index}>
                                    <td className="whitespace-nowrap px-3 py-3">{g.board}</td>
                                    <td className="whitespace-nowrap px-3 py-3">{formatDateToLocal(g.startTime)}</td>
                                    <td className="whitespace-nowrap px-3 py-3">{formatDateToLocal(g.endTime)}</td>
                                    <td className="whitespace-nowrap px-3 py-3">{formatDuration(g.endTime , g.startTime)}</td>
                                    <td className="whitespace-nowrap px-3 py-3">{g.score}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}