
import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { User } from '../interfaces';
import { CreateUserDto } from '../dto';
var bcrypt = require('bcryptjs');

@Injectable()
export class UsersService {
  
  async hashPassword(password: string): Promise<string> {
     return await bcrypt.hash(password,8);
  }

  async passwordMatches(plainTextPassword: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hash)
  }
}