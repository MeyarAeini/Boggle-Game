import { Trie } from "src/dictionary/trie";
import { GeneticBoggleBoard } from "./genetic-boggle-board";
import { getRandomLetter } from "./boggle-board-util";


export class GeneticPopulation {
    constructor(private trie: Trie, private size: number, private salt: GeneticBoggleBoard[]) {
        this.init();
    }
    generation: number;
    chromosomes: GeneticBoggleBoard[];
    private init() {
        this.generation = 0;
        const chromosomesMap = new Map<string, GeneticBoggleBoard>();
        while (chromosomesMap.size < this.size * 4) {
            const board = new GeneticBoggleBoard(this.trie, true, 4, []);
            if (chromosomesMap.has(board.id)) continue;
            board.evaluate(); //calculate the score
            board.age = 0;
            chromosomesMap.set(board.id, board);
        }
        for (let s of this.salt)
            if (!chromosomesMap.has(s.id))
                chromosomesMap.set(s.id, s);
        this.chromosomes = this.sort([...chromosomesMap.values()]).slice(-this.size);
        console.log(`genetic population initilization is done.`);
    }

    evolve() {
        const chromosomesMap = new Map<string, GeneticBoggleBoard>();
        while (chromosomesMap.size < this.size * 10) {
            const first = this.tournamentSelection();
            const second = this.tournamentSelection();
            let crossoevered = this.crossover(first, second);
            if (!chromosomesMap.has(crossoevered.id)) {
                crossoevered.evaluate();
                crossoevered.age = this.generation + 1;
                chromosomesMap.set(crossoevered.id, crossoevered);
            }
        }
        for (let best of this.getElite(1))
            if (!chromosomesMap.has(best.id))
                chromosomesMap.set(best.id, best);
        this.chromosomes = [...this.sort([...chromosomesMap.values()])].slice(-this.size);
        this.generation++;
    }

    injectChromosomes(input: GeneticBoggleBoard[]) {
        const chromosomesMap = new Map<string, GeneticBoggleBoard>();
        for (let chr of this.chromosomes) chromosomesMap.set(chr.id, chr);
        for (let s of input)
            if (!chromosomesMap.has(s.id))
                chromosomesMap.set(s.id, s);
        this.chromosomes = this.sort([...chromosomesMap.values()]);
    }

    private tournamentSelection(): GeneticBoggleBoard {
        const candidates: GeneticBoggleBoard[] = [];
        for (let i = 0; i < 3; i++)
            candidates.push(this.chromosomes[Math.floor(Math.random() * this.chromosomes.length)]);
        return candidates.reduce((best, current) => best.score < current.score ? current : best);
    }

    getElite(n: number): GeneticBoggleBoard[] {
        return this.chromosomes.slice(-n);
    }

    average(): number {
        return this.chromosomes.reduce((sum, current) => sum + current.score, 0) / this.chromosomes.length;
    }

    private sort(boards: GeneticBoggleBoard[]): GeneticBoggleBoard[] {
        return boards.sort((a, b) => a.score - b.score);
    }

    private similarity(board1: string[][], board2: string[][]): number {
        if (board1.length != board2.length) return 0;
        if (board1.length == 0) return 1;
        if (board1[0].length != board2[0].length) return 0;
        if (board1[0].length === 0) return 1;
        let count = 0;
        for (let i = 0; i < board1.length; i++)
            for (let j = 0; j < board1[0].length; j++)
                if (board1[i][j] === board2[i][j]) count++;
        return count / (board1.length * board1[0].length);
    }

    private crossover(board1: GeneticBoggleBoard, board2: GeneticBoggleBoard) {
        if (board1.size !== board2.size) throw "Not supported operation. Only board with the same size can be merged.";
        const [first, second] = this.order(board1, board2);

        const resemblance = this.similarity(first.body, second.body);

        // Adaptive probabilities based on resemblance
        let firstShare = .68;

        let secondShare = .96;
        if(resemblance>.9){
            firstShare = .3;
            secondShare = .2;
        }
        else if(resemblance>.8){
            firstShare = .4;
            secondShare = .3;
        }
        else if(resemblance>.7){
            firstShare = .5;
            secondShare = .3;
        }

        const result: string[][] = Array.from({ length: first.size }, () => Array.from({ length: first.size }, () => ''));
        for (let i = 0; i < first.size; i++)
            for (let j = 0; j < first.size; j++) {
                const rnd = Math.random();
                if (rnd <= firstShare)
                    result[i][j] = first.body[i][j];
                else if (rnd <= secondShare)
                    result[i][j] = second.body[i][j];
                else 
                    result[i][j] = getRandomLetter();
            }
        return new GeneticBoggleBoard(this.trie, false, board1.size, result);
    }

    private order(board1: GeneticBoggleBoard, board2: GeneticBoggleBoard): GeneticBoggleBoard[] {
        if (board1.score > board2.score) return [board1, board2];
        if (board2.score > board1.score) return [board2, board1];
        //flip a coin
        if (Math.floor(Math.random() * 2) === 0)
            return [board1, board2];
        return [board2, board1];
    }
}
