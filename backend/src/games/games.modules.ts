import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { controllers } from './controllers';
import { AuthModule } from 'src/auth/auth.module';
import { BotModule } from 'src/bots/bots.module';
import { gamesProviders } from './games.providers';
import { botsProviders } from 'src/bots/bots.providers';
import { GamesService } from './services/games.service';

@Module({
  imports: [DatabaseModule, AuthModule, BotModule],
  controllers: controllers,
  providers: [...gamesProviders, ...botsProviders, GamesService],
  exports: [GamesService]
})  

export class GamesModule {}