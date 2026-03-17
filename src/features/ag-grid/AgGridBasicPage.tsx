import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, type ColDef, type ICellRendererParams } from 'ag-grid-community';
import { useGetResourcesQuery } from '../resources/api/resourcesApi';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import type { Resource } from '../resources/types';

function DifficultyRenderer(params: ICellRendererParams<Resource>) {
  const colorMap: Record<string, 'success' | 'warning' | 'error'> = {
    beginner: 'success',
    intermediate: 'warning',
    advanced: 'error',
  };
  return <Chip label={params.value} size="small" color={colorMap[params.value] ?? 'default'} />;
}

function CategoryRenderer(params: ICellRendererParams<Resource>) {
  return <Chip label={params.value} size="small" color="primary" variant="outlined" />;
}

function CompletedRenderer(params: ICellRendererParams<Resource>) {
  return params.value ? <Chip label="Yes" size="small" color="success" /> : <Chip label="No" size="small" variant="outlined" />;
}

function TagsRenderer(params: ICellRendererParams<Resource>) {
  const tags: string[] = params.value ?? [];
  return (
    <Stack direction="row" spacing={0.5} sx={{ py: 0.5 }}>
      {tags.map((tag) => (
        <Chip key={tag} label={tag} size="small" variant="outlined" />
      ))}
    </Stack>
  );
}

export default function AgGridBasicPage() {
  const { data: resources, isLoading } = useGetResourcesQuery();
  const [quickFilter, setQuickFilter] = useState('');

  const columnDefs = useMemo<ColDef<Resource>[]>(
    () => [
      { field: 'id', headerName: 'ID', width: 80, sortable: true },
      { field: 'title', headerName: 'Title', flex: 2, sortable: true, filter: 'agTextColumnFilter' },
      { field: 'category', headerName: 'Category', width: 150, sortable: true, filter: true, cellRenderer: CategoryRenderer },
      { field: 'difficulty', headerName: 'Difficulty', width: 150, sortable: true, filter: true, cellRenderer: DifficultyRenderer },
      { field: 'tags', headerName: 'Tags', flex: 1, cellRenderer: TagsRenderer },
      { field: 'completed', headerName: 'Done', width: 100, sortable: true, filter: true, cellRenderer: CompletedRenderer },
    ],
    [],
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      resizable: true,
    }),
    [],
  );

  if (isLoading) return <LoadingSpinner message="Loading grid data..." />;

  return (
    <Box>
      <PageHeader
        title="AG-Grid Basic"
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'AG-Grid Basic' }]}
      />

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This page demonstrates AG-Grid basics: column definitions, sorting, filtering,
            resizable columns, custom cell renderers, and quick filter search.
          </Typography>
          <Box
            component="input"
            placeholder="Quick filter..."
            value={quickFilter}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuickFilter(e.target.value)}
            sx={{
              p: 1,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              width: 300,
              fontSize: 14,
              bgcolor: 'background.paper',
              color: 'text.primary',
            }}
          />
        </CardContent>
      </Card>

      <Box sx={{ height: 500 }}>
        <AgGridReact<Resource>
          modules={[AllCommunityModule]}
          rowData={resources ?? []}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          quickFilterText={quickFilter}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[5, 10, 20]}
          rowSelection="multiple"
          animateRows={true}
        />
      </Box>
    </Box>
  );
}
