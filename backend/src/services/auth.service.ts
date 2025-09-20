
import User, { IUser } from '../models/user.model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  console.error('JWT_SECRET is not defined in .env file');
  process.exit(1);
}

export const registerUser = async (userData: Partial<IUser>): Promise<IUser> => {
  const { name, email, password } = userData;

  if (!name || !email || !password) {
    throw new Error('Please provide name, email, and password');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error('User already exists');
  }

  const user = new User({ name, email, password });
  await user.save();
  return user;
};

export const loginUser = async (credentials: Pick<IUser, 'email' | 'password'>): Promise<string> => {
  const { email, password } = credentials;

  if (!email || !password) {
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !user.password) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, {
    expiresIn: '1d',
  });

  return token;
};
