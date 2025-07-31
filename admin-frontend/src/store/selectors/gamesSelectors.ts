import { RootState } from "../store";

export const selectShowCreateGameModal =  (state: RootState) => state.gameSlice.showCreateGameModal
export const selectShowCreateGame = (state:RootState) => state
export const selectGames = (state: RootState) => state.gameSlice.games
export const selectCreateGame = (state: RootState) => state.gameSlice.createGame;
export const selectSelectedGameRowId = (state: RootState) => state.gameSlice.selectedGameRowId;
export const selectShowEditGameModal = (state: RootState) => state.gameSlice.showEditGameModal;
export const selectSelectedGame = (state: RootState) => state.gameSlice.selectedGameRowId;
export const selectCockpitGame = (state: RootState) => state.gameSlice.cockpitGame


export const gameSelectors = {
  selectCockpitGame,
  selectCreateGame,
  selectGames,
  selectSelectedGame,
  selectShowCreateGame,
  selectShowEditGameModal,
  selectSelectedGameRowId
}