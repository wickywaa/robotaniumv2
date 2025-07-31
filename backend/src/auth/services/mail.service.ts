import { Injectable } from '@nestjs/common';
import {IEmailConfirmationDto, IForgotPasswordDto, User, UserType} from '../interfaces/user.interface';
const Mailjet = require('node-mailjet');

const mailjet = Mailjet.apiConnect(
  "example",
  "exammple",
);

@Injectable()
export class MailService {

  sendConfirmationLink = async(confirmationDto:IEmailConfirmationDto):Promise<boolean | void> => {

    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: 'gav@robotanium.com',
            Name: 'Confirm Email',
          },
          To: [
            {
              Email: confirmationDto.email,
            },
          ],
          TextPart: "Confirmation Code {{var:confirmationCode:\"confirm code\"}}",
					HTMLPart: "<h3>Confirmation Code {{var:confirmationCode:\"code\"}} </h3>",
          TemplateLanguage: true,
          Subject: 'Confirm Email address',
          Variables: {
            confirmationCode: confirmationDto.registrationToken,
          },
        },
      ], 
    })

   const response:Promise<boolean | void> = request
    .then(result => {
      return true
    })
    .catch(err => {
      return false;
    })

    return response
  }

  sendResetMailPasswordLink = async(forgotPasswordDto: IForgotPasswordDto): Promise<boolean | void> => {

    console.log('dto',forgotPasswordDto)
     const request = mailjet.post('send',{version:'v3.1'}).request({
      Messages: [
        {
          From: {
            Email: 'gav@robotanium.com',
            Name: 'Robotanium',
          },
          To: [
            {
              Email: forgotPasswordDto.email,
              token: forgotPasswordDto.code,
            },
          ],
          TextPart: "here is the email link {{var:day:\"monday\"}}",
					HTMLPart: "<h3>reset password code{{var:emailLink:\"link\"}} </h3>",
          TemplateLanguage: true,
          Subject: 'Reset Password ',
          Variables: {
            emailLink: `<p>forgot password code ${forgotPasswordDto.code}"></p>`,
          },
        }
      ]
     })

     const response:Promise<boolean | void> = request
    .then(result => {
      return true
    })
    .catch(err => {
      return false;
    })

    return response;
  }

  sendAdminInviteEmail = async(confirmationDto: IEmailConfirmationDto, password:string, userType:UserType): Promise<boolean | void> => {
    console.log('sending email')
    const request = mailjet.post('send',{version:'v3.1'}).request({
     Messages: [
       {
         From: {
           Email: 'gav@robotanium.com',
           Name: 'Robotanium',
         },
         To: [
           {
             Email: confirmationDto.email,
             token: confirmationDto.registrationToken
           },
         ],
         TextPart: `Your robotanium ${userType} account has been created; your password is {{var:password:\"link\"}} you will need to change your password on first login and you will need to activate your account within 24 hour`,
         HTMLPart: `<h3>Your robotanium ${userType} account has been created;</br> your password is{{var:password:\"link\"}} </br> click here to login and change your password {{var:emailLink:\"link\"}} </h3>`,
         TemplateLanguage: true,
         Subject: 'Robotanium Admin Account',
         Variables: {
           emailLink: `<p><a href="http://robotanium.com/login?&email=${confirmationDto.email}&password=${password}&token=${confirmationDto.registrationToken}">Login and Change Password</a></p>`,
           password,
           userType,
         },
       }
     ]
    })

    const response:Promise<boolean | void> = request
   .then(result => {
     return true
   })
   .catch(err => {
     return false;
   })

   return response;
 } 
}