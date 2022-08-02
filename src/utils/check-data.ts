import { User } from '../users/models/user.model';
import {Group} from "../groups/models/group.model";

interface options {
  entityName: string;
}

export function checkData(data: User | Group | number, options: options): void {
  if (!data) throw new Error(`No ${options.entityName}`);
}
