import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';;
var bcrypt = require('bcryptjs');

export class BotAuthService {

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password,8);
 }

 async passwordMatches(plainTextPassword: string, hash: string): Promise<boolean> {
   return bcrypt.compare(plainTextPassword, hash)
 }
}