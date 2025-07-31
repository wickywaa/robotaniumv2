import React from "react";
import { useAppDispatch, useAppSelector } from '../../../store/hooks';

import { Button } from 'primereact/button';
import { Menubar } from "primereact/menubar";
import { MenuItem } from "primereact/menuitem";
import robotaniumLogo from "../../../assets/images/icononly_transparent_nobuffer.png";
import { selectUser } from "../../../store/selectors";
import { logoutAttempt, setEditUser } from "../../../store/slices";
import { useNavigate } from 'react-router-dom'
import './Navbar.scss';

interface IMenuItemWithBadge extends MenuItem {
  label: string;
  badge?: string | number;
  shortcut?: string;
}

export const NavBar: React.FC = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const start = () => <img className="h-20" alt="Robotanium Logo" src={robotaniumLogo} />;

  const onEditUserClick = () => {
    if(user !== null) {
      dispatch(setEditUser({user, showResetPassword:true}))
    }
  }
  
  const end = () => {
    return (
      <>
        <Button 
          icon="pi pi-user"
          rounded
          outlined
          tooltip="Edit Profile"
          tooltipOptions={{ position: 'bottom' }}
          onClick={onEditUserClick}
        />
        <Button 
          icon="pi pi-sign-out"
          label="Logout"
          rounded
          outlined
          severity="danger"
          tooltip="Sign Out"
          tooltipOptions={{ position: 'bottom' }}
          onClick={() => dispatch(logoutAttempt())}
        />
      </>
    );
  };

  const items: IMenuItemWithBadge[] = [
    {
      label: "Home",
      icon: "pi pi-home",
      command: () => navigate('/admin')
    },
    {
      label: "Bots",
      icon: "pi pi-robot",
      command: () => navigate('/admin/bots')
    },
    {
      label: "Games",
      icon: "pi pi-gamepad",
      command: () => navigate('/admin/games')
    },
    {
      label: "Users",
      icon: "pi pi-users",
      command: () => navigate('/admin/adminusers')
    },
  ];

  return user ? (
    <div className="nav-bar">
      <Menubar model={items} start={start} end={user?._id ? end : null} />
    </div>
  ) : null;
};
