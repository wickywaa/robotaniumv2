import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectUser } from '../store/selectors';
import { addUsersAttempt, getGamesAttempt, setBotsListAttempt } from "../store/slices";

//import { Auth } from "../firebase/AdminFirebase";

export const PrivateRoute: React.FC<any> = ({ children }) => {

  const dispatch = useAppDispatch();

  const Auth = {
    currentUser: useAppSelector(selectUser)
  }
  const user = Auth.currentUser;

  
  useEffect(()=>{
    if(user){
      dispatch(setBotsListAttempt())
      dispatch(getGamesAttempt())
      dispatch(addUsersAttempt())
    }
  },[])

  return user ? children : <Navigate replace to="/admin/login" />;
};
