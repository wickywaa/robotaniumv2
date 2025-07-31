import React, { useEffect, useState } from 'react';
import { CockpitScreen, CockpitSidebar, LayoutControls, type LayoutType } from '../../components/Cockpit';
import  {gameSelectors, selectUser, selectCredentials } from '../../store/selectors';
import  { useAppSelector,useAppDispatch } from '../../store/hooks';
import { useSearchParams } from 'react-router-dom';
import './CockpitContainer.css';
import { webSocketServer } from '../../sockets';
import { user } from '../..';

interface ICockpitScreen {
  id: string;
  name: string;
  apiKey: string;
  sessionId: string;
  token: string;
}

const mockScreens: ICockpitScreen[] = [
  { id: '1', name: 'Front Camera', apiKey: 'your-api-key', sessionId: 'session1', token: 'token1' },
  { id: '2', name: 'Rear Camera', apiKey: 'your-api-key', sessionId: 'session2', token: 'token2' },
  { id: '3', name: 'Left Camera', apiKey: 'your-api-key', sessionId: 'session3', token: 'token3' },
  { id: '4', name: 'Right Camera', apiKey: 'your-api-key', sessionId: 'session4', token: 'token4' },
];

export const CockpitContainer: React.FC = () => {
  const [activeScreens, setActiveScreens] = useState<ICockpitScreen[]>([mockScreens[0]]);
  const [layout, setLayout] = useState<LayoutType>('single');
  const [screens, setScreens] = useState<ICockpitScreen[]>();
  const [gameId, setGameId] = useState<string | null>(null);
  const [searchParams] =  useSearchParams();
  const userId = useAppSelector(selectUser);
  const credentials = useAppSelector(selectCredentials)


  const liveGame = useAppSelector(gameSelectors.selectCockpitGame)
  useEffect(()=>{

    if(liveGame) {
      console.log('this is the live game', liveGame)
    }

  },[liveGame])

  useEffect(()=>{
    const gameId = searchParams.get('gameId')
    const token = localStorage.getItem('authToken');
    if(gameId && token !== null ) {
      setGameId(gameId)
      console.log('connec to live game')
      webSocketServer.connectToGame(gameId,token)
    }

  },[])


  useEffect(()=>{
    setScreens(credentials)
  },[credentials])    

  const handleLayoutChange = (newLayout: LayoutType) => {
    setLayout(newLayout);
    switch (newLayout) {
      case 'single':
        setActiveScreens([mockScreens[0]]);
        break;
      case 'dual':
        setActiveScreens([mockScreens[0], mockScreens[1]]);
        break;
      case 'quad':
        setActiveScreens([mockScreens[0], mockScreens[1], mockScreens[2], mockScreens[3]]);
        break;
    }
  };

  return (
    <div className="cockpit-container">
      <div className="cockpit-main">
        <div className="cockpit-header">
          <LayoutControls currentLayout={layout} onLayoutChange={handleLayoutChange} />
        </div>
        
        <div className={`cockpit-screens layout-${layout}`}>
          {activeScreens.map((screen, index) => (
            <CockpitScreen
              key={`position-${index}`}
              screen={screen}
            />
          ))}
        </div>
      </div>
      <CockpitSidebar />
    </div>
  );
};