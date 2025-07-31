import React, { useEffect } from "react";
import { NavigationBar } from '../components/global';
import { Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../src/store/hooks';
import { fetchBotsttempt } from '../store/slices';


export const HomeContainer: React.FC = () => {

  const dispatch = useAppDispatch();

  useEffect(()=>{
      dispatch(fetchBotsttempt())
  },[])

  return(
    <div style={{background:'black'}}>
      <NavigationBar/>
      <Outlet/>
    </div>
    
  ) 
};
