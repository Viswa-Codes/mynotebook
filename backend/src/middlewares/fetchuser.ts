import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

const JWT_SECRET = process.env.JWT_SECRET || 'JWTSecretKey';

const fetchuser = (req: Request, res: Response, next: NextFunction) => {
  // Get the user from the jwt token and add id to req object
  const token = req.header('auth-token');
  if (!token) {
    return next(new AppError(401, 'Please authenticate using a valid token'));
  }
  try {
    const data = jwt.verify(token, JWT_SECRET) as any;
    (req as any).user = data.user;
    next();//move to the next middleware or route handler
  } catch (error) {
    next(new AppError(401, 'Please authenticate using a valid token'));
  }
};

export default fetchuser;