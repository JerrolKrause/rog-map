import { ColDef } from 'ag-grid-community';

// Filter options : agTextColumnFilter | agNumberColumnFilter | agDateColumnFilter

export const columns: ColDef[] = [
  {
    field: 'name',
    headerName: 'Name',
  },
  {
    field: 'username',
    headerName: 'Username',
  },
  {
    field: 'email',
    headerName: 'Email',
  },
  {
    field: 'phone',
    headerName: 'Phone',
  },
  {
    field: 'website',
    headerName: 'Website',
  },
  {
    field: 'delete',
    headerName: 'Delete User',
  },
];
