import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { registerEmailSent, selectUser, isUserLoading } from '../store/selectors';
import { confirmEmailAttempt } from '../store/slices';
import { ForgotPasswordForm } from '../components/';


export const ForgotPasswordContainer:React.FC = () => {

  const [searchParams, setSearchParams] = useSearchParams();
  const username = searchParams.get('username') ?? '';
  const email = searchParams.get('email')?? '';
  const token = searchParams.get('token')?? '';
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(isUserLoading);
  const user = useAppSelector(selectUser);
  const emailSent = useAppSelector(registerEmailSent);
  const navigate = useNavigate();

  useEffect(()=>{
    if(!username.length || !email.length || !token.length ) return;
    dispatch(confirmEmailAttempt({email,registrationToken:token}))
  },[])

  useEffect(()=>{

    if(user) {
        navigate("/")
    }

  },[user])

   return (

    <div className="fullcontainer margin-5  h-2/5 flex justify-center items-center flex-1 bg-primary border border-secondary">
      <div className="w-screen w-2/4 h-full bg-center bg-no-repeat flex justify-center items-center">
        <ForgotPasswordForm emailSent={emailSent} isLoading={isLoading} user={user} />
      </div>
    </div>
   )

}