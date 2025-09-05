import React from "react";
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { useNavigate } from "react-router-dom";

import { Button } from 'primereact/button';
import { Menubar } from "primereact/menubar";
import { MenuItem } from "primereact/menuitem";
import robotaniumLogo from "../../../assets/images/icononly_transparent_nobuffer.png";
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
    return <div style={{height:"200", width:"100px", background:'red'}} ><GavoomLogo /></div>
  } ;
  const end = () => {
    return <Button className="text-primary border-primary border-solid border-1 border-primary" onClick={(() => dispatch(logoutAttempt()))} title="Logout">logout</Button>
  };
  const items: IMenuItemWithBadge[] = [
    {
      label: "Profile",
      icon: "pi pi-home",
      id: "home",
    },
    {
      label: "My Bots",
      command: () => navigate("/bots"),
      icon: "pi pi-star",
      id: "features",
    },
    {
      label: "Rooms",
      command: () => navigate("/rooms"),
      icon: "pi pi-search",
      id: "projects",
    },
  ] as IMenuItemWithBadge[];

  return (
    <div style={{ position: 'relative' }} className="border border-secondary bg-primaary" >
      <Menubar key={user?.id} className="bg-card" model={items} start={start} end={user?.id ? end : null} />
    </div>
  );
};
