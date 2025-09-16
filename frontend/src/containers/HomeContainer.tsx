import React from "react";
import { Outlet } from 'react-router-dom';
import { NavigationBar } from '../components/global';

export const HomeContainer: React.FC = () => {

  return (
    <div style={{ background: 'black' }}>
      <NavigationBar />
      <Outlet />
    </div>

  )
};
