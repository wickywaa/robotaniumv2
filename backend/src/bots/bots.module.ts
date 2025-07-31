import {Module, Inject } from '@nestjs/common';
import controllers from './controllers';
import { botsProviders } from './bots.providers';
import { DatabaseModule } from 'src/database/database.module';
import { AuthGuard } from './guards/AuthGuards';
import { BotAuthService } from './services/authService';
import { AuthModule } from 'src/auth/auth.module';
import { UserSchema } from 'src/auth/schemas/users.schema';
import { GamesModule } from 'src/games/games.modules';
import { gamesProviders } from 'src/games/games.providers';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers,
  providers: [
    ...botsProviders,
    ...gamesProviders,
    BotAuthService,
    AuthGuard
  ]
})

export class BotModule {}