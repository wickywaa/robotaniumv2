import { Controller, Post, Body, Res, Inject, Injectable, Req, Put } from '@nestjs/common';
import { Response, Request } from 'express';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dto';
import { IUserMethods, User, UserModel, ILoginCredentials, IEmailConfirmationDto, IForgotPasswordDto, IChangePassword, IChangeUserPassword } from '../interfaces';
import { MailService } from '../services';
var bcrypt = require('bcryptjs');

@Injectable()
@Controller('api/users')
export class UsersController {

  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<User, UserModel, IUserMethods>,
    private mailService: MailService,
  ) { }


  @Post('user')
  async registeruser(@Body() createUserDto: CreateUserDto, @Res() response: Response) {

    const newUser: User = {
      ...createUserDto,
      password: createUserDto.password,
      userName: "Anonymous User",
      isRobotaniumAdmin: false,
      isPlayerAdmin: false,
      authTokens: [],
      isActive: true,
      isEmailVerified: false,
      registrationToken: null,
      passwordResetToken: null,
      changePassword: false,
      imgsrc: '',
      rememberme:false,
      theme: 'dark'
    }

    try {
      const user = new this.userModel(newUser);
      await user.save();
      const emailConfirmationDto = await user.generateConfirmEmailDto();
      const mailsent = this.mailService.sendConfirmationLink(emailConfirmationDto);
      if (!mailsent) {
        throw new Error('Unable to send email');
      }

      return response.status(201).send();
    }
    catch (e) {
      return response.status(500).send({ message: e.message });
    }
  }

  @Post('login')
  async login(@Body() credentials: ILoginCredentials, @Res() response: Response) {

    try {
      const user = await this.userModel.findOne({ email: credentials.email });
      if (!user) {
        throw new Error('Unable to login with these credentials');
      }
      const isMatch = await bcrypt.compare(credentials.password, user.password);
      if (!isMatch) {
        return response.status(401).send();
      }
      const token = await user.generateAuthToken();
      const userProfile = await user.getPublicProfile();

      if(!user.isEmailVerified && user.registrationToken?.length) {
        const unverifiedUser: Partial<User>= {
          email:user.email,
          isEmailVerified: user.isEmailVerified,
        }

        return response.status(200).send({
          user: unverifiedUser,
          token:"",
        })
      }

      return response.status(201).send({
        user: userProfile,
        token,
      })

    }
    catch (e) {
      return response.status(500).send({ error: e.message })
    }
  }

  @Post('logout')
  async logout(@Body() body:{user:User},@Req()req:Request, @Res() response: Response) {

    try {
      const user = await this.userModel.findOne({ email: body.user.email });
      const authToken = req.headers.authorization.replace('Bearer ', '');

      if (!user) {
        throw new Error('Unable to logout with these credentials');
      }

      user.authTokens = user.authTokens.filter((token)=> token !== authToken);
      await user.save()
      
      return response.status(200).send()

    }
    catch (e) {
      return response.status(500).send({ error: e.message })
    }
  }

  @Post('confirm')
  async confirmEmail(@Body() body: IEmailConfirmationDto, @Res() response: Response) {

    const { email = '', registrationToken = '' } = body;

    try {
      const user = await this.userModel.findOne({ email });
      const emailRegistrationTokenMatch = await user.confirmEmail(body);
      if (!emailRegistrationTokenMatch) {
        return response.status(401).send({ error: 'unauthorized' });
      }

      const token = await user.generateAuthToken();
      const userProfile = await user.getPublicProfile();

      return response.status(200).send({
        user: userProfile,
        token,
      })

    }
    catch (e) {
      return response.status(500).send({ error: e.message })
    }
  }

  @Post('resetpassword') 
  async resetPassword(@Body()body:{email:string}, @Res() response: Response) {
      const {email} = body;

      try{
        const user = await this.userModel.findOne({email});
        if (!user) return response.status(200).send();
        if(user.isRobotaniumAdmin) return response.status(401).send();
        const code:string =  Math.floor(100000 + Math.random() * 900000).toString();
        const forgotPasswordTokenSet:IForgotPasswordDto = await user.generateForgotPasswordDto(code);
        if(!forgotPasswordTokenSet){
          return response.status(500).send();
        }
        const mailsent = this.mailService.sendResetMailPasswordLink({email,code});
      if (!mailsent) {
        throw new Error('Unable to send email');
      }
      return response.status(200).send();
      }
      catch(e) {
        return response.status(500).send();
      }
  }

  @Post('confirmresetpassword')
  async confirmResetPassword(@Body()body:IForgotPasswordDto, @Res() response: Response) {
    const { email } = body;

    try {
      const user = await this.userModel.findOne({ email });
      if(!user) return response.status(401);
   
    
      const forgotPasswordMatch = await bcrypt.compare(user.passwordResetToken, body.code)
      if (!forgotPasswordMatch) return response.status(401);

      user.registrationToken = null;
      user.isEmailVerified = true;
      await user.save();

      const token = await user.generateAuthToken();
      const userProfile = await user.getPublicProfile();

      return response.status(200).send({
        user: userProfile,
        token,
      })
    }

    catch(e) {
      return response.status(500).send();
    }
  }

  @Post('changepassword')
  async changePassword(@Body()body:IChangeUserPassword, @Res()response: Response) {

    const { oldPassword, newPassword} = body;

    try {
      const user = await this.userModel.findOne({email:'test@gmail.com'});
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if(!isMatch) return response.status(401).send();
      
      user.password = newPassword;
      await user.save();
    }
    catch(e){
      response.send({error:{
        message:e.message,
      }})
    }
  }

  //Todo name needs to change
  @Post('changeimage')
  async changeUser(@Body()body:{email:string, imgsrc:string, token:string},@Res()response: Response){
  
    try {
      const user = await this.userModel.findOne({email:body.email});
      if(!user) return response.status(401).send();
      if(!user.authTokens.find((token) => token === body.token)) return response.status(401).send();

      user.imgsrc = body.imgsrc;
      await user.save();
      return response.status(201).send();

    }
    catch(e) {
      return response.status(500).send({error:{message:e.message}});
    }
  }

}
