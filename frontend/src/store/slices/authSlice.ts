import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { ILoggedInUser } from "../../models";
import { IConfirmEmailCredentials, ILoginCredentials, IRegisterCredentials } from "../../models/auth";

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
    loginEmailUnverified: (state) => ({ ...state, loading: false, user: null, registerEmailSent:true }),
    loginSuccess: (state, action: PayloadAction<ILoggedInUser>) => ({ ...state, loading: false, user: action.payload }),
    registerUserAttempt: (state, action:PayloadAction<IRegisterCredentials>) => ({...initialState, loading:true}),
    registerUserSuccess: (state ) => ({...state, registerEmailSent:true,loading:false }),
    registerUserFailed: (state,) => ({...initialState }),
    confirmEmailAttempt: (state, _: PayloadAction<IConfirmEmailCredentials>) => ({ ...state, loading: true, user: null }),
    confirmEmailSuccess: (state, action: PayloadAction<ILoggedInUser>) => ({ ...state, loading: true, user: action.payload }),
    confirmEmailFailed: (state) => ({...state, registerEmailSent:true,loading:false }),
    logoutAttempt: (state,) => ({ ...state}),
    logout: (state,) => ({ ...state, loading: false, user: null }),
    addError: (state, action: PayloadAction<IAuthError>) => {
      if(state.errors.find((e)=>e.message ===action.payload.message && e.type === action.payload.type)) {
        return {...state,}
      }
      return {...state,errors:[...state.errors,action.payload]}
    },
    removeErrorByType: (state, action: PayloadAction<ErrorType>) => ({...state, errors:state.errors.filter((error)=> error.type !== action.payload)}),
    resetErrors: (state) => ({...state, errors: []}),
    checkuserNameAttempt: (state, action:PayloadAction<string>) =>({...state, isLoading:true}),
    checkUserNameFailed: (state, ) => ({...state, isLoading:false, errors: [...state.errors,{type:'userName',message:'Username already Taken'}]}),
    checkUserNameSuccess: (state, ) => ({...state, isLoading: false, errors: state.errors.filter((error)=>error.type !== 'userName')}),
    setResetPasswordTokenAttempt: (state, action: PayloadAction<string>) => ({...state, isLoading: true}),
    setResetPasswordTokenFailed: (state) => ({...state, isLoading: false}),
    setResetPasswordTokenSuccess: (state) => ({...state, isLoading: false, registerEmailSent:true}),
    resendConfirmationCodeAttempt: (state, action: PayloadAction<string>) => ({...state, isLoading: true}),
    resendConfirmationCodeSuccess: (state) => ({...state, isLoading: false, registerEmailSent:true}),
    resendConfirmationCodeFailed: (state) => ({...state, isLoading: false}),
  },
});

export const { 
  requestLogin, 
  loginFailed, 
  loginSuccess, 
  logoutAttempt,
  logout,
  registerUserAttempt, 
  registerUserFailed, 
  registerUserSuccess, 
  confirmEmailAttempt,
  confirmEmailFailed,
  confirmEmailSuccess,
  addError,
  removeErrorByType,
  resetErrors,
  setResetPasswordTokenAttempt,
  setResetPasswordTokenFailed,
  setResetPasswordTokenSuccess,
  resendConfirmationCodeAttempt
} = authSlice.actions;
