import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import { useColorScheme } from '@mui/material/styles';
import PaletteIcon from '@mui/icons-material/Palette';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import RouteIcon from '@mui/icons-material/Route';
import TableChartIcon from '@mui/icons-material/TableChart';
import BrushIcon from '@mui/icons-material/Brush';
import BugReportIcon from '@mui/icons-material/BugReport';
import ThemeToggle from '../../components/ThemeToggle';
import Counter from '../counter/Counter';
import PageHeader from '../../components/common/PageHeader';

const techStack = [
  { name: 'React 19', icon: <CodeIcon />, description: 'UI library with hooks and functional components' },
  { name: 'TypeScript', icon: <CodeIcon />, description: 'Static type checking for JavaScript' },
  { name: 'Redux Toolkit 2.x', icon: <StorageIcon />, description: 'State management with createSlice and RTK Query' },
  { name: 'React Router v7', icon: <RouteIcon />, description: 'Client-side routing with createBrowserRouter' },
  { name: 'MUI v7', icon: <BrushIcon />, description: 'Material UI component library' },
  { name: 'AG-Grid', icon: <TableChartIcon />, description: 'Enterprise data grid component' },
  { name: 'Vite', icon: <CodeIcon />, description: 'Fast build tool and dev server' },
  { name: 'Jest + RTL', icon: <BugReportIcon />, description: 'Testing framework with React Testing Library' },
];

export default function SettingsPage() {
  const { mode } = useColorScheme();

  return (
    <Box>
      <PageHeader
        title="Settings"
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Settings' }]}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <PaletteIcon />
                <Typography variant="h6">Theme</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography>Current mode:</Typography>
                <Chip label={mode ?? 'system'} color="primary" />
                <ThemeToggle />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Counter />
        </Grid>

        <Grid size={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Technology Stack</Typography>
              <Divider sx={{ mb: 1 }} />
              <List>
                {techStack.map((tech) => (
                  <ListItem key={tech.name}>
                    <ListItemIcon>{tech.icon}</ListItemIcon>
                    <ListItemText primary={tech.name} secondary={tech.description} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
