import { Trie, TrieNode } from "src/dictionary/trie";
import { BoggleBoard } from "./boggle-board";

const Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const Frequencies: number[] = [
        0.08167, 0.01492, 0.02782, 0.04253, 0.12703, 0.02228,
        0.02015, 0.06094, 0.06966, 0.00153, 0.00772, 0.04025,
        0.02406, 0.06749, 0.07507, 0.01929, 0.00095, 0.05987,
        0.06327, 0.09056, 0.02758, 0.00978, 0.02360, 0.00150,
        0.01974, 0.00074
];

const Frequency_intervals: number[] = Frequencies.reduce<number[]>((arr, cur, index) => {
        arr.push((arr[index - 1] || 0) + cur);
        return arr;
}, []);

export function getRandomLetter(): string {
        const randomByte = new Uint8Array(1);
        crypto.getRandomValues(randomByte); // More secure and evenly distributed
        return String.fromCharCode((randomByte[0] % 26) + 65);
};

export function getRandomLetterR(): string {
        return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}

export function getRandomLetterF(): string {
        const rnd = Math.random();
        let i = 0;
        let j = Frequencies.length - 1;
        while (i < j) {
                const k = Math.floor((i + j) / 2);
                if (rnd == Frequency_intervals[k]) return Alphabet[k];
                if (rnd > Frequency_intervals[k])
                        i = k + 1;
                else
                        j = k - 1;
        }
        return Alphabet[j < 0 ? 0 : j];
}

export function generateBoard(len: number): string[][] {
        return Array.from({ length: len }, () => Array.from({ length: len }, () => getRandomLetter()));
}

export function newGrid(len: number): string[][] {
        return Array.from({ length: len }, () => Array.from({ length: len }, () => ''));
}

export function randomString(len: number): string {
        let result = "";
        for (let i = 0; i < len; i++) {
                result += getRandomLetter();
        }
        return result;
}

export type PathMatchCallBack = (path: number[], word: string) => void;

export function dfsBoard(trie: Trie, grid: string[][], callback: PathMatchCallBack) {
        const len = grid.length;
        const visited = Array.from({ length: 4 }, () => Array.from({ length: 4 }).fill(false));

        const visit = (i: number, j: number, path: number[], word: string, node: TrieNode) => {
                if (i < 0 || j < 0 || i > len - 1 || j > len - 1) return;
                if (visited[i][j]) return;
                const index = i * len + j;
                const chu = grid[i][j].toUpperCase();
                if (!node.children[chu]) return;

                //visit current step
                visited[i][j] = true;
                path.push(index);
                word += grid[i][j];
                node = node.children[chu];
                //check if a path found
                if (node.isword) {
                        callback(path, word);
                }

                //move to the next steps
                for (let x = -1; x < 2; x++)
                        for (let y = -1; y < 2; y++)
                                visit(i + x, j + y, path, word, node);

                //backtrack
                path = path.slice(0, -1);
                word = word.slice(0, -1);
                visited[i][j] = false;

        };

        for (let i = 0; i < len; i++) {
                for (let j = 0; j < len; j++) {
                        visit(i, j, [], "", trie.root);
                }
        }
}
export function wordScore(word: string): number {
        switch (word.length) {
                case 3:
                case 4: return 1;
                case 5: return 2;
                case 6: return 3;
                case 7: return 5;
                default: return word.length < 3 ? 0 : 11;
        }
}