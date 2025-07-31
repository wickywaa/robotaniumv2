import React from 'react';

import {useAppDispatch, useAppSelector} from '../store/hooks';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomeContainer,  LoginContainer, BotsContainer, AdminUsersContainer, UsersContainer, GamesContainer } from '../containers';
import { NavBar, ToastMessages } from '../../src/components/global';
import {PrivateRoute } from './ProtectedRoute';
import { EditUserModal } from '../components';
import { selectUserManagement } from '../store/selectors';
import { CockpitContainer } from '../containers/CockPitContainer/CockpitContainer';


export const AppRouter: React.FC = () => {
  const dispatch = useAppDispatch();
  const userManagement  = useAppSelector(selectUserManagement);
  return (
    <>
    <BrowserRouter>
    <ToastMessages/>
    {userManagement.editUser !== null && <EditUserModal editUser={userManagement.editUser}/>}
    <Routes>
          <Route path="/admin/login" element={<LoginContainer />}/>
          <Route path="/admin" element={<PrivateRoute><HomeContainer /></PrivateRoute>}>
            <Route path="bots" element={<BotsContainer />}/>
            <Route path="games" element={<GamesContainer />}/>
            <Route path="adminusers" element={<AdminUsersContainer />}/>
            <Route path="cockpit" element={<CockpitContainer />}/>
          </Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}