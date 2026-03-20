import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import NotificationsIcon from '@mui/icons-material/Notifications';
import TableChartIcon from '@mui/icons-material/TableChart';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import FaceIcon from '@mui/icons-material/Face';
import { NavLink, useLocation } from 'react-router';

const DRAWER_WIDTH = 260;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  variant: 'permanent' | 'temporary';
}

const mainLinks = [
  { to: '/', label: 'Dashboard', icon: <DashboardIcon /> },
  { to: '/resources', label: 'Resources', icon: <SchoolIcon /> },
  { to: '/characters', label: 'Characters', icon: <FaceIcon /> },
  { to: '/bookmarks', label: 'Bookmarks', icon: <BookmarkIcon /> },
  { to: '/users', label: 'Users', icon: <PeopleIcon /> },
  { to: '/analytics', label: 'Analytics', icon: <BarChartIcon /> },
  { to: '/notifications', label: 'Notifications', icon: <NotificationsIcon /> },
];

const agGridLinks = [
  { to: '/ag-grid/basic', label: 'AG-Grid Basic', icon: <TableChartIcon /> },
  { to: '/ag-grid/advanced', label: 'AG-Grid Advanced', icon: <TableChartIcon /> },
];

const bottomLinks = [
  { to: '/settings', label: 'Settings', icon: <SettingsIcon /> },
  { to: '/about', label: 'About', icon: <InfoIcon /> },
];

export default function Sidebar({ open, onClose, variant }: SidebarProps) {
  const location = useLocation();

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar />
      <List id="tour-sidebar-nav" sx={{ flex: 1 }}>
        {mainLinks.map((link) => (
          <ListItemButton
            key={link.to}
            component={NavLink}
            to={link.to}
            end={link.to === '/'}
            selected={link.to === '/' ? location.pathname === '/' : location.pathname.startsWith(link.to)}
            onClick={variant === 'temporary' ? onClose : undefined}
          >
            <ListItemIcon>{link.icon}</ListItemIcon>
            <ListItemText primary={link.label} />
          </ListItemButton>
        ))}
        <Divider sx={{ my: 1 }} />
        <Typography variant="overline" sx={{ px: 2, pt: 1, color: 'text.secondary' }}>
          AG-Grid Examples
        </Typography>
        {agGridLinks.map((link) => (
          <ListItemButton
            key={link.to}
            component={NavLink}
            to={link.to}
            selected={location.pathname === link.to}
            onClick={variant === 'temporary' ? onClose : undefined}
          >
            <ListItemIcon>{link.icon}</ListItemIcon>
            <ListItemText primary={link.label} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <List>
        {bottomLinks.map((link) => (
          <ListItemButton
            key={link.to}
            component={NavLink}
            to={link.to}
            selected={location.pathname.startsWith(link.to)}
            onClick={variant === 'temporary' ? onClose : undefined}
          >
            <ListItemIcon>{link.icon}</ListItemIcon>
            <ListItemText primary={link.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}

export { DRAWER_WIDTH };
