import { BoggleBoard } from "./boggle-board";
import { getRandomLetter } from "./boggle-board-util";


export class GeneticBoggleBoard extends BoggleBoard {
    
    age: number;

    crossover(that: BoggleBoard): GeneticBoggleBoard {
        const child = this.clone<GeneticBoggleBoard>();
        for (let i = 0; i < 4; i++) {
            if (Math.random() < 0.5) { // Swap rows randomly
                child.body[i] = [...that.body[i]];
            }
        }
        return child;
    }

    mutate(): GeneticBoggleBoard {
        const newBoard = this.clone<GeneticBoggleBoard>();
        const x1 = Math.floor(Math.random() * this.size);
        const y1 = Math.floor(Math.random() * this.size);
        const x2 = Math.floor(Math.random() * this.size);
        const y2 = Math.floor(Math.random() * this.size);

        [newBoard.body[x1][y1], newBoard.body[x2][y2]] = [newBoard.body[x2][y2], newBoard.body[x1][y1]];
        newBoard.resetId();
        return newBoard;
    }

    mutate2(): GeneticBoggleBoard {
        const newBoard = this.clone<GeneticBoggleBoard>();
        const x = Math.floor(Math.random() * this.size);
        const y = Math.floor(Math.random() * this.size);
        newBoard.body[x][y] = getRandomLetter();
        newBoard.resetId();
        return newBoard;
    }
}
