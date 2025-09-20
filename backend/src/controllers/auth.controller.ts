
import { Request, Response, NextFunction } from 'express';
import * as AuthService from '../services/auth.service';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await AuthService.registerUser(req.body);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await AuthService.loginUser(req.body);
    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      data: { token },
    });
  } catch (error) {
    next(error);
  }
};
