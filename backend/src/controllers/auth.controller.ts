import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password, role, name, email } = req.body;
      const result = await authService.register({ username, password, role, name, email });
      
      res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;
      const result = await authService.login(username, password);
      
      res.status(200).json({
        status: 'success',
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body;
      const decoded = authService.verifyToken(token);
      const newToken = authService.generateToken(decoded);
      
      res.status(200).json({
        status: 'success',
        message: 'Token refreshed',
        data: { token: newToken },
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(_req: Request, res: Response, _next: NextFunction) {
    try {
      res.status(200).json({
        status: 'success',
        message: 'Logout successful',
      });
    } catch (error) {
      _next(error);
    }
  }
}

export const authController = new AuthController();
