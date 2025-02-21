import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GameBoard, GameBoardSchema } from './schemas/board.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: GameBoard.name, schema: GameBoardSchema }
      ])
  ],
  providers: [BoardService],
  controllers: [BoardController]
})
export class BoardModule { }
