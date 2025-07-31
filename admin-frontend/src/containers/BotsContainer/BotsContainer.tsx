import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectCreateBot, selectShowCreateBot, selectBots, selectOnlinebots, selectLoggedInUser } from '../../store/selectors'
import { createBotAttempt, deleteBotAttempt, setBotsListAttempt, setShowCreateBot, createGameAttempt } from "../../store";
import { BotsTable, CreateBotModule } from "../../components";
import { ICreateBotDTo, IBot } from "../../models";
import { Card } from "primereact/card";
import { mapBotToTestGame } from './mappers';

export const BotsContainer: React.FC = () => {

  const dispatch = useAppDispatch();
  const createBot = useAppSelector(selectCreateBot);
  const showCreateBot = useAppSelector(selectShowCreateBot);
  const bots = useAppSelector(selectBots);
  const onlineBots = useAppSelector(selectOnlinebots);
  const [showDeleteBotModal, setShowDeleteBotModal] = useState<string>('');
  const user = useAppSelector(selectLoggedInUser);

  const handleBot = (bot: ICreateBotDTo) => dispatch(createBotAttempt(bot))

  const handleDeleteBot = (id:string)=>{
    dispatch(deleteBotAttempt(id))
    setShowDeleteBotModal('')
  } 

  useEffect(()=>{
    dispatch(setBotsListAttempt())
  },[])

  const deleteModalFooter = ():React.ReactNode => {
    return(
      <div>
        <Button label='confirm' onClick={()=> handleDeleteBot(showDeleteBotModal)} />
        <Button label='cancel'  onClick={()=> setShowDeleteBotModal('')}/>
      </div>
    )
  }

  const deleteBotModal = () => {
    return showDeleteBotModal.length ? (
      <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)'}}>
        <Card footer={deleteModalFooter}>
          <p>Press Confirm to delete bot {`${showDeleteBotModal}`}</p>
        </Card>
      </div>
    ) : <></>
  }

  const handleConnectBot = (bot: IBot) => {
    if (!user) return;
    const newGame = mapBotToTestGame(bot, user);
    dispatch(createGameAttempt({game:newGame, isLive:true}));
  }

  return <div style={{height:'89%', overflow:'auto'}}>
    <Button label='createBot' onClick={()=> dispatch(setShowCreateBot(true))}/>
      { showCreateBot && <CreateBotModule createBot={handleBot} close={()=> dispatch(setShowCreateBot(false))}/>}
      <BotsTable onConnectBot={handleConnectBot} bots={bots} onlineBots={onlineBots} onDeleteBot={(id)=>setShowDeleteBotModal(id)} />
        {showDeleteBotModal.length ? deleteBotModal(): null}
    </div>;
};