import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { BotModule } from 'src/bots/bots.module';
import { gamesProviders } from '../games/games.providers';
import { botsProviders } from 'src/bots/bots.providers';
import { usersProviders } from 'src/auth/providers/users.providers';
import {GamesModule} from '../games/games.modules';
import { SocketGateway } from './services.ts/webSocketService';
import { OpenTokService } from './services.ts/openTokServices';

@Module({
  imports: [DatabaseModule, AuthModule, BotModule, GamesModule],
  controllers:[],
  providers: [
    ...gamesProviders,
    ...botsProviders,
    ...usersProviders,
    SocketGateway,
    OpenTokService
  ]
})

export class SocketServerModule {}