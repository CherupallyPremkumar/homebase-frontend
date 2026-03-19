import { z } from 'zod';
import type { CConfigFormSchema, CConfigFormField } from '@homebase/types';

export function buildZodSchema(schema: CConfigFormSchema): z.ZodObject<z.ZodRawShape> {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of schema.fields) {
    shape[field.name] = buildFieldSchema(field);
  }

  return z.object(shape);
}

function buildFieldSchema(field: CConfigFormField): z.ZodTypeAny {
  let schema: z.ZodTypeAny;

  switch (field.type) {
    case 'number':
      schema = buildNumberSchema(field);
      break;
    case 'checkbox':
      schema = z.boolean();
      break;
    case 'email':
      schema = z.string().email('Invalid email address');
      break;
    case 'tel':
      schema = z.string().regex(/^[+]?[\d\s-()]{7,15}$/, 'Invalid phone number');
      break;
    case 'select':
    case 'radio':
      if (field.options?.length) {
        schema = z.enum(field.options.map((o) => o.value) as [string, ...string[]]);
      } else {
        schema = z.string();
      }
      break;
    case 'date':
      schema = z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date');
      break;
    default:
      schema = buildStringSchema(field);
  }

  if (!field.required) {
    schema = schema.optional();
  }

  return schema;
}

function buildStringSchema(field: CConfigFormField): z.ZodString {
  let schema = z.string();

  if (field.required) {
    schema = schema.min(1, `${field.label} is required`);
  }
  if (field.validation?.minLength) {
    schema = schema.min(field.validation.minLength, field.validation.message || `Minimum ${field.validation.minLength} characters`);
  }
  if (field.validation?.maxLength) {
    schema = schema.max(field.validation.maxLength, field.validation.message || `Maximum ${field.validation.maxLength} characters`);
  }
  if (field.validation?.pattern) {
    schema = schema.regex(new RegExp(field.validation.pattern), field.validation.message || 'Invalid format');
  }

  return schema;
}

function buildNumberSchema(field: CConfigFormField): z.ZodNumber {
  let schema = z.number();

  if (field.validation?.min !== undefined) {
    schema = schema.min(field.validation.min, field.validation.message || `Minimum value is ${field.validation.min}`);
  }
  if (field.validation?.max !== undefined) {
    schema = schema.max(field.validation.max, field.validation.message || `Maximum value is ${field.validation.max}`);
  }

  return schema;
}
