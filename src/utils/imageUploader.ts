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
export async function uploadToImageBB(imageFile: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMAGEBB_API_KEY as string;
  console.log("apiKey", apiKey);

  if (!apiKey) {
    throw new Error("ImageBB API Key is not set in environment variables.");
  }

  const base64Image = await fileToBase64(imageFile);

  const imageBBFormData = new FormData();
  imageBBFormData.append("image", base64Image);
  imageBBFormData.append("key", apiKey);

  const imageBBResponse = await fetch(
    process.env.NEXT_PUBLIC_IMAGEBB_API_LINK as string,
    {
      method: "POST",
      body: imageBBFormData,
    }
  );

  const imageBBData = await imageBBResponse.json();

  if (imageBBData.success && imageBBData.data?.url) {
    return imageBBData.data.url;
  } else {
    const errorMessage = imageBBData.error?.message || "ImageBB upload failed";
    throw new Error(errorMessage);
  }
}
