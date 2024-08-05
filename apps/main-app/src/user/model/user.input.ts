import { Prisma } from '@prisma/prisma-main-client';
import { z } from 'zod';

export const UserCreateInput: z.ZodObject<
  {
    email: z.ZodString;
    password: z.ZodString;
  },
  'strip',
  z.ZodTypeAny,
  {
    email: string;
    password: string;
  },
  {
    email: string;
    password: string;
  }
> = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(32),
}) as z.ZodObject<
  {
    email: z.ZodString;
    password: z.ZodString;
  },
  'strip',
  z.ZodTypeAny,
  {
    email: string;
    password: string;
  },
  {
    email: string;
    password: string;
  }
> satisfies z.Schema<Prisma.UserUncheckedCreateInput>;
