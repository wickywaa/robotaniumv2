import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import React, { useState } from 'react';
import validate  from 'validator';
import { PasswordInput } from '../PasswordInput/PasswordInput';

export interface IChangePassword {
  onChange: (event:{password:string, newPassword: string})=> void
;}

export const ChangePassword: React.FC<any> = ({onChange}) => {

  const [password, setPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [repeatPassword, setRepeatPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleOnEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(event.key !== 'Enter') return;
    if(!isvalid())
    onChange({password, newPassword})
  }

  const isvalid = () => {
    if(!newPassword.length || !password.length) {
      setErrorMessage('enter password');
      return false;
    } 
    if(newPassword !==  repeatPassword) {
      setErrorMessage('passwords must match');
      return false;
    } 

    if(!validate.isStrongPassword(newPassword) ){
      setErrorMessage('Password not strong enough');
      return false
    } 
    return true;
  }

  const handleClick = () => {
    if(!isvalid()) return;
    setErrorMessage('');
    onChange({password, newPassword})
  }

  return (
    <div style={{flexDirection:'column', width:'60%', marginTop:'30px', minHeight:'450px'}} className={'flex p-flex-column'}>
      <PasswordInput onChange={setPassword} value={password} placeHolder='enter old password'/>
      <PasswordInput onChange={setNewPassword} value={newPassword} placeHolder='enter new password'/>
      <PasswordInput onChange={setRepeatPassword} value={repeatPassword} placeHolder='reenter new password'/>
      
      <Button label='Change password' onClick={handleClick}/>
      <p style={{color: 'red', marginBottom:'5px'}}>{errorMessage}</p>
    </div>
  )
}
