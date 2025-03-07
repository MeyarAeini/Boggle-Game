import { Injectable, OnModuleInit } from '@nestjs/common';
import { Trie } from './trie';
import * as fs from 'fs';
import * as path from 'path';
import { BoardPath } from './definitions';
import { dfsBoard, newGrid } from 'src/board/boggle-board-util';

@Injectable()
export class DictionaryService implements OnModuleInit {
    private readonly filePath = path.join(process.cwd(), 'files', 'words.txt');
    private readonly filePath2 = path.join(process.cwd(), 'files', 'dictionary-yawl.txt');
    public trie: Trie;
    onModuleInit() {
        try {
            this.trie = new Trie();
            for (const word of this.readFile(this.filePath).split(/\r?\n/)) {
                this.trie.insert(word);
            }
             for (const word of this.readFile(this.filePath2).split(/\r?\n/)) {
                 this.trie.insert(word);
             }
        }
        catch (error) {
            console.log(`error on populating the words dictionary. Details: ${error}`);
            throw error;
        }
    }
    private readFile(path: string): string {
        try {
            const data = fs.readFileSync(path, 'utf8');
            return data;
        }
        catch (error) {
            console.log(`error on reading the file:${path}, details: ${error}`);
            throw error;
        }
    }

    has(word: string): boolean {
        return this.trie.search(word);
    }

    findAllValidPath(board: string): BoardPath[] {
        const grid = newGrid(4);
        for (let i = 0; i < 4; i++)
            for (let j = 0; j < 4; j++)
                grid[i][j] = board[i * 4 + j];

        return this.dsf(grid);
    }

    findAllValidPath4(board: string[]): BoardPath[] {
        const grid = newGrid(4);
        for (let i = 0; i < 4; i++)
            for (let j = 0; j < 4; j++)
                grid[i][j] = board[i][j];

        return this.dsf(grid);
    }

    private dsf(grid: string[][]): BoardPath[] {
        const paths: BoardPath[] = [];
        const wordFound = (path: number[], word: string) => {
            let hexPath = "";
            for (const pos of path)
                hexPath += pos.toString(16);
            paths.push({
                path: hexPath,
                word: word
            });
        }
        dfsBoard(this.trie, grid, wordFound);

        return paths;
    }
}