import React from 'react';
import { DataTable, DataTableRowEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { IGame } from '../../models';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import './GamesTable.scss';

interface IGamesTableProps {
  games: IGame[];
  onGameDelete?: (gameId: string) => void;
  onGameEdit?: (game: IGame) => void;
  onGameSelect?: (game: IGame) => void;
  onRowClick: (game: IGame) => void;
  selectedGameRowId: string;
}

export const GamesTable: React.FC<IGamesTableProps> = ({ games, onGameSelect, onGameDelete, onGameEdit, onRowClick ,selectedGameRowId}) => {
  
  const statusBodyTemplate = (game: IGame) => {
    const severity = game.gamestopped ? 'danger' : 'success';
    const value = game.gamestopped ? 'Stopped' : 'Active';
    return <Tag value={value} severity={severity} />;
  };

  const dateBodyTemplate = (game: IGame) => {
    return new Date(game.startTime).toLocaleString();
  };

  const durationBodyTemplate = (game: IGame) => {
    if (game.endTime) {
      const duration = Math.floor((game.endTime - game.startTime) / 1000);
      return `${Math.floor(duration / 60)}m ${duration % 60}s`;
    }
    return '-';
  };

  const botsBodyTemplate = (game: IGame) => {
    return game.bots.length;
  };

  const playersBodyTemplate = (game: IGame) => {
    return game.players.length;
  };
  const confirmDelete = (game: IGame) => {
    confirmDialog({
      message: `Are you sure you want to delete the game "${game.name}"?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: () => onGameDelete && onGameDelete(game._id),
    });
  };

  const actionBodyTemplate = (game: IGame) => {
    return (
      <div className="flex gap-2">
        <Button 
          icon="pi pi-eye" 
          rounded 
          outlined 
          tooltip="View"
          tooltipOptions={{ position: 'top' }}
          onClick={() => onGameSelect && onGameSelect(game)}
        />
        <Button 
          icon="pi pi-pencil" 
          rounded 
          outlined 
          severity="success"
          tooltip="Edit"
          tooltipOptions={{ position: 'top' }}
          onClick={() => onGameEdit && onGameEdit(game)}
        />
        <Button 
          icon="pi pi-trash" 
          rounded 
          outlined 
          severity="danger"
          tooltip="Delete"
          tooltipOptions={{ position: 'top' }}
          onClick={() => confirmDelete(game)}
        />
      </div>
    );
  };


  return (
    <div className="custom-datatable">
      <ConfirmDialog />
      <DataTable 
        value={games} 
        paginator 
        rows={10} 
        rowsPerPageOptions={[5, 10, 25, 50]} 
        tableStyle={{ minWidth: '50rem' }}
        sortField="startTime"
        sortOrder={-1}
        onRowClick={(data) => onRowClick(data.data as IGame)}
        rowClassName={(game) => game._id === selectedGameRowId ? 'selected-game-row' : ''}
      >
        <Column field="name" header="Name" sortable style={{ width: '25%'  }}/>
        <Column field="startTime" header="Start Time" body={dateBodyTemplate} sortable style={{ width: '15%' }}/>
        <Column field="gameType" header="Type" sortable style={{ width: '10%' }}/>
        <Column field="reason" header="Reason" sortable style={{ width: '10%' }}/>
        <Column field="bots" header="Bots" body={botsBodyTemplate} sortable style={{ width: '10%' }}/>
        <Column field="players" header="Players" body={playersBodyTemplate} sortable style={{ width: '10%' }}/>
        <Column field="duration" header="Duration" body={durationBodyTemplate} style={{ width: '10%' }}/>
        <Column field="status" header="Status" body={statusBodyTemplate} sortable style={{ width: '10%' }}/>
        <Column body={actionBodyTemplate} style={{ width: '5%' }}/>
      </DataTable>
    </div>
  );
};