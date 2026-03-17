import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useGetResourceByIdQuery, useDeleteResourceMutation } from './api/resourcesApi';
import BookmarkButton from '../bookmarks/BookmarkButton';
import PageHeader from '../../components/common/PageHeader';
import ErrorAlert from '../../components/common/ErrorAlert';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { formatDate } from '../../utils/formatters';

export default function ResourceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: resource, isLoading, error, refetch } = useGetResourceByIdQuery(Number(id));
  const [deleteResource] = useDeleteResourceMutation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleDelete = async () => {
    try {
      await deleteResource(Number(id)).unwrap();
      setSnackbar({ open: true, message: 'Resource deleted successfully', severity: 'success' });
      setTimeout(() => navigate('/resources'), 1500);
    } catch {
      setSnackbar({ open: true, message: 'Failed to delete resource', severity: 'error' });
    }
    setDeleteDialogOpen(false);
  };

  if (error) return <ErrorAlert message="Failed to load resource" onRetry={refetch} />;

  if (isLoading) {
    return (
      <Box>
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="rounded" height={300} sx={{ mt: 2 }} />
      </Box>
    );
  }

  if (!resource) return <ErrorAlert message="Resource not found" />;

  return (
    <Box>
      <PageHeader
        title={resource.title}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Resources', to: '/resources' },
          { label: resource.title },
        ]}
        action={
          <Stack direction="row" spacing={1}>
            <BookmarkButton resourceId={resource.id} />
            <Button variant="outlined" startIcon={<EditIcon />} onClick={() => navigate(`/resources/${resource.id}/edit`)}>
              Edit
            </Button>
            <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => setDeleteDialogOpen(true)}>
              Delete
            </Button>
          </Stack>
        }
      />

      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/resources')} sx={{ mb: 2 }}>
        Back to Resources
      </Button>

      <Card>
        <CardContent>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Chip label={resource.category} color="primary" />
            <Chip
              label={resource.difficulty}
              color={resource.difficulty === 'beginner' ? 'success' : resource.difficulty === 'intermediate' ? 'warning' : 'error'}
            />
            {resource.completed && <Chip label="Completed" color="success" />}
          </Stack>

          <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
            {resource.description}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              URL: <Button size="small" endIcon={<OpenInNewIcon />} href={resource.url} target="_blank">{resource.url}</Button>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Created: {formatDate(resource.createdAt)}
            </Typography>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" gutterBottom>Tags</Typography>
          <Stack direction="row" spacing={1}>
            {resource.tags.map((tag) => (
              <Chip key={tag} label={tag} variant="outlined" />
            ))}
          </Stack>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Resource"
        message="Are you sure you want to delete this resource? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      >
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
