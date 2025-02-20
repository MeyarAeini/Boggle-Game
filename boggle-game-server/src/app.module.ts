import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DictionaryModule } from './dictionary/dictionary.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AppGateway } from './gateway/events.gateway';

@Module({
  imports: [DictionaryModule, AuthModule, UserModule,ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService,AppGateway],
})
export class AppModule {}
