import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    UseGuards
} from '@nestjs/common';
import { WordSubmissionService } from './word-submission.service';
import { GetUser } from 'src/auth/get-user.decorator';
import { SubmitWordDto } from './dtos/submit-word.dto';
import { JwtGuard } from 'src/auth/guards';

@Controller('word-submission')
export class WordSubmissionController {
    constructor(
        private service: WordSubmissionService,
    ) { }

    @UseGuards(JwtGuard)
    @Post()
    async submit(@GetUser('id') userId, @Body() dto: SubmitWordDto) {
        dto.userId = userId;
        const word = await this.service.submit(dto);
        return {
            id: word._id,
            valid: word.valid,
            score: word.score,
        };
    }

    @UseGuards(JwtGuard)
    @Get()
    async getUserTeamWordSubmissions(@GetUser('id') userId, @Query('gameId') gameId) {
        return (await this.service.getUserTeamWordSubmissions(userId, gameId)).map((it) => ({
            path: it.path,
            word: it.word,
            valid: it.valid,
            score: it.score
        }));

    }
}
