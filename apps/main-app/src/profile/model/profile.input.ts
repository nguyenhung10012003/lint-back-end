import { Prisma } from '@prisma/prisma-main-client';
import { z } from 'zod';

export const ProfileCreateInput = z.object({
  userId: z.string(),
  name: z.string().optional(),
  dob: z.date().optional(),
  country: z.string().optional(),
  gender: z.string().optional(),
  avatar: z.string().optional(),
  alias: z.string().optional(),
  bio: z.string().optional(),
}) satisfies z.Schema<Prisma.ProfileUncheckedCreateInput>;
