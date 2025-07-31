import { RootState } from "../store";

export const selectCreateBot =  (state: RootState) => state.botSlice.createBot;
export const selectShowCreateBot = (state:RootState) => state.botSlice.showCreateBot;
export const selectBots = (state: RootState) => state.botSlice.bots;
export const selectOnlinebots = (state: RootState) => state.botSlice.onlineBots;
export const selectCredentials = (state: RootState) => state.botSlice.credentials;