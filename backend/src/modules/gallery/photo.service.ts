import mongoose from 'mongoose';
import { Photo, IPhoto, PhotoLike } from './photo.model';
import { uploadImage, deleteImage } from './providers/cloudinary.provider';
import { AppError } from '../../utils/AppError';

const MAX_PENDING_PHOTOS = 10;

export class GalleryService {
  async findByCity(
    cityId: string,
    page: number = 1,
    limit: number = 20,
    userId?: string,
  ): Promise<{
    photos: IPhoto[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const filter: Record<string, unknown> = { cityId, status: 'approved' };

    const [photos, total] = await Promise.all([
      Photo.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('userId', 'displayName avatarUrl'),
      Photo.countDocuments(filter),
    ]);

    return {
      photos,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPending(): Promise<IPhoto[]> {
    return Photo.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .populate('userId', 'displayName email');
  }

  async upload(
    userId: string,
    cityId: string,
    buffer: Buffer,
    caption?: string,
  ): Promise<IPhoto> {
    const pendingCount = await Photo.countDocuments({ userId, status: 'pending' });
    if (pendingCount >= MAX_PENDING_PHOTOS) {
      throw new AppError(
        `Vous avez déjà ${MAX_PENDING_PHOTOS} photos en attente de modération. Attendez qu'elles soient traitées.`,
        429,
      );
    }

    const result = await uploadImage(buffer, cityId);

    const photo = await Photo.create({
      userId: new mongoose.Types.ObjectId(userId),
      cityId,
      cloudinaryPublicId: result.publicId,
      url: result.url,
      thumbnailUrl: result.thumbnailUrl,
      caption: caption?.trim().slice(0, 200),
      status: 'pending',
      likesCount: 0,
      width: result.width,
      height: result.height,
    });

    return photo;
  }

  async moderate(
    photoId: string,
    status: 'approved' | 'rejected',
  ): Promise<IPhoto> {
    const photo = await Photo.findById(photoId);
    if (!photo) {
      throw new AppError('Photo introuvable.', 404);
    }

    photo.status = status;
    await photo.save();

    if (status === 'rejected') {
      await deleteImage(photo.cloudinaryPublicId);
    }

    return photo;
  }

  async delete(userId: string, userRole: string, photoId: string): Promise<void> {
    const photo = await Photo.findById(photoId);
    if (!photo) {
      throw new AppError('Photo introuvable.', 404);
    }

    if (photo.userId.toString() !== userId && userRole !== 'admin') {
      throw new AppError('Vous ne pouvez pas supprimer cette photo.', 403);
    }

    await PhotoLike.deleteMany({ photoId: photo._id });
    await Photo.deleteOne({ _id: photo._id });

    await deleteImage(photo.cloudinaryPublicId);
  }

  async like(userId: string, photoId: string): Promise<{ likesCount: number }> {
    const photo = await Photo.findById(photoId);
    if (!photo) {
      throw new AppError('Photo introuvable.', 404);
    }

    if (photo.status !== 'approved') {
      throw new AppError('Vous ne pouvez pas liker cette photo.', 400);
    }

    try {
      await PhotoLike.create({
        userId: new mongoose.Types.ObjectId(userId),
        photoId: new mongoose.Types.ObjectId(photoId),
      });
    } catch (err: unknown) {
      if (err instanceof Error && (err as any).code === 11000) {
        throw new AppError('Vous avez déjà liké cette photo.', 409);
      }
      throw err;
    }

    const updated = await Photo.findByIdAndUpdate(
      photoId,
      { $inc: { likesCount: 1 } },
      { new: true },
    );

    return { likesCount: updated?.likesCount || 0 };
  }

  async unlike(userId: string, photoId: string): Promise<{ likesCount: number }> {
    const result = await PhotoLike.deleteOne({
      userId: new mongoose.Types.ObjectId(userId),
      photoId: new mongoose.Types.ObjectId(photoId),
    });

    if (result.deletedCount === 0) {
      throw new AppError('Vous n\'avez pas liké cette photo.', 404);
    }

    const updated = await Photo.findByIdAndUpdate(
      photoId,
      { $inc: { likesCount: -1 } },
      { new: true },
    );

    return { likesCount: Math.max(0, updated?.likesCount || 0) };
  }

  async getUserLikes(userId: string, photoIds: string[]): Promise<Set<string>> {
    const objectIds = photoIds.map((id) => new mongoose.Types.ObjectId(id));
    const likes = await PhotoLike.find({
      userId: new mongoose.Types.ObjectId(userId),
      photoId: { $in: objectIds },
    });
    return new Set(likes.map((l) => l.photoId.toString()));
  }
}

export const galleryService = new GalleryService();
