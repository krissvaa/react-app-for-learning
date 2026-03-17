import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface ResourcesState {
  viewMode: 'grid' | 'list';
  searchQuery: string;
  categoryFilter: string;
  difficultyFilter: string;
  sortBy: 'title' | 'date' | 'difficulty';
}

const initialState: ResourcesState = {
  viewMode: 'grid',
  searchQuery: '',
  categoryFilter: '',
  difficultyFilter: '',
  sortBy: 'date',
};

const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    setViewMode(state, action: PayloadAction<'grid' | 'list'>) {
      state.viewMode = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setCategoryFilter(state, action: PayloadAction<string>) {
      state.categoryFilter = action.payload;
    },
    setDifficultyFilter(state, action: PayloadAction<string>) {
      state.difficultyFilter = action.payload;
    },
    setSortBy(state, action: PayloadAction<ResourcesState['sortBy']>) {
      state.sortBy = action.payload;
    },
  },
  selectors: {
    selectViewMode: (state) => state.viewMode,
    selectSearchQuery: (state) => state.searchQuery,
    selectCategoryFilter: (state) => state.categoryFilter,
    selectDifficultyFilter: (state) => state.difficultyFilter,
    selectSortBy: (state) => state.sortBy,
  },
});

export const { setViewMode, setSearchQuery, setCategoryFilter, setDifficultyFilter, setSortBy } =
  resourcesSlice.actions;
export const { selectViewMode, selectSearchQuery, selectCategoryFilter, selectDifficultyFilter, selectSortBy } =
  resourcesSlice.selectors;
export default resourcesSlice.reducer;
