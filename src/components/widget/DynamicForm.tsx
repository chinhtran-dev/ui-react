// Dynamic form component with react-hook-form and yup

import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DynamicFormField } from './DynamicFormField';
import { buildFormSchema, getDefaultValues } from '../../utils/form-schema-builder';
import type { FormProperty } from '../../types/widget.types';

interface DynamicFormProps {
  properties: FormProperty[];
  model: Record<string, any>;
  onChange: (model: Record<string, any>) => void;
  onSubmit?: (model: Record<string, any>) => void;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  properties,
  model,
  onChange,
  onSubmit,
}) => {
  const schema = buildFormSchema(properties);
  const defaultValues = { ...getDefaultValues(properties), ...model };

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const { handleSubmit, watch } = methods;

  // Watch form changes and call onChange
  React.useEffect(() => {
    const subscription = watch((value) => {
      onChange(value as Record<string, any>);
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  // Handle form submission
  const onSubmitForm = (data: Record<string, any>) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  // Group properties by group
  const groupedProperties = properties.reduce((acc, prop) => {
    const group = prop.group || 'default';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(prop);
    return acc;
  }, {} as Record<string, FormProperty[]>);

  const renderProperty = (property: FormProperty) => {
    // Check condition
    if (property.condition) {
      try {
        // Simple condition evaluation (in production, use a proper expression evaluator)
        const conditionResult = eval(property.condition);
        if (!conditionResult) {
          return null;
        }
      } catch (e) {
        console.warn('Failed to evaluate condition:', property.condition, e);
      }
    }

    if (property.type === 'fieldset' && property.properties) {
      return (
        <Box key={property.id} sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            {property.name}
          </Typography>
          {property.divider && <Divider sx={{ mb: 2 }} />}
          <Box sx={{ pl: 2 }}>
            {property.properties.map((childProp) => (
              <Box key={childProp.id} sx={{ mb: 2 }}>
                {renderProperty(childProp)}
              </Box>
            ))}
          </Box>
        </Box>
      );
    }

    if (property.type === 'array') {
      // Array rendering is complex, simplified for now
      return (
        <Box key={property.id} sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            {property.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Array fields not yet fully implemented
          </Typography>
        </Box>
      );
    }

    return (
      <Box key={property.id} sx={{ mb: 2 }}>
        <DynamicFormField property={property} />
      </Box>
    );
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <Box>
          {Object.entries(groupedProperties).map(([groupName, groupProps]) => (
            <Box key={groupName} sx={{ mb: 3 }}>
              {groupName !== 'default' && (
                <>
                  <Typography variant="h6" gutterBottom>
                    {groupName}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </>
              )}
              {groupProps.map((prop) => renderProperty(prop))}
            </Box>
          ))}
        </Box>
      </form>
    </FormProvider>
  );
};
