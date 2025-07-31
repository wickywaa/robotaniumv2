import { RootState } from "../store";

export const selectUser =  (state: RootState) => state.auth.user;
export const selectErrors = (state: RootState) => state.auth.errors;
export const selectLoggedInUser = (state: RootState) => state.auth.user;