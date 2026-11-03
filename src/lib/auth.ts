import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export interface User {
  userId: string;
  email: string;
  role: string;
}

export const verifyToken = async (token: string): Promise<{ userId: string; role: string } | null> => {
  try {
    const decoded = jwt.decode(token, { complete: true }) as any;
    if (!decoded) return null;

    // Verify token signature
    const verified = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'default-secret');

    // In production, you'd fetch user from database
    // For now, return decoded payload
    return {
      userId: decoded.payload.userId,
      email: decoded.payload.email,
      role: decoded.payload.role
    } as User;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

export const extractTokenFromHeader = (request: NextRequest): string | null => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;
  return authHeader.split(' ')[1];
};