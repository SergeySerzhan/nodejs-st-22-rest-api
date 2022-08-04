import { User } from '../models/user.model';

export function checkData(user: User | number): void {
  if (!user) throw new Error('No user');
}
