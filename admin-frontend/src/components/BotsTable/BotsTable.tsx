import { Column } from 'primereact/column';
import { DataTable, DataTableExpandedRows } from 'primereact/datatable';
import React, { useEffect, useState } from 'react';
import { IBot, IConnectedBot } from '../../models';
import { Button } from 'primereact/button';
import { BotsExpansionTemplate } from '../';
import './BotsTable.scss';

interface BotsTableProps {
  bots: IBot[];
  onlineBots: IConnectedBot[];
  onDeleteBot: (id: string) => void;
  onConnectBot: (bot: IBot) => void;
}

export const BotsTable: React.FC<BotsTableProps> = ({
  bots,
  onDeleteBot,
  onlineBots,
  onConnectBot
}) => {
  const [expandedRows, setExpandedRows] = useState<any[] | DataTableExpandedRows>([]);

  const getLengthOfCamera = (value: IBot) => (
    <span className="camera-count">{value?.cockpits?.length ?? 0}</span>
  );

  const getStatus = (bot: IBot) => {
    const isOnline = onlineBots.find((onlineBot) => onlineBot._id === bot._id);
    return (
      <div className={`status-badge ${isOnline ? 'online' : 'offline'}`}>
        {isOnline ? 'Online' : 'Offline'}
      </div>
    );
  };

  const completeBots: IBot[] = bots.map((bot) => {
    const onlineBot = onlineBots.find((onlineBot) => onlineBot?._id === bot._id);

    return {
      _id: bot._id,
      name: bot.name,
      img: bot.img,
      imageUrl: bot.imageUrl,
      cockpits: bot.cockpits?.map((cm) => ({
        _id: cm._id,
        name: cm.name
      })) ?? []
    };
  });

  const renderActionButtons = (bot: IBot): React.ReactElement => {
    const isOnline = onlineBots.some(online => online._id === bot._id);

    return (
      <div className="action-buttons">
        {isOnline && (
          <Button
            label="Connect"
            icon="pi pi-play"
            onClick={() => onConnectBot(bot)}
            severity="secondary"
          />
        )}
        <Button
          label='Delete'
          icon="pi pi-trash"
          onClick={() => onDeleteBot(bot._id)}
          severity="danger"
        />
      </div>
    );
  };

  return (
    <div className="custom-datatable">
      <DataTable
        rowExpansionTemplate={(value) => <BotsExpansionTemplate data={value} />}
        onRowToggle={(e) => setExpandedRows(e.data)}
        expandedRows={expandedRows}
        value={completeBots}
        stripedRows
        showGridlines
      >
        <Column expander={true} style={{ width: '4rem' }} />
        <Column field="name" header="Name" sortable />
        <Column body={getLengthOfCamera} header="Cockpits" sortable style={{ width: '150px' }} />
        <Column header="Status" body={getStatus} style={{ width: '150px' }} />
        <Column header="Actions" body={renderActionButtons} style={{ width: '250px' }} />
      </DataTable>
    </div>
  );
};