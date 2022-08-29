import { Body } from '#shared/utils/types';

export class BodySerialize {
  constructor(body?: Body) {
    if (body?.password) body.password = '***';
    if (body?.login) body.login = '***';
    Object.assign(this, body);
  }
}
