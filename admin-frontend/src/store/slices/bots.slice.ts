import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IBot, IConnectedBot, ICreateBotDTo, IRTCCredentials } from '../../models';

export interface IBotReducer {
  createBot: {
    image: string | null;
    name: string;
  },
  bots: IBot[],
  showCreateBot: boolean;
  isLoading: boolean;
  onlineBots: IConnectedBot[],
  credentials: IRTCCredentials[] | null
}

export const initialState: IBotReducer = {
  createBot: {
    image: '',
    name: ''
  },
  bots: [],
  showCreateBot:false,
  isLoading:false,
  onlineBots: [],
  credentials: null
};


export const BotSlice = createSlice({
  name: "botSlice",
  initialState,
  reducers: {
    setBotsListAttempt: (state) => ({ ...state, isLoading:true }),
    setBotsListFailed: (state) => ({ ...state, isLoading:false }),
    setBotsListSuccess: (state, action:PayloadAction<{bots:IBot[]}>) => ({ ...state, bots:action.payload.bots, isLoading:false }),  
    setCreateBotName: (state,action: PayloadAction<string>) => ({ ...state, createBot: {...state.createBot,name:action.payload} }),
    setCreateBotImage: (state, action: PayloadAction<string>) => ({ ...state, createBot: {...state.createBot,name:action.payload} }),
    setShowCreateBot: (state, action: PayloadAction<boolean>) => ({ ...state, showCreateBot:action.payload }),
    createBotAttempt: (state, action: PayloadAction<ICreateBotDTo>) => ({ ...state, isLoading: true }),
    createBotFailed: (state) => ({...state, isLoading: false }),
    createBotSuccess: (state, action: PayloadAction<IBot[]>) => ({ ...state, bots: action.payload, showCreateBot:false, isLoading:false }),
    deleteBotAttempt: (state, action:PayloadAction<string>) =>({...state}),
    deleteBotFailed: (state) =>({...state, isLoading: true}),
    deleteBotSuccess: (state, action:PayloadAction<IBot[]>) =>({...state,bots:action.payload, isLoading: false}),
    setOnlineBots: (state, action: PayloadAction<{bots: IConnectedBot[]}>) => ({...state, onlineBots: action.payload.bots}),
    setCredentials: (state, action: PayloadAction<IRTCCredentials[]>) => ({...state, credentials: action.payload})
  }
})

export const {
  setCreateBotImage,
  setCreateBotName,
  setShowCreateBot,
  createBotAttempt,
  createBotFailed,
  createBotSuccess,
  setBotsListAttempt,
  setBotsListFailed,
  setBotsListSuccess,
  deleteBotAttempt,
  deleteBotFailed,
  deleteBotSuccess,
  setOnlineBots,
  setCredentials
} = BotSlice.actions

