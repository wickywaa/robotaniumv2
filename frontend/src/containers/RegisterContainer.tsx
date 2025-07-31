import React from 'react';
import { RegisterForm } from '../../src/components';
import { useAppSelector } from '../store/hooks';
import { isUserLoading, registerEmailSent, selectUser } from '../store/selectors';

export const RegisterContainer:React.FC = () => {

  const registeredEmailSent = useAppSelector(registerEmailSent);
  const isLoading = useAppSelector(isUserLoading);
  const user = useAppSelector(selectUser);

   return (
    <div className="fullcontainer margin-5  h-2/5 flex justify-center items-center flex-1 bg-primary border border-secondary">
      <div className="w-screen  h-full bg-center bg-no-repeat flex justify-center items-center">
        <RegisterForm isLoading={isLoading} emailSent={registeredEmailSent} user={user}/>
      </div>
    </div>
   )

}