import { Connection } from 'mongoose';
import { UserSchema } from '../schemas/users.schema'
import { User, UserModel } from '../interfaces';

export const usersProviders = [
  {
    provide: 'USER_MODEL',
    useFactory: (connection: Connection) => connection.model<User, UserModel>('User', UserSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];