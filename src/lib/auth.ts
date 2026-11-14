import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export const verifyToken = async (token: string): Promise<{ userId: string; role: string } | null> => {
  try {
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded) return null;

    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
      throw new Error('JWT_ACCESS_SECRET environment variable is required');
    }
    jwt.verify(token, secret);

    // In production, you'd fetch user from database
    // For now, return decoded payload
    const payload = decoded.payload as { userId: string; role: string };
    return {
      userId: payload.userId,
      role: payload.role
    };
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