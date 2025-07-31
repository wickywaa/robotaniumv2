import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import React, { useEffect, useState } from 'react';
import { emptyGame, IBot, IConnectedBot, IGame, ILoggedInUser } from '../../models';
import { InputText } from 'primereact/inputtext';
import { SelectButton } from 'primereact/selectbutton';
import { BotForm } from './Createbotfrom';

interface ICreateGameModal {
  close: () => void;
  onSave: (game: IGame) => void;
  availableUsers: ILoggedInUser[];
  availableBots: IBot[];
  gameToEdit?: IGame;
  mode?: 'create' | 'edit';
}

export const CreateGameModal: React.FC<ICreateGameModal> = ({ close, onSave, availableBots, availableUsers, mode='create', gameToEdit }) => {

  const [createGame, setCreateGame] = useState<IGame>({ ...emptyGame });
  const numbers = [
    { name: 'Text Chat', code: 'chatEnabled' },
    { name: 'Voice Chat', code: 'voiceChatEnabled' },
    { name: 'Cameras enabled', code: 'camerasEnabled' }
  ];
  const [value, setValue] = useState<number | null | undefined>(0);
  const [availableBotsList, setAvailableBotsList] = useState<IConnectedBot[]>([]);


  const handleNumberOBotsChange = (value: number = 0) => {
    if (value < 0) return setValue(0);
    if (value > 50) return;
    setValue(value)
  }


  useEffect(() => {

    console.log('mode', mode)
    console.log('gameToEdit', gameToEdit)
    if (mode === 'edit' && gameToEdit) {

      console.log('gameToEdit', gameToEdit)
      const botsToEdit = gameToEdit.bots.map((bot) => {
        return { ...bot, key: bot._id }
      })

      console.log('botsToEdit', botsToEdit)
      setCreateGame({
        ...gameToEdit,
        bots: botsToEdit
      })
    }
  }, [])


  const handleChange = (key: keyof IGame, value: any) => {
    const newState = {
      ...createGame,
      [key]: value
    }
    setCreateGame(newState)
  }


  useEffect(() => {
    console.log('createGame', createGame)
  }, [createGame])


  const availableConnectedBots: IConnectedBot[] = availableBots.map((bot, index) => {
    return {
      key: index,
      _id: bot._id,
      name: bot.name,
      cockpits: bot.cockpits.map((cam, index) => {
        return {
          key: index,
          _id: cam._id,
          name: cam.name,
          player: {
            name: '',
            id: ''
          },
          status: 'offline',
          sessionId: ''
        }
      }),
      adminId: '',
      socketId: ''
    }
  })

  useEffect(() => {
    setAvailableBotsList(availableConnectedBots)
  }, [])


  const handleDeleteBot = (id: string) => {

    const filteredBots = createGame.bots.filter((bot) => bot._id !== id)

  }

  const handleAddBot = (bot: IConnectedBot) => {

    console.log('bot to add', bot)
    setCreateGame(
      {
        ...createGame,
        bots:createGame.bots.filter((b)=>b._id!==bot._id).concat(bot)
      }

    )
  }

  const handleSave = () => {

    console.log('createGame', createGame)
    onSave(createGame)
  }

  useEffect(()=>{
    console.log('latest createGame', createGame)
  },[createGame])

  return (
    <Card title={mode === 'create' ? 'Create Game' : 'Edit Game'} style={{ overflow: 'auto', position: 'absolute', width: '100%', height: '80%', boxSizing: 'border-box', top: '10%',left: '0' }} className="create-bot-from-container"
      pt={{
        body: () => ({
          style: { 'height': '100%' }
        }),
        content: () => ({
          style: { 'height': '100%' }
        }),
      }}>
      <div className="close-button-container">
        <Button onClick={() => close()} style={{ margin: 0 }} icon="pi pi-times" />
        <Button label='Save' onClick={() => handleSave()} />
      </div>
      <div style={{ margin: 'auto', flexDirection: 'column', justifyContent: 'start', alignItems: 'left', display: 'flex' }}>
        <InputText placeholder='name' value={createGame.name} style={{ width: '20%' }} />
        <div style={{ display: 'flex', justifyContent: '', flexDirection: 'column', width: '20%' }}>
          <Button label={createGame.chatEnabled ? 'Text Chat Enabled' : 'Text Chat disabled'} style={{ backgroundColor: createGame.chatEnabled ? 'black' : 'red' }} onClick={(e) => handleChange('chatEnabled', !createGame.chatEnabled)} />
          <Button label={createGame.chatEnabled ? 'Voice Chat Enabled' : 'Voice Chat disabled'} style={{ backgroundColor: createGame.voiceChatEnabled ? 'black' : 'red' }} onClick={(e) => handleChange('voiceChatEnabled', !createGame.voiceChatEnabled)} />
          <Button label={createGame.chatEnabled ? 'Video Chat Enabled' : 'Video Chat disabled'} style={{ backgroundColor: createGame.camerasEnabled ? 'black' : 'red' }} onClick={(e) => handleChange('camerasEnabled', !createGame.camerasEnabled)} />
        </div>
        <SelectButton value={createGame.reason} onChange={(e) => handleChange('reason', e.value)} options={[{ label: 'game', value: 'game' }, { label: 'practise', value: 'practise' }, { label: 'test', value: 'test' }]} />
        <SelectButton value={createGame.gameType} onChange={(e) => handleChange('gameType', e.value)} options={[{ label: 'private', value: 'private' }, { label: 'public', value: ' public' }]} />
        <div className="card flex justify-content-center">
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', width: '30%', position: 'relative', alignItems: 'left', justifyContent: 'space-between' }}>
          {createGame.bots.map((bot, index) => {
            return (
              <BotForm key={index} availableUsers={availableUsers} createGame={createGame} availableBots={availableBotsList} deleteBot={handleDeleteBot} bot={bot} onChange={(e) => handleAddBot(e)} />
            )
          })
          }
          <BotForm availableUsers={availableUsers} createGame={createGame} availableBots={availableBotsList} onChange={(e) => handleAddBot(e)} deleteBot={() => console.log('delete')} />
        </div>
      </div>
      <div style={{ display: 'flex', height: '70%', overflow: 'auto' }} >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          </div>
        </div>
      </div>
    </Card>
  )
}
