import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useGetResourceByIdQuery, useCreateResourceMutation, useUpdateResourceMutation } from './api/resourcesApi';
import PageHeader from '../../components/common/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import type { ResourceFormData, Resource } from './types';

const tagSuggestions = ['react', 'typescript', 'redux', 'mui', 'router', 'testing', 'vite', 'javascript', 'css', 'node'];

const initialForm: ResourceFormData = {
  title: '',
  description: '',
  url: '',
  category: 'article',
  difficulty: 'beginner',
  tags: [],
};

interface FormErrors {
  title?: string;
  description?: string;
  url?: string;
}

function validate(form: ResourceFormData): FormErrors {
  const errors: FormErrors = {};
  if (!form.title.trim()) errors.title = 'Title is required';
  else if (form.title.length < 3) errors.title = 'Title must be at least 3 characters';
  if (!form.description.trim()) errors.description = 'Description is required';
  if (!form.url.trim()) errors.url = 'URL is required';
  else if (!/^https?:\/\/.+/.test(form.url)) errors.url = 'Must be a valid URL starting with http(s)://';
  return errors;
}

export default function ResourceForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { data: existing, isLoading: loadingExisting } = useGetResourceByIdQuery(Number(id), { skip: !isEdit });
  const [createResource] = useCreateResourceMutation();
  const [updateResource] = useUpdateResourceMutation();

  const [form, setForm] = useState<ResourceFormData>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title,
        description: existing.description,
        url: existing.url,
        category: existing.category,
        difficulty: existing.difficulty,
        tags: existing.tags,
      });
    }
  }, [existing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      if (isEdit) {
        await updateResource({ id: Number(id), ...form } as Partial<Resource> & Pick<Resource, 'id'>).unwrap();
        setSnackbar({ open: true, message: 'Resource updated!', severity: 'success' });
      } else {
        await createResource(form).unwrap();
        setSnackbar({ open: true, message: 'Resource created!', severity: 'success' });
      }
      setTimeout(() => navigate('/resources'), 1000);
    } catch {
      setSnackbar({ open: true, message: 'Something went wrong', severity: 'error' });
    }
  };

  if (isEdit && loadingExisting) return <LoadingSpinner message="Loading resource..." />;

  return (
    <Box>
      <PageHeader
        title={isEdit ? 'Edit Resource' : 'Create Resource'}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Resources', to: '/resources' },
          { label: isEdit ? 'Edit' : 'New' },
        ]}
      />

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                error={Boolean(errors.title)}
                helperText={errors.title}
                required
                fullWidth
              />
              <TextField
                label="Description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                error={Boolean(errors.description)}
                helperText={errors.description}
                required
                fullWidth
                multiline
                rows={4}
              />
              <TextField
                label="URL"
                value={form.url}
                onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                error={Boolean(errors.url)}
                helperText={errors.url}
                required
                fullWidth
                placeholder="https://example.com"
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={form.category}
                    label="Category"
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as ResourceFormData['category'] }))}
                  >
                    <MenuItem value="course">Course</MenuItem>
                    <MenuItem value="article">Article</MenuItem>
                    <MenuItem value="tutorial">Tutorial</MenuItem>
                    <MenuItem value="video">Video</MenuItem>
                    <MenuItem value="documentation">Documentation</MenuItem>
                  </Select>
                  <FormHelperText>Select the type of resource</FormHelperText>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Difficulty</InputLabel>
                  <Select
                    value={form.difficulty}
                    label="Difficulty"
                    onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value as ResourceFormData['difficulty'] }))}
                  >
                    <MenuItem value="beginner">Beginner</MenuItem>
                    <MenuItem value="intermediate">Intermediate</MenuItem>
                    <MenuItem value="advanced">Advanced</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
              <Autocomplete
                multiple
                freeSolo
                options={tagSuggestions}
                value={form.tags}
                onChange={(_, newValue) => setForm((f) => ({ ...f, tags: newValue }))}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip variant="outlined" label={option} size="small" {...getTagProps({ index })} key={option} />
                  ))
                }
                renderInput={(params) => <TextField {...params} label="Tags" placeholder="Add tags..." />}
              />
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="outlined" onClick={() => navigate('/resources')}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained">
                  {isEdit ? 'Update' : 'Create'} Resource
                </Button>
              </Stack>
            </Stack>
          </Box>
        </CardContent>
      </Card>

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
