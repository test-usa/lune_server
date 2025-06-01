import { z } from 'zod';

const createTestValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'name is required' }).trim(),
  }),
});


export const testValidation = {
createTestValidationSchema
};
