import { compare, hash } from 'bcrypt';

export class PasswordService {
  static async hashPassword(password: string): Promise<string> {
    return hash(password, +process.env.SALT_ROUNDS);
  }

  static async comparePasswords(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    return compare(password, hashPassword);
  }
}
