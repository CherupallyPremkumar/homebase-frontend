import type { ApiError } from '@homebase/api-client';

export interface FormattedError {
  message: string;
  fieldErrors: Record<string, string>;
}

export function formatApiError(error: unknown): FormattedError {
  if (error instanceof Error && 'errors' in error) {
    const apiError = error as ApiError;
    const fieldErrors: Record<string, string> = {};
    let message = apiError.message || 'An unexpected error occurred';

    if (apiError.errors?.length) {
      for (const err of apiError.errors) {
        if (err.field) {
          fieldErrors[err.field] = err.description;
        }
      }
      if (!Object.keys(fieldErrors).length) {
        message = apiError.errors[0]!.description;
      }
    }

    return { message, fieldErrors };
  }

  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      return { message: 'Request timed out. Please try again.', fieldErrors: {} };
    }
    return { message: error.message, fieldErrors: {} };
  }

  return { message: 'An unexpected error occurred', fieldErrors: {} };
}

export function getErrorMessage(error: unknown): string {
  return formatApiError(error).message;
}
