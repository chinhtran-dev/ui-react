// Dashboard states dialog component with react-hook-form and yup

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
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDashboardStates } from '../../hooks/useDashboardStates';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setDashboardConfiguration } from '../../store/slices/dashboard.slice';
import { dashboardStatesService } from '../../services/dashboard/dashboard-states.service';
import type { DashboardState } from '../../types/dashboard.types';

interface DashboardStatesDialogProps {
  open: boolean;
  onClose: () => void;
}

// Validation schema
const stateSchema = yup.object({
  name: yup.string().required('State name is required'),
  root: yup.boolean().optional(),
});

type StateFormData = {
  name: string;
  root?: boolean;
};

export const DashboardStatesDialog: React.FC<DashboardStatesDialogProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const configuration = useAppSelector((state) => state.dashboard.dashboardConfiguration);
  const { states, rootState } = useDashboardStates();

  const [editingState, setEditingState] = useState<DashboardState | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StateFormData>({
    resolver: yupResolver(stateSchema) as any,
    defaultValues: {
      name: '',
      root: false,
    },
  });

  const handleAdd = () => {
    setEditingState(null);
    reset({ name: '', root: false });
  };

  const handleEdit = (state: DashboardState) => {
    setEditingState(state);
    reset({
      name: state.name,
      root: state.root,
    });
  };

  const onSubmit = (data: StateFormData) => {
    if (!configuration || !data.name.trim()) {
      return;
    }

    const stateId = editingState?.id || `state_${Date.now()}`;
    const newState: Partial<DashboardState> = {
      name: data.name.trim(),
      root: data.root,
      layouts: editingState?.layouts || {},
    };

    let newConfiguration = { ...configuration };
    newConfiguration = dashboardStatesService.setState(newConfiguration, stateId, newState);

    if (data.root) {
      newConfiguration = dashboardStatesService.setRootState(newConfiguration, stateId);
    }

    dispatch(setDashboardConfiguration(newConfiguration));
    handleAdd();
  };

  const handleDelete = (stateId: string) => {
    if (!configuration || stateId === rootState?.id) {
      return; // Cannot delete root state
    }

    const newConfiguration = dashboardStatesService.removeState(
      { ...configuration },
      stateId
    );
    dispatch(setDashboardConfiguration(newConfiguration));
  };

  const handleClose = () => {
    handleAdd();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Dashboard States</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{ mb: 2 }}
          >
            Add State
          </Button>
        </Box>

        {(editingState || (!editingState && open)) && (
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
          >
            <Typography variant="subtitle2" gutterBottom>
              {editingState ? 'Edit State' : 'New State'}
            </Typography>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth required error={!!errors.name} sx={{ mt: 1 }}>
                  <InputLabel>State Name</InputLabel>
                  <OutlinedInput {...field} label="State Name" size="small" />
                  {errors.name && (
                    <FormHelperText>{errors.name.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
            <Controller
              name="root"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      {...field}
                      checked={field.value}
                      disabled={!!rootState && rootState.id !== editingState?.id}
                    />
                  }
                  label="Root State"
                  sx={{ mt: 1 }}
                />
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
          {states.map((state) => (
            <ListItem key={state.id}>
              <ListItemText
                primary={state.name}
                secondary={state.root ? 'Root State' : 'Regular State'}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleEdit(state)} size="small">
                  <EditIcon />
                </IconButton>
                {state.id !== rootState?.id && (
                  <IconButton
                    edge="end"
                    onClick={() => handleDelete(state.id)}
                    size="small"
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>

        {states.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No states defined. Add a state to get started.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
