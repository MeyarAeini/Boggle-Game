import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WordSubmission } from './schemas/word-submission.schema';
import { Model, Types } from 'mongoose';
import { SubmitWordDto } from './dtos/submit-word.dto';
import { UserService } from 'src/user/user.service';
import { GameService } from 'src/game/game.service';
import { DictionaryService } from 'src/dictionary/dictionary.service';
import { wordScore } from 'src/board/boggle-board-util';

@Injectable()
export class WordSubmissionService {
    constructor(
        @InjectModel(WordSubmission.name) private wordSubmissionModel: Model<WordSubmission>,
        private userService: UserService,
        private gameService: GameService,
        private dictionaryService: DictionaryService,
    ) { }

    async submit(dto: SubmitWordDto): Promise<WordSubmission> {
        const user = await this.userService.findOne(dto.userId);
        const game = await this.gameService.findOne(dto.game);
        const valid = await this.dictionaryService.has(dto.word);
        const score = valid ? wordScore(dto.word) : 0;
        const record = new this.wordSubmissionModel({
            _id: new Types.ObjectId(),
            finder: user,
            game: game,
            word: dto.word,
            path: dto.path,
            valid: valid,
            dictionary: "default",
            dateTime: new Date(),
            score : score,
        });
        return record.save();
    }
}
