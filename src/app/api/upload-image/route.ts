

import { NextResponse } from 'next/server';
import { getImageBBApiKey, getImageBBApiLink } from '@/lib/apiConfig';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function POST(request: { formData: () => any; }) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image'); // 'image' is the key expected from the frontend

    if (!imageFile) {
      return NextResponse.json({ success: false, error: 'No image file provided' }, { status: 400 });
    }

    // Convert the File object to a Buffer
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert Buffer to a Base64 string for ImageBB
    const base64Image = buffer.toString('base64');

    // Create a new FormData object for the ImageBB API call
    // ImageBB expects the base64 string under the 'image' key
    const imageBBFormData = new FormData();
    imageBBFormData.append('key', getImageBBApiKey());
    imageBBFormData.append('image', base64Image);

    // Forward the request to ImageBB (direct call without explicit timeout)
    // The ImageBB API typically responds in 1-5 seconds, but we'll handle any potential timeout
    let imageBBResponse: Response;

    try {
      imageBBResponse = await fetch(getImageBBApiLink(), {
        method: 'POST',
        body: imageBBFormData,
        signal: AbortSignal.timeout(30000),
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
      console.error('ImageBB API request error:', errorMessage);

      // Type-check for timeout errors
      const errorObj = error as { code?: number; name?: string };
      if (errorObj.code === 23 || errorMessage.includes('timed out')) {
        console.error('ImageBB API request timed out after 30 seconds');
        return NextResponse.json(
          { success: false, error: 'Image upload service timed out. Please try again.' },
          { status: 504 }
        );
      }
      if (errorObj.name === 'AbortError') {
        console.error('ImageBB API request was aborted');
        return NextResponse.json(
          { success: false, error: 'Image upload was aborted.' },
          { status: 499 }
        );
      }

      // Re-throw other errors
      throw error;
    }

    const imageBBData = await imageBBResponse.json();

    if (imageBBData.success) {
      // Image uploaded successfully to ImageBB
      const imageUrl = imageBBData.data.url;
      return NextResponse.json({ success: true, url: imageUrl }, { status: 200 });
    } else {
      // ImageBB API returned an error
      return NextResponse.json({ success: false, error: imageBBData.error?.message || 'ImageBB upload failed' }, { status: 500 });
    }
  } catch (error) {
    console.error('Upload Error:', error);

    // Handle specific error types with user-friendly messages
    if (error instanceof Error) {
      if (error.message.includes('timed out')) {
        return NextResponse.json({ success: false, error: 'Image upload service is taking too long. Please try again.' }, { status: 504 });
      }
      if (error.message.includes('fetch failed')) {
        return NextResponse.json({ success: false, error: 'Unable to connect to image service. Please check your internet connection and try again.' }, { status: 503 });
      }
    }

    return NextResponse.json({ success: false, error: 'Internal server error during upload' }, { status: 500 });
  }
}
