import React, { useEffect } from "react";
import { Button } from 'primereact/button';

import { AdminUsersTable, CreateUserModal } from '../../components/';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectUser, selectUserManagement } from '../../store/selectors';
import { createUserAttempt, setShowCreateUser } from "../../store";
import { ILoggedInUser, UserType } from "../../models";
import { EditUserModal } from "../../components/UserEditModal/UserEditmodal";

export const AdminUsersContainer: React.FC = () => {

  const user = useAppSelector(selectUser);
  const userManagement = useAppSelector(selectUserManagement)
  const dispatch = useAppDispatch()

  const createUser = (email: string, userName: string, userType:UserType) => dispatch(createUserAttempt({ email, userName,userType }))

  return (
    <div className="admin-users-container">
      <CreateUserModal
          onCreateUser={createUser}
          user={user} userType={'admin'}
          isVisible={userManagement.showCreateAdminUser}
          close={() => dispatch(setShowCreateUser(!userManagement.showCreateAdminUser))} 
        />
    
      <Button
        onClick={() => dispatch(setShowCreateUser(!userManagement.showCreateAdminUser))}
        style={{ margin: "10px", height: "50px", width: "50px" }} icon="pi pi-plus" />
      <AdminUsersTable />
    </div>
  );
};
