import { Controller, Inject, Injectable, Post, Body, Res, Get,Delete, UseInterceptors, UploadedFile, Param } from '@nestjs/common';
import { Response } from 'express';
import { Multer } from 'multer';
import { Model } from 'mongoose';
import { botProfile, IBot, IBotMethods, IBotModel, ICreateBotDto } from '../interfaces';
import { FileInterceptor } from '@nestjs/platform-express';
import { BotAuthService } from '../services/authService';

@Injectable()
@Controller('api/admin')

export class BotsUsersController {

  constructor(
    @Inject('BOT_MODEL')
    private botModel: Model<IBot, IBotModel, IBotMethods>,
    private  botAuthService : BotAuthService,
  ) { }

  @Post('bot')
  @UseInterceptors(FileInterceptor('file'))
  async createBot(@Body() body:ICreateBotDto,@UploadedFile() file: Express.Multer.File, @Res() res: Response) {


    const hashedPassword = await this.botAuthService.hashPassword(body.password);
    try {
      const newBot:Omit<IBot,'id'> = {
        name: body.name,
        token:  hashedPassword,
        cockpits: body.cockpits,
        imageUrl: body.imageUrl
      }

      console.log('newBot', newBot)
    
      const bot = new this.botModel(newBot);
      await bot.save();
      const bots = await this.botModel.find({});
      if(!bots) throw new Error('bots could not be loaded');
      return res.status(201).json({bots})
    }
    catch (e) {
      console.log('could not create bot')
      return res.status(500).send({ message: e.message });
    }
  }

  @Get('/bots')
  async getAllBots(@Res()res: Response) {
    try {
      const bots = await this.botModel.find();
      if(!bots) return res.status(404).json({
        message: {
          error: 'no bots found',
        }
      })
      return res.status(200).json({
       bots:  bots.map((bot)=>{
          return {
            _id: bot._id,
            name: bot.name,
            cockpits: bot.cockpits.map((cockpit)=>{
              return {
                name: cockpit.name,
                _id: cockpit._id,
              }
            })
          }

        })
      });
    }
    catch (e) {
      return res.status(500).send({ message: e.message });
    }
  }

  @Delete('bot/:id')
  async deleteUserById(@Res() response:Response, @Param('id') id: string) {
    
    try {
      const bot = await this.botModel.findByIdAndDelete(id);
      if(!bot) return response.status(400).json({error:'bot not found'})
      const bots = await this.botModel.find();

      if(bot && bots) return response.status(200).json({bots})
    }
    catch(e) {
      return response.status(500).json({message:'could not delete bot'})
    }

}
}
