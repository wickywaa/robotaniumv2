import { Server, Socket } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Inject, UseGuards } from '@nestjs/common';
import {AuthGuard} from '../../bots/guards/AuthGuards';
import mongoose, { Model } from 'mongoose';
import { IBot, IBotCockpits, IBotMethods, IBotModel, botAuth, userAuth,IConnectedBot, IConnectedUser,IConnectedCockpit, connectedClient  } from '../../bots/interfaces';
import { BotAuthService } from '../../bots/services/authService';
import { OpenTokService } from './openTokServices'
import { IUserMethods, User, UserModel } from 'src/auth/interfaces';
import { authDTOIsValid, botAuthValid, userAuthValid } from '../validators/socket.validator';
import { IGame, IGameMethods, IGameModel } from 'src/games/interfaces';
import { gamesProviders } from 'src/games/games.providers';
import { timeStamp } from 'console';
var jwt = require('jsonwebtoken');
import { GamesService } from 'src/games/services/games.service';

interface LiveGame extends IGame {
  id: string | mongoose.Types.ObjectId
}


@WebSocketGateway()
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  

  connectedBots: IConnectedBot[];
  connectedUsers: IConnectedUser[];
  connectedAdminUsers: IConnectedUser[];
  liveGames: LiveGame[]
  constructor(
    @Inject('BOT_MODEL')
    private botModel: Model<IBot, IBotModel, IBotMethods>,
    @Inject('USER_MODEL')
    private userModel: Model<User,UserModel, IUserMethods>,
    private readonly botsService: BotAuthService,
    private readonly openTokService: OpenTokService,
    @Inject('GAME_MODEL')
    private gameModel: Model<IGame, IGameModel, IGameMethods>,
    private readonly gameService: GamesService
  ) {
    this.connectedBots = []
    this.connectedUsers = []
    this.connectedAdminUsers = []
    this.liveGames = []
   }


  @WebSocketServer() io: Server;


  afterInit() {
    console.log('web sockets initiated first time')
  }

  OnGatewayInit() {
    console.log('hello there')
  }

  updateBotList = async(bot: IBot, id:string, socketId) => {
    const isBotConnected = this.connectedBots.find((connectedBot)=> connectedBot._id = id)

    const cameras: IConnectedCockpit[] = await  Promise.all(
      bot.cockpits.map(async(camera)=>{
        return  {
          _id: camera._id,
          sessionId: await this.openTokService.createSessionID().then((session:any)=>session.sessionId),
          name: bot.name,
          player: {
            id:null,
            name: null,
          },
          status: "online"
        }
      })
    )

   this.connectedBots =  this.connectedBots.filter((bot)=>bot._id !== id).concat({
      _id:id,
      name:bot.name,
      cockpits:cameras,
      socketId:socketId,
      adminId: ''
    })

  }

  handleConnection = async(socket ) => {

    const authData: connectedClient = socket.handshake.auth;


    if(!authDTOIsValid(authData)) return socket.disconnect();

  
    if( authData.type === 'bot') {
      const bot = await this.botModel.findOne({_id:authData.botId});
      if(!bot) return socket.disconnect();
      if(!botAuthValid(bot,authData))return false;
      const passwordMatches = await this.botsService.passwordMatches(authData.password,bot.token)
      if(!passwordMatches) return socket.disconnect();
      await this.updateBotList(bot, bot._id.toString(), socket.id);  

      this.emitAllConnections(socket)
    }


    if( authData.type === 'user') {

    if(!userAuthValid(authData)) return socket.disconnect();

    const user:User = await this.userModel.findOne({_id:authData.id});

    if(!user) return socket.disconnect();
    const connectedUser = {
      userName:user.userName,
      id: user._id.toString(),
      socketId:socket.id
    }

    if(user.isRobotaniumAdmin) {
      this.addToAdminUserArray(connectedUser);
      this.emitAllConnections(socket)
      return
    }

    this.addToUserArray(connectedUser)
    this.emitAllConnections(socket)

    }

    return true
  }

  validGame = async(gameId:string, socketId:string, userId):Promise<IGame | false > => {

    const foundGame = await this.gameService.findGameById(gameId);
    if(!foundGame) return false;

    const  playerInGame = foundGame.players.find((players)=> players.toString() === userId);

    if(!playerInGame) return false;

    return foundGame
  } 

  @SubscribeMessage('registerBot')
  handleMessage(socket: Socket, data: any) {
    
  }
   emitCredentialsToBotAndUser = async(credentials:any, bot:IConnectedBot, user:IConnectedUser) => {
    console.log('credentials', credentials)
    console.log('bot', bot)
    console.log('user', user)
    console.log('livebots', this.connectedBots)
    this.io.to(bot.socketId).emit('credentials', credentials)
    this.io.to(user.socketId).emit('credentials', credentials)
  }

  getCredentialsForBot = async(cockpits:IConnectedCockpit[], botId:string, botName:string) => {

    return Promise.all(cockpits.map(async(cockpit)=> {
      const sessionId = await this.openTokService.createSessionID().then((session:any)=>session.sessionId)
      return {
        botId: botId,
        botName: botName,
        cockpitId: cockpit._id,
        sessionId: sessionId,
        userToken: this.openTokService.createAccesstoken(sessionId),
        botToken: this.openTokService.createAccesstoken(sessionId)
      }
    }))
  }

  @SubscribeMessage('connectToGame')
  async handleconnectUserToGame (socket: Socket, data: {botId:string, cockpits:string[], gameId:string, usertoken:string}) {

    try {
    const gameAlreadylive = this.liveGames.find((game)=> game.id === data.gameId );
    const user = [...this.connectedUsers, ...this.connectedAdminUsers].find((user)=> user.socketId === socket.id);
    if(!gameAlreadylive && user ) {
       const game = await this.validGame(data.gameId,socket.id, user.id)
        if(game) {
          console.log('game', game)
          const botMatch = game.bots.find((bot)=> bot.cockpits.find((cockpit)=> cockpit.player.id === user.id ))

          console.log('botMatch', botMatch)
          const liveBot = this.connectedBots.find((bot)=> bot._id.toString() === botMatch._id.toString())

          console.log('liveBot', liveBot)
          if(!liveBot)  {
            throw new Error('Bot not found')
          }
          const cockpitsAssigned = botMatch.cockpits.filter((cockpit)=> cockpit.player.id === user.id);
          const credentials = await this.getCredentialsForBot(cockpitsAssigned, botMatch._id, botMatch.name)
          await this.emitCredentialsToBotAndUser(credentials, liveBot, user)
          console.log('pushing livegames', game)
          this.liveGames = [...this.liveGames, game as LiveGame]
        }
    
  }


    if(user && gameAlreadylive ) {

      const botMatch = gameAlreadylive.bots.find((bot)=> bot.cockpits.find((cockpit)=> cockpit.player.id === user.id ))
      const cockpitsAssigned = botMatch.cockpits.filter((cockpit)=> cockpit.player.id === user.id)  
      const credentials = await this.getCredentialsForBot(cockpitsAssigned, botMatch._id, botMatch.name)
      this.liveGames = [...this.liveGames.filter((game)=> game.id !== gameAlreadylive.id), gameAlreadylive]
    }

    return true
  } catch (error) { 
    console.log('error', error)
    this.io.to(socket.id).emit('error', error.message)
    return false
  } 
}


  addToAdminUserArray = (adminUser:IConnectedUser) =>
   this.connectedAdminUsers =  this.connectedAdminUsers.filter((user)=>adminUser.id !== user.id).concat(adminUser)

  addToUserArray = (connectedUser:IConnectedUser ) =>  
    this.connectedUsers = this.connectedUsers.filter((user)=>user.id !== connectedUser.id).concat(connectedUser)


  sendNewBotList = () => this.io.to('userRoom').emit('updatedBotList', this.connectedBots);
  sendNewUserList = () => this.io.to('userRoom').emit('updateUserList', this.connectedBots);


  handleDisconnect(socket: any) {

    const socketId = socket.id as string
    this.connectedBots = this.connectedBots.filter((bot)=> bot.socketId !== socketId);
    this.connectedUsers = this.connectedUsers.filter((user) => user.socketId !== socketId);
    this.connectedAdminUsers = this.connectedAdminUsers.filter((user)=> user.socketId !== socketId) 

    this.emitAllConnections(socket)

    //TODO send message to connected use to let them know bot was connected
  }

  emitAllConnections(socket:Socket) {
  /*   console.log('broadcasting',{
      bots: this.connectedBots.map((bot)=>{
        return {
          _id: bot._id,
          name: bot.name,
          cockpits: bot.cockpits.map((cockpit)=>{
            return{
              _id: cockpit._id,
              name: cockpit.name,
              player: cockpit.player,
              status: cockpit.status

            }
          })
        }
      }),
      admins: this.connectedAdminUsers,
      users: this.connectedUsers
    }) */

      this.io.emit('connections',{
        bots: this.connectedBots.map((bot)=>{
          return {
            _id: bot._id,
            name: bot.name,
            cockpits: bot.cockpits.map((cockpit)=>{
              return{
                _id: cockpit._id,
                name: cockpit.name,
                player: cockpit.player,
                status: cockpit.status
              }
            })
          }
        }),
      admins: this.connectedAdminUsers,
      users: this.connectedUsers
    })
  }

  // Example method to emit a message to a specific room

}
