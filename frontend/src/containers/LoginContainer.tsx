import React from "react";
import { LoginForm } from '../components';

export  const LoginContainer: React.FC = () => {
 
  return (
    <div className="fullcontainer margin-5 w-screen  flex justify-center items-center flex-1 bg-primary border border-secondary">
      <div className="w-screen  h-screen bg-center bg-no-repeat flex justify-center items-center">
        <LoginForm/>
      </div>
    </div>
  )
};