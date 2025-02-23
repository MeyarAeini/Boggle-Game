import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GameBoard, GameBoardSchema } from './schemas/board.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: GameBoard.name, schema: GameBoardSchema }
      ]),
    UserModule,
  ],
  providers: [BoardService],
  controllers: [BoardController]
})
export class BoardModule { }
