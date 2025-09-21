import { injectable } from "tsyringe";
import User, { IUser } from "../models/user.model";
import { AppError } from "../middleware/errorHandler";

@injectable()
export class UserService {
  public async updateUserDescription(
    userId: string,
    description: string
  ): Promise<IUser> {
    const user = await User.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    user.description = description;
    await user.save();
    return user;
  }

  public async getUserById(userId: string): Promise<IUser> {
    const user = await User.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }
}
