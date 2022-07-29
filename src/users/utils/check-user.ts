import { User } from '../models/user.model';

export function checkUser(user: User): void {
  if (!user) throw new Error('No user');
}
