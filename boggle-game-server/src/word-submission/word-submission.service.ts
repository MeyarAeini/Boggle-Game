import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WordSubmission } from './schemas/word-submission.schema';
import { Model } from 'mongoose';
import { SubmitWordDto } from './dtos/submit-word.dto';

@Injectable()
export class WordSubmissionService {
    constructor(
        @InjectModel(WordSubmission.name) private wordSubmissionModel: Model<WordSubmission>
    ) { }

    async submit(dto: SubmitWordDto): Promise<WordSubmission> {
        const word = new this.wordSubmissionModel(dto);
        return word.save();
    }
}
