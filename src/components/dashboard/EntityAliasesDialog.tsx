// Entity aliases dialog component with react-hook-form and yup

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
  ListItemSecondaryAction,
  IconButton,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEntityAliases } from '../../hooks/useEntityAliases';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setDashboardConfiguration } from '../../store/slices/dashboard.slice';
import { entityAliasesService } from '../../services/dashboard/entity-aliases.service';
import { AliasFilterType } from '../../types/dashboard.types';
import type { EntityAlias, EntityAliasFilter } from '../../types/dashboard.types';

interface EntityAliasesDialogProps {
  open: boolean;
  onClose: () => void;
}

// Validation schema
const aliasSchema = yup.object({
  alias: yup.string().required('Alias name is required'),
  filterType: yup.string().required('Filter type is required'),
  resolveMultiple: yup.boolean().optional(),
});

type AliasFormData = {
  alias: string;
  filterType: string;
  resolveMultiple?: boolean;
};

export const EntityAliasesDialog: React.FC<EntityAliasesDialogProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const configuration = useAppSelector((state) => state.dashboard.dashboardConfiguration);
  const { aliases } = useEntityAliases();

  const [editingAlias, setEditingAlias] = useState<EntityAlias | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AliasFormData>({
    resolver: yupResolver(aliasSchema) as any,
    defaultValues: {
      alias: '',
      filterType: AliasFilterType.SINGLE_ENTITY,
      resolveMultiple: false,
    },
  });

  const handleAdd = () => {
    setEditingAlias(null);
    reset({
      alias: '',
      filterType: AliasFilterType.SINGLE_ENTITY,
      resolveMultiple: false,
    });
  };

  const handleEdit = (alias: EntityAlias) => {
    setEditingAlias(alias);
    reset({
      alias: alias.alias,
      filterType: alias.filter?.type || AliasFilterType.SINGLE_ENTITY,
      resolveMultiple: alias.filter?.resolveMultiple || false,
    });
  };

  const onSubmit = (data: AliasFormData) => {
    if (!configuration || !data.alias.trim()) {
      return;
    }

    const aliasId = editingAlias?.id || `alias_${Date.now()}`;
    const filter: EntityAliasFilter = {
      type: data.filterType as AliasFilterType,
      resolveMultiple: data.resolveMultiple,
    };

    const newAlias: Partial<EntityAlias> = {
      alias: data.alias.trim(),
      filter,
    };

    const validation = entityAliasesService.validateAlias(newAlias as EntityAlias);
    if (!validation.valid) {
      console.error('Validation errors:', validation.errors);
      return;
    }

    const newConfiguration = entityAliasesService.setAlias(
      { ...configuration },
      aliasId,
      newAlias
    );
    dispatch(setDashboardConfiguration(newConfiguration));
    handleAdd();
  };

  const handleDelete = (aliasId: string) => {
    if (!configuration) {
      return;
    }

    const newConfiguration = entityAliasesService.removeAlias({ ...configuration }, aliasId);
    dispatch(setDashboardConfiguration(newConfiguration));
  };

  const handleClose = () => {
    handleAdd();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Entity Aliases</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{ mb: 2 }}
          >
            Add Alias
          </Button>
        </Box>

        {(editingAlias || (!editingAlias && open)) && (
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
          >
            <Typography variant="subtitle2" gutterBottom>
              {editingAlias ? 'Edit Alias' : 'New Alias'}
            </Typography>
            <Controller
              name="alias"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth required error={!!errors.alias} sx={{ mt: 1 }}>
                  <InputLabel>Alias Name</InputLabel>
                  <OutlinedInput {...field} label="Alias Name" size="small" />
                  {errors.alias && (
                    <FormHelperText>{errors.alias.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
            <Controller
              name="filterType"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth required error={!!errors.filterType} sx={{ mt: 1 }} size="small">
                  <InputLabel>Filter Type</InputLabel>
                  <Select {...field} label="Filter Type">
                    {Object.entries(AliasFilterType).map(([key, value]) => (
                      <MenuItem key={key} value={value}>
                        {key.replace(/_/g, ' ')}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.filterType && (
                    <FormHelperText>{errors.filterType.message}</FormHelperText>
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
          {aliases.map((alias) => (
            <ListItem key={alias.id}>
              <ListItemText
                primary={alias.alias}
                secondary={`Type: ${alias.filter?.type || 'N/A'}`}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleEdit(alias)} size="small">
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => handleDelete(alias.id)}
                  size="small"
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>

        {aliases.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No aliases defined. Add an alias to get started.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
