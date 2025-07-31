import React,{ useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectUserManagement } from '../../store/selectors';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { addUsersAttempt } from '../../store';


export const UsersTable: React.FC = () => {

  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUserManagement).users

  useEffect(()=>{
    dispatch(addUsersAttempt())
  },[])

  return (
    <div>
      <DataTable value={users?? []} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}>
        <Column field="_id" header="Id" style={{ width: '25%' }}></Column>
        <Column field="email" header="Email" style={{ width: '25%' }}></Column>
        <Column field="userName" header="UserName" style={{ width: '25%' }}></Column>
        <Column field="isEmailVerified" header="Verified" style={{ width: '25%' }}></Column>
        <Column field="isActive" header="Active" style={{ width: '25%' }}></Column>
    </DataTable>
    </div>
  )
}