import { PayloadAction } from "@reduxjs/toolkit";
import { put, takeEvery } from "redux-saga/effects";
import { IConfirmEmailCredentials, ILoggedInUser, ILoginCredentials, IRegisterCredentials } from "../../../models";
import { AuthService, validateisLoginCredentials } from '../../../services/';
import { confirmEmailFailed, confirmEmailSuccess, loginFailed, loginSuccess, logout, registerUserFailed, registerUserSuccess, setResetPasswordTokenFailed, setResetPasswordTokenSuccess } from '../../slices/';
import { addMessage, toastSlice } from "../../slices/toastslice";
const authService = new AuthService();

function * loginUser(action: PayloadAction<ILoginCredentials>) {

  try {
    const isValid = validateisLoginCredentials(action.payload)
    if(!isValid){
      yield put(addMessage({message:isValid, severity:'error'}));
      return;
    } 
    const response: {user:ILoggedInUser, token:string} = yield authService.login({...action.payload});
    localStorage.setItem('authToken',response.token)
    yield put(loginSuccess(response.user));
  }
  catch  {
    yield put(addMessage({message:'Could not login with  these credentials', severity:'error'}));
    yield put(loginFailed());
  }
}

function* registerUserAttempt(action: PayloadAction<IRegisterCredentials>) {
  try{
    const userCreated: boolean = yield authService.registerUser({...action.payload});
    if(!userCreated)  {
      yield put(addMessage({message:'Could not register with those credentials', severity:'error'}));
      yield put(registerUserFailed());
    } 
    yield put(registerUserSuccess())
  }
  catch (e:any) {
  
    yield put(toastSlice.actions.addMessage({message:'could not register with these credentials', severity:'error'}));
    
    yield put(registerUserFailed())
  }
}

function* confirmEmailSaga(action:PayloadAction<IConfirmEmailCredentials>) {
  try {
    const response:{user:ILoggedInUser, token:string} = yield authService.confirmEmail({...action.payload});
    if(!response)  {
      yield put(toastSlice.actions.addMessage({message:'token invalid or expired', severity:'error'}));
      yield put(confirmEmailFailed());
    }
    localStorage.setItem('authToken',response.token)

    console.log("confirmEmailSaga", response)
    yield put(confirmEmailSuccess(response.user))
  }
  catch(e) {
    yield put(toastSlice.actions.addMessage({message:'token invalid or expired', severity:'error'}));
    yield put(confirmEmailFailed());
  }
}

function* logoutSaga() {

        localStorage.setItem('authToken','')
        yield put(logout())
        window.location.href = "/login"


}

function* setResetPasswordToken(action:PayloadAction<string>) {
  try {
  const resetpassword:boolean = yield authService.setResetPasswordToken(action.payload);
  if(resetpassword) {
     yield put(setResetPasswordTokenSuccess())
  }

  }
  catch(e) {
    yield put(setResetPasswordTokenFailed())
  }
}

function* resendConfirmationCode(action:PayloadAction<string>) {
  try {
    const response:boolean = yield authService.resendConfirmationCode(action.payload);
    if(response) {
      yield put(setResetPasswordTokenSuccess())
    }
  }
  catch(e) {
    yield put(setResetPasswordTokenFailed())
  }
} 
export  function* authSagas() {
  yield takeEvery("authSlice/requestLogin", loginUser);
  yield takeEvery("authSlice/logoutAttempt", logoutSaga);
  yield takeEvery("authSlice/registerUserAttempt", registerUserAttempt)
  yield takeEvery("authSlice/confirmEmailAttempt", confirmEmailSaga)
  yield takeEvery("authSlice/setResetPasswordTokenAttempt", setResetPasswordToken)
  yield takeEvery("authSlice/resendConfirmationCodeAttempt", resendConfirmationCode)
}