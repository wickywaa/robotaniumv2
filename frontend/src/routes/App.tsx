import React from 'react';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { RestoreLastRoute } from '../components';
import { ToastComponent } from '../components/global/Toast.Component';
import { ConfirmEmailContainer, HomeContainer, LoginContainer, RegisterContainer } from '../containers';
import { BotContainer } from '../containers/BotContainer';
import { ForgotPasswordContainer } from '../containers/ForgotPassword';
import { PrivateRoute } from './PrivateRoute';

export const AppRouter: React.FC = () => {

  return (
    <>
      <BrowserRouter>
        <RestoreLastRoute />
        <ToastComponent />
        <Routes>
          <Route path="/" element={<PrivateRoute><HomeContainer /></PrivateRoute>} >
            <Route path="bots" element={<BotContainer />} />
          </Route >
          <Route path="/register" element={<RegisterContainer />} />
          <Route path="/login" element={<LoginContainer />} />
          <Route path="/confirmemail" element={<ConfirmEmailContainer />} />
          <Route path="/forgotpassword" element={<ForgotPasswordContainer />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}