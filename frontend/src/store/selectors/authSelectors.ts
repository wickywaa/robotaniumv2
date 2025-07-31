import { RootState } from "../store";

export const selectUser =  (state: RootState) => state.auth.user;
export const isUserLoading = (state: RootState) => state.auth.loading;
export const registerEmailSent = (state: RootState) => state.auth.registerEmailSent;
export const selectErrors = (state: RootState) => state.auth.errors;