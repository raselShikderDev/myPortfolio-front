// Compare working test vs failing route
import { getImageBBApiKey, getImageBBApiLink } from './src/lib/apiConfig';

async function testWorkingApproach() {
  console.log("=== Testing WORKING approach (from test-upload-debug.ts) ===");

  const pngData = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64'
  );

  const base64Image = pngData.toString('base64');

  const imageBBFormData = new FormData();
  imageBBFormData.append('key', getImageBBApiKey());
  imageBBFormData.append('image', base64Image);

  try {
    const response = await fetch(getImageBBApiLink(), {
      method: 'POST',
      body: imageBBFormData,
    });

    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Data:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

async function testWithFile() {
  console.log("\n=== Testing with File object ===");

  const pngData = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64'
  );

  const base64Image = pngData.toString('base64');

  // Try with a Blob containing the base64 string
  const imageBlob = new Blob([base64Image], { type: 'text/plain' });

  const imageBBFormData = new FormData();
  imageBBFormData.append('key', getImageBBApiKey());
  imageBBFormData.append('image', imageBlob, 'image.png');

  try {
    const response = await fetch(getImageBBApiLink(), {
      method: 'POST',
      body: imageBBFormData,
    });

    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Data:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

async function testWithRawBuffer() {
  console.log("\n=== Testing with raw buffer ===");

  const pngData = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64'
  );

  // Try with raw buffer as a File
  const testFile = new File([pngData], 'test.png', { type: 'image/png' });

  const imageBBFormData = new FormData();
  imageBBFormData.append('key', getImageBBApiKey());
  imageBBFormData.append('image', testFile);

  try {
    const response = await fetch(getImageBBApiLink(), {
      method: 'POST',
      body: imageBBFormData,
    });

    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Data:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

testWorkingApproach().then(() => testWithFile()).then(() => testWithRawBuffer()).catch((error) => {
  console.error("Test failed:", error);
  process.exit(1);
});