import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { usersProviders } from './providers/users.providers';
import { AdminAuthMiddleware, UserAuthMiddleware } from './middleware';
import { MailService, UsersService } from './services/';
import services from './services';
import controllers from './controllers';

@Module({
  imports: [DatabaseModule],
  controllers: [ ...controllers ],
  providers: [
    ...services,
    MailService,
    ...usersProviders,
  ],
  exports:[...usersProviders]
  
})
export class AuthModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(AdminAuthMiddleware)
    .exclude(
      {path: 'api/admin/login', method: RequestMethod.ALL},
      {path: 'api/admin/user', method: RequestMethod.POST},
      {path: 'api/admin/user', method: RequestMethod.GET}
    ).forRoutes('api/admin', 'api/errors')
    .apply(UserAuthMiddleware)
    .exclude(
      {path:'api/users/user', method: RequestMethod.ALL},
      {path:'api/users/login', method: RequestMethod.ALL},
      {path:'api/users/confirm', method: RequestMethod.ALL},
      {path:'api/users/resetpassword', method: RequestMethod.ALL},
    ).forRoutes('api/users', 'api/bots')
  }
}
