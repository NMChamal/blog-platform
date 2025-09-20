import { User, IUser } from "../models";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { AppError } from "../middleware/errorHandler";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  console.error("JWT_SECRET is not defined in .env file");
  process.exit(1);
}

export const registerUser = async (
  userData: Partial<IUser>
): Promise<IUser> => {
  const { name, email, password } = userData;

  if (!name || !email || !password) {
    throw new AppError("Please provide name, email, and password", 400);
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError("User already exists", 400);
  }

  const user = new User({ name, email, password });
  await user.save();
  return user;
};

export const loginUser = async (
  credentials: Pick<IUser, "email" | "password">
): Promise<string> => {
  const { email, password } = credentials;

  if (!email || !password) {
    throw new AppError("Please provide email and password", 400);
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !user.password) {
    throw new AppError("Invalid credentials", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, {
    expiresIn: "1d",
  });

  return token;
};
