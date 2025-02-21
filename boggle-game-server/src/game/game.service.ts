import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GameSession } from './schemas/game-session.schema';
import { Model } from 'mongoose';
import { CreateGameSessionDto } from './dtos/create-game-session.dto';

@Injectable()
export class GameService {
    constructor(
        @InjectModel(GameSession.name) private gameSessionModel: Model<GameSession>
    ) { }

    async createSession(dto: CreateGameSessionDto): Promise<GameSession> {
        const session = new this.gameSessionModel(dto);
        session.startTime = new Date();
        return session.save();
    }

    async findOne(id: string): Promise<GameSession | null> {
        return this.gameSessionModel.findOne({ _id: id }).exec();
    }

}
