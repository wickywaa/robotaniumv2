import {RootState} from '../store';

export const selectBotsLoading = (state: RootState) => state.botSlice.loading;
export const selectBots = (state: RootState) => state.botSlice.bots;