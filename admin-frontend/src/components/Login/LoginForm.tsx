import { useEffect, useState } from "react";

import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { useNavigate } from 'react-router-dom';
import {useAppDispatch, useAppSelector, addError, requestLogin, removeErrorByType} from '../../store';
import  './LoginForm.scss';
import { ErrorType } from "../../models";
import validator from "validator";
import { selectErrors, selectUser } from "../../store/selectors";

export const LoginForm = () => {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const errors = useAppSelector(selectErrors);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const getBorderClass = (field: ErrorType) => errors.find((error)=>error.type === field) ? 'input-error' :'';

  const handleLogin = () => {
    if(checkforErrors()) return;
      dispatch(requestLogin({email, password}))
  }

  const isfieldValid = (field:ErrorType) =>{
    if(field==='email') return validator.isEmail(email);
    if(field === 'password') return password.length > 1;
  }

  const checkforErrors = (field?:ErrorType):boolean => {
    const fields:ErrorType[] = ['email','password']
    let error:boolean = false;
    if(!field) {
      fields.forEach((field)=>{
        if(!isfieldValid(field)) {
          dispatch(addError({type:field,message:''}))
          error = true;
        }
      })
      return error
    }

    if(!isfieldValid(field)){
      dispatch(addError({type:field,message:''}))
      return true;
    }
    return false;
  }

  const clearErrorOnChange = (field:ErrorType) => {
    if(isfieldValid(field)){
      dispatch(removeErrorByType(field))
    }
  }

  useEffect(()=>{
    if(user?.isRobotaniumAdmin) {
      navigate("/admin/")
    }
  },[user])

  useEffect(()=>{
    clearErrorOnChange('email');
    clearErrorOnChange('password');
   },[email,password])


  const footer = (
    <>
      <div className="login-footer">
        <Button onClick={()=> handleLogin()} className="login-button" label="login" title="login" />
      </div>
    </>
  );

 return  (
    <Card
      footer={footer}
      className="login-form-container border-primary"
    >
      <InputText  
        placeholder="email"
        className={`login-form-input ${getBorderClass('email')}`}
        value={email}
        onChange={(value)=> setEmail(value.target.value)}
        onBlur={()=> checkforErrors('email')}
      />
      <InputText
        type="password"
        placeholder="password"
        className={`login-form-input ${getBorderClass('password')}`}
        value={password}
        onChange={(value)=> setPassword(value.target.value)}
        onBlur={()=> checkforErrors('password')}
      />
    </Card>
  )
}