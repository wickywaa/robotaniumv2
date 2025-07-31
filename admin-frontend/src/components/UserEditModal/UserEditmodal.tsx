import React, { useEffect, useState } from 'react';
import { IEditUser, ILoggedInUser } from '../../models';

import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import './UserEditModal.scss'
import { resetPasswordAttempt, setEditUser, updateUserAttempt, changePasswordAttempt } from '../../store';
import { UpateUserForm } from '../UpdateUserForm/UpdateUserForm';
import { InputText } from 'primereact/inputtext';
import { ChangePassword } from '../ChangePassword/ChangePassword';
        
interface EditUserModal {
  editUser: {user:ILoggedInUser, showResetPassword:boolean }
}

export const EditUserModal:React.FC<EditUserModal> = ({editUser}) => {

  const [tempUser, setTempUser] =  useState<IEditUser | null>(null)
  const dispatch = useAppDispatch();

  useEffect(()=>{
    setTempUser({...editUser.user,password:''})
  },[])

  const handleOnSave = (user: ILoggedInUser) => dispatch(updateUserAttempt(user));
  const handleResetPassword  =  () => dispatch(resetPasswordAttempt({id:editUser.user._id}));


  return tempUser !== null ? (
    <div className='user-edit-modal-container'>
      <Card className='user-edit-modal-card' >
      <Button className='user-edit-modal-close' onClick={()=> dispatch(setEditUser(null))}  severity="secondary" icon="pi pi-times" style={{ marginLeft: '0.5em' }} />
        <UpateUserForm  onResetPassword={handleResetPassword}
        onSave={(user)=> handleOnSave(user)} user={tempUser} isCurrentUser={false}/>

        { editUser.showResetPassword && <ChangePassword onChange={(e:{password:string, newPassword:string})=> dispatch(changePasswordAttempt({email:editUser.user.email,password:e.password, newPassword:e.newPassword}))}/>}
      </Card>
    </div>
  ): null
}