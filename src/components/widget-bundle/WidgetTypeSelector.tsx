// Widget Type Selector Component

import React, { useState } from 'react';
import {
  Box,
  Autocomplete,
  TextField,
  Chip,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useWidgetTypes } from '../../hooks/useWidgetTypes';
import type { WidgetType } from '../../types/widget.types';

interface WidgetTypeSelectorProps {
  bundleId?: string;
  selectedTypes?: string[];
  onSelectionChange?: (selectedFqns: string[]) => void;
  multiple?: boolean;
}

const WidgetTypeSelector: React.FC<WidgetTypeSelectorProps> = ({
  bundleId,
  selectedTypes = [],
  onSelectionChange,
  multiple = true,
}) => {
  const { data: widgetTypes, isLoading } = useWidgetTypes(bundleId);
  const [selected, setSelected] = useState<string[]>(selectedTypes);

  const handleChange = (_event: any, newValue: WidgetType | WidgetType[] | null) => {
    if (!newValue) {
      setSelected([]);
      onSelectionChange?.([]);
      return;
    }
    const values = Array.isArray(newValue) ? newValue : [newValue];
    const fqns = values.map((wt) => wt.fqn);
    setSelected(fqns);
    onSelectionChange?.(fqns);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={2}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  const selectedWidgetTypes = widgetTypes?.filter((wt) => selected.includes(wt.fqn)) || [];

  return (
    <Box>
      <Autocomplete
        multiple={multiple}
        options={widgetTypes || []}
        getOptionLabel={(option) => option.name || option.fqn}
        value={selectedWidgetTypes}
        onChange={handleChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select Widget Types"
            placeholder="Search widget types..."
          />
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              key={option.fqn}
              label={option.name || option.fqn}
              size="small"
            />
          ))
        }
        renderOption={(props, option) => (
          <Box component="li" {...props}>
            <Box>
              <Typography variant="body2">{option.name || option.fqn}</Typography>
              <Typography variant="caption" color="text.secondary">
                {option.fqn}
              </Typography>
            </Box>
          </Box>
        )}
        isOptionEqualToValue={(option, value) => option.fqn === value.fqn}
      />
    </Box>
  );
};

export default WidgetTypeSelector;

