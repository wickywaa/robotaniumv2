import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { selectUserManagement } from '../../store/selectors';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { addUsersAttempt, deleteUserAttempt, setEditUser } from '../../store';
import { ILoggedInUser } from '../../models';
import { FilterMatchMode } from 'primereact/api';
import { TriStateCheckbox, TriStateCheckboxChangeEvent } from 'primereact/tristatecheckbox';

export const AdminUsersTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector(selectUserManagement);

  const [filters, setFilters] = useState<DataTableFilterMeta>({
    _id: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    email: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    isRobotaniumAdmin: { value: null, matchMode: FilterMatchMode.EQUALS },
    userName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    isEmailVerified: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    isActive: { value: null, matchMode: FilterMatchMode.EQUALS },
    isPlayerAdmin: { value: null, matchMode: FilterMatchMode.EQUALS }
  });

  useEffect(() => {
    dispatch(addUsersAttempt());
  }, []);

  const confirmDelete = (user: ILoggedInUser) => {
    confirmDialog({
      message: `Are you sure you want to delete user "${user.userName}"?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: () => dispatch(deleteUserAttempt({ id: user._id, userName: user.userName })),
    });
  };

  const actionBodyTemplate = (user: ILoggedInUser): JSX.Element => {
    return (
      <div className="flex gap-2">
        <Button 
          icon="pi pi-pencil"
          rounded
          outlined
          severity="success"
          tooltip="Edit User"
          tooltipOptions={{ position: 'top' }}
          onClick={() => dispatch(setEditUser({ user, showResetPassword: false }))}
        />
        <Button 
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          tooltip="Delete User"
          tooltipOptions={{ position: 'top' }}
          onClick={() => confirmDelete(user)}
        />
      </div>
    );
  };

  const adminStatusTemplate = (rowData: ILoggedInUser, type: 'robotanium' | 'player') => {
    const isAdmin = type === 'robotanium' ? rowData.isRobotaniumAdmin : rowData.isPlayerAdmin;
    return (
      <i className={classNames('pi', { 
        'true-icon pi-check-circle': isAdmin, 
        'false-icon pi-times-circle': !isAdmin 
      })}></i>
    );
  };

  const adminFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    return (
      <TriStateCheckbox 
        value={options.value} 
        onChange={(e: TriStateCheckboxChangeEvent) => options.filterApplyCallback(e.value)} 
      />
    );
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: 'calc(100vh - 80px)', // Adjust this value based on your navbar height
    }}>
      <div className="custom-datatable">
        <ConfirmDialog />
        <DataTable 
          value={users ?? []}
          filters={filters}
          filterDisplay="row"
          paginator 
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          tableStyle={{ minWidth: '50rem' }}
          stripedRows
          showGridlines
          responsiveLayout="scroll"
          className="flex-grow-0" // Prevents table from stretching
        >
          <Column 
            field="userName" 
            header="Username" 
            filter 
            filterPlaceholder="Search username"
            sortable
          />
          <Column 
            field="email" 
            header="Email" 
            filter 
            filterPlaceholder="Search email"
            sortable
          />
          <Column 
            field="isEmailVerified" 
            header="Verified" 
            filter 
            sortable
            bodyClassName="text-center"
          />
          <Column 
            field="isActive" 
            header="Active" 
            filter 
            sortable
            bodyClassName="text-center"
          />
          <Column 
            field="isRobotaniumAdmin" 
            header="Robotanium Admin" 
            dataType="boolean"
            filter
            filterElement={adminFilterTemplate}
            body={(rowData) => adminStatusTemplate(rowData, 'robotanium')}
            bodyClassName="text-center"
            sortable
          />
          <Column 
            field="isPlayerAdmin" 
            header="Player Admin" 
            dataType="boolean"
            filter
            filterElement={adminFilterTemplate}
            body={(rowData) => adminStatusTemplate(rowData, 'player')}
            bodyClassName="text-center"
            sortable
          />
          <Column 
            body={actionBodyTemplate} 
            header="Actions"
            bodyClassName="text-center"
          />
        </DataTable>
      </div>
      <div style={{ flexGrow: 1 }}></div> {/* This creates the space */}
    </div>
  );
};