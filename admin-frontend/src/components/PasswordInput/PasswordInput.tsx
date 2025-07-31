import { InputText } from 'primereact/inputtext';
import React, {useState} from 'react';

interface PasswordInput {
  onChange: (password:string) => void;
  placeHolder: string;
  value:string;

}

export const PasswordInput:React.FC<PasswordInput> = ({onChange, placeHolder,value }) => {

  const [showPassword, setShowPassword] = useState<boolean>(false);

  return(
      <div style={{position:'relative'}} >
        <InputText style={{width:'100%', background:'transparent'}} type={showPassword ? 'text' : 'password'} onChange={(e)=>onChange(e.target.value)} placeholder={placeHolder} value={value}/>
        <i style={{color: '#4ddfc0', position:'absolute', right:'2px',top:'8px'}} onClick={()=>setShowPassword(!showPassword)}  className={`${!showPassword ? 'pi pi-eye' : 'pi pi-eye-slash'}`}></i>
      </div>
  )
}