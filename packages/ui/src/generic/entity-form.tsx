'use client';

import * as React from 'react';
import {
  useForm,
  useFieldArray,
  type FieldValues,
  type DefaultValues,
  type UseFormRegister,
  type FieldErrors,
  type Control,
  type Path,
} from 'react-hook-form';
import { cn } from '../lib/utils';

export type FormFieldDef = SimpleFieldDef | GroupFieldDef | ArrayFieldDef;

export interface SimpleFieldDef {
  kind: 'simple';
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'date' | 'password';
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  validation?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: { value: string; message: string };
  };
  dependsOn?: { field: string; value: unknown };
  helpText?: string;
  colSpan?: 1 | 2;
}

export interface GroupFieldDef {
  kind: 'group';
  name: string;
  label: string;
  fields: SimpleFieldDef[];
  columns?: 1 | 2 | 3;
}

export interface ArrayFieldDef {
  kind: 'array';
  name: string;
  label: string;
  itemFields: SimpleFieldDef[];
  minItems?: number;
  maxItems?: number;
  addLabel?: string;
}

export interface FormSchema {
  fields: FormFieldDef[];
}

export interface EntityFormProps<T extends FieldValues = FieldValues> {
  schema: FormSchema;
  onSubmit: (data: T) => void | Promise<void>;
  defaultValues?: DefaultValues<T>;
  submitLabel?: string;
  loading?: boolean;
  columns?: 1 | 2;
  sections?: { title: string; description?: string; fieldNames: string[] }[];
  renderField?: (field: FormFieldDef, register: UseFormRegister<T>, errors: FieldErrors<T>) => React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function EntityForm<T extends FieldValues = FieldValues>({
  schema,
  onSubmit,
  defaultValues,
  submitLabel = 'Submit',
  loading = false,
  columns = 2,
  sections,
  renderField: customRenderField,
  footer,
  className,
}: EntityFormProps<T>) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<T>({
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const isLoading = loading || isSubmitting;
  const watchAll = watch();

  if (process.env.NODE_ENV === 'development' && !schema.fields.length) {
    console.warn('[EntityForm] Schema has no fields');
  }

  const renderFields = (fields: FormFieldDef[]) => {
    return fields.map((field) => {
      if (customRenderField) {
        const custom = customRenderField(field, register, errors);
        if (custom) return <React.Fragment key={field.name}>{custom}</React.Fragment>;
      }

      switch (field.kind) {
        case 'group':
          return (
            <div key={field.name} className="col-span-full">
              <h3 className="mb-3 text-sm font-semibold text-gray-700">{field.label}</h3>
              <div className={cn(
                'grid gap-4',
                field.columns === 3 ? 'grid-cols-1 sm:grid-cols-3' :
                field.columns === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2',
              )}>
                {field.fields.map((f) => renderSimpleField({ ...f, kind: 'simple' }))}
              </div>
            </div>
          );

        case 'array':
          return <ArrayFieldComponent key={field.name} field={field} control={control as unknown as Control<FieldValues>} register={register as unknown as UseFormRegister<FieldValues>} errors={errors as unknown as FieldErrors<FieldValues>} disabled={isLoading} />;

        case 'simple':
          return renderSimpleField(field);

        default:
          return null;
      }
    });
  };

  const renderSimpleField = (field: SimpleFieldDef) => {
    if (field.dependsOn) {
      const depValue = (watchAll as Record<string, unknown>)[field.dependsOn.field];
      if (depValue !== field.dependsOn.value) return null;
    }

    const fieldError = (errors as Record<string, { message?: string }>)[field.name];
    const commonProps = {
      ...register(field.name as Path<T>, {
        required: field.required ? `${field.label} is required` : undefined,
        minLength: field.validation?.minLength ? { value: field.validation.minLength, message: `Min ${field.validation.minLength} characters` } : undefined,
        maxLength: field.validation?.maxLength ? { value: field.validation.maxLength, message: `Max ${field.validation.maxLength} characters` } : undefined,
        min: field.validation?.min ? { value: field.validation.min, message: `Min value is ${field.validation.min}` } : undefined,
        max: field.validation?.max ? { value: field.validation.max, message: `Max value is ${field.validation.max}` } : undefined,
        pattern: field.validation?.pattern ? { value: new RegExp(field.validation.pattern.value), message: field.validation.pattern.message } : undefined,
      }),
      disabled: isLoading,
      id: field.name,
    };

    return (
      <div key={field.name} className={cn(field.colSpan === 2 && 'sm:col-span-2')}>
        {field.type !== 'checkbox' && (
          <label htmlFor={field.name} className="mb-1.5 block text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-error-500 ml-0.5">*</span>}
          </label>
        )}

        {field.type === 'textarea' ? (
          <textarea
            {...commonProps}
            placeholder={field.placeholder}
            rows={3}
            className={cn(
              'w-full rounded-md border bg-white px-3 py-2 text-sm outline-none transition-colors',
              fieldError ? 'border-error-500 focus:ring-1 focus:ring-error-500' : 'border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500',
            )}
          />
        ) : field.type === 'select' ? (
          <select
            {...commonProps}
            className={cn(
              'h-10 w-full rounded-md border bg-white px-3 text-sm outline-none transition-colors',
              fieldError ? 'border-error-500' : 'border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500',
            )}
          >
            <option value="">{field.placeholder || `Select ${field.label}...`}</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        ) : field.type === 'checkbox' ? (
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...commonProps} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
            <span className="text-sm text-gray-700">{field.label}</span>
          </label>
        ) : field.type === 'radio' && field.options ? (
          <div className="space-y-2">
            {field.options.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value={opt.value} {...register(field.name as Path<T>, { required: field.required ? `${field.label} is required` : undefined })} className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500" />
                <span className="text-sm text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
        ) : (
          <input
            type={field.type}
            {...commonProps}
            placeholder={field.placeholder}
            className={cn(
              'h-10 w-full rounded-md border bg-white px-3 text-sm outline-none transition-colors',
              fieldError ? 'border-error-500 focus:ring-1 focus:ring-error-500' : 'border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500',
            )}
          />
        )}

        {field.helpText && !fieldError && (
          <p className="mt-1 text-xs text-gray-400">{field.helpText}</p>
        )}
        {fieldError && (
          <p className="mt-1 text-xs text-error-600">{fieldError.message}</p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit as (data: FieldValues) => void)} className={cn('space-y-6', className)}>
      {sections ? (
        sections.map((section, i) => {
          const sectionFields = schema.fields.filter((f) => section.fieldNames.includes(f.name));
          return (
            <div key={i}>
              <h2 className="text-base font-semibold text-gray-900">{section.title}</h2>
              {section.description && <p className="mt-0.5 text-sm text-gray-500">{section.description}</p>}
              <div className={cn('mt-4 grid gap-4', columns === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2')}>
                {renderFields(sectionFields)}
              </div>
            </div>
          );
        })
      ) : (
        <div className={cn('grid gap-4', columns === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2')}>
          {renderFields(schema.fields)}
        </div>
      )}

      <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-primary-600 px-6 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
        >
          {isLoading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
          {isLoading ? 'Submitting...' : submitLabel}
        </button>
        {footer}
      </div>
    </form>
  );
}

function ArrayFieldComponent({ field, control, register, errors, disabled }: {
  field: ArrayFieldDef;
  control: Control<FieldValues>;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
  disabled: boolean;
}) {
  const { fields, append, remove } = useFieldArray({ control, name: field.name });

  return (
    <div className="col-span-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">{field.label}</h3>
        <button
          type="button"
          onClick={() => append({})}
          disabled={disabled || (field.maxItems != null && fields.length >= field.maxItems)}
          className="text-sm font-medium text-primary-600 hover:text-primary-700 disabled:opacity-40"
        >
          + {field.addLabel || `Add ${field.label}`}
        </button>
      </div>

      {fields.length === 0 ? (
        <p className="text-sm text-gray-400">No items yet. Click add to create one.</p>
      ) : (
        <div className="space-y-3">
          {fields.map((item, index) => (
            <div key={item.id} className="rounded-md border border-gray-200 bg-gray-50 p-3">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-medium text-gray-400">#{index + 1}</span>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={disabled || (field.minItems != null && fields.length <= field.minItems)}
                  className="text-xs text-error-500 hover:text-error-700 disabled:opacity-40"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {field.itemFields.map((itemField) => {
                  const fieldName = `${field.name}.${index}.${itemField.name}`;
                  const arrayErrors = errors[field.name] as Record<string, Record<string, { message?: string }>> | undefined;
                  const fieldError = arrayErrors?.[String(index)]?.[itemField.name];

                  return (
                    <div key={itemField.name}>
                      <label className="mb-1 block text-xs font-medium text-gray-600">
                        {itemField.label}
                        {itemField.required && <span className="text-error-500 ml-0.5">*</span>}
                      </label>
                      <input
                        type={itemField.type}
                        {...register(fieldName, {
                          required: itemField.required ? `${itemField.label} is required` : undefined,
                        })}
                        placeholder={itemField.placeholder}
                        disabled={disabled}
                        className={cn(
                          'h-9 w-full rounded-md border bg-white px-3 text-sm outline-none',
                          fieldError ? 'border-error-500' : 'border-gray-300 focus:border-primary-500',
                        )}
                      />
                      {fieldError && <p className="mt-0.5 text-xs text-error-600">{fieldError.message}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
