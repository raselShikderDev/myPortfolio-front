// app/api/upload-image/route.js (App Router)

import { NextResponse } from 'next/server';

const IMAGEBB_UPLOAD_URL = "https://api.imgbb.com/1/upload";

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
    const imageBBFormData = new FormData();
    imageBBFormData.append('key', process.env.IMAGEBB_API_KEY as string);
    imageBBFormData.append('image', base64Image); // ImageBB expects the base64 string under the 'image' key
    // You can optionally add 'name' or 'expiration' to imageBBFormData as well

    // Forward the request to ImageBB
    const imageBBResponse = await fetch(IMAGEBB_UPLOAD_URL, {
      method: 'POST',
      body: imageBBFormData,
    });

    const imageBBData = await imageBBResponse.json();

    if (imageBBData.success) {
      // Image uploaded successfully to ImageBB
      const imageUrl = imageBBData.data.url;
      return NextResponse.json({ success: true, url: imageUrl, data: imageBBData.data }, { status: 200 });
    } else {
      // ImageBB API returned an error
      return NextResponse.json({ success: false, error: imageBBData.error.message || 'ImageBB upload failed' }, { status: 500 });
    }
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error during upload' }, { status: 500 });
  }
}