import { newGame, startGame } from "@/app/services/game.service";
import BoggleGamePanel from "./boggle-game-panel";

export default async function BoggleForm() {
    const gameSession = await newGame();
    if (!!gameSession.id) {
        await startGame(gameSession.id);
    }
    return (
        <BoggleGamePanel gameid={gameSession.id} board={gameSession.board} />
    );
}