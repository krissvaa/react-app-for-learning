import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Resource, ResourceFormData } from '../types';

const categories: Resource['category'][] = ['course', 'article', 'tutorial', 'video', 'documentation'];
const difficulties: Resource['difficulty'][] = ['beginner', 'intermediate', 'advanced'];
const tagOptions = ['react', 'typescript', 'redux', 'mui', 'router', 'testing', 'vite', 'javascript'];

function transformPost(post: { id: number; title: string; body: string }): Resource {
  return {
    id: post.id,
    title: post.title.charAt(0).toUpperCase() + post.title.slice(1),
    description: post.body,
    url: `https://example.com/resource/${post.id}`,
    category: categories[post.id % categories.length],
    difficulty: difficulties[post.id % difficulties.length],
    tags: tagOptions.slice(0, (post.id % 4) + 1),
    completed: post.id % 3 === 0,
    createdAt: new Date(2025, 0, post.id).toISOString(),
  };
}

export const resourcesApi = createApi({
  reducerPath: 'resourcesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com' }),
  tagTypes: ['Resource'],
  endpoints: (builder) => ({
    getResources: builder.query<Resource[], void>({
      query: () => '/posts',
      transformResponse: (response: { id: number; title: string; body: string }[]) =>
        response.slice(0, 20).map(transformPost),
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Resource' as const, id })), 'Resource']
          : ['Resource'],
    }),
    getResourceById: builder.query<Resource, number>({
      query: (id) => `/posts/${id}`,
      transformResponse: (post: { id: number; title: string; body: string }) => transformPost(post),
      providesTags: (_result, _error, id) => [{ type: 'Resource', id }],
    }),
    createResource: builder.mutation<Resource, ResourceFormData>({
      query: (body) => ({ url: '/posts', method: 'POST', body }),
      invalidatesTags: ['Resource'],
    }),
    updateResource: builder.mutation<Resource, Partial<Resource> & Pick<Resource, 'id'>>({
      query: ({ id, ...patch }) => ({ url: `/posts/${id}`, method: 'PATCH', body: patch }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Resource', id }],
    }),
    deleteResource: builder.mutation<void, number>({
      query: (id) => ({ url: `/posts/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Resource', id }],
    }),
  }),
});

export const {
  useGetResourcesQuery,
  useGetResourceByIdQuery,
  useCreateResourceMutation,
  useUpdateResourceMutation,
  useDeleteResourceMutation,
} = resourcesApi;
