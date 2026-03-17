import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface BookmarksState {
  ids: number[];
}

const initialState: BookmarksState = { ids: [] };

const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    toggleBookmark(state, action: PayloadAction<number>) {
      const index = state.ids.indexOf(action.payload);
      if (index >= 0) {
        state.ids.splice(index, 1);
      } else {
        state.ids.push(action.payload);
      }
    },
    removeBookmark(state, action: PayloadAction<number>) {
      state.ids = state.ids.filter((id) => id !== action.payload);
    },
  },
  selectors: {
    selectBookmarkIds: (state) => state.ids,
  },
});

export const { toggleBookmark, removeBookmark } = bookmarksSlice.actions;
export const { selectBookmarkIds } = bookmarksSlice.selectors;
export default bookmarksSlice.reducer;
