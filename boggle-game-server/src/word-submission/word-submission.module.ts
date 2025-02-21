import { Module } from '@nestjs/common';
import { WordSubmissionService } from './word-submission.service';
import { WordSubmissionController } from './word-submission.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WordSubmission, WordSubmissionSchema } from './schemas/word-submission.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: WordSubmission.name, schema: WordSubmissionSchema }
      ])
  ],
  providers: [WordSubmissionService],
  controllers: [WordSubmissionController]
})
export class WordSubmissionModule { }
