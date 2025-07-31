import { Body, Controller, Get, Inject, Injectable, Post, Res, Delete, Param } from '@nestjs/common';
import { request, Response } from 'express';
import { CreateGameDto, ICreateGame, IGame, IGameMethods, IGameModel } from '../interfaces/games.interface';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { IUserMethods, User, UserModel } from 'src/auth/interfaces';
import { IBot, IBotMethods, IBotModel, IConnectedBot } from 'src/bots/interfaces';
import { BotsSChema } from 'src/bots/bots.schema';

@Injectable()
@Controller('api/admin')
export class AdminGamesController {

  constructor(
    @Inject('GAME_MODEL')
    private gameModel: Model<IGame, IGameModel, IGameMethods>,
    @Inject('USER_MODEL')
    private userModel: Model<User, UserModel, IUserMethods>,
    @Inject('BOT_MODEL')
    private botModel: Model<IBot, IBotModel, IBotMethods>,
  ) { }

  @Post('game')
  async createGame(@Body() body: CreateGameDto, @Res() response: Response) {


    const getUniqueUserIds = async () => {
      const ids = body.bots.map((bot) => 
        bot.cockpits.map((cockpit) => cockpit.player.id)
      ).flat();

      const uniqueIds = ids.filter((id, key, arr) => arr.indexOf(id) === key && id !== '');
      const convertedIds = await Promise.all(uniqueIds.map(async(id) => await new mongoose.Types.ObjectId(id)));
      return convertedIds;

    }


    try {
        
      const bots = await this.botModel.find({ _id: { $in: body.bots.map((bot) => bot._id) } });

      const botsArray: IConnectedBot[] = bots.map((dbbot) => {
        const requestBot = body.bots.find((reqbot) => reqbot._id === dbbot._id.toString());
  
        return {
          _id: dbbot._id.toString(),
          name: dbbot.name,
          socketId: '',
          adminId:  body.bots.find((bot) => bot._id === dbbot._id.toString()).adminId,
          cockpits: requestBot.cockpits.map((cockpit) => ({
            _id: cockpit._id,
            name: cockpit.name || '',
            sessionId: cockpit.sessionId || '',
            accessToken: cockpit.accessToken || '',
            player: {
              id: cockpit.player.id || '',
              name: cockpit.player.name || ''
            },
            status: 'offline'
          }))
        }
      });

      const newGame: IGame = {
        name: `robo game ${new Date().getTime()}`,
        startTime: new Date().getTime(),
        endTime: null,
        players: await getUniqueUserIds(),
        adminPlayerId: body.adminPlayerId,
        bots: botsArray,
        gameType: body.gameType ?? 'private',
        reason: body.reason ?? 'test',
        chatEnabled: body.chatEnabled ?? false,
        voiceChatEnabled: body.voiceChatEnabled ?? false,
        camerasEnabled: body.camerasEnabled ?? false,
        gamestopped: false,
        gamesStoppedBy: null,
        gameStoppedReason: '',
        gameinSeconds: 0,
        chat: [],
        notes: [],
      }

      const game = await new this.gameModel(newGame)
      console.log('game', game)

      await game.save();
      const newGames = await this.gameModel.find();
      console.log('newGames', newGames)
      response.status(200).json({
        newGames
      })


    } catch (e) {
      response.status(400).json({ error: e })
    }


  }

  @Get('games')

  async getAllGames(@Res() response: Response) {

    const games = await this.gameModel.find();


    return response.status(200).json({
      games
    });

  }

  @Delete('games')
  async deleteAllGames(@Res() response: Response) {

    const games = await this.gameModel.find()

    await games.find(async (game) => {

      await this.gameModel.findByIdAndDelete(game._id)
    });

    const newGames = await this.gameModel.find()


    return response.status(200).json({
      newGames
    });

  }

  @Delete('game/:id')
  async deleteGameById(@Res() response: Response, @Param('id') id: string) {
  

    try {
      const game = await this.gameModel.findByIdAndDelete(id);
      const games = await this.gameModel.find();


    return response.status(200).json({
      games
      });
    } catch (e) {
      console.log('error', e)
      response.status(400).json({ error: e })
    }

  }
}

