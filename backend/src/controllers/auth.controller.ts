import { Request, Response, NextFunction } from 'express';
import * as AuthService from '../services/auth.service';
import { CreateUserInput, createUserSchema, loginSchema } from '../validations/auth.validation';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';

// Register a new user
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input with Zod
    const validatedData : CreateUserInput = createUserSchema.parse({ body: req.body });//zod expects a body property
    const { name, email, password } = validatedData.body;

    const result = await AuthService.registerUser({
      name,
      email,
      password,
    });

    res.status(201).json(result);
  } catch (error: any) {
    if (error instanceof ZodError) {
      const formattedErrors = (error as any).issues?.map((issue: any) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })) || [];
      return res.status(400).json({
        success: false,
        errors: formattedErrors,
      });
    }
    next(error);
  }
};

// Login user
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input with Zod
    const validatedData = loginSchema.parse({ body: req.body });
    const { email, password } = validatedData.body;

    const result = await AuthService.loginUser(email, password);
    res.status(200).json(result);
  } catch (error: any) {
    if (error instanceof ZodError) {
      const formattedErrors = (error as any).issues?.map((issue: any) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })) || [];
      return res.status(400).json({
        success: false,
        errors: formattedErrors,
      });
    }
    next(error);
  }
};

// Get logged-in user details
export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    const user = await AuthService.getUserDetails(userId);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
