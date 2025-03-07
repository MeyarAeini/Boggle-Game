import { Module } from '@nestjs/common';
import { DictionaryModule } from './dictionary/dictionary.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AppGateway } from './gateway/events.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { GameModule } from './game/game.module';
import { BoardModule } from './board/board.module';
import { WordSubmissionModule } from './word-submission/word-submission.module';


@Module({
  imports:
    [
      DictionaryModule,
      AuthModule,
      UserModule,
      ConfigModule.forRoot(),
      MongooseModule.forRoot('mongodb://root:example@mongodb:27017/boggle?authSource=admin'),
      GameModule,
      BoardModule,
      WordSubmissionModule
    ],
  providers: [AppGateway ],
})
export class AppModule { }
