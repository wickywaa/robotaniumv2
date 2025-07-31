import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createGameAttempt, deleteGameAttempt, getGamesAttempt, setBotsListAttempt, setShowCreateGameModal, updateCreateGame, showEditGameModal, setSelectedGameRowId  } from '../../store/slices';
import { Button } from 'primereact/button';
import { selectallUsers, selectBots, selectCreateGame, selectGames, selectShowCreateGameModal, selectUserManagement,selectSelectedGameRowId, selectShowEditGameModal } from "../../store/selectors";
import { CreateGameModal }  from '../../components/CreateGames';
import { IConnectedBot, IGame } from "../../models";
import { GamesTable } from "../../components/GamesTable/GamesTable";  

export const GamesContainer: React.FC = () => {

  const dispatch = useAppDispatch();
  const selectShowCreateGame = useAppSelector(selectShowCreateGameModal);
  const bots = useAppSelector(selectBots);
  const users = useAppSelector(selectallUsers);
  const games = useAppSelector(selectGames);
  const createGame = useAppSelector(selectCreateGame).game;
  const selectedGameRowId = useAppSelector(selectSelectedGameRowId);  
  const selecthowEditGameModal = useAppSelector(selectShowEditGameModal);
  const [gameToEdit,setGametoEdit] = useState<IGame | null>(null);


  useEffect(() => {
    if(!bots.length) {
      dispatch(setBotsListAttempt());
    }
  }, [bots]);

  useEffect(() => {
    if(selectedGameRowId) {
      setGametoEdit(games.find(game => game._id === selectedGameRowId) || null);
    }
  }, [selectedGameRowId])

  const handleChange = (game: IGame) => dispatch(updateCreateGame(game));
  const handleSave = (game: IGame) => dispatch(createGameAttempt({game, isLive:false}));
  
  const handleGameSelect = (game: IGame) => {
    // Handle view game details
    console.log('View game:', game);
  };

  const handleOnGameEditClick = (game: IGame) => {
    dispatch(setSelectedGameRowId(game._id));
    dispatch(showEditGameModal(true));
  };

  const handleGameDelete = async (gameId: string) => dispatch(deleteGameAttempt(gameId))

  const handleGamesRowClick = (game: IGame) => {
    console.log('game clicked', game);
    dispatch(setSelectedGameRowId(game._id));
  }
    

  useEffect(()=>{
    dispatch(getGamesAttempt())
  },[])

  return (
    <div style={{height:'89%', width:'100%', padding: '1rem', position: 'relative'}}>
      
      <div style={{marginBottom: '1rem'}}>
        <Button 
          label="Create Game" 
          onClick={() => dispatch(setShowCreateGameModal(!selectShowCreateGame))}
          icon="pi pi-plus"
        />
      </div>
      
      <GamesTable 
        selectedGameRowId={selectedGameRowId}
        onRowClick={handleGamesRowClick}
        games={games} 
        onGameSelect={handleGameSelect}
        onGameEdit={handleOnGameEditClick}
        onGameDelete={handleGameDelete}
      />

      {selectShowCreateGame && (
        <CreateGameModal 
          availableBots={bots}  
          availableUsers={users} 
          onSave={handleSave} 
          close={() => dispatch(setShowCreateGameModal(false))}
        />
      )}
      {
        selecthowEditGameModal && selectedGameRowId && gameToEdit && (
          <CreateGameModal
            mode="edit"
            gameToEdit={gameToEdit}
            onSave={handleSave}
            close={() => dispatch(showEditGameModal(false))}
            availableBots={bots}
            availableUsers={users}
          />
        )
      }
    </div>
  );
};


