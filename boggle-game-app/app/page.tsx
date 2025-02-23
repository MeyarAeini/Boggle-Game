import GameList from "./components/game-list";
import TopScoredGames from "./components/top-scored-games";

export default function Page() {

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome to My Board Game</h1>
      <div className="space-y-8">
        <GameList title="Ongoing Games" games={[{ id: 1, name: 'Game 1' }]} />
        <TopScoredGames
          title="Top Rated Games"
          games={[
            { id: 1, name: 'Game A', score: 4.8 },
            { id: 2, name: 'Game B', score: 4.7 },
          ]}
        />
      </div>
    </div>
  );
}
