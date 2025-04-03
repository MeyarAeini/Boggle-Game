import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameTeam, GameTeamSchema } from './schemas/game-team.schema';
import { GameSession, GameSessionSchema } from './schemas/game-session.schema';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { UserModule } from 'src/user/user.module';
import { BoardModule } from 'src/board/board.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                { name: GameTeam.name, schema: GameTeamSchema },
                { name: GameSession.name, schema: GameSessionSchema }
            ]),
        UserModule,
        BoardModule,
        ClientsModule.register([
            {
              name: 'NOTIF_SERVICE',
              transport: Transport.REDIS,
              options: {
                host: 'redis',
                port: 6379,
              }
            },
          ]),
    ],
    providers: [GameService],
    controllers: [GameController],
    exports: [GameService]
})
export class GameModule { }
