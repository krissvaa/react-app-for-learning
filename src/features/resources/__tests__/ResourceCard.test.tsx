import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { configureStore } from '@reduxjs/toolkit';
import bookmarksReducer from '../../bookmarks/bookmarksSlice';
import ResourceCard from '../ResourceCard';
import type { Resource } from '../types';

const mockResource: Resource = {
  id: 1,
  title: 'Learn React Testing',
  description: 'A comprehensive guide to testing React applications with Jest and Testing Library.',
  url: 'https://example.com/react-testing',
  category: 'tutorial',
  difficulty: 'intermediate',
  tags: ['react', 'testing'],
  completed: false,
  createdAt: '2025-01-15T00:00:00.000Z',
};

function renderWithProviders(resource: Resource) {
  const store = configureStore({
    reducer: { bookmarks: bookmarksReducer },
    preloadedState: { bookmarks: { ids: [] } },
  });
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <ResourceCard resource={resource} />
      </MemoryRouter>
    </Provider>,
  );
}

describe('ResourceCard', () => {
  it('renders the resource title', () => {
    renderWithProviders(mockResource);
    expect(screen.getByText('Learn React Testing')).toBeInTheDocument();
  });

  it('renders the category chip', () => {
    renderWithProviders(mockResource);
    expect(screen.getByText('tutorial')).toBeInTheDocument();
  });

  it('renders the difficulty chip', () => {
    renderWithProviders(mockResource);
    expect(screen.getByText('intermediate')).toBeInTheDocument();
  });

  it('renders tags', () => {
    renderWithProviders(mockResource);
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('testing')).toBeInTheDocument();
  });

  it('renders View Details button', () => {
    renderWithProviders(mockResource);
    expect(screen.getByText('View Details')).toBeInTheDocument();
  });

  it('shows completed chip when resource is completed', () => {
    renderWithProviders({ ...mockResource, completed: true });
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('does not show completed chip when resource is not completed', () => {
    renderWithProviders(mockResource);
    expect(screen.queryByText('Completed')).not.toBeInTheDocument();
  });

  it('truncates long descriptions', () => {
    const longDesc = 'A'.repeat(200);
    renderWithProviders({ ...mockResource, description: longDesc });
    const descElement = screen.getByText(/A+\.\.\./);
    expect(descElement).toBeInTheDocument();
  });
});
