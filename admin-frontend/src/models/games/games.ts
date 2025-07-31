import { IConnectedBot } from "../Bots";

export interface IGame {  
  _id: string;
  name:string;
  startTime: number;
  endTime: number | null;
  players: string[];
  adminPlayerId: string;
  bots: IConnectedBot [];
  gameType: 'public' | 'private';
  reason: 'game' | 'practise' | 'test';
  chatEnabled: boolean;
  voiceChatEnabled: boolean;
  camerasEnabled: boolean;
  gamestopped: boolean;
  gamesStoppedBy: string;
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

export const emptyGame: IGame = {   
  _id: '',
  name: `test game ${new Date().getTime()}`,
  startTime: new Date().getTime(),
  endTime: null,
  players: [],
  adminPlayerId: '',
  bots: [],
  gameType: 'private',
  reason: 'test',
  chatEnabled: true,
  voiceChatEnabled: true,
  camerasEnabled: true,
  gamestopped: false,
  gamesStoppedBy: '',
  gameStoppedReason: '',
  gameinSeconds: 0,
  chat:[],
  notes: [],
}

export interface ICreateGameDto {
  name:string,
  startTime: number,
  endTime: number, 
  players: string[],
  adminPlayerId: string;
  bots: {
    _id: string,
    cockpits: {_id: string, userId: string}[]
  }[];
  gameType: 'public' | 'private',
  reason: 'game' | 'practise' | 'test',
  chatEnabled: boolean;
  voiceChatEnabled: boolean;
  camerasEnabled: boolean;
}