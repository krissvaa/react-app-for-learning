import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router';
import type { Character } from './types';

// LEARNING NOTE: CardMedia is an MUI component for displaying images in cards.
// CardActionArea makes the entire card clickable with a ripple effect.

// Status dot color — maps character status to a visual indicator
const statusColor: Record<Character['status'], string> = {
  Alive: '#4caf50',    // green
  Dead: '#f44336',     // red
  unknown: '#9e9e9e',  // grey
};

interface CharacterCardProps {
  character: Character;
}

export default function CharacterCard({ character }: CharacterCardProps) {
  const navigate = useNavigate();

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea onClick={() => navigate(`/characters/${character.id}`)}>
        <CardMedia
          component="img"
          height="200"
          image={character.image}
          alt={character.name}
        />
        <CardContent>
          <Typography variant="h6" noWrap>
            {character.name}
          </Typography>

          {/* Status indicator — a colored dot + text */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: statusColor[character.status],
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {character.status} — {character.species}
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }} noWrap>
            Last seen: {character.location.name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
