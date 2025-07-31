import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { IGame, IGameModel, IGameMethods } from '../interfaces/games.interface';

@Injectable()
export class GamesService {
  constructor(
    @Inject('GAME_MODEL')
    private gameModel: Model<IGame, IGameModel, IGameMethods>,
  ) {}

  async findGameById(id: string): Promise<IGame | null> {
    return this.gameModel.findById(id).select({
      name: 1,
      startTime: 1,
      endTime: 1,
      players: 1,
      adminPlayerId: 1,
      bots: 1,
      gameType: 1,
      reason: 1,
      chatEnabled: 1,
      voiceChatEnabled: 1,
      camerasEnabled: 1,
      gamestopped: 1,
      gamesStoppedBy: 1,
      gameStoppedReason: 1,
      gameinSeconds: 1,
      chat: 1,
      notes: 1
    }).lean();
  }

  async findAllGames(): Promise<IGame[]> {
    return this.gameModel.find().select({
      name: 1,
      startTime: 1,
      endTime: 1,
      players: 1,
      adminPlayerId: 1,
      bots: 1,
      gameType: 1,
      reason: 1,
      chatEnabled: 1,
      voiceChatEnabled: 1,
      camerasEnabled: 1,
      gamestopped: 1,
      gamesStoppedBy: 1,
      gameStoppedReason: 1,
      gameinSeconds: 1,
      chat: 1,
      notes: 1
    }).lean();
  }
} 