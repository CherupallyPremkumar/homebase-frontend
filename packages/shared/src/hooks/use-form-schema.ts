'use client';

import { useQuery } from '@tanstack/react-query';
import { cconfigApi } from '@homebase/api-client';
import { buildZodSchema } from '../lib/schema-builder';
import { CACHE_TIMES } from '../lib/constants';

export function useFormSchema(schemaKey: string) {
  return useQuery({
    queryKey: ['cconfig-schema', schemaKey],
    queryFn: async () => {
      const schema = await cconfigApi.getFormSchema(schemaKey);
      const zodSchema = buildZodSchema(schema);
      return { schema, zodSchema };
    },
    ...CACHE_TIMES.cconfig,
    retry: 1,
  });
}
