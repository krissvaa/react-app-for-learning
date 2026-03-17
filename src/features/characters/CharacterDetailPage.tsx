import { useParams, useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useGetCharacterByIdQuery } from './api/charactersApi';
import PageHeader from '../../components/common/PageHeader';
import ErrorAlert from '../../components/common/ErrorAlert';
import type { Character } from './types';

// LEARNING NOTE: This detail page follows the same pattern as ResourceDetailPage:
// 1. Read :id from the URL with useParams
// 2. Fetch data with RTK Query hook
// 3. Handle loading/error/not-found states
// 4. Render the detail view
//
// Since this is a read-only API, there's no edit/delete like ResourceDetailPage has.

const statusColor: Record<Character['status'], 'success' | 'error' | 'default'> = {
  Alive: 'success',
  Dead: 'error',
  unknown: 'default',
};

export default function CharacterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: character, isLoading, error, refetch } = useGetCharacterByIdQuery(Number(id));

  if (error) return <ErrorAlert message="Failed to load character" onRetry={refetch} />;

  // LEARNING NOTE: Skeleton loading state — matches the layout of the actual content
  // so the page doesn't jump when data arrives. Compare with ResourceDetailPage which
  // uses simpler Skeleton blocks.
  if (isLoading) {
    return (
      <Box>
        <Skeleton variant="text" width={200} height={40} />
        <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, mt: 2 }}>
          <Skeleton variant="rectangular" sx={{ width: { xs: '100%', md: 300 }, height: 300 }} />
          <CardContent sx={{ flex: 1 }}>
            <Skeleton variant="text" sx={{ fontSize: '2rem' }} width="60%" />
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="text" width="50%" />
            <Skeleton variant="text" width="45%" />
            <Skeleton variant="text" width="35%" />
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (!character) return <ErrorAlert message="Character not found" />;

  const episodeCount = character.episode.length;

  return (
    <Box>
      <PageHeader
        title={character.name}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Characters', to: '/characters' },
          { label: character.name },
        ]}
      />

      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/characters')} sx={{ mb: 2 }}>
        Back to Characters
      </Button>

      {/* Character detail card — image on left, info on right */}
      <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <CardMedia
          component="img"
          image={character.image}
          alt={character.name}
          sx={{ width: { xs: '100%', md: 300 }, height: { xs: 300, md: 'auto' } }}
        />
        <CardContent sx={{ flex: 1 }}>
          <Typography variant="h4" gutterBottom>
            {character.name}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Chip label={character.status} color={statusColor[character.status]} />
            <Chip label={character.species} variant="outlined" />
            <Chip label={character.gender} variant="outlined" />
            {character.type && <Chip label={character.type} variant="outlined" size="small" />}
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Stack spacing={1.5}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Origin</Typography>
              <Typography variant="body1">{character.origin.name}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Last Known Location</Typography>
              <Typography variant="body1">{character.location.name}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Episodes</Typography>
              <Typography variant="body1">
                Appeared in {episodeCount} episode{episodeCount !== 1 ? 's' : ''}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Created</Typography>
              <Typography variant="body1">
                {new Date(character.created).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
