import { NextResponse } from 'next/server';

// Define the expected shape of the form data
interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// Simple validation function
function validateContactForm(data: FormData): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const name = data.get('name') as string | null;
  const email = data.get('email') as string | null;
  const message = data.get('message') as string | null;

  if (!name || name.trim() === '') {
    errors.push('Name is required');
  }

  if (!email || email.trim() === '') {
    errors.push('Email is required');
  } else {
    // Simple email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      errors.push('Invalid email format');
    }
  }

  if (!message || message.trim() === '') {
    errors.push('Message is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const { isValid, errors } = validateContactForm(formData);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    // Get the Web3Forms access key from environment variable
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

    if (!accessKey) {
      console.error('Web3Forms access key is not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Append the access key to the form data to forward to Web3Forms
    formData.append('access_key', accessKey);

    // Forward the request to Web3Forms
    const web3formsResponse = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData,
    });

    const data = await web3formsResponse.json();

    if (data.success) {
      return NextResponse.json({ success: true, message: 'Form submitted successfully' });
    } else {
      console.error('Web3Forms error:', data);
      return NextResponse.json(
        { error: 'Failed to submit form', details: data },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error in contact API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}