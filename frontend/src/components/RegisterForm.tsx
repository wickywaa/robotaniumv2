import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import { ILoggedInUser } from "../models";
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectErrors } from "../store/selectors";
import { addError, confirmEmailAttempt, registerUserAttempt, removeErrorByType, resendConfirmationCodeAttempt } from '../store/slices/authSlice';
import "./RegisterForm.scss";

export const RegisterForm: React.FC<{ emailSent: boolean, isLoading: boolean, user: ILoggedInUser | null }> = ({ isLoading, emailSent, user }) => {

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPassword2, setShowPassword2] = useState<boolean>(false);
  const [confirmationCode, setConfirmationCode] = useState<string>("");
  const errors = useAppSelector(selectErrors);
  const [canSave, setCanSave] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const getBorderClass = (field: ErrorType) => errors.find((error) => error.type === field) ? 'inputError' : 'border-secondary';

  const isfieldValid = (field: ErrorType) => {
    if (field === 'email') return validator.isEmail(email);
    if (field === 'password') return validator.isStrongPassword(password);
    if (field === 'password2') return password === password2;
  }

  const checkforErrors = (field?: ErrorType): boolean => {
    const fields: ErrorType[] = ['email', 'password', 'password2']
    let error: boolean = false;
    if (!field) {
      fields.forEach((field) => {
        if (!isfieldValid(field)) {
          dispatch(addError({ type: field, message: '' }))
          error = true;
        }
      })
      return error
    }

    if (!isfieldValid(field)) {
      dispatch(addError({ type: field, message: '' }))
      return true;
    }
    return false;
  }

  const clearErrorOnChange = (field: ErrorType) => {
    if (isfieldValid(field)) {
      dispatch(removeErrorByType(field))
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {

    if (event.code === 'Enter')
      dispatch(confirmEmailAttempt({
        email,
        registrationToken: confirmationCode,
      }))
  }

  const handleregister = () => {
    if (checkforErrors()) return;
    return dispatch(registerUserAttempt({ email, password }))
  }

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user])

  useEffect(() => {
    clearErrorOnChange('email');
    clearErrorOnChange('password')
    clearErrorOnChange('password2')
  }, [email, password, password2])

  const renderEmailSentMessage = (
    <div >
      a confirmation code has been sent to the email  {email} <br />
      Enter The code to confirm your email address  {email} <br />
      <InputText onKeyUp={handleKeyPress} value={confirmationCode} onChange={(event) => setConfirmationCode(event.target.value)} />
      <p onClick={() => dispatch(resendConfirmationCodeAttempt(email))}>send new code</p>
    </div>
  )

  const footer = (
    <>
      <div className="w-full flex flex-column cursor-pointer justify-center items-center">
        <Button
          disabled={errors.length > 0}
          onClick={() => handleregister()}
          className="bg-secondary  text-white w-32 h-8"
          label="Register" title="Register"
        />
      </div>
      <div className="mt-2 w-full  flex flex-row justify-center items-center">
        <a style={{ color: '#4ddfc0', textDecoration: 'underline' }} href="/login"> login here</a>
      </div>
    </>
  );

  // eslint-disable-next-line no-lone-blocks
  {
    return !emailSent ? (
      <Card
        footer={footer}
        className={`loginform ${isLoading ? "login-loading" : ''} m-auto m-2 p-2 min-h-72 relative rounded-2xl flex-column justify-center items-center border border-secondary md:w-4/5 lg:w-2/4 p-8 xl:w-1/5`}
      >
        <InputText
          placeholder="email"
          style={{ color: '#4ddfc0' }}
          className={`w-full color-red-500  h-8 border ${getBorderClass('email')} mb-5`}
          value={email}
          onBlur={() => checkforErrors('email')}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="w-full relative h-8  mb-5" >
          <InputText
            style={{ color: '#4ddfc0' }}
            type={showPassword ? 'text' : 'password'}
            placeholder="password"
            className={`w-full h-8 border color-red-500 ${getBorderClass('password')} mb-5`}
            value={password}
            onBlur={() => checkforErrors('password')}
            onChange={(e) => setPassword(e.target.value)}
          />
          <i style={{ color: '#4ddfc0' }} onClick={() => setShowPassword(!showPassword)} className={`absolute hoverIcon  right-2 top-5 ${!showPassword ? 'pi pi-eye' : 'pi pi-eye-slash'}`}></i>
        </div>

        <div className="w-full relative h-8 mb-5" >
          <InputText
            style={{ color: '#4ddfc0' }}
            type={showPassword2 ? 'text' : 'password'}
            placeholder="repeat password"
            className={`w-full h-8 border placeholder text-red-100 color-secondary ${getBorderClass('password2')} mb-5`}
            value={password2}
            onBlur={() => checkforErrors('password2')}
            onChange={(e) => setPassword2(e.target.value)}
          />
          <i style={{ color: '#4ddfc0' }} onClick={() => setShowPassword2(!showPassword2)} className={`absolute hoverIcon right-2 top-5 ${!showPassword2 ? 'pi pi-eye' : 'pi pi-eye-slash'}`}></i>
        </div>
      </Card>

    ) : renderEmailSentMessage
  }
}