import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { useAppSelector } from '../../app/hooks';
import { selectBookmarkIds } from './bookmarksSlice';
import { useGetResourcesQuery } from '../resources/api/resourcesApi';
import ResourceCard from '../resources/ResourceCard';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function BookmarksPage() {
  const bookmarkIds = useAppSelector(selectBookmarkIds);
  const { data: resources, isLoading } = useGetResourcesQuery();

  const bookmarkedResources = resources?.filter((r) => bookmarkIds.includes(r.id)) ?? [];

  return (
    <Box>
      <PageHeader
        title="Bookmarks"
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Bookmarks' }]}
      />

      {isLoading ? (
        <LoadingSpinner />
      ) : bookmarkedResources.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <BookmarkBorderIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No bookmarks yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Click the bookmark icon on any resource to save it here.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {bookmarkedResources.map((resource) => (
            <Grid key={resource.id} item xs={12} sm={6} md={4}>
              <ResourceCard resource={resource} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
