import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { emptyGame, IBot, IConnectedBot, ICreateBotDTo, ICreateGameDto, IGame } from '../../models';

export interface IGamesReducer {
  createGame: {
    game: IGame
    image: string | null;
    name: string;
  },
  games: IGame[],
  showCreateGameModal: boolean;
  showEditGameModal: boolean;
  selectedGameRowId: string;
  isLoading: boolean;
  cockpitGame: IGame | null;
  onlineBots: IConnectedBot[];
  isLive: boolean;
}

export const initialGameState: IGamesReducer = {
  createGame: {
    game: emptyGame,
    image: '',
    name: '',
  },
  games: [],
  showCreateGameModal: false, 
  selectedGameRowId: '',
  showEditGameModal: false,
  isLoading: false,
  onlineBots: [],
  cockpitGame: null,
  isLive: false
};

// Add interface for the create game payload
interface CreateGamePayload {
  game: IGame;
  isLive?: boolean;
}

export const GameSlice = createSlice({
  name: "gameSlice",
  initialState: initialGameState,
  reducers: {
    setShowCreateGameModal: (state, action:PayloadAction<boolean>) => ({ ...state, showCreateGameModal: action.payload }),
    createGameAttempt: (state, action: PayloadAction<CreateGamePayload>) => ({ 
      ...state, 
      isLoading: true,
      isLive: action.payload.isLive || false 
    }),
    createGameFailed: (state) => ({...state, isLoading: false }),
    createGameSuccess: (state, action: PayloadAction<IGame[]>) => ({ ...state, games: action.payload, showCreateGame:false, isLoading:false }),
    updateCreateGame: (state, action:PayloadAction<IGame>) => ({...state,createGame:{...state.createGame,game:action.payload} , showCreateGameModal:false}),
    getGamesAttempt: (state) => ({...state, isLoading: true}),
    getGamesSuccess: (state, action: PayloadAction<IGame[]>) => ({...state, games: action.payload, isLoading: false}),
    getGamesFailed: (state) => ({...state, isLoading: false}),
    deleteGameAttempt: (state, action: PayloadAction<string>) => ({ ...state, isLoading: true }),
    deleteGameSuccess: (state, action: PayloadAction<IGame[]>) => ({ 
      ...state, 
      games: action.payload, 
      isLoading: false 
    }),
    deleteGameFailed: (state) => ({ ...state, isLoading: false }),
    setSelectedGameRowId: (state, action: PayloadAction<string>) => ({ ...state, selectedGameRowId: action.payload }),
    showEditGameModal: (state, action: PayloadAction<boolean>) => ({ ...state, showEditGameModal: action.payload }),
    setSelectedGame: (state, action: PayloadAction<IGame>) => ({ ...state, selectedGame: action.payload }),
    setLiveGame: (state, action:PayloadAction<IGame>) => ({...state, cockpitGame: action.payload}),
    createLiveGameAttempt: (state, action: PayloadAction<IGame>) => ({ 
      ...state, 
      isLoading: true,
      isLive: true 
    }),
    createLiveGameSuccess: (state, action: PayloadAction<IGame[]>) => ({ 
      ...state, 
      games: action.payload, 
      showCreateGame: false, 
      isLoading: false,
      isLive: false 
    }),
    createLiveGameFailed: (state) => ({
      ...state, 
      isLoading: false,
      isLive: false
    }),
  }
});

export const {
  setShowCreateGameModal,
  createGameAttempt,
  createGameFailed,
  createGameSuccess,
  updateCreateGame,
  getGamesAttempt,
  getGamesSuccess,
  getGamesFailed,
  deleteGameAttempt,
  deleteGameSuccess,
  deleteGameFailed,
  setSelectedGameRowId,
  setSelectedGame,
  showEditGameModal,
  createLiveGameAttempt,
  createLiveGameSuccess,
  createLiveGameFailed,
  setLiveGame
} = GameSlice.actions

