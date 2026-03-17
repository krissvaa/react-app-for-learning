import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Character } from './types';

// LEARNING NOTE: This slice manages UI state for the characters feature.
// Compare with resourcesSlice — same pattern, different filters.
//
// Key difference: when any filter changes, we reset page to 1.
// This is because the API paginates server-side, so changing a filter
// means the old page number might not exist anymore.

interface CharactersState {
  page: number;
  searchQuery: string;
  statusFilter: Character['status'] | '';
  genderFilter: Character['gender'] | '';
}

const initialState: CharactersState = {
  page: 1,
  searchQuery: '',
  statusFilter: '',
  genderFilter: '',
};

const charactersSlice = createSlice({
  name: 'characters',
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
      state.page = 1; // reset to first page when search changes
    },
    setStatusFilter(state, action: PayloadAction<CharactersState['statusFilter']>) {
      state.statusFilter = action.payload;
      state.page = 1;
    },
    setGenderFilter(state, action: PayloadAction<CharactersState['genderFilter']>) {
      state.genderFilter = action.payload;
      state.page = 1;
    },
    resetFilters() {
      return initialState;
    },
  },
  selectors: {
    selectPage: (state) => state.page,
    selectSearchQuery: (state) => state.searchQuery,
    selectStatusFilter: (state) => state.statusFilter,
    selectGenderFilter: (state) => state.genderFilter,
  },
});

export const { setPage, setSearchQuery, setStatusFilter, setGenderFilter, resetFilters } =
  charactersSlice.actions;
export const { selectPage, selectSearchQuery, selectStatusFilter, selectGenderFilter } =
  charactersSlice.selectors;
export default charactersSlice.reducer;
