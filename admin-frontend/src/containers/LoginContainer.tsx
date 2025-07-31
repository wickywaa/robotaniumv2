import React from "react";
import { LoginForm } from '../components';
import "./LoginContainer.scss"

export  const LoginContainer: React.FC = () => {
 
  return (
    <div className="login-container">
        <LoginForm/>
    </div>
  )
};