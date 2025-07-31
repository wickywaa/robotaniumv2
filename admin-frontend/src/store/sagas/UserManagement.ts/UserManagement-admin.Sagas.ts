import { put, takeEvery } from "redux-saga/effects";
import { UserManagementService } from "../../../services";
import { ILoggedInUser, UserType } from "../../../models";
import { addUsersFailed, addUsersSuccess, createUserFailed, createUserSuccess, addMessage, deleteUserFailed, deleteUserSuccess, updateUserSuccess, resetPasswordSuccess, setLoadingFalse, changePasswordAttempt, changePasswordSuccess } from '../../slices';
import { PayloadAction } from "@reduxjs/toolkit";
const userMangementService = new UserManagementService();

function* setallUsers() {

  try {
    const users: ILoggedInUser[] = yield userMangementService.getAllUSers();
    yield put(addUsersSuccess(users))
  } catch (e) {
    yield put(addUsersFailed())
  }
}

function* createUser(action: PayloadAction<{ email: string, userName: string, userType: UserType }>) {

  const { email, userName, userType } = action.payload
  try {
    const userCreated: ILoggedInUser[] | false = yield userMangementService.inviteNewUser({ email, userName, userType });
    //todo no need to have possible false or array  just trip the error if there is a problem
    if (userCreated === false) {
      yield put(createUserFailed());
      yield put(addMessage({ message: `${"user could not be created"}`, severity: 'error' }));
    }

    if (Array.isArray(userCreated)) {
      yield put(createUserSuccess(userCreated));
      yield put(addMessage({ message: `user ${action.payload.userName} created`, severity: 'success' }));
    }
  }
  catch (e) {
    yield put(createUserFailed())
    yield put(addMessage({ message: `${e}`, severity: 'error' }));
  }
}

function* deleteUser(action: PayloadAction<{ id: string, userName: string }>) {
  try {
    const users: ILoggedInUser[] = yield userMangementService.deleteUserById(action.payload.id);
    yield put(deleteUserSuccess(users));
    yield put(addMessage({ message: `user ${action.payload.userName} deleted successfully`, severity: 'success' }));
  }
  catch (e) {
    yield put(deleteUserFailed());
    yield put(addMessage({ message: `${e}`, severity: 'error' }));
  }
}

function* updateUser(action: PayloadAction<ILoggedInUser>) {
  try {
    if(action.payload.userName.length < 6) throw new Error('Username must not be less than 6 characters');
    const users: ILoggedInUser[] = yield userMangementService.updateUser(action.payload._id, action.payload);
    yield put(updateUserSuccess(users));
    yield put(addMessage({ message: `user ${action.payload.userName} updated successfully`, severity: 'success' }));
  }
  catch (e) {
    yield put(deleteUserFailed());
    yield put(addMessage({ message: `${e}`, severity: 'error' }));
  }
}

function* resetPassword(action: PayloadAction<{id:string}>) {
  try {
    const success:boolean = yield userMangementService.resetPassword(action.payload.id).then((response)=>{
      if(response.status === 200) return true;
    })
    if(!success) throw new Error('could not reset password')
    yield put(resetPasswordSuccess());
    yield put(addMessage({ message: `user password reset  successfully`, severity: 'success' }));
  }
  catch (e) {
    yield put(deleteUserFailed());
    yield put(addMessage({ message: `${e}`, severity: 'error' }));
  }
}

function* changeMyPassword(action:PayloadAction<{email:string, password:string, newPassword:string}>) {
  try {
    const passwordChanged:boolean =  yield userMangementService.changeMyPassword(action.payload.email, action.payload.password, action.payload.newPassword).then((response)=>{
      if(response.status === 200) return true;
    })

    if(!passwordChanged) throw new Error('could not change password');
    yield put(changePasswordSuccess())
  }
  catch(e) {
    yield put(setLoadingFalse());
    yield put(addMessage({ message: `${e}`, severity: 'error' }));
  }
}

export function* UserManagementAdminSagas() {

  yield takeEvery("userManagementSlice/addUsersAttempt", setallUsers);
  yield takeEvery("userManagementSlice/createUserAttempt", createUser);
  yield takeEvery("userManagementSlice/deleteUserAttempt", deleteUser);
  yield takeEvery("userManagementSlice/updateUserAttempt", updateUser);
  yield takeEvery("userManagementSlice/resetPasswordAttempt", resetPassword);
  yield takeEvery("userManagementSlice/changePasswordAttempt", changeMyPassword);

}