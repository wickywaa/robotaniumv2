import { PayloadAction } from "@reduxjs/toolkit";
import { put, takeEvery } from "redux-saga/effects";
import { AuthService, validateisLoginCredentials } from '../../services';
import { ILoggedInUser, ILoginCredentials } from "../../models";
import  {logout, addError, loginSuccess, loginFailed, addMessage, setEditUser, setShowCreateUser} from '../slices';
const authService = new AuthService();

function * loginUser(action: PayloadAction<ILoginCredentials>) {

  try  {
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

function* logoutSaga() {
  console.log('logout ssage')
  try {
    console.log('fired it here firstr')
     yield authService.logout().then((response)=>{
      if(response.status === 200) {
        localStorage.setItem('authToken','')
        return
      }
     });
     
     console.log('fired it herer')
     //yield put(setEditUser(null));
     yield put(setShowCreateUser(false))
  
     yield put(logout())
  }
  catch(e) {
    localStorage.setItem('authToken','')
    //yield put(setEditUser(null));
    yield put(setShowCreateUser(false))
    yield put(logout())
  }
}

export  function* authSagas() {
  yield takeEvery("authSlice/requestLogin", loginUser);
  yield takeEvery("authSlice/logoutAttempt", logoutSaga);
}