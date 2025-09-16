import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

//import { Auth } from "../firebase/AdminFirebase";
export const PrivateRoute: React.FC<any> = ({ children }) => {

  const auth = useAuth();

  let user = auth.user;


  return user ? children : <Navigate replace to="/login" />;
};
