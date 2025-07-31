import React, { useEffect, useState } from 'react'
import { IConnectedCockpit, ILoggedInUser } from '../../models'
import { AutoComplete, AutoCompleteCompleteEvent } from 'primereact/autocomplete'


interface ICockpitAutoComplete {
  cockpit: IConnectedCockpit,
  availableUsers: ILoggedInUser[],
  onChange: (e: IConnectedCockpit) => void
}

export const CockpitAutoComplete:React.FC<ICockpitAutoComplete> = ({cockpit, availableUsers, onChange}) => {

  const [newCockpit,setNewCockpit] = useState<IConnectedCockpit>({
    _id:'',
    player: {
      id: null,
      name: null,
    },
    status: 'offline', 
    name:'',
    sessionId:''
  })

  useEffect(()=>{

    console.log('cockpit', cockpit)
    const user = availableUsers.find((user)=>user._id === cockpit.player.id)
    if(user){
      setNewCockpit(cockpit)
      setSelectedUser(user)
    }
  },[])

  const [selectedUser,setSelectedUser]  = useState<ILoggedInUser| null >(null)
  const [possibleUsers, setPossibleUsers] = useState<ILoggedInUser[]>(availableUsers);

  const handleChange = (e:{value:ILoggedInUser} ) => {
        setSelectedUser(e.value);
        const newCockpit = {
          _id:cockpit._id,
          player: {
            id: e.value._id ?? null,
            name: availableUsers.find((user)=>user._id === e.value?._id)?.userName ?? null
          },
          status: cockpit.status,
          name: cockpit.name,
          sessionId: cockpit.sessionId
        }      
        setNewCockpit(newCockpit)
        onChange(newCockpit)
  }

  useEffect(()=>{
    console.log('availableUsers', availableUsers)
    setPossibleUsers(availableUsers)
  },[availableUsers])

   const handleUserSearch = (event:AutoCompleteCompleteEvent) => {
        const filteredUSers = availableUsers.filter((user) => {
          return user.userName.startsWith(event.query) || user.email.startsWith(event.query)
        }).map((user)=>{
          return {
            ...user,
            userName: `${user.userName} | ${user.email} | ${user._id} isRobotaniumAdmin: ${user.isRobotaniumAdmin}`
          }
        })

       setPossibleUsers(filteredUSers)
  
        return filteredUSers
      }
  return (
    <AutoComplete field='userName'  value={selectedUser} placeholder={cockpit.name} suggestions={possibleUsers} completeMethod={handleUserSearch} onChange={handleChange} dropdown />
  )

}