import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
var jwt = require('jsonwebtoken');
import mongoose, { Model } from 'mongoose';
import { IUserMethods, User, UserModel } from '../../interfaces';

@Injectable()
export class UserAuthMiddleware implements NestMiddleware {

  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<User, UserModel, IUserMethods>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const bearerToken = req.headers.authorization ?? '';
    if(!bearerToken.length) return (res.status(401).send('no token'));
    const token = bearerToken.replace('Bearer ', '') ?? '';
    var decoded = jwt.verify(token, 'supersecretpassword');
    const tokenExpired = new Date().getTime() - (decoded.iat * 1000)  >= 600000;
    const user = await  this.userModel.findOne({_id: decoded._id});


    if(!user || !user.authTokens.includes(token) || tokenExpired) return res.status(401).send();
    if(new Date().getTime() - (decoded.iat * 1000)  >= 60000000 ) return res.status(401).send({error:{message:'Token Expired'}});

    req.body.user = user;
    next();
  }
}