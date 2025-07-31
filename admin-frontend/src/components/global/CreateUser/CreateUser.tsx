import React, { useEffect, useState } from "react";
import "./CreateUser.scss";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ILoggedInUser, UserType } from "../../../models";
import { Dropdown } from 'primereact/dropdown';
import validator from 'validator';

interface props {
  isVisible: boolean;
  user: ILoggedInUser | null;
  userType: "player" | "admin";
  onCreateUser: (email: string, userName: string, userType: UserType ) => void;
  close: () => void;
}

export const CreateUserModal: React.FC<props> = ({ isVisible, close, onCreateUser }) => {

  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [userType, setUserType] = useState<{name:UserType,code:UserType} | null>(null);
  const [isValid, setIsValid] = useState<boolean>(false)

  const types = [
    {name:'player', code: 'player'},
    {name: 'admin', code: 'admin'}
  ]
  
  const handleSubmit = ()=> {
    console.log('submitting', userType)
    if(userType !== null) {
      onCreateUser(email, userName, userType.code)
    }
  }

  useEffect(()=>{
    if(validator.isEmail(email) && userName.length && userType!== null)return setIsValid(true);
    setIsValid(false)
  },[userType,userName,email])


  return isVisible ? (
    <Card className="create-user-from-container">
      <div className="close-button-container">
        <Button onClick={() => close()} style={{ margin: 0 }} icon="pi pi-times" />
      </div>
      <div className="create-user-form">
        <InputText onChange={(e) => setEmail(e.target.value)} className="create-user-button" placeholder="email" />
        <InputText onChange={(e) => setUserName(e.target.value)} className="create-user-button" placeholder="userName" />
        <Dropdown value={userType} onChange={(e) => setUserType(e.value)} options={types} optionLabel="name" 
                placeholder="Select Role" className="w-full md:w-14rem" />
      </div>
      <Button disabled={!isValid} onClick={handleSubmit } className="create-user-confirm-button" label="Invite User" />
    </Card>
  ) : null;
};
