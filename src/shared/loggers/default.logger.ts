import { createLogger, format, transports } from 'winston';

const { combine, timestamp, json } = format;

const serializeReqRes = format((info) => {
  if (info?.req?.rawHeaders) {
    const authIndex = info.req.rawHeaders.findIndex(
      (header) => header === 'Authorization',
    );
    if (authIndex !== -1) info.req.rawHeaders[authIndex + 1] = 'Bearer token';
  }

  return info;
});

export const logger = createLogger({
  format: combine(timestamp(), serializeReqRes(), json()),
  transports: new transports.Console(),
});
