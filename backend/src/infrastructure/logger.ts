
import winston from 'winston';

const { combine, timestamp, json, colorize, align, printf } = winston.format;

const errorFilter = winston.format((info) => {
  return info.level === 'error' ? info : false;
});

const infoFilter = winston.format((info) => {
  return info.level === 'info' ? info : false;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    colorize({ all: true }),
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: combine(errorFilter(), timestamp(), json()),
    }),
    new winston.transports.File({
      filename: 'logs/info.log',
      level: 'info',
      format: combine(infoFilter(), timestamp(), json()),
    }),
  ],
  exceptionHandlers: [new winston.transports.File({ filename: 'logs/exception.log' })],
  rejectionHandlers: [new winston.transports.File({ filename: 'logs/rejection.log' })],
});

export default logger;
