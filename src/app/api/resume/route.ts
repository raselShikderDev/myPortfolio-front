
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { uploadFileToCloud } from '@/lib/fileUpload';
import { pool } from '@/lib/db';
import { z } from 'zod';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

// Validate resume file
const uploadSchema = z.object({
  resume: z
    .instanceof(File, { message: 'Resume file is required' })
    .refine(
      (file) => file.size > 0,
      'Resume file cannot be empty'
    )
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      'File size exceeds 10MB limit'
    )
    .refine(
      (file) => ALLOWED_FILE_TYPES.includes(file.type),
      'Invalid file type. Only PDF, DOC, and DOCX files are allowed.'
    ),
});

// GET /resume
// Public endpoint to retrieve the current resume URL
export async function GET() {
  try {
    const { rows } = await pool.query<{ resume_url: string | null }>(
      `SELECT resume_url
       FROM resumes
       WHERE user_id = 'public'
       ORDER BY uploaded_at DESC
       LIMIT 1`
    );

    const resumeUrl = rows[0]?.resume_url || '/rasel_resume.pdf';

    return NextResponse.json({
      success: true,
      data: {
        url: resumeUrl,
      },
    });
  } catch (error) {
    console.error('Error fetching resume:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch resume URL',
      },
      { status: 500 }
    );
  }
}

// POST /resume/upload
// Authenticated endpoint to upload a resume
export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const authorization = request.headers.get('authorization');

    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Authentication required',
        },
        { status: 401 }
      );
    }

    const token = authorization.slice(7).trim();

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: 'Authentication token is missing',
        },
        { status: 401 }
      );
    }

    let user;

    try {
      user = await verifyToken(token);
    } catch (error) {
      console.error('Token verification failed:', error);

      return NextResponse.json(
        {
          success: false,
          message: 'Invalid or expired authentication token',
        },
        { status: 401 }
      );
    }

    if (!user?.userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid authentication token',
        },
        { status: 401 }
      );
    }

    // 2. Parse multipart form data
    let formData: FormData;

    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid form data',
        },
        { status: 400 }
      );
    }

    // 3. Validate uploaded file
    const validationResult = uploadSchema.safeParse({
      resume: formData.get('resume'),
    });

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message:
              validationResult.error.issues[0]?.message ||
              'Invalid resume file',
        },
        { status: 400 }
      );
    }

    const file = validationResult.data.resume;

    // 4. Upload file to cloud storage
    const uploadResult = await uploadFileToCloud(file);

    if (!uploadResult.success || !uploadResult.data?.url) {
      console.error('Cloud storage upload failed:', uploadResult);

      return NextResponse.json(
        {
          success: false,
          message: 'Failed to upload resume to cloud storage',
        },
        { status: 502 }
      );
    }

    const { url, filename } = uploadResult.data;

    // 5. Save or update resume record
    await pool.query(
      `INSERT INTO resumes (
        user_id,
        resume_url,
        file_name,
        uploaded_at,
        updated_at
      )
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id)
      DO UPDATE SET
        resume_url = EXCLUDED.resume_url,
        file_name = EXCLUDED.file_name,
        uploaded_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP`,
      [user.userId, url, filename]
    );

    // 6. Return successful response
    return NextResponse.json(
      {
        success: true,
        data: {
          message: 'Resume uploaded successfully',
          url,
          filename,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error uploading resume:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to upload resume',
        },
      },
      { status: 500 }
    );
  }
}
