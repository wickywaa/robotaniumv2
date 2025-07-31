import React, { ReactNode } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { IBot } from '../../models';
import  './BotCard.scss'

interface IBotCard {
  bot: IBot,
  onConnect: (bot:IBot) => void;
  onDelete: (bot:IBot) => void;
  onEdit: (bot: IBot) => void;
}

export const BotCard:React.FC<IBotCard> = ({bot, onConnect, onDelete, onEdit}) => {

    const header = (
      <div className="bot-card-header">
        <img src={bot.imageUrl} alt={bot.name} />
      </div>
    );

    const footer = (
      <div className="bot-card-footer">
        <Button
          icon="pi pi-pencil"
          className="p-button-success mr-2"
          onClick={() => onEdit(bot)}
        />
        <Button
          icon="pi pi-play"
          className="p-button-success mr-2"
          onClick={() => onConnect(bot)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-danger"
          onClick={() => onDelete(bot)}
        />
      </div>
    );

    const title = (title:string):ReactNode =>{
      return (
        <>
      <h1 > {title}</h1>
      <hr style={{color:"var(--darkgreen)", height:"1px"}}/>
      </>
      )
    }

    return (
      <Card
        key={bot.id}
        title={title(bot.name)}
        header={header}
        footer={footer}
        className="bot-card"
      >
        <div className='inside-container-card'>

        <div className="cockpits-list">
          
          <p className=''>{`${bot.cockpits.length} Camera${bot.cockpits.length > 1? 's':'' }`} </p>
          {bot.cockpits.map(cockpit => (
            <span key={cockpit.id} className="cockpit-tag">
              {cockpit.name}
            </span>
  
          ))}
        </div>
          
          </div>
        
      </Card>
    );
}


