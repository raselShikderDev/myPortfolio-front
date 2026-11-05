import { IMAGEBB_API_KEY, IMAGEBB_API_LINK } from '@/lib/apiConfig';

interface UploadResult {
  success: boolean;
  data?: {
    url: string;
    filename: string;
  };
  error?: string;
}

// Fallback to local storage if cloud upload fails
const uploadToLocalStorage = async (file: File): Promise<UploadResult> => {
  try {
    // In a real implementation, you would save the file to a local directory
    // For now, we'll simulate this by returning a placeholder URL
    const filename = file.name || `resume_${Date.now()}.pdf`;

    // In a real implementation, you would save the file to a local directory
    // and return the local path as the URL
    const localUrl = `/uploads/${filename}`;

    return {
      success: true,
      data: {
        url: localUrl,
        filename: filename,
      },
    };
  } catch (error) {
    console.error('Local storage upload failed:', error);
    return {
      success: false,
      error: 'Failed to upload to local storage',
    };
  }
};

// Upload file to ImageBB cloud storage
const uploadToCloud = async (file: File): Promise<UploadResult> => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${IMAGEBB_API_LINK}?key=${IMAGEBB_API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`ImageBB upload failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.data?.url) {
      throw new Error('Invalid response from ImageBB');
    }

    return {
      success: true,
      data: {
        url: data.data.url,
        filename: file.name || 'resume.pdf',
      },
    };
  } catch (error) {
    console.error('Cloud upload failed:', error);
    return {
      success: false,
      error: 'Failed to upload to cloud storage',
    };
  }
};

// Main upload function with fallback
export const uploadFileToCloud = async (file: File): Promise<UploadResult> => {
  try {
    // First try cloud upload
    const cloudResult = await uploadToCloud(file);

    if (cloudResult.success) {
      return cloudResult;
    }

    // If cloud upload fails, try local storage
    return await uploadToLocalStorage(file);
  } catch (error) {
    console.error('Upload failed:', error);
    return {
      success: false,
      error: 'Upload failed',
    };
  }
};