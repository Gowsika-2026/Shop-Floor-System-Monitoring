import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError, ForbiddenError } from '../utils/AppError';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    role: string;
  };
}

export const authenticate = (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
    };

    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid or expired token'));
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('User not authenticated'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }

    next();
  };
};
