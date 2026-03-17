import { createBrowserRouter } from 'react-router';
import RootLayout from '../components/layout/RootLayout';
import DashboardPage from '../features/dashboard/DashboardPage';
import ResourcesListPage from '../features/resources/ResourcesListPage';
import ResourceDetailPage from '../features/resources/ResourceDetailPage';
import ResourceForm from '../features/resources/ResourceForm';
import BookmarksPage from '../features/bookmarks/BookmarksPage';
import SettingsPage from '../features/settings/SettingsPage';
import UsersPage from '../features/users/UsersPage';
import UserDetailPage from '../features/users/UserDetailPage';
import AnalyticsPage from '../features/analytics/AnalyticsPage';
import NotificationsPage from '../features/notifications/NotificationsPage';
import AboutPage from '../features/about/AboutPage';
import CharactersListPage from '../features/characters/CharactersListPage';
import CharacterDetailPage from '../features/characters/CharacterDetailPage';
import AgGridBasicPage from '../features/ag-grid/AgGridBasicPage';
import AgGridAdvancedPage from '../features/ag-grid/AgGridAdvancedPage';
import ErrorAlert from '../components/common/ErrorAlert';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorAlert message="Page not found" />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'resources', element: <ResourcesListPage /> },
      { path: 'resources/new', element: <ResourceForm /> },
      { path: 'resources/:id', element: <ResourceDetailPage /> },
      { path: 'resources/:id/edit', element: <ResourceForm /> },
      { path: 'characters', element: <CharactersListPage /> },
      { path: 'characters/:id', element: <CharacterDetailPage /> },
      { path: 'bookmarks', element: <BookmarksPage /> },
      { path: 'users', element: <UsersPage /> },
      { path: 'users/:id', element: <UserDetailPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'ag-grid/basic', element: <AgGridBasicPage /> },
      { path: 'ag-grid/advanced', element: <AgGridAdvancedPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'about', element: <AboutPage /> },
    ],
  },
]);
