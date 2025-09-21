import { Response, NextFunction } from "express";
import { container } from "tsyringe";
import { UserService } from "../services/user.service";
import { AuthRequest } from "../middleware/auth.middleware";
import { AppError } from "../middleware/errorHandler";

const userService = container.resolve(UserService);

export const updateUserDescription = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError("Not authorized", 401);
    }
    const { description } = req.body;
    const user = await userService.updateUserDescription(
      req.user._id,
      description
    );
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
