import type { PayloadAction  } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { ILoggedInUser, UserType } from '../../models/User'
import { IConnectedUser} from '../../models';

interface userManagementState {
  users: ILoggedInUser[];
  onlineUsers: IConnectedUser[];
  onlineAdmins: IConnectedUser[];
  loading: boolean;
  showCreateAdminUser: boolean;
  editUser: {user:ILoggedInUser, showResetPassword:boolean} | null ; 
}

const initialState: userManagementState = {
  users: [],
  onlineAdmins: [],
  onlineUsers: [],
  loading: true,
  showCreateAdminUser: false,
  editUser: null,
}

export const userManagementSlice = createSlice({
  name: "userManagementSlice",
  initialState,
  reducers: {
    setShowCreateUser:(state,action: PayloadAction<boolean>)=>({...state, showCreateAdminUser:action.payload}),
    setEditUser:(state,action: PayloadAction<{user:ILoggedInUser, showResetPassword:boolean} | null>)=>({...state, editUser:action.payload}),
    addUsersAttempt: (state ) => ({...state, isLoading: true}),
    addUsersFailed: (state ) => ({...state, users: [], loading: false }),
    addUsersSuccess: (state, action: PayloadAction<ILoggedInUser[]>) => ({...state, users: action.payload}),
    createUserAttempt: (state, action: PayloadAction<{email: string, userName:string, userType:UserType}>)=> ({...state, loading: true}),
    createUserFailed: (state)=> ({...state, loading:false}),
    createUserSuccess: (state, action: PayloadAction<ILoggedInUser[]> )=> ({...state, loading: false, users: action.payload, showCreateAdminUser: false}),
    deleteUserAttempt: (state, action: PayloadAction<{id:string, userName:string}>) => ({...state, loading: true}),
    deleteUserFailed: (state ) =>({...state, loading: true}),
    deleteUserSuccess: (state, action:PayloadAction<ILoggedInUser[]>)=>({...state, loading: false, users:action.payload}),
    updateUserAttempt: (state, action:PayloadAction<ILoggedInUser>)=>({...state, loading: true }),
    updateUserFailed: (state, )=>({...state, loading: false }),
    updateUserSuccess: (state, action:PayloadAction<ILoggedInUser[]>)=> ({...state, loading: false, users:action.payload }),
    resetPasswordAttempt: (state, action:PayloadAction<{id:string}>)=>({...state, loading: true }),
    resetPasswordFailed: (state, ) =>({...state, loading: false }),
    resetPasswordSuccess: (state) => ({...state, loading: false}),
    changePasswordAttempt: (state, action:PayloadAction<{email:string, password:string, newPassword:string}>) => ({...state, loading: false }),
    changePasswordSuccess: (state) => ({...state, loading:false, editUser:null}),
    setLoadingFalse: (state) => ({...state, loading: false, setEditUser:false }),
    setOnLineUsers: (state, action: PayloadAction<{users: IConnectedUser[], admins:IConnectedUser[]}> ) =>( {...state, onlineUsers:action.payload.users, onlineAdmins: action.payload.admins })
  }
})

export  const { 
  setShowCreateUser,
  setEditUser,
  addUsersAttempt, 
  addUsersFailed,
  addUsersSuccess,
  createUserAttempt,
  createUserFailed,
  createUserSuccess,
  deleteUserAttempt,
  deleteUserFailed,
  deleteUserSuccess,
  updateUserAttempt,
  updateUserFailed,
  updateUserSuccess,
  resetPasswordAttempt,
  resetPasswordFailed,
  resetPasswordSuccess,
  changePasswordAttempt,
  setLoadingFalse,
  changePasswordSuccess,
  setOnLineUsers
} = userManagementSlice.actions

