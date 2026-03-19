export interface CConfig {
  id: string;
  key: string;
  value: string;
  description?: string;
  module?: string;
  dataType: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON';
  createdTime?: string;
  lastModifiedTime?: string;
}

export interface CConfigFormSchema {
  fields: CConfigFormField[];
}

export interface CConfigFormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'tel' | 'select' | 'checkbox' | 'textarea' | 'date' | 'radio';
  required?: boolean;
  placeholder?: string;
  defaultValue?: unknown;
  options?: { label: string; value: string }[];
  validation?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    message?: string;
  };
}
