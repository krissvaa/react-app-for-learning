import resourcesReducer, {
  setViewMode,
  setSearchQuery,
  setCategoryFilter,
  setDifficultyFilter,
  setSortBy,
} from '../resourcesSlice';

describe('resourcesSlice', () => {
  const initialState = {
    viewMode: 'grid' as const,
    searchQuery: '',
    categoryFilter: '',
    difficultyFilter: '',
    sortBy: 'date' as const,
  };

  it('should return the initial state', () => {
    expect(resourcesReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should set view mode to list', () => {
    const state = resourcesReducer(initialState, setViewMode('list'));
    expect(state.viewMode).toBe('list');
  });

  it('should set view mode back to grid', () => {
    const state = resourcesReducer({ ...initialState, viewMode: 'list' }, setViewMode('grid'));
    expect(state.viewMode).toBe('grid');
  });

  it('should set search query', () => {
    const state = resourcesReducer(initialState, setSearchQuery('react hooks'));
    expect(state.searchQuery).toBe('react hooks');
  });

  it('should set category filter', () => {
    const state = resourcesReducer(initialState, setCategoryFilter('tutorial'));
    expect(state.categoryFilter).toBe('tutorial');
  });

  it('should set difficulty filter', () => {
    const state = resourcesReducer(initialState, setDifficultyFilter('advanced'));
    expect(state.difficultyFilter).toBe('advanced');
  });

  it('should set sort by', () => {
    const state = resourcesReducer(initialState, setSortBy('title'));
    expect(state.sortBy).toBe('title');
  });

  it('should clear filters by setting empty strings', () => {
    const filtered = {
      ...initialState,
      searchQuery: 'test',
      categoryFilter: 'article',
      difficultyFilter: 'beginner',
    };
    let state = resourcesReducer(filtered, setSearchQuery(''));
    state = resourcesReducer(state, setCategoryFilter(''));
    state = resourcesReducer(state, setDifficultyFilter(''));
    expect(state.searchQuery).toBe('');
    expect(state.categoryFilter).toBe('');
    expect(state.difficultyFilter).toBe('');
  });
});
