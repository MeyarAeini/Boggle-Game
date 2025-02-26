import { Module } from '@nestjs/common';
import { WordSubmissionService } from './word-submission.service';
import { WordSubmissionController } from './word-submission.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WordSubmission, WordSubmissionSchema } from './schemas/word-submission.schema';
import { UserModule } from 'src/user/user.module';
import { GameModule } from 'src/game/game.module';
import { DictionaryModule } from 'src/dictionary/dictionary.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: WordSubmission.name, schema: WordSubmissionSchema }
      ]),
      UserModule,
      GameModule,
      DictionaryModule
  ],
  providers: [WordSubmissionService],
  controllers: [WordSubmissionController]
})
export class WordSubmissionModule { }
