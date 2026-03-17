import { configureStore } from '@reduxjs/toolkit';
import { resourcesApi } from '../features/resources/api/resourcesApi';
import { charactersApi } from '../features/characters/api/charactersApi';
import counterReducer from '../features/counter/counterSlice';
import bookmarksReducer from '../features/bookmarks/bookmarksSlice';
import resourcesReducer from '../features/resources/resourcesSlice';
import charactersReducer from '../features/characters/charactersSlice';

export const store = configureStore({
  reducer: {
    [resourcesApi.reducerPath]: resourcesApi.reducer,
    [charactersApi.reducerPath]: charactersApi.reducer,
    counter: counterReducer,
    bookmarks: bookmarksReducer,
    resources: resourcesReducer,
    characters: charactersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(resourcesApi.middleware, charactersApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
