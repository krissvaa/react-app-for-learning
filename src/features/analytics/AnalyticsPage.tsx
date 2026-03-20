import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import { useGetResourcesQuery } from '../resources/api/resourcesApi';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import type { Resource } from '../resources/types';

interface CategoryStat {
  name: string;
  count: number;
  percentage: number;
}

export default function AnalyticsPage() {
  const { data: resources, isLoading } = useGetResourcesQuery();

  if (isLoading) return <LoadingSpinner message="Loading analytics..." />;

  const total = resources?.length ?? 0;
  const completed = resources?.filter((r) => r.completed).length ?? 0;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const categoryStats: CategoryStat[] = (['course', 'article', 'tutorial', 'video', 'documentation'] as const).map((cat) => {
    const count = resources?.filter((r: Resource) => r.category === cat).length ?? 0;
    return { name: cat, count, percentage: total > 0 ? Math.round((count / total) * 100) : 0 };
  });

  const difficultyStats = (['beginner', 'intermediate', 'advanced'] as const).map((diff) => {
    const count = resources?.filter((r: Resource) => r.difficulty === diff).length ?? 0;
    return { name: diff, count, percentage: total > 0 ? Math.round((count / total) * 100) : 0 };
  });

  const difficultyColors: Record<string, 'success' | 'warning' | 'error'> = {
    beginner: 'success',
    intermediate: 'warning',
    advanced: 'error',
  };

  const tagCounts: Record<string, number> = {};
  resources?.forEach((r: Resource) => {
    r.tags.forEach((t) => { tagCounts[t] = (tagCounts[t] || 0) + 1; });
  });
  const topTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);

  return (
    <Box>
      <PageHeader
        title="Analytics"
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Analytics' }]}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Completion Rate</Typography>
              <Typography variant="h3" sx={{ mb: 1 }}>{completionRate}%</Typography>
              <LinearProgress
                variant="determinate"
                value={completionRate}
                sx={{ height: 12, borderRadius: 6, mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                {completed} of {total} resources completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Popular Tags</Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {topTags.map(([tag, count]) => (
                  <Chip key={tag} label={`${tag} (${count})`} variant="outlined" />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>By Category</Typography>
              <Stack spacing={2}>
                {categoryStats.map((stat) => (
                  <Box key={stat.name}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{stat.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{stat.count} ({stat.percentage}%)</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={stat.percentage} sx={{ height: 8, borderRadius: 4 }} />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>By Difficulty</Typography>
              <Stack spacing={2}>
                {difficultyStats.map((stat) => (
                  <Box key={stat.name}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{stat.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{stat.count} ({stat.percentage}%)</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={stat.percentage}
                      color={difficultyColors[stat.name]}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
