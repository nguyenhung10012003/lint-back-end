import * as bcrypt from 'bcrypt';
import { env } from 'process';

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(Number(env.SALT_ROUNDS));
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};
