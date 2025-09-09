import { InputText } from 'primereact/inputtext';
import React, { useState } from 'react';

interface IPasswordInput {
  onChange: (password: string) => void;
  placeHolder: string;
  value: string;

}

export const PasswordInput: React.FC<IPasswordInput> = ({ onChange, placeHolder, value }) => {

  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div style={{ position: 'relative' }} >
      <InputText style={{ width: '100%', background: 'transparent' }} type={showPassword ? 'text' : 'password'} onChange={(e) => onChange(e.target.value)} placeholder={placeHolder} value={value} />
      <i  style={{ position: 'absolute', right: '2px', top: '8px' }} onClick={() => setShowPassword(!showPassword)} className={`color-primary-color ${!showPassword ? 'pi pi-eye' : 'pi pi-eye-slash'}`}></i>
    </div>
  )
}