import { Review, IReview } from './review.model';
import { AppError } from '../../utils/AppError';
import { autoModerate } from './autoModerate';
import { ReviewSummary } from './review.types';

export class ReviewService {
  async findByCity(
    cityId: string,
    page: number = 1,
    limit: number = 10,
    sort: 'recent' | 'highest' | 'lowest' = 'recent',
  ): Promise<{ reviews: IReview[]; total: number; page: number; totalPages: number }> {
    const sortMap: Record<string, Record<string, 1 | -1>> = {
      recent: { createdAt: -1 },
      highest: { rating: -1, createdAt: -1 },
      lowest: { rating: 1, createdAt: -1 },
    };

    const [reviews, total] = await Promise.all([
      Review.find({ cityId, status: 'visible' })
        .sort(sortMap[sort])
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('userId', 'displayName avatarUrl'),
      Review.countDocuments({ cityId, status: 'visible' }),
    ]);

    return {
      reviews,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getSummary(cityId: string): Promise<ReviewSummary> {
    const pipeline = [
      { $match: { cityId, status: 'visible' } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          distribution: { $push: '$rating' },
        },
      },
    ];

    const results = await Review.aggregate(pipeline);

    if (results.length === 0) {
      return { averageRating: 0, totalReviews: 0, distribution: [] };
    }

    const { averageRating, totalReviews, distribution } = results[0];
    const distMap: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const r of distribution) {
      distMap[r] = (distMap[r] || 0) + 1;
    }

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
      distribution: [1, 2, 3, 4, 5].map((rating) => ({
        rating,
        count: distMap[rating] || 0,
      })),
    };
  }

  async getMyReviews(userId: string): Promise<IReview[]> {
    return Review.find({ userId }).sort({ createdAt: -1 });
  }

  async create(userId: string, cityId: string, rating: number, comment: string): Promise<IReview> {
    const existing = await Review.findOne({ userId, cityId });
    if (existing) {
      throw new AppError('Vous avez déjà noté cette ville. Modifiez votre avis existant.', 409);
    }

    const status = autoModerate(comment);
    return Review.create({ userId, cityId, rating, comment, status });
  }

  async update(userId: string, cityId: string, data: { rating?: number; comment?: string }): Promise<IReview> {
    const review = await Review.findOne({ userId, cityId });
    if (!review) {
      throw new AppError('Avis introuvable.', 404);
    }

    if (review.userId.toString() !== userId) {
      throw new AppError('Vous ne pouvez pas modifier cet avis.', 403);
    }

    if (data.rating !== undefined) review.rating = data.rating;
    if (data.comment !== undefined) {
      review.comment = data.comment;
      review.status = autoModerate(data.comment);
    }
    review.editedAt = new Date();
    await review.save();
    return review;
  }

  async delete(userId: string, cityId: string): Promise<void> {
    const review = await Review.findOne({ userId, cityId });
    if (!review) {
      throw new AppError('Avis introuvable.', 404);
    }

    if (review.userId.toString() !== userId) {
      throw new AppError('Vous ne pouvez pas supprimer cet avis.', 403);
    }

    await Review.deleteOne({ _id: review._id });
  }

  async moderate(reviewId: string, status: 'visible' | 'rejected'): Promise<IReview> {
    const review = await Review.findById(reviewId);
    if (!review) {
      throw new AppError('Avis introuvable.', 404);
    }
    review.status = status;
    await review.save();
    return review;
  }

  async getPending(): Promise<IReview[]> {
    return Review.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .populate('userId', 'displayName email');
  }
}

export const reviewService = new ReviewService();
