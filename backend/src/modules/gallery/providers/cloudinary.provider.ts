import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from 'cloudinary';
import { logger } from '../../../utils/logger';

export interface CloudinaryResult {
  publicId: string;
  url: string;
  thumbnailUrl: string;
  width: number;
  height: number;
}

export function initCloudinary(config: {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}): void {
  cloudinary.config({
    cloud_name: config.cloudName,
    api_key: config.apiKey,
    api_secret: config.apiSecret,
  });
}

export async function uploadImage(
  buffer: Buffer,
  cityId: string,
): Promise<CloudinaryResult> {
  const options: UploadApiOptions = {
    folder: `dyarna/${cityId}`,
    resource_type: 'image',
    tags: [cityId],
    transformation: [
      { quality: 'auto', fetch_format: 'auto' },
    ],
  };

  return new Promise<CloudinaryResult>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error || !result) {
          reject(new Error(error?.message || 'Échec de l\'upload Cloudinary.'));
          return;
        }
        resolve({
          publicId: result.public_id,
          url: result.secure_url,
          thumbnailUrl: cloudinary.url(result.public_id, {
            transformation: [
              { width: 400, height: 300, crop: 'fill', quality: 'auto', fetch_format: 'auto' },
            ],
          }),
          width: result.width,
          height: result.height,
        });
      },
    );

    uploadStream.end(buffer);
  });
}

export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    logger.warn(`[Cloudinary] Delete failed for "${publicId}": ${message}`);
  }
}
