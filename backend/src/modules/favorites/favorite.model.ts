import mongoose, { Document, Schema } from 'mongoose';

export interface IFavorite extends Document {
  userId: mongoose.Types.ObjectId;
  cityId: string;
  createdAt: Date;
}

const favoriteSchema = new Schema<IFavorite>(
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
  },
  { timestamps: true },
);

favoriteSchema.index({ userId: 1, cityId: 1 }, { unique: true });

export const Favorite = mongoose.model<IFavorite>('Favorite', favoriteSchema);
