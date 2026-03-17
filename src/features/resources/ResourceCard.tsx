import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router';
import BookmarkButton from '../bookmarks/BookmarkButton';
import { truncateText } from '../../utils/formatters';
import type { Resource } from './types';

const difficultyColor: Record<Resource['difficulty'], 'success' | 'warning' | 'error'> = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'error',
};

interface ResourceCardProps {
  resource: Resource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  const navigate = useNavigate();

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="div" sx={{ flex: 1 }}>
            {truncateText(resource.title, 50)}
          </Typography>
          <BookmarkButton resourceId={resource.id} />
        </Box>
        <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
          <Chip label={resource.category} size="small" color="primary" variant="outlined" />
          <Chip label={resource.difficulty} size="small" color={difficultyColor[resource.difficulty]} />
          {resource.completed && <Chip label="Completed" size="small" color="success" variant="filled" />}
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {truncateText(resource.description, 120)}
        </Typography>
        <Stack direction="row" spacing={0.5} sx={{ mt: 1.5, flexWrap: 'wrap', gap: 0.5 }}>
          {resource.tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" variant="outlined" />
          ))}
        </Stack>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => navigate(`/resources/${resource.id}`)}>
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}
