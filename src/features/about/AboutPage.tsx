import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import SchoolIcon from '@mui/icons-material/School';
import PageHeader from '../../components/common/PageHeader';

const features = [
  { title: 'Redux Toolkit', description: 'State management using createSlice, configureStore, and typed hooks (.withTypes<> pattern).' },
  { title: 'RTK Query', description: 'Data fetching with createApi, auto-generated hooks, cache invalidation, and tag-based refetching.' },
  { title: 'React Router v7', description: 'Client-side routing with createBrowserRouter, nested routes, URL params, and navigation.' },
  { title: 'MUI Components', description: '40+ Material UI components including Cards, Tables, Dialogs, Forms, Drawers, AppBar, and more.' },
  { title: 'MUI Theming', description: 'Custom theme with colorSchemes for dark/light mode, CSS variables, and component overrides.' },
  { title: 'AG-Grid', description: 'Enterprise-grade data grid with sorting, filtering, pagination, row grouping, and cell editing.' },
  { title: 'TypeScript', description: 'Full type safety with interfaces, generics, typed Redux hooks, and RTK Query typing.' },
  { title: 'Jest Testing', description: 'Unit tests for Redux slices, component tests with React Testing Library, and RTK Query tests.' },
];

export default function AboutPage() {
  return (
    <Box>
      <PageHeader
        title="About LearnHub"
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'About' }]}
      />

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <SchoolIcon sx={{ fontSize: 48, color: 'primary.main' }} />
            <Box>
              <Typography variant="h5">LearnHub</Typography>
              <Typography variant="body2" color="text.secondary">
                A React learning application for exploring modern web technologies
              </Typography>
            </Box>
          </Box>
          <Typography variant="body1" sx={{ mb: 2 }}>
            LearnHub is a demo application designed to showcase how React, Redux Toolkit, React Router,
            Material UI, and AG-Grid work together in a real-world application. Each page and feature
            demonstrates different patterns and best practices.
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip label="React 19" color="primary" />
            <Chip label="TypeScript" color="secondary" />
            <Chip label="Redux Toolkit" />
            <Chip label="RTK Query" />
            <Chip label="React Router v7" />
            <Chip label="MUI v7" />
            <Chip label="AG-Grid" />
            <Chip label="Vite" />
            <Chip label="Jest" />
          </Stack>
        </CardContent>
      </Card>

      <Typography variant="h5" sx={{ mb: 2 }}>What You Can Learn</Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={2}>
        {features.map((feature) => (
          <Grid key={feature.title} item xs={12} sm={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>{feature.title}</Typography>
                <Typography variant="body2" color="text.secondary">{feature.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
