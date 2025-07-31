import { AutoComplete, AutoCompleteCompleteEvent } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import React, { useEffect, useState } from 'react';
import { IBot, IConnectedBot, IConnectedCockpit, IGame, ILoggedInUser } from '../../models';
import { CockpitAutoComplete } from './CockpitAutoComplete';
import { SelectAdminId } from './SelectAdminId';

interface IBotForm {
    bot?: IConnectedBot;
    onChange: (e: IConnectedBot) => void;
    deleteBot: (id:string) => void;
    availableBots: IConnectedBot[];
    availableUsers: ILoggedInUser[]
    createGame: IGame 
  }


 export const BotForm: React.FC<IBotForm> = ({ bot, onChange, deleteBot, availableBots, createGame, availableUsers }): React.ReactElement => {

    const [possibleBots, setPossibleBots] = useState<IConnectedBot[]>([]);
    const [value, setValue] = useState<string>('');
    const [possibleAdmins, setPossibleAdmins] = useState<{name:string, id:string}[]>([])
    const [selectedBotId, setSelectedBotID] = useState<IConnectedBot | null>(null)


    useEffect(() => {
      setPossibleBots(availableBots)
    }, [availableBots])


    useEffect(() => {
      console.log('bot', bot)
    }, [])

    const search = (event: AutoCompleteCompleteEvent) => {
      const filteredbots = availableBots.filter((bot) => {
        return bot.name.startsWith(event.query) || bot._id.toString().startsWith(event.query)
      })
      const allBots = [...filteredbots].filter((bot) => {
        return !createGame.bots.map((bot) => bot._id).includes(bot._id)
      })
      .map((bot) => {
        return {
          _id: bot._id,
          name: `${bot.name} (${bot._id})`,
          cockpits: bot.cockpits,
          socketId: bot.socketId,
          adminId: bot.adminId
        }
      })
      setPossibleBots(allBots)
    }

    const handleBotChange = (e:{value:IConnectedBot} ) =>{
      console.log('bot', e.value)
      onChange(e.value)
    } 

    const handleAdminChange = (e:string) => {

      if(!bot?.cockpits.length) return
      console.log('admin', e)
      const findBot = createGame.bots.find((bot)=>bot._id===bot._id)
      if(!findBot) return
      const newBot:IConnectedBot = {
        ...findBot,
        adminId: e
      }
      onChange(newBot)
    }

    const handleCockpitChange = (e:IConnectedCockpit) => { 

      if(!bot) return
     const newBot:IConnectedBot = {
      ...bot,
      cockpits: bot.cockpits.map((cockpit)=>{
        if(cockpit._id === e._id){
          return e
        }
        return cockpit
      })
     }
     setPossibleAdmins(getPlayers(e))
     onChange(newBot)
    }


    const getPlayers = (connectedCockpit:IConnectedCockpit) => {
      if(possibleAdmins.find((admin)=>admin.id===connectedCockpit.player.id)) return possibleAdmins
      return [...possibleAdmins, {name:connectedCockpit.player.name??'', id:connectedCockpit.player.id??''}]
    }

    return bot ? (
      <Card style={{position:'relative', display:'flex', flexDirection:'column'}}>
        <Button>Save</Button>
        <Button onClick={() => deleteBot(bot._id)} style={{ margin: 0, position:'absolute', right:'10px', top:'5px' }} icon="pi pi-times" />
          <AutoComplete field="name" value={bot} suggestions={possibleBots} completeMethod={search} onChange={handleBotChange} dropdown />
          {bot.cockpits.map((cockpit)=>{
            return (
              <CockpitAutoComplete onChange={handleCockpitChange} cockpit={cockpit} availableUsers={availableUsers}/>
            )
          })}
          <SelectAdminId bot={bot}  availableUsers={possibleAdmins} onChange={handleAdminChange} />
          
      </Card>
    ) : (
      <Card>
        <div className="card flex justify-content-center">
          <AutoComplete field="name" value={value} suggestions={possibleBots} completeMethod={search} onChange={handleBotChange} dropdown />
        </div>
      </Card>
    )

  }