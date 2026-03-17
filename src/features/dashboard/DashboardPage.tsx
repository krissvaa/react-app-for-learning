import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import SchoolIcon from '@mui/icons-material/School';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useGetResourcesQuery } from '../resources/api/resourcesApi';
import { useAppSelector } from '../../app/hooks';
import { selectBookmarkIds } from '../bookmarks/bookmarksSlice';
import PageHeader from '../../components/common/PageHeader';
import StatCard from './StatCard';
import RecentActivity from './RecentActivity';
import Counter from '../counter/Counter';
import Timer from './Timer';

export default function DashboardPage() {
  const { data: resources } = useGetResourcesQuery();
  const bookmarkIds = useAppSelector(selectBookmarkIds);

  const totalResources = resources?.length ?? 0;
  const completedCount = resources?.filter((r) => r.completed).length ?? 0;
  const categoriesCount = new Set(resources?.map((r) => r.category)).size;

  return (
    <Box>
      <PageHeader title="Dashboard" />

      <Timer />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Resources" value={totalResources} icon={<SchoolIcon />} color="#1976d2" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Bookmarks" value={bookmarkIds.length} icon={<BookmarkIcon />} color="#9c27b0" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Completed" value={completedCount} icon={<CheckCircleIcon />} color="#2e7d32" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Categories" value={categoriesCount} icon={<TrendingUpIcon />} color="#ed6c02" />
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <RecentActivity />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Counter />
        </Grid>
      </Grid>
    </Box>
  );
}
