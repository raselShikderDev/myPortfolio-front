// Test script to debug the ImageBB upload issue
import { getImageBBApiKey, getImageBBApiLink } from "./src/lib/apiConfig";

async function testUpload() {
  console.log("Testing ImageBB API configuration...");
  console.log("API Key:", getImageBBApiKey() ? "Set (length: " + getImageBBApiKey().length + ")" : "NOT SET");
  console.log("API Link:", getImageBBApiLink());

  // Create a test image (1x1 red pixel in PNG)
  const pngImage = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
    0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41,
    0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
    0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00,
    0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
  ]);

  const base64Image = pngImage.toString('base64');

  console.log("\nCreating FormData...");
  const imageBBFormData = new FormData();
  imageBBFormData.append('key', getImageBBApiKey());
  imageBBFormData.append('image', base64Image);

  console.log("Sending request to ImageBB API...");
  console.time("Upload time");

  try {
    const response = await fetch(getImageBBApiLink(), {
      method: 'POST',
      body: imageBBFormData,
    });

    console.log("Response status:", response.status);
    console.timeEnd("Upload time");

    const data = await response.json();
    console.log("Response data:", JSON.stringify(data, null, 2));

    if (data.success) {
      console.log("\n✓ Upload successful! URL:", data.data.url);
    } else {
      console.error("\n✗ Upload failed:", data.error?.message || data);
    }
  } catch (error) {
    console.timeEnd("Upload time");
    console.error("\n✗ Error during upload:", error);

    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error.message:", error.message);
      if ('cause' in error) {
        console.error("Error.cause:", (error as any).cause);
      }
    }
  }
}

testUpload();