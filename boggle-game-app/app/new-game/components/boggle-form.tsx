import { getLastSession, newGame, startGame } from "@/app/services/game.service";
import BoggleGamePanel from "./boggle-game-panel";

export default async function BoggleForm() {
    let gameSession = await getLastSession();
    if(gameSession && gameSession.endTime){
        gameSession = await newGame();
        if (!!gameSession.sessionId) {
            await startGame(gameSession.sessionId);
        }
    }

    return (
        <BoggleGamePanel gameSession={gameSession} />
    );
}