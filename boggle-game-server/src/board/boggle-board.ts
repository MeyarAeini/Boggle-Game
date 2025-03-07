import { Trie } from "src/dictionary/trie";
import { dfsBoard, generateBoard, wordScore } from "./boggle-board-util";

export class BoggleBoard {
    constructor(protected trie: Trie, generate: boolean, len: number, grid: string[][]) {
        if (generate) {
            this.body = generateBoard(len);
            this.size = len;
        }
        else {
            this.body = grid;
            this.size = grid.length;
        }
        this.resetId();
    }

    protected resetId(){
        this.id = this.body.flat().join('');
    }

    evaluate() {
        this.score = 0;
        const visited = new Set<string>();
        const wordFound = (_: number[], word: string) => {
            if (visited.has(word)) return;
            visited.add(word)
            this.score += wordScore(word);
        }
        dfsBoard(this.trie, this.body, wordFound);
    }

    public clone<T extends BoggleBoard>(): T {
        const clone = Object.create(this);
        Object.assign(clone, this);
        return clone as T;
    }

    id: string;
    body: string[][];
    size: number;
    score: number;
}


