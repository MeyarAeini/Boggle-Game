import BuggleLetter from "./boggle-letter";
import { getBoard } from "../lib/randomBoardGenerator";
export default function BoggleBoard(){
    const board = getBoard();
    return (
        <div className="grid grid-cols-4 gap-2">
            {
                board.flat().map((letter:any)=> (<BuggleLetter letter={letter}/>))
            }
        </div>
    )
}