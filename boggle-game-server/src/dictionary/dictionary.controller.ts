import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import {BoardPath} from './definitions';
import { Trie } from './trie';

@Controller('dictionary')
export class DictionaryController {
    trie:Trie;
    constructor(private readonly service : DictionaryService){
    }

    @Get(':word')
    exist(@Param('word') word:string) : boolean{
        return this.service.has(word);
    }

    /*
    curl -X POST "http://localhost:3003/dictionary" \
      -H "Content-Type: application/json" \
      -d '{"board":["abcd", "efgh", "ijkl", "mnop"]}' |jq
    */
    @Post()
    findwordsInBoard(@Body("board") board:string[]):BoardPath[]{
        console.log("request");
        return this.service.findAllValidPath(board);
    }

}
