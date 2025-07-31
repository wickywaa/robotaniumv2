import { PayloadAction } from "@reduxjs/toolkit";
import { put, takeEvery } from "redux-saga/effects";
import { UserManagementService } from "../../../services";
import { ILoggedInUser } from "../../../models";
import { addUsersFailed, addUsersSuccess} from '../../slices';
const userMangementService  = new UserManagementService();

function * setallUsers() {

  try {
    const users: ILoggedInUser[]  = yield userMangementService.getAllUSers(); 
    yield put(addUsersSuccess(users) )
  } catch (e) {
    yield put( addUsersFailed())
  }
}

export function * UserManagementUserSagas (){

  yield takeEvery("userManagementSlice/addUsersAttempt", setallUsers);

}