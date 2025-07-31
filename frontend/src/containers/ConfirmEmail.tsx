import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectUser } from '../store/selectors';
import { confirmEmailAttempt } from '../store/slices';

export const ConfirmEmailContainer:React.FC = () => {

  const [searchParams, setSearchParams] = useSearchParams();
  const username = searchParams.get('username') ?? '';
  const email = searchParams.get('email')?? '';
  const token = searchParams.get('token')?? '';
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser); 
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
        confirmEmail
      </div>
    </div>
   )

}