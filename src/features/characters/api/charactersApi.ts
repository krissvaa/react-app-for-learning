import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Character, CharacterFilters, PaginatedResponse } from '../types';

// LEARNING NOTE: This API is similar to resourcesApi, but with two key differences:
// 1. Server-side pagination — the API returns pages, we pass ?page=N
// 2. Server-side filtering — filters like ?status=Alive are query params, not client-side
//
// Compare with resourcesApi which loads ALL data at once and filters client-side with useMemo.

export const charactersApi = createApi({
  reducerPath: 'charactersApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://rickandmortyapi.com/api' }),
  tagTypes: ['Character'],
  endpoints: (builder) => ({

    // List endpoint — accepts filters as query params
    // LEARNING NOTE: The query function builds the URL params dynamically.
    // Only non-empty filters are included, so ?page=1&status=Alive (not ?page=1&status=&name=&gender=)
    getCharacters: builder.query<PaginatedResponse<Character>, CharacterFilters>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters.page) params.set('page', String(filters.page));
        if (filters.name) params.set('name', filters.name);
        if (filters.status) params.set('status', filters.status);
        if (filters.gender) params.set('gender', filters.gender);
        return `/character?${params.toString()}`;
      },
      // LEARNING NOTE: providesTags tells RTK Query what cache entries this data represents.
      // When a mutation invalidates 'Character', all character queries refetch automatically.
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: 'Character' as const, id })),
              { type: 'Character', id: 'LIST' },
            ]
          : [{ type: 'Character', id: 'LIST' }],
    }),

    // Detail endpoint — fetches a single character by ID
    getCharacterById: builder.query<Character, number>({
      query: (id) => `/character/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Character', id }],
    }),
  }),
});

// LEARNING NOTE: RTK Query auto-generates these hooks from the endpoint names.
// useGetCharactersQuery returns { data, isLoading, isFetching, error, refetch }
export const {
  useGetCharactersQuery,
  useGetCharacterByIdQuery,
} = charactersApi;
