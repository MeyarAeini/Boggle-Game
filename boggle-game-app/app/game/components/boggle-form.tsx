import { getLastSession, newGame, startGame } from "@/app/services/game.service";
import BoggleGamePanel from "./boggle-game-panel";
import BoggleStartPanel from "./boggle-waiting-panel";

export default async function BoggleForm() {
    try {
        const lastSession = await getLastSession();

        const gameSession = lastSession && lastSession.endTime
            ? await newGame()
            : lastSession;
            
        return gameSession?.startTime 
            ? <BoggleGamePanel gameSession={gameSession} /> 
            : <BoggleStartPanel gameSession={gameSession} />;
    } catch (error) {
        console.error("Error in BoggleForm:", error);
        return <p>Something went wrong. Please try again later.</p>;
    }
}