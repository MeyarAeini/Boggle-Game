import { Controller, Get, Param } from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import { Trie } from './Trie';

@Controller('dictionary')
export class DictionaryController {
    trie:Trie;
    constructor(private readonly service : DictionaryService){
    }

    @Get(':word')
    exist(@Param('word') word:string) : boolean{
        return this.service.has(word);
    }

}
