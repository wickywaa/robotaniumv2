import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { IAuthError, ILoggedInUser, ErrorType } from "../../models";
import { ILoginCredentials } from "../../models/auth/credentials";

interface IUserReducer {
  user: ILoggedInUser | null;
  loading: boolean;
  registerEmailSent: boolean;
  errors: IAuthError[];
}

const initialState: IUserReducer = {
  user: null,
  loading: false,
  registerEmailSent: false,
  errors:[]
};

export const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    requestLogin: (state, _: PayloadAction<ILoginCredentials>) => ({ ...state, loading: true, user: null }),
    loginFailed: (state) => ({ ...state, loading: false, user: null }),
    loginSuccess: (state, action: PayloadAction<ILoggedInUser>) => ({ ...state, loading: false, user: action.payload }),
    logoutAttempt: (state,) => ({ ...state, loading: true}),
    logout: (state,) => ({ ...state, loading: false, user: null }),
    addError: (state, action: PayloadAction<IAuthError>) => {
      if(state.errors.find((e)=>e.message ===action.payload.message && e.type === action.payload.type)) {
        return {...state,}
      }
      return {...state,errors:[...state.errors,action.payload]}
    },
    removeErrorByType: (state, action: PayloadAction<ErrorType>) => ({...state, errors:state.errors.filter((error)=> error.type !== action.payload)}),
    resetErrors: (state) => ({...state, errors: []}),
  },
});

export const { 
  requestLogin, 
  loginFailed, 
  loginSuccess, 
  logoutAttempt,
  logout,
  addError,
  removeErrorByType,
  resetErrors
} = authSlice.actions;
