import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../../../store/hooks';

import { Button } from 'primereact/button';
import { Menubar } from "primereact/menubar";
import { MenuItem } from "primereact/menuitem";
import { GavoomLogo } from "../../../assets/images/svglogo";
import { selectUser } from "../../../store/selectors";
import { logoutAttempt } from "../../../store/slices";

interface IMenuItemWithBadge extends MenuItem {
  label: string;
  badge?: string | number;
  shortcut?: string;
  id?: string;
}

export const NavigationBar: React.FC = () => {

  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const start = () => {
    return <div style={{ height: "200", width: "100px", background: 'red' }} ><GavoomLogo /></div>
  };
  const end = () => {
    return <Button className={`text-white border-primary border-solid border-1 border-primary`} onClick={(() => dispatch(logoutAttempt()))} title="Logout">logout</Button>
  };

  const navigateToPage = (path: string) => {
    navigate(path)
    localStorage.setItem('lastPath', path)
  }
  const items: IMenuItemWithBadge[] = [
    {
      label: "Profile",
      icon: "pi pi-home",
      id: "home",
    },
    {
      label: "My Bots",
      command: () => navigateToPage("/bots"),
      icon: "pi pi-star",
      id: "features",
    },
    {
      label: "Rooms",
      command: () => navigateToPage("/rooms"),
      icon: "pi pi-search",
      id: "projects",
    },
  ] as IMenuItemWithBadge[];

  return (
    <div style={{ position: 'relative' }} className="border border-secondary " >
      <Menubar key={user?.id} className="bg-card" model={items} start={start} end={user?.id ? end : null} />
    </div>
  );
};
