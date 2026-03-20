import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';

// LEARNING NOTE: Skeleton components are placeholder animations that show
// while content is loading. They match the shape of the real content so the
// layout doesn't "jump" when data arrives. This is better UX than a spinner
// because the user can see the page structure immediately.
//
// MUI Skeleton variants:
//   "rectangular" — a solid block (good for images)
//   "text" — matches text line height
//   "circular" — for avatars or icons

function CharacterCardSkeleton() {
  return (
    <Card sx={{ height: '100%' }}>
      {/* Matches the CardMedia image height in CharacterCard */}
      <Skeleton variant="rectangular" height={200} />
      <CardContent>
        {/* Matches the h6 title */}
        <Skeleton variant="text" sx={{ fontSize: '1.25rem' }} width="80%" />
        {/* Matches the status line */}
        <Skeleton variant="text" width="60%" />
        {/* Matches the location line */}
        <Skeleton variant="text" width="70%" />
      </CardContent>
    </Card>
  );
}

// Renders a grid of skeleton cards — use this while the character list is loading
export default function CharacterCardSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }, (_, i) => (
        <Grid key={i} item xs={12} sm={6} md={4} lg={3}>
          <CharacterCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
}
