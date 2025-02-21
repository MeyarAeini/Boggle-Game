import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameTeam, GameTeamSchema } from './schemas/game-team.schema';
import { GameSession, GameSessionSchema } from './schemas/game-session.schema';
import { GameService } from './game.service';
import { GameController } from './game.controller';

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                { name: GameTeam.name, schema: GameTeamSchema },
                { name: GameSession.name, schema: GameSessionSchema }
            ])],
    providers: [GameService],
    controllers: [GameController]
})
export class GameModule { }
