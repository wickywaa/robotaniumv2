import { IConnectedBot, IConnectedUser } from '../models';
import {store} from '../store/store';
import { userManagementSlice, setOnLineUsers, setOnlineBots } from '../store/slices';

interface IonlineConnectedUsersAndBots {
  admins: IConnectedUser[],
  users: IConnectedUser[],
  bots: IConnectedBot[]
}


export const handleUserListUpdate = (message: IonlineConnectedUsersAndBots) => {

  console.log('updates', message)

store.dispatch(setOnLineUsers({users: message.users, admins: message.admins}));
store.dispatch(setOnlineBots({bots: message.bots}))
console.log('mmessage', message)
}