import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import {BoardPath} from './definitions';
import { Trie } from './trie';
import { JwtGuard } from 'src/auth/guards';

@Controller('dictionary')
export class DictionaryController {
    trie:Trie;
    constructor(private readonly service : DictionaryService){
    }

    @UseGuards(JwtGuard)
    @Get(':word')
    exist(@Param('word') word:string) : boolean{
        return this.service.has(word);
    }

    /*
    curl -X POST "http://localhost:3003/dictionary" \
      -H "Content-Type: application/json" \
      -d '{"board":["abcd", "efgh", "ijkl", "mnop"]}' |jq
    */
    @UseGuards(JwtGuard)
    @Post()
    findwordsInBoard(@Body("board") board:string[]):BoardPath[]{
        console.log("request");
        return this.service.findAllValidPath4(board);
    }

}
