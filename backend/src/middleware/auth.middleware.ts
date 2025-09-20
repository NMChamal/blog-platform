
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';
import dotenv from 'dotenv';
import logger from '../infrastructure/logger';
import { AppError } from './errorHandler';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  logger.error('JWT_SECRET is not defined in .env file');
  process.exit(1);
}

export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, jwtSecret) as { id: string };
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
        return next();
      }
      return next(new AppError('Not authorized, user not found', 401));
    } catch (error) {
      return next(new AppError('Not authorized, token failed', 401));
    }
  }

  return next(new AppError('Not authorized, no token', 401));
};

export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    next(new AppError('Not authorized as an admin', 403));
  }
};

export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, jwtSecret) as { id: string };
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
      }
    } catch (error) {
      // In optional auth, we don't throw an error if the token is invalid.
      // We just proceed without a user attached to the request.
    }
  }

  next();
};
