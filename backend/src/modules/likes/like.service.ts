import mongoose from 'mongoose';
import { Like } from './like.model';
import { AppError } from '../../utils/AppError';

export class LikeService {
  async like(userId: string, targetId: string, targetType: 'city' | 'dish'): Promise<{ likesCount: number }> {
    try {
      await Like.create({
        userId: new mongoose.Types.ObjectId(userId),
        targetId,
        targetType,
      });
    } catch (err: unknown) {
      if (err instanceof Error && (err as any).code === 11000) {
        throw new AppError('Vous aimez déjà cette destination.', 409);
      }
      throw err;
    }

    const likesCount = await Like.countDocuments({ targetId, targetType });
    return { likesCount };
  }

  async unlike(userId: string, targetId: string): Promise<{ likesCount: number }> {
    const result = await Like.findOneAndDelete({
      userId: new mongoose.Types.ObjectId(userId),
      targetId,
    });

    if (!result) {
      throw new AppError("Vous n'avez pas aimé cette destination.", 404);
    }

    const likesCount = await Like.countDocuments({ targetId, targetType: result.targetType });
    return { likesCount };
  }

  async hasLiked(userId: string, targetId: string): Promise<boolean> {
    const like = await Like.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      targetId,
    });
    return like !== null;
  }

  async getCount(targetId: string): Promise<number> {
    return Like.countDocuments({ targetId });
  }

  async getUserLikes(userId: string, targetIds: string[]): Promise<Record<string, boolean>> {
    const likes = await Like.find({
      userId: new mongoose.Types.ObjectId(userId),
      targetId: { $in: targetIds },
    });
    const liked = new Set(likes.map((l) => l.targetId));
    const result: Record<string, boolean> = {};
    for (const id of targetIds) {
      result[id] = liked.has(id);
    }
    return result;
  }
}

export const likeService = new LikeService();
