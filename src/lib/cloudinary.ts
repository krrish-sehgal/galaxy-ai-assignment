import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

// Helper function to upload file to Cloudinary
export async function uploadToCloudinary(
  file: Buffer,
  options: {
    folder?: string;
    resource_type?: "auto" | "image" | "video" | "raw";
    public_id?: string;
  } = {}
) {
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: options.folder || "chat-uploads",
            resource_type: options.resource_type || "auto",
            public_id: options.public_id,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(file);
    });

    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload file");
  }
}

// Helper function to delete file from Cloudinary
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: "image" | "video" | "raw" = "image"
) {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error("Failed to delete file");
  }
}

// Helper to get optimized image URL
export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
  } = {}
) {
  return cloudinary.url(publicId, {
    width: options.width,
    height: options.height,
    quality: options.quality || "auto",
    format: options.format || "auto",
    crop: "fill",
  });
}
