// Timewindow dialog component with react-hook-form and yup

import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTimewindow } from '../../hooks/useTimewindow';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setDashboardConfiguration } from '../../store/slices/dashboard.slice';
import { timewindowService } from '../../services/dashboard/timewindow.service';
import type { Timewindow } from '../../types/dashboard.types';

interface TimewindowDialogProps {
  open: boolean;
  onClose: () => void;
}

// Validation schema with conditional validation
const timewindowSchema = yup.object({
  mode: yup.string().oneOf(['realtime', 'history']).required(),
  realtimeMs: yup.number().when('mode', {
    is: 'realtime',
    then: (schema) => schema.min(1, 'Must be greater than 0').required('Time window is required'),
    otherwise: (schema) => schema.optional(),
  }),
  historyMs: yup.number().when('mode', {
    is: 'history',
    then: (schema) => schema.min(1, 'Must be greater than 0').required('Time window is required'),
    otherwise: (schema) => schema.optional(),
  }),
  intervalMs: yup.number().when('mode', {
    is: 'history',
    then: (schema) => schema.min(1, 'Must be greater than 0').required('Interval is required'),
    otherwise: (schema) => schema.optional(),
  }),
  aggregationType: yup.string().optional(),
  limit: yup.number().when('mode', {
    is: 'history',
    then: (schema) => schema.min(1, 'Must be greater than 0').required('Limit is required'),
    otherwise: (schema) => schema.optional(),
  }),
});

type TimewindowFormData = {
  mode: 'realtime' | 'history';
  realtimeMs?: number;
  historyMs?: number;
  intervalMs?: number;
  aggregationType?: string;
  limit?: number;
};

export const TimewindowDialog: React.FC<TimewindowDialogProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const configuration = useAppSelector((state) => state.dashboard.dashboardConfiguration);
  const { timewindow, isRealtime, isHistory } = useTimewindow();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<TimewindowFormData>({
    resolver: yupResolver(timewindowSchema) as any,
    defaultValues: {
      mode: 'realtime',
      realtimeMs: 60000,
      historyMs: 86400000,
      intervalMs: 3600000,
      aggregationType: 'NONE',
      limit: 100,
    },
  });

  const mode = watch('mode');

  useEffect(() => {
    if (timewindow) {
      if (isRealtime) {
        reset({
          mode: 'realtime',
          realtimeMs: timewindow.realtime?.timewindowMs || 60000,
          historyMs: 86400000,
          intervalMs: 3600000,
          aggregationType: 'NONE',
          limit: 100,
        });
      } else if (isHistory) {
        reset({
          mode: 'history',
          realtimeMs: 60000,
          historyMs: timewindow.history?.timewindowMs || 86400000,
          intervalMs: timewindow.history?.intervalMs || 3600000,
          aggregationType: timewindow.history?.aggregationType || 'NONE',
          limit: timewindow.history?.limit || 100,
        });
      }
    }
  }, [timewindow, isRealtime, isHistory, reset]);

  const onSubmit = (data: TimewindowFormData) => {
    if (!configuration) {
      return;
    }

    let newTimewindow: Timewindow;

    if (data.mode === 'realtime') {
      newTimewindow = timewindowService.createRealtimeTimewindow(data.realtimeMs || 60000);
    } else {
      newTimewindow = timewindowService.createHistoryTimewindow(
        data.historyMs || 86400000,
        data.intervalMs || 3600000,
        data.aggregationType || 'NONE',
        data.limit || 100
      );
    }

    const newConfiguration = {
      ...configuration,
      timewindow: newTimewindow,
    };

    dispatch(setDashboardConfiguration(newConfiguration));
    onClose();
  };

  const formatDuration = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${ms / 1000}s`;
    if (ms < 3600000) return `${ms / 60000}m`;
    if (ms < 86400000) return `${ms / 3600000}h`;
    return `${ms / 86400000}d`;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Time Window Configuration</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Mode
            </Typography>
            <Controller
              name="mode"
              control={control}
              render={({ field }) => (
                <RadioGroup {...field} row>
                  <FormControlLabel value="realtime" control={<Radio />} label="Realtime" />
                  <FormControlLabel value="history" control={<Radio />} label="History" />
                </RadioGroup>
              )}
            />
          </Box>

          {mode === 'realtime' && (
            <Box sx={{ mt: 3 }}>
              <Controller
                name="realtimeMs"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth required error={!!errors.realtimeMs}>
                    <InputLabel>Time Window (ms)</InputLabel>
                    <OutlinedInput
                      {...field}
                      type="number"
                      label="Time Window (ms)"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                    {errors.realtimeMs ? (
                      <FormHelperText>{errors.realtimeMs.message}</FormHelperText>
                    ) : (
                      <FormHelperText>
                        Current: {formatDuration(field.value || 60000)}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Box>
          )}

          {mode === 'history' && (
            <Box sx={{ mt: 3 }}>
              <Controller
                name="historyMs"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth required error={!!errors.historyMs} sx={{ mb: 2 }}>
                    <InputLabel>Time Window (ms)</InputLabel>
                    <OutlinedInput
                      {...field}
                      type="number"
                      label="Time Window (ms)"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                    {errors.historyMs ? (
                      <FormHelperText>{errors.historyMs.message}</FormHelperText>
                    ) : (
                      <FormHelperText>
                        Current: {formatDuration(field.value || 86400000)}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
              <Controller
                name="intervalMs"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth required error={!!errors.intervalMs} sx={{ mb: 2 }}>
                    <InputLabel>Interval (ms)</InputLabel>
                    <OutlinedInput
                      {...field}
                      type="number"
                      label="Interval (ms)"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                    {errors.intervalMs ? (
                      <FormHelperText>{errors.intervalMs.message}</FormHelperText>
                    ) : (
                      <FormHelperText>
                        Current: {formatDuration(field.value || 3600000)}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
              <Controller
                name="aggregationType"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Aggregation Type</InputLabel>
                    <Select {...field} label="Aggregation Type">
                      <MenuItem value="NONE">None</MenuItem>
                      <MenuItem value="MIN">Min</MenuItem>
                      <MenuItem value="MAX">Max</MenuItem>
                      <MenuItem value="AVG">Average</MenuItem>
                      <MenuItem value="SUM">Sum</MenuItem>
                      <MenuItem value="COUNT">Count</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
              <Controller
                name="limit"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth required error={!!errors.limit}>
                    <InputLabel>Limit</InputLabel>
                    <OutlinedInput
                      {...field}
                      type="number"
                      label="Limit"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                    {errors.limit && (
                      <FormHelperText>{errors.limit.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Box>
          )}

          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Current: {timewindowService.formatTimewindow(timewindow)}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit(onSubmit)}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
