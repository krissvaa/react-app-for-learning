import bookmarksReducer, { toggleBookmark, removeBookmark } from '../bookmarksSlice';

describe('bookmarksSlice', () => {
  const initialState = { ids: [] as number[] };

  it('should return the initial state', () => {
    expect(bookmarksReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should add a bookmark when toggling a non-bookmarked id', () => {
    const state = bookmarksReducer(initialState, toggleBookmark(1));
    expect(state.ids).toEqual([1]);
  });

  it('should remove a bookmark when toggling an already-bookmarked id', () => {
    const state = bookmarksReducer({ ids: [1, 2, 3] }, toggleBookmark(2));
    expect(state.ids).toEqual([1, 3]);
  });

  it('should add multiple bookmarks', () => {
    let state = bookmarksReducer(initialState, toggleBookmark(1));
    state = bookmarksReducer(state, toggleBookmark(5));
    state = bookmarksReducer(state, toggleBookmark(3));
    expect(state.ids).toEqual([1, 5, 3]);
  });

  it('should remove a specific bookmark', () => {
    const state = bookmarksReducer({ ids: [1, 2, 3] }, removeBookmark(2));
    expect(state.ids).toEqual([1, 3]);
  });

  it('should handle removing a non-existent bookmark gracefully', () => {
    const state = bookmarksReducer({ ids: [1, 2] }, removeBookmark(99));
    expect(state.ids).toEqual([1, 2]);
  });
});
