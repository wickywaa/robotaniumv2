import React, { useEffect, useState } from 'react';
import { ILoggedInUser } from '../../models/User';
import { InputText } from 'primereact/inputtext';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primereact/autocomplete';
import { IBot, IConnectedBot, IConnectedCockpit, IGame } from '../../models';

interface IAvailableUser {
  id: string;
  name: string;
}

interface SelectAdminIdProps {
  availableUsers: {name:string, id:string}[];
  onChange: (adminId: string) => void;
  bot: IConnectedBot;
}

export const SelectAdminId: React.FC<SelectAdminIdProps> = ({ availableUsers, onChange,  bot }) => {

  const [selectedUser, setSelectedUser] = useState<string>('');
  const [possibleUsers, setPossibleUsers] = useState<{name:string, id:string}[]>([]);

  const handleUserSearch = (event: AutoCompleteCompleteEvent) => {
    const filteredUsers = availableUsers.filter((user) => user.id.startsWith(event.query));
    setPossibleUsers(filteredUsers);
  }



  useEffect(()=>{

    console.log('bot', bot)
    console.log('bot.cockpits', bot.cockpits)
    if(bot?.adminId.length > 0 && bot.cockpits.length > 0){
      console.log('should select amdinid')
      const gameAdmin = bot.cockpits.find((cockpit)=>cockpit.player.id === bot.adminId)
      console.log('gameAdmin', gameAdmin)
      if(gameAdmin?.player?.id){
        console.log('gameAdmin', gameAdmin)
        setSelectedUser(`${gameAdmin.player.name} (${gameAdmin.player.id})`);
      }
    }
  },[])

  useEffect(()=>{
    console.log('selectedUser', selectedUser)
  },[selectedUser])


  const handleChange = (e: { value: {name:string, id:string} }) => {
    setSelectedUser(`${e.value.name} (${e.value.id})`);
    onChange(e.value.id);
  }

  const gettNameAndId = (user: { id: string; name: string }):string => {
    return `${user.name} (${user.id})`
  }

  useEffect(()=>{

    if(availableUsers.length === 1){
      setSelectedUser(`${availableUsers[0].name} (${availableUsers[0].id})`);
      onChange(availableUsers[0].id);
    }
  },[availableUsers])

  return availableUsers.length > 1 ? (
    <div>
      <AutoComplete field='id' value={selectedUser} placeholder={'select admin'} suggestions={possibleUsers} completeMethod={handleUserSearch} onChange={handleChange} dropdown />
    </div>
  ) : availableUsers.length === 1 ? (
    <div>
      <InputText value={selectedUser} placeholder='Admin Id'  />
    </div>
  ) : (
    <div>
      <InputText value={selectedUser} placeholder='Admin ID'  />
    </div>
  );
};