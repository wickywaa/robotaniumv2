import { InputText } from 'primereact/inputtext';
import React, { useEffect, useState } from 'react';
import { IEditUser, ILoggedInUser } from '../../models';
import  './UpdateUserForm.scss'

import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';

interface IUpdateUserForm {
  user: ILoggedInUser;
  isCurrentUser: boolean;
  onSave: (user: ILoggedInUser) => void;
  onResetPassword: () => void
}

export const UpateUserForm: React.FC<IUpdateUserForm> = ({ user, isCurrentUser, onSave, onResetPassword }) => {

  const [tempUser, setTempUser] = useState<ILoggedInUser | null>(null);

  useEffect(() => {
    if (user) {
      setTempUser(user);
    }
  }, [])

  const handleSave = () => {
    if (!tempUser) return;
    onSave(tempUser);
  }

  return tempUser !== null ? (
    <div className='flex-column'>
      <div className='edit-user-button-container '>
        <Button onClick={onResetPassword} className='m-2 p-1 '>Reset Password</Button>
      </div>
      <div className='edit-user-form-container'>
        <div className="flex align-items-center ">
          <label htmlFor="userName" >User Name </label>
          <InputText className='ml-2 p-1' placeholder='userName' onChange={(event) => setTempUser({ ...tempUser, userName: event.target.value })} value={tempUser?.userName} />
        </div>

        <div className="flex align-items-center">
          <Checkbox onChange={(value) => setTempUser({ ...tempUser, isActive: !tempUser.isActive })} checked={tempUser.isActive} />
          <label htmlFor="isActive" >Is Active</label>
        </div>

        <div className="flex align-items-center">
          <Checkbox onChange={(value) => setTempUser({ ...tempUser, isEmailVerified: !tempUser.isEmailVerified })} checked={tempUser.isEmailVerified} />
          <label htmlFor="verified" >Is Verified</label>
        </div>

        <div className="flex align-items-center">
          <Checkbox inputId="robotaniumAdmin" onChange={(value) => setTempUser({ ...tempUser, isRobotaniumAdmin: !tempUser.isRobotaniumAdmin })} checked={tempUser.isRobotaniumAdmin} />
          <label htmlFor="isRobotaniumAdmin" >Robotanium Admin</label>
        </div>

        <div className="flex align-items-center">
          <Checkbox onChange={(value) => setTempUser({ ...tempUser, isPlayerAdmin: !tempUser.isPlayerAdmin })} checked={tempUser.isPlayerAdmin} />
          <label htmlFor="isPlayerAdmin" >Player Admin</label>
        </div>

        <Button className='mt-2 p-1' label='save' title='save' onClick={() => handleSave()} />
      </div>
    </div>
  ) : null
}
