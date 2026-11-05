import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  let user: Awaited<ReturnType<typeof verifyToken>>;
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    user = await verifyToken(token as string);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Invalid token'
      }, { status: 401 });
    }
  } catch {
    return NextResponse.json({
      success: false,
      message: 'Authentication failed'
    }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { resumeUrl, fileName } = body;

    if (!resumeUrl) {
      return NextResponse.json({
        success: false,
        message: 'Resume URL is required'
      }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(resumeUrl);
    } catch {
      return NextResponse.json({
        success: false,
        message: 'Invalid URL format'
      }, { status: 400 });
    }

    // Upsert resume record
    await pool.query(
      `INSERT INTO resumes (user_id, resume_url, file_name, uploaded_at, updated_at)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id) DO UPDATE SET
         resume_url = EXCLUDED.resume_url,
         file_name = EXCLUDED.file_name,
         updated_at = CURRENT_TIMESTAMP`,
      [user.userId, resumeUrl, fileName]
    );

    return NextResponse.json({
      success: true,
      message: 'Resume uploaded successfully',
      data: {
        resumeUrl,
        fileName
      }
    });
  } catch {
    console.error('Error uploading resume');
    return NextResponse.json({
      success: false,
      message: 'Failed to upload resume'
    }, { status: 500 });
  }
}