import { Injectable } from '@nestjs/common';
import { GameBoard } from './schemas/board.schema';
import { wordScore } from './boggle-board-util';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { DictionaryService } from 'src/dictionary/dictionary.service';
import { BoardPath } from 'src/dictionary/definitions';
import { GeneticPopulation } from "./genetic-population";
import { GeneticBoggleBoard } from './genetic-boggle-board';

@Injectable()
export class BoardService {
    constructor(
        @InjectModel(GameBoard.name) private boardModel: Model<GameBoard>,
        private userService: UserService,
        private dictionaryService: DictionaryService
    ) { }

    async generateBoard(userId: string): Promise<GameBoard> {
        const board = (await this.geneticGet()).id;//randomString(16);
        const user = await this.userService.findOne(userId);
        let validWords: string[] = this.dictionaryService.findAllValidPath(board).filter(it => it.word.length > 2).map((v: BoardPath, i: number) => {

            return v.word;
        });
        validWords = [...new Set(validWords)];
        let score = 0;
        for (let word of validWords)
            score += wordScore(word);
        console.log(score);
        const model = new this.boardModel({
            creationDate: new Date(),
            creator: user,
            generated: true,
            _id: board,
            validWords: validWords,
            score: score
        });
        return model.save();
    }

    async findOne(id: string): Promise<GameBoard | null> {
        return this.boardModel.findOne({ value: id }).exec();
    }

    async getBoardScore(board: string): Promise<Record<string, any>> {

        let totalScore = 0;
        let map = new Map<number, number>();
        let count = new Map<number, number>();
        const paths = this.dictionaryService.findAllValidPath(board);

        const visited = new Set<string>();
        for (let p of paths) {
            if (visited.has(p.word)) continue;
            visited.add(p.word);
            if (count.has(p.word.length))
                count.set(p.word.length, count.get(p.word.length)! + 1);
            else
                count.set(p.word.length, 1);

            const score = wordScore(p.word);
            if (map.has(score))
                map.set(score, map.get(score)! + 1);
            else
                map.set(score, 1);
            totalScore += score;

        }
        console.log(count);
        return {
            wordCount: Object.fromEntries(count),
            scoreMap: Object.fromEntries(map),
            totalScore: totalScore
        };
    }

    async geneticGet(): Promise<GeneticBoggleBoard> {
        //const best = await runGeneticParallel(this.dictionaryService);
        //return best;
        //const goodGene = new GeneticBoggleBoard(this.dictionaryService.trie,false,4,[['S','E','R','S'],['P','A','T','G'],['L','I','N','E'],['S','E','R','S']]);
        //goodGene.evaluate();
        let genetic = new GeneticPopulation(this.dictionaryService.trie, 10, [/*goodGene*/]);
        let bestScore = genetic.getElite(1)[0].score;
        while (bestScore < 4200 && genetic.generation < 100) {
            genetic.evolve();
            bestScore = genetic.getElite(1)[0].score;
            if (genetic.generation % 11 == 0)
                console.log(`generation:${genetic.generation}, score:${bestScore}, average : ${genetic.average()}`);
        }
        return genetic.getElite(1)[0];

    }
}
