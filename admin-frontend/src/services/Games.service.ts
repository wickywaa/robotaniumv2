import { IGame } from "../models";
import { adminBaseAxios } from "./Base.service";

export class GamesService {

    createGame = async (game: IGame): Promise<IGame[]> => {
        return await adminBaseAxios.post<{ newGames: IGame[] }>('/game', game).then((response) => {

          console.log('response', response)
            return response.data.newGames;
        })
    }

    deleteGameById = async (id: string): Promise<IGame[]> => {
        return await adminBaseAxios.delete<{ games: IGame[] }>(`/game/${id}`).then((response) => {
            return response.data.games;
        })
    }

    getGames = async (): Promise<IGame[]> => {
        return await adminBaseAxios.get<{ games: IGame[] }>('/games').then((response) => {
            return response.data.games;
        })
    }

    getGameById = async (id: string): Promise<IGame[]> => {
        return await adminBaseAxios.get<{ game: IGame[] }>(`/game/${id}`).then((response) => {
            return response.data.game;
        })
    } 

    updateGame = async (game: IGame, id: string): Promise<IGame[]> => {
        return await adminBaseAxios.put<{ games: IGame[] }>(`/game/${id}`, game).then((response) => {
            return response.data.games;
        })
    } 
    
    
}

export const gamesService = new GamesService()
