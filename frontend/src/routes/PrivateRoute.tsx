import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from '../store/hooks';
import { selectUser } from '../store/selectors';

//import { Auth } from "../firebase/AdminFirebase";
export const PrivateRoute: React.FC<any> = ({ children }) => {

  const Auth = {
    currentUser: useAppSelector(selectUser)
  }
  const user = Auth.currentUser;

  return user ? children : <Navigate replace to="/login" />;
};
