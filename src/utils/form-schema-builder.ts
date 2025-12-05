// Form schema builder - converts FormProperty[] to Yup schema

import * as yup from 'yup';
import type { FormProperty } from '../types/widget.types';

/**
 * Build Yup validation schema from FormProperty array
 */
export function buildFormSchema(properties: FormProperty[]): yup.ObjectSchema<any> {
  const schemaShape: Record<string, yup.AnySchema> = {};

  properties.forEach((property) => {
    if (property.type === 'fieldset' && property.properties) {
      // Recursively build schema for nested properties
      const nestedSchema = buildFormSchema(property.properties);
      schemaShape[property.id] = nestedSchema;
    } else if (property.type === 'array') {
      // Array validation
      let arrayItemSchema: yup.AnySchema = yup.mixed();
      
      if (property.arrayItemType === 'number') {
        arrayItemSchema = yup.number();
      } else if (property.arrayItemType === 'text') {
        arrayItemSchema = yup.string();
      } else if (property.arrayItemType === 'fieldset' && property.properties) {
        arrayItemSchema = buildFormSchema(property.properties);
      }

      let arraySchema = yup.array().of(arrayItemSchema) as yup.ArraySchema<any, any, any>;
      
      if (property.minItems !== undefined) {
        arraySchema = arraySchema.min(property.minItems, `At least ${property.minItems} items required`) as yup.ArraySchema<any, any, any>;
      }
      if (property.maxItems !== undefined) {
        arraySchema = arraySchema.max(property.maxItems, `At most ${property.maxItems} items allowed`) as yup.ArraySchema<any, any, any>;
      }
      if (property.required) {
        arraySchema = arraySchema.required(`${property.name} is required`) as yup.ArraySchema<any, any, any>;
      }

      schemaShape[property.id] = arraySchema;
    } else {
      // Regular field validation
      let fieldSchema: yup.AnySchema;

      switch (property.type) {
        case 'text':
        case 'password':
        case 'textarea':
        case 'html':
        case 'css':
        case 'javascript':
        case 'json':
        case 'markdown':
          fieldSchema = yup.string();
          if (property.required) {
            fieldSchema = fieldSchema.required(`${property.name} is required`);
          }
          break;

        case 'number': {
          let numberSchema = yup.number().typeError(`${property.name} must be a number`);
          if (property.min !== undefined) {
            numberSchema = numberSchema.min(property.min, `${property.name} must be at least ${property.min}`);
          }
          if (property.max !== undefined) {
            numberSchema = numberSchema.max(property.max, `${property.name} must be at most ${property.max}`);
          }
          if (property.required) {
            numberSchema = numberSchema.required(`${property.name} is required`);
          }
          fieldSchema = numberSchema;
          break;
        }

        case 'switch':
          fieldSchema = yup.boolean();
          if (property.required) {
            fieldSchema = fieldSchema.required(`${property.name} is required`);
          }
          break;

        case 'select':
          if (property.multiple) {
            let arraySchema = yup.array().of(yup.mixed()) as yup.ArraySchema<any, any, any>;
            if (property.minItems !== undefined) {
              arraySchema = arraySchema.min(property.minItems, `At least ${property.minItems} items required`) as yup.ArraySchema<any, any, any>;
            }
            if (property.maxItems !== undefined) {
              arraySchema = arraySchema.max(property.maxItems, `At most ${property.maxItems} items allowed`) as yup.ArraySchema<any, any, any>;
            }
            fieldSchema = arraySchema;
          } else {
            fieldSchema = yup.mixed();
          }
          if (property.required) {
            fieldSchema = fieldSchema.required(`${property.name} is required`);
          }
          break;

        case 'radios':
          fieldSchema = yup.mixed();
          if (property.required) {
            fieldSchema = fieldSchema.required(`${property.name} is required`);
          }
          break;

        case 'color':
          fieldSchema = yup.string().matches(/^#[0-9A-F]{6}$/i, 'Invalid color format');
          if (property.required) {
            fieldSchema = fieldSchema.required(`${property.name} is required`);
          }
          break;

        case 'htmlSection':
          // HTML sections don't need validation
          fieldSchema = yup.mixed();
          break;

        default:
          fieldSchema = yup.mixed();
          if (property.required) {
            fieldSchema = fieldSchema.required(`${property.name} is required`);
          }
      }

      schemaShape[property.id] = fieldSchema;
    }
  });

  return yup.object().shape(schemaShape);
}

/**
 * Get default values from FormProperty array
 */
export function getDefaultValues(properties: FormProperty[]): Record<string, any> {
  const defaults: Record<string, any> = {};

  properties.forEach((property) => {
    if (property.type === 'fieldset' && property.properties) {
      defaults[property.id] = getDefaultValues(property.properties);
    } else if (property.type === 'array') {
      defaults[property.id] = [];
    } else if (property.default !== undefined) {
      defaults[property.id] = property.default;
    } else {
      // Set appropriate default based on type
      switch (property.type) {
        case 'number':
          defaults[property.id] = 0;
          break;
        case 'switch':
          defaults[property.id] = false;
          break;
        case 'select':
          defaults[property.id] = property.multiple ? [] : '';
          break;
        default:
          defaults[property.id] = '';
      }
    }
  });

  return defaults;
}

