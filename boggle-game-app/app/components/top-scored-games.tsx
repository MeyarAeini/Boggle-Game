import { Game } from "../lib/definitions";

interface TopScoredGamesProps {
    title: string,
    games: Game[]
}
export default function TopScoredGames({ title, games }: TopScoredGamesProps) {
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">{title}</h2>
            <ul className="space-y-2">
                {games.map((game) => (
                    <li key={game.id.toString()} className="bg-white p-4 rounded shadow">
                        {game.name} - {game.score?.toString()}⭐
                    </li>
                ))}
            </ul>
        </div>
    );
}