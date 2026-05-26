import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { UnauthorizedError, ValidationError, ConflictError } from '../utils/AppError';

export const authService = {
  async register(userData: {
    username: string;
    password: string;
    role: string;
    name: string;
    email: string;
  }) {
    const existingUser = await User.findOne({
      where: {
        username: userData.username,
      },
    });

    if (existingUser) {
      throw new ConflictError('Username already exists');
    }

    const existingEmail = await User.findOne({
      where: {
        email: userData.email,
      },
    });

    if (existingEmail) {
      throw new ConflictError('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await User.create({
      ...userData,
      password: hashedPassword,
    });

    const token = this.generateToken(user);

    return {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name,
        email: user.email,
      },
      token,
    };
  },

  async login(username: string, password: string) {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = this.generateToken(user);

    return {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name,
        email: user.email,
      },
      token,
    };
  },

  generateToken(user: User): string {
    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
  },

  verifyToken(token: string) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired token');
    }
  },
};
