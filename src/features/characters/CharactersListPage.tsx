import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  selectPage,
  selectSearchQuery,
  selectStatusFilter,
  selectGenderFilter,
  setPage,
  setSearchQuery,
  setStatusFilter,
  setGenderFilter,
  resetFilters,
} from './charactersSlice';
import { useGetCharactersQuery } from './api/charactersApi';
import PageHeader from '../../components/common/PageHeader';
import ErrorAlert from '../../components/common/ErrorAlert';
import CharacterCard from './CharacterCard';
import CharacterCardSkeletonGrid from './CharacterCardSkeleton';
import type { Character } from './types';

// LEARNING NOTE: This page demonstrates server-side filtering and pagination.
//
// In ResourcesListPage, ALL data is loaded once and filtered client-side with useMemo.
// Here, every filter change triggers a NEW API request — the server does the filtering.
//
// Compare:
//   Resources:  useGetResourcesQuery()             → always returns all data
//   Characters: useGetCharactersQuery(filters)      → returns only matching results
//
// This is how real-world apps work with large datasets.

export default function CharactersListPage() {
  const dispatch = useAppDispatch();

  // Read filter state from Redux
  const page = useAppSelector(selectPage);
  const searchQuery = useAppSelector(selectSearchQuery);
  const statusFilter = useAppSelector(selectStatusFilter);
  const genderFilter = useAppSelector(selectGenderFilter);

  // LEARNING NOTE: When filter values change in Redux, this hook re-runs the query
  // automatically because the argument object changed. RTK Query detects the change
  // and fetches new data. This is "reactive data fetching".
  const { data, isLoading, isFetching, error, refetch } = useGetCharactersQuery({
    page,
    name: searchQuery,
    status: statusFilter,
    gender: genderFilter,
  });

  if (error) {
    // The Rick and Morty API returns 404 when no characters match filters
    const isNotFound = 'status' in error && error.status === 404;
    if (!isNotFound) {
      return <ErrorAlert message="Failed to load characters" onRetry={refetch} />;
    }
  }

  const characters: Character[] = data?.results ?? [];
  const totalPages = data?.info.pages ?? 0;

  return (
    <Box>
      <PageHeader
        title="Characters"
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Characters' },
        ]}
      />

      {/* Filter toolbar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <TextField
            size="small"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ minWidth: 200 }}
          />

          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => dispatch(setStatusFilter(e.target.value as Character['status'] | ''))}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Alive">Alive</MenuItem>
              <MenuItem value="Dead">Dead</MenuItem>
              <MenuItem value="unknown">Unknown</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>Gender</InputLabel>
            <Select
              value={genderFilter}
              label="Gender"
              onChange={(e) => dispatch(setGenderFilter(e.target.value as Character['gender'] | ''))}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Genderless">Genderless</MenuItem>
              <MenuItem value="unknown">Unknown</MenuItem>
            </Select>
          </FormControl>

          <Button variant="text" onClick={() => dispatch(resetFilters())}>
            Clear Filters
          </Button>
        </Stack>
      </Paper>

      {/* Content area */}
      {/* LEARNING NOTE: isLoading = true on first load (no cached data yet).
          isFetching = true whenever a request is in flight (including refetches).
          We show skeletons only on the first load. On filter/page changes, the
          previous data stays visible while new data loads (better UX). */}
      {isLoading ? (
        <CharacterCardSkeletonGrid />
      ) : characters.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          No characters found. Try different filters.
        </Typography>
      ) : (
        <Box sx={{ opacity: isFetching ? 0.5 : 1, transition: 'opacity 0.2s' }}>
          <Grid container spacing={3}>
            {characters.map((character) => (
              <Grid key={character.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <CharacterCard character={character} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Pagination */}
      {/* LEARNING NOTE: MUI's Pagination component handles page number display.
          We just tell it the total pages and current page, and dispatch setPage on change. */}
      {totalPages > 1 && (
        <Stack alignItems="center" sx={{ mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, newPage) => dispatch(setPage(newPage))}
            color="primary"
            size="large"
          />
        </Stack>
      )}
    </Box>
  );
}
