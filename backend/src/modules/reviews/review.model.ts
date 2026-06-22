import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId;
  cityId: string;
  rating: number;
  comment: string;
  status: 'visible' | 'pending' | 'rejected';
  editedAt?: Date;
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cityId: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ['visible', 'pending', 'rejected'],
      default: 'visible',
    },
    editedAt: Date,
  },
  { timestamps: true },
);

reviewSchema.index({ userId: 1, cityId: 1 }, { unique: true });
reviewSchema.index({ cityId: 1, status: 1, createdAt: -1 });

export const Review = mongoose.model<IReview>('Review', reviewSchema);
