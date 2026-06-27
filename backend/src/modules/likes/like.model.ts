import mongoose, { Document, Schema } from 'mongoose';

export interface ILike extends Document {
  userId: mongoose.Types.ObjectId;
  targetId: string;
  targetType: 'city' | 'dish';
  createdAt: Date;
}

const likeSchema = new Schema<ILike>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetId: {
      type: String,
      required: true,
    },
    targetType: {
      type: String,
      enum: ['city', 'dish'],
      required: true,
    },
  },
  { timestamps: true },
);

likeSchema.index({ userId: 1, targetId: 1, targetType: 1 }, { unique: true });
likeSchema.index({ targetId: 1, targetType: 1 });

export const Like = mongoose.model<ILike>('Like', likeSchema);
