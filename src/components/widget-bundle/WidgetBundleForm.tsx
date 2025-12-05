// Widget Bundle Form Component with react-hook-form and yup

import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Alert,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSaveWidgetBundle, useUpdateWidgetBundle } from '../../hooks/useWidgetBundles';
import type { WidgetsBundle } from '../../types/widget.types';

interface WidgetBundleFormProps {
  open: boolean;
  bundle: WidgetsBundle | null;
  onClose: () => void;
}

// Validation schema
const widgetBundleSchema = yup.object({
  title: yup.string().required('Title is required'),
  alias: yup.string().required('Alias is required'),
  description: yup.string().optional(),
});

type WidgetBundleFormData = {
  title: string;
  alias: string;
  description?: string;
};

const WidgetBundleForm: React.FC<WidgetBundleFormProps> = ({ open, bundle, onClose }) => {
  const saveMutation = useSaveWidgetBundle();
  const updateMutation = useUpdateWidgetBundle();
  const isEdit = !!bundle;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WidgetBundleFormData>({
    resolver: yupResolver(widgetBundleSchema) as any,
    defaultValues: {
      title: '',
      alias: '',
      description: '',
    },
  });

  // Reset form when bundle changes
  useEffect(() => {
    if (bundle) {
      reset({
        title: bundle.title || '',
        alias: bundle.alias || '',
        description: bundle.description || '',
      });
    } else {
      reset({
        title: '',
        alias: '',
        description: '',
      });
    }
  }, [bundle, open, reset]);

  const onSubmit = (data: WidgetBundleFormData) => {
    const bundleData: Partial<WidgetsBundle> = {
      ...data,
      ...(isEdit && bundle ? { id: bundle.id } : {}),
    };

    if (isEdit) {
      updateMutation.mutate(bundleData as WidgetsBundle, {
        onSuccess: () => {
          onClose();
        },
      });
    } else {
      saveMutation.mutate(bundleData as WidgetsBundle, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const mutation = isEdit ? updateMutation : saveMutation;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Widget Bundle' : 'Add Widget Bundle'}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {mutation.isError && (
            <Alert severity="error">
              {mutation.error instanceof Error
                ? mutation.error.message
                : 'Failed to save widget bundle'}
            </Alert>
          )}

          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth required error={!!errors.title}>
                <InputLabel>Title</InputLabel>
                <OutlinedInput {...field} label="Title" />
                {errors.title && (
                  <FormHelperText>{errors.title.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          <Controller
            name="alias"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth required error={!!errors.alias} disabled={isEdit}>
                <InputLabel>Alias</InputLabel>
                <OutlinedInput {...field} label="Alias" />
                {errors.alias ? (
                  <FormHelperText>{errors.alias.message}</FormHelperText>
                ) : (
                  <FormHelperText>
                    {isEdit ? 'Alias cannot be changed' : 'Unique identifier for the bundle'}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.description}>
                <InputLabel>Description</InputLabel>
                <OutlinedInput
                  {...field}
                  label="Description"
                  multiline
                  rows={3}
                />
                {errors.description && (
                  <FormHelperText>{errors.description.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={isSubmitting || mutation.isPending}
        >
          {isSubmitting || mutation.isPending ? 'Saving...' : isEdit ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WidgetBundleForm;
