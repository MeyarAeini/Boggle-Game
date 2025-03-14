import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    UseGuards
} from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameSessionDto } from './dtos/create-game-session.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { GameSessionDto } from './dtos/game-session.dto';
import { JwtGuard } from 'src/auth/guards';

@Controller('game')
export class GameController {
    constructor(
        private gameService: GameService
    ) { }

    @UseGuards(JwtGuard)
    @Post()
    async createGameSession(@GetUser('id') userId, @Body() dto: CreateGameSessionDto) {
        const session = await this.gameService.createSession(userId);
        return {
            sessionId: session?._id,
            board: session?.board?._id,
            startTime: session?.startTime,
            endTime: session?.endTime,
            now: new Date(),
        };
    }

    @UseGuards(JwtGuard)
    @Post('start')
    async startGameSession(@Body() dto: GameSessionDto) {
        return this.gameService.startSession(dto.sessionId);
    }

    @UseGuards(JwtGuard)
    @Post('end')
    async endGameSession(@Body() dto: GameSessionDto) {
        return this.gameService.endSession(dto.sessionId);
    }

    @UseGuards(JwtGuard)
    @Get('game/:id')
    async getGameSession(@Param('id') id: string) {
        return this.gameService.findOne(id);
    }

    @UseGuards(JwtGuard)
    @Get('list')
    async getUserGames(@GetUser('id') userId, @Query('page') page, @Query('take') take) {
        return this.gameService.getUserGames({
            pageNo: Number(page),
            take: Number(take),
            userId: userId
        });
    }

    @UseGuards(JwtGuard)
    @Get('count')
    async getUserGamesCount(@GetUser('id') userId) {
        return this.gameService.getUserGamesCount(userId);
    }

    @UseGuards(JwtGuard)
    @Get('lastsession')
    async getLastSession(@GetUser('id') userId) {
        const session = await this.gameService.getLastSession(userId);
        if (session == null) return null;
        return {
            sessionId: session._id,
            board: session.board,
            startTime: session.startTime,
            endTime: session.endTime,
            now: new Date(),
        };
    }

    @UseGuards(JwtGuard)
    @Get("players")
    async getGamePlayers(@Query('gameId') gameId) {
        const players = await this.gameService.getGamePlayers(gameId);
        return players?.map((p) => ({
            email: p.email,
            id: p.id,
            name: p.name,
        }));
    }
}
