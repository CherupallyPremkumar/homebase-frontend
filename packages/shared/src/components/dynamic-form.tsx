'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Input,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
  Button,
  Label,
} from '@homebase/ui';
import { useFormSchema } from '../hooks/use-form-schema';
import { SectionSkeleton } from './section-skeleton';
import { ErrorSection } from './error-section';
import type { CConfigFormField } from '@homebase/types';

interface DynamicFormProps {
  schemaKey: string;
  onSubmit: (data: Record<string, unknown>) => void;
  defaultValues?: Record<string, unknown>;
  submitLabel?: string;
  loading?: boolean;
  className?: string;
}

export function DynamicForm({
  schemaKey,
  onSubmit,
  defaultValues,
  submitLabel = 'Submit',
  loading = false,
  className,
}: DynamicFormProps) {
  const { data, isLoading, error, refetch } = useFormSchema(schemaKey);

  if (isLoading) return <SectionSkeleton rows={4} />;
  if (error || !data) return <ErrorSection error={error} onRetry={() => refetch()} />;

  return (
    <DynamicFormInner
      fields={data.schema.fields}
      zodSchema={data.zodSchema}
      onSubmit={onSubmit}
      defaultValues={defaultValues}
      submitLabel={submitLabel}
      loading={loading}
      className={className}
    />
  );
}

function DynamicFormInner({
  fields,
  zodSchema,
  onSubmit,
  defaultValues,
  submitLabel,
  loading,
  className,
}: {
  fields: CConfigFormField[];
  zodSchema: z.ZodObject<z.ZodRawShape>;
  onSubmit: (data: Record<string, unknown>) => void;
  defaultValues?: Record<string, unknown>;
  submitLabel: string;
  loading: boolean;
  className?: string;
}) {
  const form = useForm({
    resolver: zodResolver(zodSchema),
    defaultValues: defaultValues ?? {},
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={`space-y-4 ${className ?? ''}`}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {fields.map((field) => (
            <FormField
              key={field.name}
              control={form.control}
              name={field.name}
              render={({ field: formField }) => (
                <FormItem className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                  <FormLabel>{field.label}</FormLabel>
                  <FormControl>
                    {renderField(field, formField)}
                  </FormControl>
                  {field.placeholder && <FormDescription>{field.placeholder}</FormDescription>}
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : submitLabel}
        </Button>
      </form>
    </Form>
  );
}

interface FormFieldControlProps {
  value: unknown;
  onChange: (...event: unknown[]) => void;
  onBlur: () => void;
  name: string;
  ref: React.Ref<HTMLElement>;
}

function renderField(field: CConfigFormField, formField: FormFieldControlProps) {
  switch (field.type) {
    case 'textarea':
      return (
        <Textarea
          value={String(formField.value ?? '')}
          onChange={formField.onChange}
          onBlur={formField.onBlur}
          name={formField.name}
          placeholder={field.placeholder}
        />
      );
    case 'select':
      return (
        <Select value={String(formField.value ?? '')} onValueChange={formField.onChange}>
          <SelectTrigger>
            <SelectValue placeholder={field.placeholder || 'Select...'} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case 'checkbox':
      return (
        <div className="flex items-center gap-2">
          <Checkbox checked={!!formField.value} onCheckedChange={formField.onChange} />
        </div>
      );
    case 'radio':
      return (
        <RadioGroup value={String(formField.value ?? '')} onValueChange={formField.onChange}>
          {field.options?.map((opt) => (
            <div key={opt.value} className="flex items-center gap-2">
              <RadioGroupItem value={opt.value} id={`${field.name}-${opt.value}`} />
              <Label htmlFor={`${field.name}-${opt.value}`}>{opt.label}</Label>
            </div>
          ))}
        </RadioGroup>
      );
    default:
      return (
        <Input
          value={String(formField.value ?? '')}
          onChange={formField.onChange}
          onBlur={formField.onBlur}
          name={formField.name}
          type={field.type}
          placeholder={field.placeholder}
        />
      );
  }
}
