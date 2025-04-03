import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppGateway } from './events.gateway';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_ACCESS_EXPIRATION', '1h') },
      }),
    }),
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
  controllers: [NotificationService],
  providers: [AppGateway],
})
export class AppModule { }
