import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

export interface AdminUser {
  _id?: ObjectId;
  username: string;
  password: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
  status: 'active' | 'inactive';
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
