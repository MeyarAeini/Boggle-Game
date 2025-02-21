import {
    Body,
    Controller,
    Get, 
    Param,
    Post
} from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameSessionDto } from './dtos/create-game-session.dto';

@Controller('game')
export class GameController {
    constructor(
        private gameService: GameService
    ) { }

    @Post()
    async createGameSession(@Body() dto: CreateGameSessionDto) {
        return this.gameService.createSession(dto);
    }

    @Get(':id')
    async getGameSession(@Param('id') id: string) {
        return this.gameService.findOne(id);
    }
}
