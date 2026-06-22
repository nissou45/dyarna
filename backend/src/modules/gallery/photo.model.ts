import mongoose, { Document, Schema } from 'mongoose';

export interface IPhoto extends Document {
  userId: mongoose.Types.ObjectId;
  cityId: string;
  cloudinaryPublicId: string;
  url: string;
  thumbnailUrl: string;
  caption?: string;
  status: 'pending' | 'approved' | 'rejected';
  likesCount: number;
  width: number;
  height: number;
  createdAt: Date;
}

const photoSchema = new Schema<IPhoto>(
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
    cloudinaryPublicId: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      maxlength: 200,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

photoSchema.index({ cityId: 1, status: 1, createdAt: -1 });
photoSchema.index({ userId: 1, status: 1 });

export interface IPhotoLike extends Document {
  userId: mongoose.Types.ObjectId;
  photoId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const photoLikeSchema = new Schema<IPhotoLike>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    photoId: {
      type: Schema.Types.ObjectId,
      ref: 'Photo',
      required: true,
    },
  },
  { timestamps: true },
);

photoLikeSchema.index({ userId: 1, photoId: 1 }, { unique: true });
photoLikeSchema.index({ photoId: 1 });

export const Photo = mongoose.model<IPhoto>('Photo', photoSchema);
export const PhotoLike = mongoose.model<IPhotoLike>('PhotoLike', photoLikeSchema);
