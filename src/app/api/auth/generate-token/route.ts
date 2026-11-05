import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'default-secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export async function POST() {
  try {
    // Get refresh token from cookies
    const refreshToken = (await cookies()).get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: 'No refresh token provided' },
        { status: 401 }
      );
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as TokenPayload;

    // Generate new access token
    const newAccessToken = jwt.sign(
      {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      },
      JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    // Set new access token in cookies
    (await cookies()).set('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60, // 15 minutes
    });

    return NextResponse.json(
      { success: true, message: 'Token refreshed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Token refresh failed:', error);
    return NextResponse.json(
      { success: false, message: 'Invalid refresh token' },
      { status: 401 }
    );
  }
}