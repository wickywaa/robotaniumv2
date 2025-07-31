import { Body, Controller, Get, Delete, Inject, Injectable, Post, Res, Param, Put  } from '@nestjs/common';
import { Response } from 'express';
import { IUserMethods, User, UserModel, ILoginCredentials, IChangePassword, ICreateUser } from '../interfaces';
import mongoose, { Model } from 'mongoose';
import { MailService } from '../services';
import isEmail from 'validator/lib/isEmail';
var generator = require('generate-password');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

@Injectable()
@Controller('api/admin')

export class AdminUsersController {

  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<User, UserModel, IUserMethods>,
    private mailService: MailService,
  ) { }

  @Post('user')
  async createAdminuser(@Body()body: ICreateUser, @Res()response: Response) {

    const password = generator.generate({
      length: 16,
      numbers: true,
      uppercase: true,
      symbols: true,
      strict: true
    });
      
    const newUser: User = {
      password: password,
      userName: body.userName,
      email: body.email,
      isRobotaniumAdmin: body.userType === 'admin'? true : false,
      isPlayerAdmin: false,
      authTokens: [],
      isActive: true,
      isEmailVerified: true,
      registrationToken: null,
      passwordResetToken: null,
      changePassword: true,
      imgsrc: '',
      theme:'dark',
      rememberme:false,
    }

    try {

      const user  = new this.userModel(newUser);
      await user.save();

      const emailConfirmationDto = await user.generateConfirmEmailDto();
      const mailsent = await this.mailService.sendAdminInviteEmail(emailConfirmationDto, password, body.userType);

      if (!mailsent) {
        throw new Error('Unable to send email');
      }

      const users = await this.userModel.find();

      const filtered =  users.map(async (user)=>{
        const userprofile = user.getPublicProfile()
        return  userprofile
      })

      const userlist = await Promise.all(filtered)

      return response.status(201).json({users:userlist});

    } catch(e) {
      return response.status(500).send({ message: e.message });
    }
  }

  @Post('login')
  async adminLogin(@Body() body: ILoginCredentials, @Res() response: Response) {
    const { email, password  } = body;

    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        return response.status(401).send();
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch || !user.isRobotaniumAdmin) {
        return response.status(401).send();
      }
      const token = await user.generateAuthToken();
      const userProfile = await user.getPublicProfile();

      return response.status(201).send({
        user: userProfile,
        token,
      })

    }
    catch (e) {
      return response.status(500).send({
        error: {
          message: e.message,
        }
      })
    }
  }

  @Post('authenticate')
  async authenticate(@Body() body: {user:User},  @Res() response: Response) {

    const user = (await this.userModel.findOne({ email: body.user.email }));
    const token = await user.generateAuthToken();
    const publicProfile =  await user.getPublicProfile()

    try {
      if (!body.user) {
        return response.status(401).send();
      }

      return response.status(201).send({
        user: publicProfile,
        token,
      })

    }
    catch (e) {
      return response.status(500).send({
        error: {
          message: e.message,
        }
      })
    }
  }

  @Post('changepassword')
  async changePassword(@Body() body: IChangePassword, @Res() response: Response) {
    const { oldPassword, newPassword } = body;

    try {
      const user = await this.userModel.findOne({ email:body.user.email });
      const isMatch = await bcrypt.compare(oldPassword, user.password);

      if (!isMatch) return response.status(401).send({ error: { message: 'Password does not match' } });
      user.password = newPassword;
      await user.save();

      response.status(200).send({ message: 'hello' });

    } catch (e) {
      return response.status(500).send({ error: { message: e.message } })
    }
  }
  
  @Get('user/{id}')
  async getUserById(@Body() body: { user: User }, @Res() response: Response) {
    response.status(200).send({ message: 'hello' });
  }


  @Get('users')
  async getAllUsers(@Res()response:Response) {
    const users = await this.userModel.find({});
    const filteredUsers = users.map((user)=> user.getPublicProfile());
    const userlist = await Promise.all(filteredUsers)
    return response.status(200).json({ users: userlist });
  }
  
  @Delete('user/:id')
    async deleteUserById(@Res() response:Response, @Param('id') id: string) {
    
      try {
        const user = await this.userModel.findByIdAndDelete(id);
        if(!user) return response.status(400).json({error:'user not found'})
        const users = await this.userModel.find();

        if(user && users) return response.status(200).json({users})
      }
      catch(e) {
        return response.status(500).json({message:'could not delete user'})
      }
  }

  @Put('user/:id')
    async updateUser(@Body() body: { editedUser: User }, @Res() response: Response, @Param('id') id: string) {
      try {
        const user = await this.userModel.findByIdAndUpdate(id,{
          isActive: body.editedUser.isActive,
          isEmailVerified: body.editedUser.isEmailVerified,
          isPlayerAdmin: body.editedUser.isPlayerAdmin,
          isRobotaniumAdmin: body.editedUser.isRobotaniumAdmin,
          imgsrc: body.editedUser.imgsrc,
          userName: body.editedUser.userName
        });

        if(!user) return response.status(400).json({error:'user not found'})
        const users = await this.userModel.find();

        if(user && users) return response.status(200).json({users})
      }
      catch(e) {
        return response.status(500).json({message:'could not update user'})
      }
    }

    @Post('user/password/reset:id')
    async resetPassword ( @Res() response:Response, @Param('id') id:string) {
      const user = await this.userModel.findById(id);

      try {
        const user = await this.userModel.findOne({ _id:id });
        const code:string =  Math.floor(100000 + Math.random() * 900000).toString();
        const forgotPasswordDto = await user.generateForgotPasswordDto(code);
        console.log('dto generates',forgotPasswordDto);
        const mailsent = await this.mailService.sendResetMailPasswordLink({email:user.email,code});
        console.log(mailsent)
        await user.save();
  
        response.status(200).send({ message: 'hello' });
  
      } catch (e) {
        return response.status(500).send({ error: { message: e.message } })
      }
    }

}