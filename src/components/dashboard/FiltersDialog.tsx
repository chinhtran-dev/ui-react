// Filters dialog component with react-hook-form and yup

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setDashboardConfiguration } from '../../store/slices/dashboard.slice';
import type { DashboardConfiguration, Filters, EntityFilter } from '../../types/dashboard.types';

interface FiltersDialogProps {
  open: boolean;
  onClose: () => void;
}

// Validation schema
const filterSchema = yup.object({
  type: yup.string().required('Filter type is required'),
});

type FilterFormData = yup.InferType<typeof filterSchema>;

export const FiltersDialog: React.FC<FiltersDialogProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const configuration = useAppSelector((state) => state.dashboard.dashboardConfiguration);
  const filters = configuration?.filters || {};

  const [editingFilterId, setEditingFilterId] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FilterFormData>({
    resolver: yupResolver(filterSchema),
    defaultValues: {
      type: '',
    },
  });

  const handleAdd = () => {
    setEditingFilterId(null);
    reset({ type: '' });
  };

  const handleEdit = (filterId: string, filter: EntityFilter) => {
    setEditingFilterId(filterId);
    reset({ type: filter.type || '' });
  };

  const onSubmit = (data: FilterFormData) => {
    if (!configuration || !data.type.trim()) {
      return;
    }

    const filterId = editingFilterId || `filter_${Date.now()}`;
    const newFilter: EntityFilter = {
      type: data.type.trim(),
    };

    const newFilters: Filters = {
      ...filters,
      [filterId]: newFilter,
    };

    const newConfiguration: DashboardConfiguration = {
      ...configuration,
      filters: newFilters,
    };

    dispatch(setDashboardConfiguration(newConfiguration));
    handleAdd();
  };

  const handleDelete = (filterId: string) => {
    if (!configuration) {
      return;
    }

    const newFilters = { ...filters };
    delete newFilters[filterId];

    const newConfiguration: DashboardConfiguration = {
      ...configuration,
      filters: newFilters,
    };

    dispatch(setDashboardConfiguration(newConfiguration));
  };

  const handleClose = () => {
    handleAdd();
    onClose();
  };

  const filterEntries = Object.entries(filters);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Filters</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{ mb: 2 }}
          >
            Add Filter
          </Button>
        </Box>

        {(editingFilterId || (!editingFilterId && open)) && (
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
          >
            <Typography variant="subtitle2" gutterBottom>
              {editingFilterId ? 'Edit Filter' : 'New Filter'}
            </Typography>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth required error={!!errors.type} sx={{ mt: 1 }}>
                  <InputLabel>Filter Type</InputLabel>
                  <OutlinedInput {...field} label="Filter Type" size="small" />
                  {errors.type && (
                    <FormHelperText>{errors.type.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
            <Box sx={{ mt: 2 }}>
              <Button type="submit" variant="contained" size="small" sx={{ mr: 1 }}>
                Save
              </Button>
              <Button type="button" variant="outlined" onClick={handleAdd} size="small">
                Cancel
              </Button>
            </Box>
          </Box>
        )}

        <List>
          {filterEntries.map(([filterId, filter]) => (
            <ListItem
              key={filterId}
              secondaryAction={
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    edge="end"
                    onClick={() => handleEdit(filterId, filter)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={() => handleDelete(filterId)}
                    size="small"
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText
                primary={filterId}
                secondary={`Type: ${filter.type || 'N/A'}`}
              />
            </ListItem>
          ))}
        </List>

        {filterEntries.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No filters defined. Add a filter to get started.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
