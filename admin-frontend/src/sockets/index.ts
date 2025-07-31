import { io, Socket } from 'socket.io-client';
import { store } from '../store/store';
import { IRTCCredentials } from '../models';
import { handleConnection, handleDisconnect } from './handleConnection';
import { handleUserListUpdate } from './userLists';
import { handleRTCCredentials } from './handlecredentials';



export class WebSocketServer  {

  socket:Socket | null
  credentials: IRTCCredentials | null    
  constructor ( ) {
      this.socket = null
      this.credentials = null
  }

   
  connectsocket = (userId: string,usertoken: string):void => {

    console.log('connecting now', userId, usertoken)

    const socket = io('http://localhost:47000',{
      auth: {
        type:'user',
        id:userId,
        token: usertoken
      },
      autoConnect:false,
    });
  
    if(!userId.length || !usertoken.length) return;
    console.log('should connect now')
  
    socket.connect();
  
    socket.on('connect',handleConnection)
    socket.on('disconnect', handleDisconnect)
    socket.on('connections',handleUserListUpdate)
    socket.on('credentials', handleRTCCredentials)

    this.socket = socket

  }

  connectToGame = (gameId: string, usertoken:string) => {

    console.log('trying to connect to game', gameId, usertoken)

    if(this.socket === null ) return;

    this.socket.emit('connectToGame',{ gameId, usertoken})
  }

}


export const webSocketServer = new WebSocketServer()


// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:46000'
// ';