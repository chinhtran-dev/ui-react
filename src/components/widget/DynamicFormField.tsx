// Dynamic form field component with react-hook-form

import React from 'react';
import {
  OutlinedInput,
  InputLabel,
  FormHelperText,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  RadioGroup,
  Radio,
  Box,
  Typography,
  InputAdornment,
} from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import type { FormProperty } from '../../types/widget.types';

interface DynamicFormFieldProps {
  property: FormProperty;
}

export const DynamicFormField: React.FC<DynamicFormFieldProps> = ({ property }) => {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[property.id]?.message as string | undefined;

  // Check visibility condition
  if (property.visible === false) {
    return null;
  }

  // Check condition function
  const { watch } = useFormContext();
  const formValues = watch();
  if (property.conditionFunction && !property.conditionFunction(property, formValues)) {
    return null;
  }

  const renderField = () => {
    switch (property.type) {
      case 'text':
      case 'password':
        return (
          <Controller
            name={property.id}
            control={control}
            defaultValue={property.default ?? ''}
            render={({ field }) => (
              <FormControl fullWidth required={property.required} error={!!error} disabled={property.disabled}>
                <InputLabel>{property.name}</InputLabel>
                <OutlinedInput
                  {...field}
                  type={property.type === 'password' ? 'password' : 'text'}
                  label={property.name}
                  endAdornment={
                    property.fieldSuffix ? (
                      <InputAdornment position="end">
                        <Typography variant="body2" color="text.secondary">
                          {property.fieldSuffix}
                        </Typography>
                      </InputAdornment>
                    ) : undefined
                  }
                />
                {(property.hint || error) && (
                  <FormHelperText>{property.hint || error}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        );

      case 'number':
        return (
          <Controller
            name={property.id}
            control={control}
            defaultValue={property.default ?? 0}
            render={({ field }) => (
              <FormControl fullWidth required={property.required} error={!!error} disabled={property.disabled}>
                <InputLabel>{property.name}</InputLabel>
                <OutlinedInput
                  {...field}
                  type="number"
                  label={property.name}
                  inputProps={{
                    min: property.min,
                    max: property.max,
                    step: property.step,
                  }}
                  onChange={(e) => {
                    const value = e.target.value === '' ? undefined : Number(e.target.value);
                    field.onChange(value);
                  }}
                />
                {(property.hint || error) && (
                  <FormHelperText>{property.hint || error}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        );

      case 'textarea':
        return (
          <Controller
            name={property.id}
            control={control}
            defaultValue={property.default ?? ''}
            render={({ field }) => (
              <FormControl fullWidth required={property.required} error={!!error} disabled={property.disabled}>
                <InputLabel>{property.name}</InputLabel>
                <OutlinedInput
                  {...field}
                  label={property.name}
                  multiline
                  rows={property.rows || 4}
                />
                {(property.hint || error) && (
                  <FormHelperText>{property.hint || error}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        );

      case 'switch':
        return (
          <Controller
            name={property.id}
            control={control}
            defaultValue={property.default ?? false}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    {...field}
                    checked={field.value ?? false}
                    disabled={property.disabled}
                  />
                }
                label={property.name}
              />
            )}
          />
        );

      case 'select':
        return (
          <Controller
            name={property.id}
            control={control}
            defaultValue={property.default ?? (property.multiple ? [] : '')}
            render={({ field }) => (
              <FormControl fullWidth required={property.required} error={!!error} disabled={property.disabled}>
                <InputLabel>{property.name}</InputLabel>
                <Select
                  {...field}
                  multiple={property.multiple}
                  label={property.name}
                >
                  {property.allowEmptyOption && !property.multiple && (
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                  )}
                  {property.items?.map((item) => (
                    <MenuItem key={String(item.value)} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
                {(property.hint || error) && <FormHelperText>{property.hint || error}</FormHelperText>}
              </FormControl>
            )}
          />
        );

      case 'radios':
        return (
          <Controller
            name={property.id}
            control={control}
            defaultValue={property.default ?? ''}
            render={({ field }) => (
              <FormControl component="fieldset" required={property.required} error={!!error}>
                <Typography variant="body2" gutterBottom>
                  {property.name}
                </Typography>
                <RadioGroup
                  {...field}
                  row={property.direction === 'row'}
                >
                  {property.items?.map((item) => (
                    <FormControlLabel
                      key={String(item.value)}
                      value={item.value}
                      control={<Radio />}
                      label={item.label}
                      disabled={property.disabled}
                    />
                  ))}
                </RadioGroup>
                {(property.hint || error) && (
                  <FormHelperText>{property.hint || error}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        );

      case 'color':
        return (
          <Controller
            name={property.id}
            control={control}
            defaultValue={property.default ?? '#000000'}
            render={({ field }) => (
              <FormControl fullWidth required={property.required} error={!!error} disabled={property.disabled}>
                <InputLabel>{property.name}</InputLabel>
                <OutlinedInput
                  {...field}
                  type="color"
                  label={property.name}
                />
                {(property.hint || error) && (
                  <FormHelperText>{property.hint || error}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        );

      case 'json':
      case 'javascript':
      case 'html':
      case 'css':
      case 'markdown':
        return (
          <Controller
            name={property.id}
            control={control}
            defaultValue={property.default ?? ''}
            render={({ field }) => (
              <FormControl fullWidth required={property.required} error={!!error} disabled={property.disabled}>
                <InputLabel>{property.name}</InputLabel>
                <OutlinedInput
                  {...field}
                  label={property.name}
                  multiline
                  rows={property.rows || 10}
                  sx={{
                    '& .MuiInputBase-input': {
                      fontFamily: 'monospace',
                    },
                  }}
                />
                {(property.hint || error) && (
                  <FormHelperText>{property.hint || error}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        );

      case 'htmlSection':
        return (
          <Box>
            {property.name && (
              <Typography variant="h6" gutterBottom>
                {property.name}
              </Typography>
            )}
            {property.htmlContent && (
              <Box
                dangerouslySetInnerHTML={{ __html: property.htmlContent }}
                className={property.htmlClassList?.join(' ')}
              />
            )}
          </Box>
        );

      default:
        return (
          <Controller
            name={property.id}
            control={control}
            defaultValue={property.default ?? ''}
            render={({ field }) => (
              <FormControl fullWidth required={property.required} error={!!error} disabled={property.disabled}>
                <InputLabel>{property.name}</InputLabel>
                <OutlinedInput
                  {...field}
                  label={property.name}
                />
                {(property.hint || error) && (
                  <FormHelperText>{property.hint || error}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        );
    }
  };

  return (
    <Box>
      {renderField()}
      {property.subLabel && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          {property.subLabel}
        </Typography>
      )}
    </Box>
  );
};
