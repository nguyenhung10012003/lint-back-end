export interface PasswordOptions {
  length: number;
  includeSpecialChars?: boolean;
  includeNumbers?: boolean;
  includeUppercase?: boolean;
}

export function generatePassword(options: PasswordOptions): string {
  const lowercase: string = 'abcdefghijklmnopqrstuvwxyz';
  const numbers: string = '0123456789';
  const specialChars: string = '!@#$%^&*()_+[]{}|;:,.<>?';
  let characters: string = lowercase;

  if (options.includeUppercase) {
      characters += lowercase.toUpperCase();
  }
  if (options.includeNumbers) {
      characters += numbers;
  }
  if (options.includeSpecialChars) {
      characters += specialChars;
  }

  let password: string = '';
  for (let i = 0; i < options.length; i++) {
      const randomIndex: number = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
  }

  return password;
}