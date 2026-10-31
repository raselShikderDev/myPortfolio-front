// Converting file
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result?.toString().split(",")[1] || "";
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

//Uplaoding image
import { getImageBBApiKey, getImageBBApiLink } from '@/lib/apiConfig';

export async function uploadToImageBB(imageFile: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success && data.url) {
      return data.url;
    } else {
      const errorMessage = data.error || "Image upload failed";
      throw new Error(errorMessage);
    }
  } catch (error: unknown) {
    console.error("Internal API Upload Error:", error);
    const message = error instanceof Error ? error.message : "Failed to upload image";
    throw new Error(message);
  }
}
