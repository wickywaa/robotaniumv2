import { MailService } from './mail.service';
import { UsersService } from './users.service';

export * from './users.service';
export * from './mail.service';

export default [MailService, UsersService];