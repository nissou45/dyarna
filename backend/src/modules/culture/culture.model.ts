import mongoose, { Document, Schema } from 'mongoose';

export interface CuisineItem {
  name: string;
  description: string;
}

export interface ICityCulture extends Document {
  cityId: string;
  history: string;
  traditions: string[];
  legend?: {
    title: string;
    content: string;
  };
  cuisine: CuisineItem[];
  sourceUrl: string;
  lastFetchedAt: Date;
  isManuallyEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const cuisineSchema = new Schema<CuisineItem>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false },
);

const cultureSchema = new Schema<ICityCulture>(
  {
    cityId: {
      type: String,
      required: true,
      unique: true,
    },
    history: {
      type: String,
      required: true,
    },
    traditions: {
      type: [String],
      required: true,
      default: [],
    },
    legend: {
      title: { type: String },
      content: { type: String },
    },
    cuisine: {
      type: [cuisineSchema],
      required: true,
      default: [],
    },
    sourceUrl: {
      type: String,
      required: true,
    },
    lastFetchedAt: {
      type: Date,
      required: true,
    },
    isManuallyEdited: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const CityCulture = mongoose.model<ICityCulture>('CityCulture', cultureSchema);
