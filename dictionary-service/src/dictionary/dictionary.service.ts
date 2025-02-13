import { Injectable,OnModuleInit } from '@nestjs/common';
import { Trie } from './Trie';
import * as fs from 'fs';
import * as path from 'path';

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
            console.log(this.trie);
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

}




