import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GameBoard, GameBoardSchema } from './schemas/board.schema';
import { UserModule } from 'src/user/user.module';
import { DictionaryModule } from 'src/dictionary/dictionary.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: GameBoard.name, schema: GameBoardSchema }
      ]),
    UserModule,DictionaryModule
  ],
  providers: [BoardService],
  controllers: [BoardController],
  exports: [BoardService]
})
export class BoardModule { }
