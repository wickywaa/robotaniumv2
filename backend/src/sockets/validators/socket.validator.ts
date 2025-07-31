import { User } from "src/auth/interfaces";
import { botAuth, connectedClient, IBot, userAuth } from "../../bots/interfaces";
var jwt = require('jsonwebtoken');

export const authDTOIsValid = (authData:connectedClient): { message:string, valid:boolean} => {


  if(!authData) return {message:'Invalid auth data', valid:false};
  if(!authData?.type) return {message:'Invalid auth data', valid:false};
  if(authData.type !== 'bot' && authData.type !== 'user') return {message:'Invalid auth data', valid:false};
  if(authData.type === 'bot') return isBotAuthDtoValid(authData);
  if(authData.type === 'user') return isUserAuthDtoValid(authData)

    return {message:'Valid auth data', valid:true}
}

export const isUserAuthDtoValid = (user: userAuth):{message:string, valid:boolean} => {

 if(!user.id) return {message:'Invalid user id', valid:false}; 
 if(user.id.length < 5) return {message:'Invalid user id', valid:false};
 if(user.token?.length <5) return {message:'Invalid user token', valid:false};
 return {message:'Valid user', valid:true}
}

export const isBotAuthDtoValid = (bot: botAuth):{message:string, valid:boolean}	 => {

    if(!bot.botId?.length) return {message:'Invalid bot id', valid:false}     ;
  if(!bot.camId?.length) return {message:'Invalid camera id', valid:false}  ;
  if(!bot.name?.length) return {message:'Invalid bot name', valid:false};
  if(!bot.password?.length) return {message:'Invalid bot password', valid:false};
  if(!bot.camName?.length) return {message:'Invalid camera name', valid:false};
  return {message:'Valid bot', valid:true};
}

export const userAuthValid = (authData:userAuth):{message:string, valid:boolean} => {
  var decoded = jwt.verify(authData.token, 'supersecretpassword');
  const {_id:id, iat} = decoded;
  if((new Date().getTime() - (iat * 1000))  >= 3600000 ) return {message:'Invalid user token', valid:false} ;
  return {message:'Valid user', valid:true}
}

export const botAuthValid = (bot:IBot, authData:botAuth):{message:string, valid:boolean} => {

  if(bot.id !== authData.botId) return {valid:false, message:'Invalid bot id'};
  const camera = bot.cockpits.find((camera)=>camera.name);
  if(!camera) return {valid:false, message:'Invalid camera'};
  if(bot.name !== authData.name) return {valid:false, message:'Invalid bot name'};
  return {valid:true, message:'Valid bot'};   
}
