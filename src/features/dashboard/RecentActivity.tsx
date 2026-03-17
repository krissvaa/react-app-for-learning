import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import SchoolIcon from '@mui/icons-material/School';
import Skeleton from '@mui/material/Skeleton';
import { useNavigate } from 'react-router';
import { useGetResourcesQuery } from '../resources/api/resourcesApi';
import { formatDate, truncateText } from '../../utils/formatters';

export default function RecentActivity() {
  const navigate = useNavigate();
  const { data: resources, isLoading } = useGetResourcesQuery();
  const recent = resources?.slice(0, 5) ?? [];

  

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Resources
        </Typography>
        <List disablePadding>
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} variant="rectangular" height={56} sx={{ mb: 1, borderRadius: 1 }} />
              ))
            : recent.map((r) => (
                <ListItemButton key={r.id} onClick={() => navigate(`/resources/${r.id}`)} sx={{ borderRadius: 1 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <SchoolIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={truncateText(r.title, 40)}
                    secondary={formatDate(r.createdAt)}
                  />
                </ListItemButton>
              ))}
        </List>
      </CardContent>
    </Card>
  );
}
