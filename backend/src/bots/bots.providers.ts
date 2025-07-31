import { Connection } from 'mongoose';
import { BotsSChema } from './bots.schema'
import { IBot, IBotMethods } from './interfaces';
import { BotAuthService } from './services';

export const botsProviders = [
  {
    provide: 'BOT_MODEL',
    useFactory: (connection: Connection) => connection.model<IBot, IBotMethods>('Bot', BotsSChema),
    inject: ['DATABASE_CONNECTION'],
  },
  BotAuthService,
  
];