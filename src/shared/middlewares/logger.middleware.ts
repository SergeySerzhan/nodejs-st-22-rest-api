import { Request, Response, NextFunction } from 'express';

import { logger } from '../loggers/service.logger';

export function globalLogger(req: Request, res: Response, next: NextFunction) {
  logger.log({
    level: 'info',
    message: 'info',
    method: req.method,
    path: req.url,
    req,
    res,
  });
  next();
}
