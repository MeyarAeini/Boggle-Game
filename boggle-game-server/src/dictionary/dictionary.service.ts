import { Injectable,OnModuleInit } from '@nestjs/common';
import { Trie,TrieNode } from './Trie';
import * as fs from 'fs';
import * as path from 'path';
import {BoardPath} from './definitions';

@Injectable()
export class DictionaryService implements OnModuleInit {
    private readonly filePath = path.join(process.cwd(),'files','dictionary-zingarelli2005.txt');
    private trie : Trie;
    onModuleInit() {
        try{
            this.trie = new Trie();
            for(const word of this.readFile(this.filePath).split(/\r?\n/)){                
                this.trie.insert(word);
            }
        }
        catch(error){
            console.log(`error on populating the words dictionary. Details: ${error}`);
            throw error;
        }
    }
    private readFile(path:string):string{
        try{
            const data = fs.readFileSync(path,'utf8');
            return data;
        }
        catch(error){
            console.log(`error on reading the file:${path}, details: ${error}`);
            throw error;
        }
    }

    has(word:string):boolean{
        return this.trie.search(word);
    }

    findAllValidPath(board:string[]):BoardPath[]{
        const result:BoardPath[] = [];

        const visited = Array.from({length:4},()=>Array.from({length:4}).fill(false));

        const visit = (i:number,j:number,path:string,word:string,node:TrieNode)=>{
            if(i<0 || j<0 || i>3 || j>3) return;
            if(visited[i][j]) return;
            const index = i*4+j;
            const chu = board[i][j].toUpperCase();
            if(!node.children[chu]) return;

            //visit current step
            visited[i][j] = true;
            path+=index.toString(16);
            word+=board[i][j];
            node = node.children[chu];
            //check if a path found
            if(node.isword){
                result.push({path:path,word:word});
            }

            //move to the next steps
            for(let x=-1;x<2;x++)
                for(let y=-1;y<2;y++)
                    visit(i+x,j+y,path,word,node);

            //backtrack
            path = path.slice(0,-1);
            word = word.slice(0,-1);
            visited[i][j]=false;

        };

        for(let i=0;i<4;i++){
            for(let j=0;j<4;j++){
                visit(i,j,"","", this.trie.root);
            }
        }

        return result;
    }
}