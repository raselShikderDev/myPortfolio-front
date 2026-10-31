// Test the API route handler directly with detailed error logging
import { POST } from './src/app/api/upload-image/route';
import { NextRequest } from 'next/server';
import { getImageBBApiKey, getImageBBApiLink } from './src/lib/apiConfig';

async function testUploadRoute() {
  console.log("Testing API route handler directly...");

  // Create a test image file
  const pngData = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64'
  );

  // Create a File object
  const testFile = new File([pngData], 'test.png', { type: 'image/png' });

  // Create FormData
  const formData = new FormData();
  formData.append('image', testFile);

  // Create a mock NextRequest
  const mockRequest = {
    formData: () => Promise.resolve(formData),
  } as unknown as NextRequest;

  console.log("Calling POST handler...");
  const response = await POST(mockRequest);

  console.log("Response status:", response.status);
  const data = await response.json();
  console.log("Response data:", JSON.stringify(data, null, 2));

  if (response.status === 200 && data.success) {
    console.log("\n✓ Upload successful! URL:", data.url);
  } else {
    console.error("\n✗ Upload failed:", data.error);
  }

  // Also test direct ImageBB call to see the raw error
  console.log("\n--- Testing direct ImageBB call ---");
  const base64Image = pngData.toString('base64');
  const imageBBFormData = new FormData();
  imageBBFormData.append('key', getImageBBApiKey());
  imageBBFormData.append('image', base64Image);

  try {
    const imageBBResponse = await fetch(getImageBBApiLink(), {
      method: 'POST',
      body: imageBBFormData,
    });

    console.log("ImageBB response status:", imageBBResponse.status);
    const imageBBData = await imageBBResponse.json();
    console.log("ImageBB response data:", JSON.stringify(imageBBData, null, 2));
  } catch (error) {
    console.error("ImageBB direct call error:", error);
  }
}

testUploadRoute().catch((error) => {
  console.error("Test failed with error:", error);
  process.exit(1);
});