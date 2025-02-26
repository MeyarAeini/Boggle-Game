import { Injectable } from '@nestjs/common';
import { GameBoard } from './schemas/board.schema';
import { getBoardString } from './randomBoardGenerator';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';

@Injectable()
export class BoardService {
    constructor(
        @InjectModel(GameBoard.name) private boardModel: Model<GameBoard>,
        private userService: UserService
    ) { }

    async generateBoard(userId: string): Promise<GameBoard> {
        const board = getBoardString();
        const user = await this.userService.findOne(userId);
        const model = new this.boardModel({
            creationDate: new Date(),
            creator: user,
            generated: true,
            _id: board
        })
        return model.save();
    }

    async findOne(id: string): Promise<GameBoard | null> {
        return this.boardModel.findOne({ value: id }).exec();
    }
}
