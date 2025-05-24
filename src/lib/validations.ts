import { z } from 'zod';

// Password validation: min 6 chars, at least 1 uppercase, 1 special character
const passwordSchema = z.string()
  .min(6, 'Password must be at least 6 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'Password must contain at least one special character');

// Name validation: no numbers allowed
const nameSchema = z.string()
  .min(1, 'Name is required')
  .regex(/^[a-zA-Z\s]+$/, 'Name cannot contain numbers or special characters');

// Email validation
const emailSchema = z.string()
  .email('Please enter a valid email address');

export const signUpSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;