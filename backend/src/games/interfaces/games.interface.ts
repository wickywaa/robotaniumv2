import mongoose from "mongoose";
import { IBot, IConnectedBot, IConnectedUser } from "src/bots/interfaces";

export type IGameModel = mongoose.Model<IGame, {}, IGameMethods>;


export interface ICreateGame {
  game: string;
}

export interface IGame {
  name:string,
  startTime: number,
  endTime: number, 
  players: string[] | mongoose.Types.ObjectId[],
  adminPlayerId: string,
  bots:IConnectedBot[];
  gameType: 'public' | 'private',
  reason: 'game' | 'practise' | 'test',
  chatEnabled: boolean;
  voiceChatEnabled: boolean;
  camerasEnabled: boolean;
  gamestopped: boolean;
  gamesStoppedBy: mongoose.Schema.Types.ObjectId | null;
  gameStoppedReason: string;
  gameinSeconds: number;
  chat: {
    userId: string;
    message: string;
  }[]
  notes: {
    adminId: string;
    note: string;
  }[]
}

export const emptyGame = {
  name: `test game ${new Date().getTime()}`,
  startTime: new Date().getTime(),
  endTime: null,
  players: [],
  adminPlayerId: '',
  bots: [],
  gameType: 'private',
  reason: 'test',
  chatEnabled: false,
  voiceChatEnabled: false,
  camerasEnabled: false,
  gamestopped: false,
  gamesStoppedBy: null,
  gameStoppedReason: '',
  gameinSeconds: 0,
  chat:[],
  notes: [],
}

export interface CreateGameDto {
  name?: string,
  startTime?: number,
  endTime?: number, 
  players: string[],
  adminPlayerId: string;
  bots: {
    _id: string,
    name: string,
    adminId: string,
    cockpits: {
      _id: string,
      player: {
        id: string | null,
        name: string | null
      }
      name?: string,
      sessionId?: string,
      accessToken?: string
    }[]
  }[];
  gameType?: 'public' | 'private',
  reason?: 'game' | 'practise' | 'test',
  chatEnabled?: boolean;
  voiceChatEnabled?: boolean;
  camerasEnabled?: boolean;
}

export interface IGameMethods {

}

