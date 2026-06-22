import mongoose, { Document, Schema } from 'mongoose';

export interface ItineraryDay {
  dayNumber: number;
  cityId: string;
  nightsCount: number;
  notes?: string;
}

export interface IItinerary extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  days: ItineraryDay[];
  isPublic: boolean;
  shareToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const daySchema = new Schema<ItineraryDay>(
  {
    dayNumber: { type: Number, required: true },
    cityId: { type: String, required: true },
    nightsCount: { type: Number, required: true, min: 1 },
    notes: { type: String, trim: true },
  },
  { _id: false },
);

const itinerarySchema = new Schema<IItinerary>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    days: {
      type: [daySchema],
      required: true,
      validate: {
        validator: (days: ItineraryDay[]) => days.length >= 1,
        message: 'Au moins une étape est requise.',
      },
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    shareToken: {
      type: String,
      index: true,
      sparse: true,
    },
  },
  { timestamps: true },
);

itinerarySchema.index({ userId: 1, createdAt: -1 });

export const Itinerary = mongoose.model<IItinerary>('Itinerary', itinerarySchema);
