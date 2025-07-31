import { RootState } from '../store';

export const selectUserManagement = (state: RootState) => state.userManagementSlice;
export const selectallUsers = (state: RootState) => state.userManagementSlice.users