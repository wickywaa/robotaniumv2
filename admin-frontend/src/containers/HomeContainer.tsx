import React from "react";
import { Outlet } from 'react-router-dom';
import { NavBar } from '../components/global/Navbar/Navbar';
import './HomeContainer.css';

export const HomeContainer: React.FC = () => {
  return (
    <div className="home-container">
      <NavBar />
      <main className="home-content">
        <Outlet />
      </main>
    </div>
  );
};
