export interface ILoginCredentials {
  email: string;
  password: string;
  token?:string;
}

export interface IRegisterCredentials {
  userName?: string;
  email: string;
  password: string;
}

export interface IConnectedUser {
  id: string,
  socketId: string,
  userName: string,
}

export interface RTCCredentials {
  botId: string,
  botName: string,
  cockpitId: string,
  sessionId: string,
  userToken: string,
}
