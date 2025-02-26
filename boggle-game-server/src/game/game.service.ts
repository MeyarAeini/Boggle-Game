import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GameSession } from './schemas/game-session.schema';
import mongoose, { Model, Types } from 'mongoose';
import { BoardService } from 'src/board/board.service';
import { UserService } from 'src/user/user.service';
import { GameTeam } from './schemas/game-team.schema';

@Injectable()
export class GameService {
    constructor(
        @InjectModel(GameSession.name) private gameSessionModel: Model<GameSession>,
        @InjectModel(GameTeam.name) private gameTeamModel: Model<GameTeam>,
        private boardService: BoardService,
        private userService: UserService
    ) { }

    async createSession(userId: string): Promise<GameSession | null> {
        const user = await this.userService.findOne(userId);
        if (!user) return null;
        const session = new this.gameSessionModel({
            _id : new Types.ObjectId(),
            board: await this.boardService.generateBoard(userId),
            teams: [new this.gameTeamModel({
                members: [user],
                winner: false
            })],
            organiser: user
        });
        const model = await session.save();
        return model.toObject({ virtuals: true });;
    }

    async startSession(sessionId: string): Promise<boolean> {
        console.log(sessionId);
        const session = await this.gameSessionModel.findOne({ _id: new mongoose.Types.ObjectId(sessionId) }).exec();
        if (!session) return false;
        if (!!session.startTime) return false;
        session.startTime = new Date();
        await session.save();
        return true;
    }

    async endSession(sessionId: string): Promise<boolean> {
        const session = await this.gameSessionModel.findOne({ _id: new mongoose.Types.ObjectId(sessionId) }).exec();
        if (!session) return false;
        if (!!session.endTime) return false;
        session.endTime = new Date();
        session.save();
        return true;
    }

    async findOne(id: string): Promise<GameSession | null> {
        return this.gameSessionModel.findOne({ _id: new mongoose.Types.ObjectId(id) }).exec();
    }

}
