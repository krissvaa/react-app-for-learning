import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router';
import { useGetResourcesQuery } from './api/resourcesApi';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  selectViewMode, selectSearchQuery, selectCategoryFilter, selectDifficultyFilter,
  setViewMode, setSearchQuery, setCategoryFilter, setDifficultyFilter,
} from './resourcesSlice';
import ResourceCard from './ResourceCard';
import PageHeader from '../../components/common/PageHeader';
import ErrorAlert from '../../components/common/ErrorAlert';
import type { Resource } from './types';

export default function ResourcesListPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: resources, isLoading, error, refetch } = useGetResourcesQuery();

  const viewMode = useAppSelector(selectViewMode);
  const searchQuery = useAppSelector(selectSearchQuery);
  const categoryFilter = useAppSelector(selectCategoryFilter);
  const difficultyFilter = useAppSelector(selectDifficultyFilter);

  const filtered = useMemo(() => {
    if (!resources) return [];
    return resources.filter((r: Resource) => {
      if (searchQuery && !r.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (categoryFilter && r.category !== categoryFilter) return false;
      if (difficultyFilter && r.difficulty !== difficultyFilter) return false;
      return true;
    });
  }, [resources, searchQuery, categoryFilter, difficultyFilter]);

  if (error) return <ErrorAlert message="Failed to load resources" onRetry={refetch} />;

  return (
    <Box>
      <PageHeader
        title="Resources"
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Resources' }]}
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/resources/new')}>
            Add Resource
          </Button>
        }
      />

      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <TextField
            size="small"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            sx={{ minWidth: 200 }}
          />
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              label="Category"
              onChange={(e) => dispatch(setCategoryFilter(e.target.value))}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="course">Course</MenuItem>
              <MenuItem value="article">Article</MenuItem>
              <MenuItem value="tutorial">Tutorial</MenuItem>
              <MenuItem value="video">Video</MenuItem>
              <MenuItem value="documentation">Documentation</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Difficulty</InputLabel>
            <Select
              value={difficultyFilter}
              label="Difficulty"
              onChange={(e) => dispatch(setDifficultyFilter(e.target.value))}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="beginner">Beginner</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="advanced">Advanced</MenuItem>
            </Select>
          </FormControl>
          <ToggleButtonGroup
            size="small"
            value={viewMode}
            exclusive
            onChange={(_, val) => val && dispatch(setViewMode(val))}
          >
            <ToggleButton value="grid"><ViewModuleIcon /></ToggleButton>
            <ToggleButton value="list"><ViewListIcon /></ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Paper>

      {isLoading ? (
        <Grid container spacing={2}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
              <Skeleton variant="rounded" height={200} />
            </Grid>
          ))}
        </Grid>
      ) : filtered.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 8 }}>
          No resources found. Try adjusting your filters.
        </Typography>
      ) : viewMode === 'grid' ? (
        <Grid container spacing={2}>
          {filtered.map((resource: Resource) => (
            <Grid key={resource.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <ResourceCard resource={resource} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Difficulty</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((resource: Resource) => (
                <TableRow key={resource.id} hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/resources/${resource.id}`)}>
                  <TableCell>{resource.title}</TableCell>
                  <TableCell><Chip label={resource.category} size="small" /></TableCell>
                  <TableCell><Chip label={resource.difficulty} size="small" /></TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5}>
                      {resource.tags.slice(0, 2).map((t) => <Chip key={t} label={t} size="small" variant="outlined" />)}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Button size="small" onClick={(e) => { e.stopPropagation(); navigate(`/resources/${resource.id}`); }}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
}
