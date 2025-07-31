import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import mongoose, { Model } from 'mongoose';
import { IUserMethods, User, UserModel } from 'src/auth/interfaces';
var jwt = require('jsonwebtoken');

@Injectable()
export class AdminAuthMiddleware implements NestMiddleware {

  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<User, UserModel, IUserMethods>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const bearerToken = req.headers.authorization ?? '';
    if(!bearerToken.length) return (res.status(401).send());
    const token = bearerToken.replace('Bearer ', '') ?? '';
    var decoded = jwt.verify(token, 'supersecretpassword');
    const {_id:id, iat} = decoded;


    // time is currently at 5 minutes needs to ba 24 hours
    if(new Date().getTime() - (iat * 1000)  >= 86400000 ) return res.status(401).send({error:{message:'Token Expired'}});
    const _id = mongoose.Types.ObjectId.createFromTime(parseInt(id));
    const user = await this.userModel.findOne({_id:id});


    if(!user) return res.status(400).send({error:{message:' user not found'}});
    if(!user.isRobotaniumAdmin) return res.status(401).send({error:{message:'User is not Admin'}});

    req.body.user =  user;

    next();
  }
}