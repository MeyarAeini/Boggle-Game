import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GameSession } from './schemas/game-session.schema';
import mongoose, { Model, Types } from 'mongoose';
import { BoardService } from 'src/board/board.service';
import { UserService } from 'src/user/user.service';
import { GameTeam } from './schemas/game-team.schema';
import { UserGamesDto } from './dtos/user-games.dto';
import { User } from 'src/user/schemas/user.schema';

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
            _id: new Types.ObjectId(),            
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
        const session = await this.gameSessionModel.findOne({ _id: new mongoose.Types.ObjectId(sessionId) }).exec();
        if (!session) return false;
        if (!!session.startTime) return false;
        session.startTime = new Date();
        session.board = await this.boardService.generateBoard(session.organiser._id.toHexString()),
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

    async getLastSession(userId: string): Promise<GameSession | null> {
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const games = await this.gameSessionModel.find({
            teams: {
                $elemMatch: {
                    members: userObjectId
                }
            }
        }).sort({ startTime: -1 }).limit(1).exec();
        if (!games || games.length == 0) return null;
        return games[0];
    }

    async getUserGames(userGamesDto: UserGamesDto): Promise<any> {
        return this.gameSessionModel.aggregate([{
            $match: {
                organiser: new mongoose.Types.ObjectId(userGamesDto.userId)
            }
        },
        {
            $lookup: {
                from: "wordsubmissions",
                localField: "_id",
                foreignField: "game",
                as: "gamewords"
            }
        },
        {
            $unwind: "$gamewords"
        },
        // {
        //     $match: {
        //         "finder": new mongoose.Types.ObjectId(userGamesDto.userId)
        //     }
        // },
        {
            $group: {
                _id: {
                    id: "$_id",
                    startTime: "$startTime",
                    endTime: "$endTime",
                    board: "$board"
                },
                score: { $sum: "$gamewords.score" }
            }
        },
        {
            $project: {
                _id: 0,
                id: "$_id.id",
                startTime: "$_id.startTime",
                endTime: "$_id.endTime",
                board: "$_id.board",
                score: 1
            }
        },
        {
            $sort: { startTime: -1 }
        },
        {
            $skip: (userGamesDto.pageNo - 1) * userGamesDto.take
        },
        {
            $limit: userGamesDto.take
        }]).exec();
    }

    async getUserGamesCount(userId: string): Promise<any> {
        console.log(userId);
        const result = await this.gameSessionModel.aggregate([
            {
                $match: {
                    organiser: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $count: 'count'
            }]);
        return result.length > 0 ? result[0].count : 0;

    }

    async findTeammateUserIds(gameId: Types.ObjectId, userId: Types.ObjectId): Promise<Types.ObjectId[]> {

        const gameSession = await this.gameSessionModel.findOne({
            '_id': gameId,
        });

        if (!gameSession) {
            return [];
        }

        const teamWithUser = gameSession.teams.find((team) =>
            team.members.some((member) => {
                const memberId = member instanceof Types.ObjectId ? member : member._id;
                return memberId.equals(userId)
            }),
        );

        if (!teamWithUser) {
            return [];
        }

        return teamWithUser.members
            .map((member) => (member instanceof Types.ObjectId ? member : member._id));
    }

    async getGamePlayers(sessionId: string): Promise<User[] | null> {
        const result = await this.gameSessionModel.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(sessionId) } },
            { $unwind: "$teams" },
            { $unwind: "$teams.members" },
            { $group: { _id: null, userIds: { $push: "$teams.members" } } },
            { $project: { _id: 0, userIds: 1 } }]).exec();
        return this.userService.findAll(result[0].userIds);
    }

}
