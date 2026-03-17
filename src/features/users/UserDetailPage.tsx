import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LanguageIcon from '@mui/icons-material/Language';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';

interface UserDetail {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: { street: string; suite: string; city: string; zipcode: string };
  company: { name: string; catchPhrase: string; bs: string };
}

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then((res) => res.json())
      .then((data) => { setUser(data); setLoading(false); })
      .catch(() => { setError('Failed to load user'); setLoading(false); });
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading user profile..." />;
  if (error || !user) return <ErrorAlert message={error ?? 'User not found'} />;

  return (
    <Box>
      <PageHeader
        title={user.name}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Users', to: '/users' },
          { label: user.name },
        ]}
      />

      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/users')} sx={{ mb: 2 }}>
        Back to Users
      </Button>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 80, height: 80, fontSize: 32 }}>
              {user.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h5">{user.name}</Typography>
              <Typography variant="body1" color="text.secondary">@{user.username}</Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>Contact Information</Typography>
          <List disablePadding>
            <ListItem>
              <ListItemIcon><EmailIcon /></ListItemIcon>
              <ListItemText primary="Email" secondary={user.email} />
            </ListItem>
            <ListItem>
              <ListItemIcon><PhoneIcon /></ListItemIcon>
              <ListItemText primary="Phone" secondary={user.phone} />
            </ListItem>
            <ListItem>
              <ListItemIcon><LanguageIcon /></ListItemIcon>
              <ListItemText primary="Website" secondary={user.website} />
            </ListItem>
            <ListItem>
              <ListItemIcon><LocationOnIcon /></ListItemIcon>
              <ListItemText
                primary="Address"
                secondary={`${user.address.street}, ${user.address.suite}, ${user.address.city} ${user.address.zipcode}`}
              />
            </ListItem>
          </List>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>Company</Typography>
          <List disablePadding>
            <ListItem>
              <ListItemIcon><BusinessIcon /></ListItemIcon>
              <ListItemText
                primary={user.company.name}
                secondary={user.company.catchPhrase}
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}
