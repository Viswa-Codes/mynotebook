import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as AuthRepository from '../repositories/auth.repository';
import { AppError } from '../utils/AppError';

const JWT_SECRET = process.env.JWT_SECRET || 'JWTSecretKey';

export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    // Check if user already exists
    const existingUser = await AuthRepository.findUserByEmail(userData.email);
    if (existingUser) {
      throw new AppError(400, "User with this email already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Create new user
    const user = await AuthRepository.createNewUser({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
    });

    // Generate token
    const token = generateToken(user.id);

    return { success: true, authtoken: token };
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    throw new AppError(500, error.message || "Failed to register user");
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    // Find user
    const user = await AuthRepository.findUserByEmail(email);
    if (!user) {
      throw new AppError(400, "Please try to login with correct credentials");
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError(400, "Please try to login with correct credentials");
    }

    // Generate token
    const token = generateToken(user.id);

    return { success: true, authtoken: token };
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    throw new AppError(500, error.message || "Failed to login");
  }
};

export const getUserDetails = async (userId: string) => {
  try {
    const user = await AuthRepository.findUserById(userId);
    if (!user) {
      throw new AppError(404, "User not found");
    }
    return user;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    throw new AppError(500, error.message || "Failed to retrieve user");
  }
};

const generateToken = (userId: string): string => {
  const payload = { user: { id: userId } };
  return jwt.sign(payload, JWT_SECRET);
};
