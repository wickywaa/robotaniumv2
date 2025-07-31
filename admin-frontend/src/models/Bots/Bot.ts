import { Session } from "inspector";
import { ILoggedInUser } from "../User";

interface camera{
    _id:string;
    name:string;
}

export interface IBot {
  _id: string,
  name: string;
  img: string;
  imageUrl: string;
  cockpits: camera[]
}

export interface ICockpit {
  name:string,
  sessionId: string
}

export interface ICreateBotDTo {
  name: string;
  image?: File;
  password: string;
  cockpits: ICockpit[];
  botImageUrl: string;
}

export interface IBotCockpits {
  name: string;
  sessionId: string;
}


export interface IConnectedCockpit extends IBotCockpits {
  _id:string,
  player: {
    id: string | null,
    name: string | null,
  }
  status: 'online' | 'offline' | 'occupied',  
}


export const emptyConnectedCokpit:IConnectedCockpit = {
  _id:'',
  player: {
    id: null,
    name: null,
  },
  status: 'offline', 
  name:'',
  sessionId:''
}

 export interface IConnectedBot {
  _id: string,
  name: string,
  cockpits: IConnectedCockpit[],
  socketId: string,
  adminId: string
}

export interface IRTCCredentials {
  botId: string,
  botName: string,
  cockpitId: string,
  sessionId: string,
  userToken: string,
  botToken: string
}