/**
 * DUMMY — Same form as ResourceForm.tsx but using Zod + React Hook Form.
 *
 * Compare with the original and the RHF version to see what Zod adds:
 *  - Schema defines validation AND TypeScript types in one place
 *  - No separate `interface FormErrors` or `validate()` function
 *  - No separate `ResourceFormData` type needed — inferred from schema
 *  - zodResolver connects the schema to React Hook Form
 */
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import type { Resource } from './types';

const tagSuggestions = ['react', 'typescript', 'redux', 'mui', 'router', 'testing', 'vite', 'javascript', 'css', 'node'];

// Zod schema — single source of truth for BOTH validation and TypeScript types
// This replaces: interface FormErrors, function validate(), and interface ResourceFormData
const resourceSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters'),
  description: z
    .string()
    .min(1, 'Description is required'),
  url: z
    .string()
    .min(1, 'URL is required')
    .regex(/^https?:\/\/.+/, 'Must be a valid URL starting with http(s)://'),
  category: z.enum(['course', 'article', 'tutorial', 'video', 'documentation']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  tags: z.array(z.string()),
});

// Infer the TypeScript type from the schema — no manual type definition needed!
type ResourceFormData = z.infer<typeof resourceSchema>;

const defaultValues: ResourceFormData = {
  title: '',
  description: '',
  url: '',
  category: 'article',
  difficulty: 'beginner',
  tags: [],
};

export default function ResourceFormZod() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { data: existing, isLoading: loadingExisting } = useGetResourceByIdQuery(Number(id), { skip: !isEdit });
  const [createResource] = useCreateResourceMutation();
  const [updateResource] = useUpdateResourceMutation();

  // zodResolver connects the Zod schema to React Hook Form
  // RHF delegates all validation to Zod — no rules on individual Controllers
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResourceFormData>({
    defaultValues,
    resolver: zodResolver(resourceSchema),  // <-- this is the only difference from RHF version
  });

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

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
        title={isEdit ? 'Edit Resource (Zod)' : 'Create Resource (Zod)'}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Resources', to: '/resources' },
          { label: isEdit ? 'Edit' : 'New' },
        ]}
      />

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>

              {/* No "rules" prop needed — Zod schema handles all validation */}
              <Controller
                name="title"
                control={control}
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
