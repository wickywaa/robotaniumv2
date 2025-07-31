import React from 'react';
import { DataTable  } from 'primereact/datatable';
import { IBot, IConnectedBot } from '../../models';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Session } from 'inspector';
import { setOnlineBots } from '../../store';


interface BotsExpansion {
  data: IBot
}

export const BotsExpansionTemplate:React.FC<BotsExpansion> = ({data}) => {


  const cameraList = ():React.ReactElement => {
    return data.cockpits?.length ? ( <div> 
      <DataTable value={data?.cockpits}>
        <Column field='name' header='camera name'/>
        <Column field='_id' header='id'/>
        <Column field='sessionId' header='Sesion Id'/>
      </DataTable>
    </div>) : (<div>no camera selected for this bot yet</div>)
  }

  const footer = ():React.ReactElement => {
   return( <>
      <Button label='delete'/>
      <Button label='connect'/>
      <Button label='save changes'/>
    </>
   )
  }

  const renderImage = ():React.ReactElement | null => {
    return data.imageUrl?.length > 1 ? ( 
      <div>
        <img src={data?.imageUrl} alt='bot'/>
      </div>
   ) : null
  }

  return(
    <Card footer={footer} >
      {cameraList()}
      {renderImage()}
    </Card>
  )
}