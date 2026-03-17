import { useState, useMemo, useCallback } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, type ColDef, type CellValueChangedEvent, type GridApi } from 'ag-grid-community';
import PageHeader from '../../components/common/PageHeader';

interface Employee {
  id: number;
  name: string;
  department: string;
  role: string;
  salary: number;
  startDate: string;
  performance: 'Excellent' | 'Good' | 'Average' | 'Below Average';
  active: boolean;
}

const departments = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'HR'];
const roles = ['Manager', 'Senior', 'Mid-Level', 'Junior', 'Intern'];
const performances: Employee['performance'][] = ['Excellent', 'Good', 'Average', 'Below Average'];
const firstNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack', 'Karen', 'Leo', 'Mia', 'Noah', 'Olivia', 'Peter', 'Quinn', 'Rachel', 'Sam', 'Tina'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Wilson', 'Moore'];

function generateEmployees(count: number): Employee[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
    department: departments[i % departments.length],
    role: roles[i % roles.length],
    salary: 45000 + Math.round(Math.random() * 105000),
    startDate: new Date(2018 + (i % 7), i % 12, (i % 28) + 1).toISOString().split('T')[0],
    performance: performances[i % performances.length],
    active: i % 5 !== 0,
  }));
}

export default function AgGridAdvancedPage() {
  const [rowData] = useState(() => generateEmployees(50));
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const columnDefs = useMemo<ColDef<Employee>[]>(
    () => [
      { field: 'id', headerName: 'ID', width: 80, pinned: 'left' },
      { field: 'name', headerName: 'Name', flex: 1, pinned: 'left', filter: 'agTextColumnFilter' },
      {
        field: 'department',
        headerName: 'Department',
        width: 150,
        filter: true,
        enableRowGroup: true,
        rowGroup: false,
      },
      {
        field: 'role',
        headerName: 'Role',
        width: 130,
        filter: true,
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: { values: roles },
      },
      {
        field: 'salary',
        headerName: 'Salary',
        width: 130,
        filter: 'agNumberColumnFilter',
        editable: true,
        valueFormatter: (params) => {
          if (params.value == null) return '';
          return `$${params.value.toLocaleString()}`;
        },
      },
      { field: 'startDate', headerName: 'Start Date', width: 140, filter: 'agDateColumnFilter', sortable: true },
      {
        field: 'performance',
        headerName: 'Performance',
        width: 150,
        filter: true,
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: { values: performances },
        cellStyle: (params) => {
          const colorMap: Record<string, string> = {
            Excellent: '#2e7d32',
            Good: '#1976d2',
            Average: '#ed6c02',
            'Below Average': '#d32f2f',
          };
          return { color: colorMap[params.value] ?? undefined, fontWeight: 600 };
        },
      },
      {
        field: 'active',
        headerName: 'Active',
        width: 100,
        editable: true,
        cellRenderer: 'agCheckboxCellRenderer',
        cellEditor: 'agCheckboxCellEditor',
      },
    ],
    [],
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      sortable: true,
      resizable: true,
    }),
    [],
  );

  const onCellValueChanged = useCallback(
    (event: CellValueChangedEvent<Employee>) => {
      setSnackbar({
        open: true,
        message: `Updated ${event.colDef.headerName} for ${event.data?.name}: ${event.oldValue} -> ${event.newValue}`,
      });
    },
    [],
  );

  const exportCsv = () => {
    gridApi?.exportDataAsCsv({ fileName: 'employees.csv' });
  };

  const resetFilters = () => {
    gridApi?.setFilterModel(null);
  };

  return (
    <Box>
      <PageHeader
        title="AG-Grid Advanced"
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'AG-Grid Advanced' }]}
      />

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Advanced AG-Grid features: editable cells, select editors, checkbox editing, column pinning,
            number/date filters, cell styling, CSV export, and 50 rows of generated employee data.
            Double-click cells in Role, Salary, Performance, or Active columns to edit them.
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" size="small" onClick={exportCsv}>
              Export CSV
            </Button>
            <Button variant="outlined" size="small" onClick={resetFilters}>
              Reset Filters
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Box sx={{ height: 600 }}>
        <AgGridReact<Employee>
          modules={[AllCommunityModule]}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={(params) => setGridApi(params.api)}
          onCellValueChanged={onCellValueChanged}
          pagination={true}
          paginationPageSize={15}
          paginationPageSizeSelector={[10, 15, 25, 50]}
          animateRows={true}
          rowSelection="multiple"
          suppressRowClickSelection={true}
        />
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: '' })}
      >
        <Alert severity="info" variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
