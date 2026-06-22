import multer from 'multer';
import sharp from 'sharp';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../utils/AppError';

const ALLOWED_FORMATS = ['jpeg', 'png', 'webp'];
const MAX_FILE_SIZE = 8 * 1024 * 1024;
const MIN_DIMENSION = 400;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_FORMATS.some((fmt) => file.mimetype.includes(fmt))) {
      cb(new AppError('Format non autorisé. Utilisez JPEG, PNG ou WebP.', 400));
      return;
    }
    cb(null, true);
  },
});

export const uploadMiddleware = upload.single('photo');

export async function validateImageBuffer(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  if (!req.file) {
    throw new AppError('Aucun fichier fourni.', 400);
  }

  try {
    const metadata = await sharp(req.file.buffer).metadata();

    if (!metadata.format || !ALLOWED_FORMATS.includes(metadata.format)) {
      throw new AppError('Le fichier n\'est pas une image JPEG, PNG ou WebP valide.', 400);
    }

    if (metadata.width && metadata.width < MIN_DIMENSION) {
      throw new AppError(`L'image doit faire au moins ${MIN_DIMENSION}px de large.`, 400);
    }
    if (metadata.height && metadata.height < MIN_DIMENSION) {
      throw new AppError(`L'image doit faire au moins ${MIN_DIMENSION}px de haut.`, 400);
    }

    next();
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError('Le fichier n\'est pas une image valide.', 400);
  }
}
