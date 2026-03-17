import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import PageHeader from '../../components/common/PageHeader';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
  timestamp: string;
}

const initialNotifications: Notification[] = [
  { id: 1, title: 'New Resource Added', message: 'A new React 19 tutorial has been added to the library.', type: 'info', read: false, timestamp: '2025-01-15T10:30:00Z' },
  { id: 2, title: 'Course Completed', message: 'Congratulations! You completed the TypeScript Fundamentals course.', type: 'success', read: false, timestamp: '2025-01-14T14:00:00Z' },
  { id: 3, title: 'Update Available', message: 'Redux Toolkit has been updated to version 2.6. Check out the new features.', type: 'warning', read: false, timestamp: '2025-01-13T09:15:00Z' },
  { id: 4, title: 'Bookmark Reminder', message: 'You have 5 bookmarked resources you haven\'t visited in a while.', type: 'info', read: true, timestamp: '2025-01-12T16:45:00Z' },
  { id: 5, title: 'Achievement Unlocked', message: 'You\'ve added 10 resources to your library!', type: 'success', read: true, timestamp: '2025-01-11T11:00:00Z' },
  { id: 6, title: 'New Feature', message: 'AG-Grid examples have been added. Check out the Data Grid section.', type: 'info', read: true, timestamp: '2025-01-10T08:30:00Z' },
];

const typeIcon = {
  info: <InfoIcon />,
  success: <CheckCircleIcon />,
  warning: <WarningIcon />,
};

const typeColor = {
  info: '#1976d2',
  success: '#2e7d32',
  warning: '#ed6c02',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const toggleRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)),
    );
  };

  return (
    <Box>
      <PageHeader
        title="Notifications"
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Notifications' }]}
        action={
          <Stack direction="row" spacing={1} alignItems="center">
            {unreadCount > 0 && <Chip label={`${unreadCount} unread`} color="primary" size="small" />}
            <Button startIcon={<DoneAllIcon />} onClick={markAllRead} disabled={unreadCount === 0}>
              Mark all read
            </Button>
          </Stack>
        }
      />

      <Card>
        <CardContent sx={{ p: 0 }}>
          {notifications.length === 0 ? (
            <Typography sx={{ p: 4, textAlign: 'center' }} color="text.secondary">
              No notifications
            </Typography>
          ) : (
            <List disablePadding>
              {notifications.map((notification, index) => (
                <Box key={notification.id}>
                  {index > 0 && <Divider />}
                  <ListItem
                    sx={{
                      bgcolor: notification.read ? 'transparent' : 'action.hover',
                      cursor: 'pointer',
                    }}
                    onClick={() => toggleRead(notification.id)}
                    secondaryAction={
                      <IconButton edge="end" onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}>
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: typeColor[notification.type] }}>
                        {typeIcon[notification.type]}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" sx={{ fontWeight: notification.read ? 400 : 700 }}>
                          {notification.title}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary" component="span">
                            {notification.message}
                          </Typography>
                          <br />
                          <Typography variant="caption" color="text.secondary" component="span">
                            {new Date(notification.timestamp).toLocaleDateString()}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                </Box>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
