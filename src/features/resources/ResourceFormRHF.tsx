/**
 * DUMMY — Same form as ResourceForm.tsx but using React Hook Form.
 *
 * Compare with the original to see what RHF replaces:
 *  - No useState for form data (RHF manages it internally)
 *  - No useState for errors (formState.errors)
 *  - No manual validate() function (rules declared per field)
 *  - No e.preventDefault() (handleSubmit does it)
 *  - Errors clear automatically as the user types
 */
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
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

const defaultValues: ResourceFormData = {
  title: '',
  description: '',
  url: '',
  category: 'article',
  difficulty: 'beginner',
  tags: [],
};

export default function ResourceFormRHF() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { data: existing, isLoading: loadingExisting } = useGetResourceByIdQuery(Number(id), { skip: !isEdit });
  const [createResource] = useCreateResourceMutation();
  const [updateResource] = useUpdateResourceMutation();

  // React Hook Form — replaces useState for form + errors
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResourceFormData>({ defaultValues });

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Populate form when editing — reset() replaces setForm()
  useEffect(() => {
    if (existing) {
      reset({
        title: existing.title,
        description: existing.description,
        url: existing.url,
        category: existing.category,
        difficulty: existing.difficulty,
        tags: existing.tags,
      });
    }
  }, [existing, reset]);

  // RHF's handleSubmit: validates first, then calls onSubmit with clean data
  // No need for e.preventDefault() or manual validation
  const onSubmit = async (data: ResourceFormData) => {
    try {
      if (isEdit) {
        await updateResource({ id: Number(id), ...data } as Partial<Resource> & Pick<Resource, 'id'>).unwrap();
        setSnackbar({ open: true, message: 'Resource updated!', severity: 'success' });
      } else {
        await createResource(data).unwrap();
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
        title={isEdit ? 'Edit Resource (RHF)' : 'Create Resource (RHF)'}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Resources', to: '/resources' },
          { label: isEdit ? 'Edit' : 'New' },
        ]}
      />

      <Card>
        <CardContent>
          {/* handleSubmit wraps onSubmit: validates → calls onSubmit if valid */}
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>

              {/* Controller bridges RHF with MUI's controlled components */}
              {/* rules = validation — replaces the validate() function */}
              <Controller
                name="title"
                control={control}
                rules={{
                  required: 'Title is required',
                  minLength: { value: 3, message: 'Title must be at least 3 characters' },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Title"
                    error={Boolean(errors.title)}
                    helperText={errors.title?.message}
                    required
                    fullWidth
                  />
                )}
              />

              <Controller
                name="description"
                control={control}
                rules={{ required: 'Description is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    error={Boolean(errors.description)}
                    helperText={errors.description?.message}
                    required
                    fullWidth
                    multiline
                    rows={4}
                  />
                )}
              />

              <Controller
                name="url"
                control={control}
                rules={{
                  required: 'URL is required',
                  pattern: {
                    value: /^https?:\/\/.+/,
                    message: 'Must be a valid URL starting with http(s)://',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="URL"
                    error={Boolean(errors.url)}
                    helperText={errors.url?.message}
                    required
                    fullWidth
                    placeholder="https://example.com"
                  />
                )}
              />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Category</InputLabel>
                      <Select {...field} label="Category">
                        <MenuItem value="course">Course</MenuItem>
                        <MenuItem value="article">Article</MenuItem>
                        <MenuItem value="tutorial">Tutorial</MenuItem>
                        <MenuItem value="video">Video</MenuItem>
                        <MenuItem value="documentation">Documentation</MenuItem>
                      </Select>
                      <FormHelperText>Select the type of resource</FormHelperText>
                    </FormControl>
                  )}
                />
                <Controller
                  name="difficulty"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Difficulty</InputLabel>
                      <Select {...field} label="Difficulty">
                        <MenuItem value="beginner">Beginner</MenuItem>
                        <MenuItem value="intermediate">Intermediate</MenuItem>
                        <MenuItem value="advanced">Advanced</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Stack>

              <Controller
                name="tags"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <Autocomplete
                    {...field}
                    multiple
                    freeSolo
                    options={tagSuggestions}
                    value={value}
                    onChange={(_, newValue) => onChange(newValue)}
                    renderTags={(val, getTagProps) =>
                      val.map((option, index) => (
                        <Chip variant="outlined" label={option} size="small" {...getTagProps({ index })} key={option} />
                      ))
                    }
                    renderInput={(params) => <TextField {...params} label="Tags" placeholder="Add tags..." />}
                  />
                )}
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
