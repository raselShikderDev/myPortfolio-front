import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Invalid token'
      }, { status: 401 });
    }
  } catch (error) {
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
    } catch (error) {
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
  } catch (error) {
    console.error('Error uploading resume:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to upload resume'
    }, { status: 500 });
  }
}